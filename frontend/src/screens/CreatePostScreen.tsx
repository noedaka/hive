import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/layout/Layout";
import { useCreatePost } from "../hooks/useCreatePost";
import { createLocalImageUrl, revokeLocalImageUrl } from "../utils/imageUtils";
import type { CreatePostErrors } from "../types";
import type { CreatePostRequest } from "../api/posts";

export default function CreatePostScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { createPost, uploadImage, isLoading, isUploading, error, success } = useCreatePost();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    imagePreview: "",
    uploadedImageUrl: "", 
  });
  
  const [errors, setErrors] = useState<CreatePostErrors>({});

  useEffect(() => {
    return () => {
      if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        revokeLocalImageUrl(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const validateForm = (): boolean => {
    const newErrors: CreatePostErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 1) {
      newErrors.title = "Title must be at least 1 character";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    } else if (formData.content.length > 10000) {
      newErrors.content = "Content must be less than 10000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let imageUrl = "";

      if (formData.image) {
        const uploadedUrl = await uploadImage(formData.image);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return;
        }
      }
      
      const postData: CreatePostRequest = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl || undefined,
      };
      
      const result = await createPost(postData);
      
      if (result.success) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        revokeLocalImageUrl(formData.imagePreview);
      }
      
      const previewUrl = createLocalImageUrl(file);
      
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
        uploadedImageUrl: ""
      }));
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  }

  function removeImage() {
    if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
      revokeLocalImageUrl(formData.imagePreview);
    }
    
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: "",
      uploadedImageUrl: ""
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof CreatePostErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }

  const isSubmitting = isLoading || isUploading;

  return (
    <Layout>
      <div className="create-post-container">
        <h1 className="create-post-title">Create New Post</h1>
        
        {success && (
          <div className="success-message">
            Post created successfully! Redirecting...
          </div>
        )}
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleTextChange}
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.title && (
              <div className="form-error">{errors.title}</div>
            )}
            <div className="character-count">
              {formData.title.length}/200
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea 
              name="content" 
              id="content" 
              className={`form-textarea ${errors.content ? 'form-input-error' : ''}`}
              required 
              placeholder="Write your post (minimum 20 characters)"
              value={formData.content}
              onChange={handleTextChange}
              disabled={isSubmitting}
              maxLength={10000}
              rows={8}
            />
            {errors.content && (
              <div className="form-error">{errors.content}</div>
            )}
            <div className="character-count">
              {formData.content.length}/10000
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Image (optional)
            </label>
            <div className="file-upload-section">
              <input 
                ref={fileInputRef}
                type="file" 
                id="file-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              
              <div className="file-upload-buttons">
                <button 
                  type="button"
                  className="auth-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  Choose Image
                </button>
                
                {formData.image && (
                  <button 
                    type="button"
                    className="auth-button remove-button"
                    onClick={removeImage}
                    disabled={isSubmitting}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  Uploading image...
                </div>
              )}
              
              {formData.image && !isUploading && (
                <>
                  <div className="file-info">
                    <span className="file-name">{formData.image.name}</span>
                    <span className="file-size">
                      ({(formData.image.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <div className="image-preview">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="preview-image"
                    />
                  </div>
                </>
              )}
              
              {formData.uploadedImageUrl && (
                <div className="upload-success">
                  Image uploaded successfully!
                </div>
              )}
            </div>
          </div>
          
          <div className="create-post-actions">
            <button 
              type="button" 
              className="auth-button cancel-button"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="auth-button submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Post..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}