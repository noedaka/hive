import { useState } from "react"
import { useNavigate } from "react-router"
import Layout from "../components/Layout"
import Button from "../components/Button"

export default function CreatePostScreen() {
    const navigate = useNavigate()
    const [text, setText] = useState("")
    const [image, setImage] = useState<File | null>(null)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log("Creating post:", { text, image })
        navigate("/")
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    return (
        <Layout>
            <div className="create-post-container">
                <h1 className="create-post-title">Create New Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea 
                            name="post-content" 
                            id="post-content" 
                            className="form-textarea" 
                            required 
                            placeholder="Write your post"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="create-post-actions">
                        <div className="file-upload">
                            <input 
                                type="file" 
                                id="file-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <Button 
                                type="button"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                Upload File
                            </Button>
                            {image && <span className="file-name">{image.name}</span>}
                        </div>
                        <Button type="submit">Post</Button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}