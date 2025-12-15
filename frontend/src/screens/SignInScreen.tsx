import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Layout from "../components/layout/Layout"
import FormInput from "../components/ui/FormInput"
import { useAuth } from "../hooks/useAuth"
import type { SignInFormData, SignInFormErrors } from "../types"

export default function SignInScreen() {
  const navigate = useNavigate()
  const { login, isLoading, error: apiError } = useAuth()
  
  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: ""
  })
  
  const [errors, setErrors] = useState<SignInFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: SignInFormErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const result = await login({
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
    
    if (errors[name as keyof SignInFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return (
    <Layout>
      <div className="auth-container">
        <h1 className="auth-title">Sign In</h1>
        
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
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div className="proposal">
          <p>Don't have an account yet? 
            <Link to="/auth/signup" className="auth-link"> Sign Up</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}