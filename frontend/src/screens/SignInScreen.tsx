import { useState } from "react"
import { Link } from "react-router"
import Layout from "../components/layout/Layout"
import FormInput from "../components/ui/FormInput"

export default function SignInScreen() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log("Sign in:", formData)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <Layout>
            <div className="auth-container">
                <h1 className="auth-title">Sign In</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <FormInput
                        id="username"
                        name="username"
                        value={formData.username}
                        placeholder="Input username"
                        onChange={handleChange}
                        label="Username"
                    />
                    <FormInput
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Input password"
                        onChange={handleChange}
                        label="Password"
                    />
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <div className="proposal">
                    <p>Don't have an account yet? <Link to="/auth/signUp" className="auth-link">Sign Up</Link></p>
                </div>
            </div>
        </Layout>
    )
}