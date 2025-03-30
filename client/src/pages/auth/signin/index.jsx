import React, { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Checkbox } from "../../../components/ui/checkbox"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../../components/ui/card"
import { Alert } from "../../../components/ui/alert"
import { Link, useNavigate } from "react-router-dom"

export default function Signin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Login submitted:", formData)

      // Redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setErrors({
        form: "Invalid email or password. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-amber-600 rounded-md flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2L16 6M12 2L8 6M12 2V15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 11H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">Legal</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    label="Email Address"
                    required
                    error={errors.email}
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    label="Password"
                    required
                    error={errors.password}
                    className="pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} label="Remember me" />

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-amber-600 hover:text-amber-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {errors.form && (
                <Alert variant="error" title="Error" className="mt-4">
                  {errors.form}
                </Alert>
              )}

              <div>
                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              Don't have an account?{" "}
              <Link href="/auth/user/signup" className="font-medium text-amber-600 hover:text-amber-500">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

