import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Layout from "../components/layout/Layout"
import FormInput from "../components/ui/FormInput"
import { useAuth } from "../hooks/useAuth"
import type { SignUpFormData, SignUpFormErrors } from "../types"

export default function SignUpScreen() {
  const navigate = useNavigate()
  const { register, isLoading, error: apiError } = useAuth()
  
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    password: "",
    confirmPassword: ""
  })
  
  const [errors, setErrors] = useState<SignUpFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (formData.username.length > 50) {
      newErrors.username = "Username must be less than 50 characters"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters"
    } else if (formData.password.length > 50) {
      newErrors.password = "Password must be less than 50 characters"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const result = await register({
      login: formData.username,
      password: formData.password
    })
    
    if (result.success) {
      navigate("/")
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name as keyof SignUpFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
    
    if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }))
    } else if (name === 'confirmPassword' && formData.password && value !== formData.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }))
    } else if (name === 'confirmPassword' && formData.password && value === formData.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: undefined
      }))
    }
  }

  return (
    <Layout>
      <div className="auth-container">
        <h1 className="auth-title">Sign Up</h1>
        
        {(apiError || errors.general) && (
          <div className="auth-error">
            {apiError || errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            id="username"
            name="username"
            value={formData.username}
            placeholder="Input username"
            onChange={handleChange}
            label="Username"
            error={errors.username}
            disabled={isLoading}
          />
          
          <FormInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="Input password"
            onChange={handleChange}
            label="Password"
            error={errors.password}
            disabled={isLoading}
          />
          
          <FormInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm password"
            onChange={handleChange}
            label="Confirm Password"
            error={errors.confirmPassword}
            disabled={isLoading}
          />
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="proposal">
          <p>Already have an account? 
            <Link to="/auth/signIn" className="auth-link"> Sign In</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}