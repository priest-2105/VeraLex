import React, { useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../../components/ui/card"
import { Alert } from "../../../components/ui/alert"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const router = useNavigate()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    setEmail(e.target.value)

    // Clear error when field is edited
    if (errors.email) {
      setErrors({})
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
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

      console.log("Password reset requested for:", email)

      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setErrors({
        form: "An error occurred. Please try again.",
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
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Reset your password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      label="Email Address"
                      required
                      error={errors.email}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                  </div>

                  {errors.form && (
                    <Alert variant="error" title="Error" className="mt-4">
                      {errors.form}
                    </Alert>
                  )}

                  <div>
                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-amber-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                inbox and follow the instructions to reset your password.
              </p>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                  Try another email
                </Button>
              </div>
            </CardContent>
          )}
          <CardFooter>
            <Link
              href="/auth/login"
              className="flex items-center text-sm text-amber-600 hover:text-amber-500 w-full justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

