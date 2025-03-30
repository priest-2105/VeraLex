import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Lock, Phone, MapPin } from "lucide-react"

import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { FileUpload } from "../../../../components/ui/file-upload"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../../../components/ui/card"
import { Alert } from "../../../../components/ui/alert"

export default function UserSignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    phoneNumber: "",
    location: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  // Handle file uploads
  const handleFileChange = (name, file) => {
    setFormData({
      ...formData,
      [name]: file,
    })
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    // Basic info validations
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }

      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    // Additional info validations
    if (step === 2) {
      if (!formData.location.trim()) newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setStep(step - 1)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form submitted:", formData)

      // Redirect to dashboard or confirmation page
      navigate("/auth/signup-success")
    } catch (error) {
      console.error("Signup error:", error)
      setErrors({
        form: "An error occurred during signup. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render basic info fields
  const renderBasicInfoFields = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              label="Full Name"
              required
              error={errors.fullName}
              className="pl-10"
            />
            <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>

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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              label="Password"
              required
              error={errors.password}
              className="pl-10"
            />
            <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              label="Confirm Password"
              required
              error={errors.confirmPassword}
              className="pl-10"
            />
            <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>

          <div>
            <FileUpload
              label="Profile Picture (Optional)"
              accept="image/*"
              onChange={(file) => handleFileChange("profilePicture", file)}
              maxSize={5242880} // 5MB
              helperText="Upload a profile picture (JPG, PNG, max 5MB)"
            />
          </div>
        </div>
      </div>
    )
  }

  // Render additional info fields
  const renderAdditionalInfoFields = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number (Optional)"
              label="Phone Number (Optional)"
              className="pl-10"
            />
            <Phone className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location (City, State, Country)"
              label="Location"
              required
              error={errors.location}
              className="pl-10"
            />
            <MapPin className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {errors.form && (
          <Alert variant="error" title="Error" className="mt-4">
            {errors.form}
          </Alert>
        )}
      </div>
    )
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center">
              <div className={`flex items-center ${step >= 1 ? "text-amber-600" : "text-gray-400"}`}>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? "border-amber-600 bg-amber-100" : "border-gray-300"}`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Basic Info</span>
              </div>
              <div className={`w-12 h-1 mx-2 ${step >= 2 ? "bg-amber-600" : "bg-gray-300"}`}></div>
              <div className={`flex items-center ${step >= 2 ? "text-amber-600" : "text-gray-400"}`}>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? "border-amber-600 bg-amber-100" : "border-gray-300"}`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Additional Info</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg">
          {step === 1 ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
                <CardDescription className="text-center">Please provide your basic information</CardDescription>
              </CardHeader>
              <CardContent>{renderBasicInfoFields()}</CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="primary" onClick={handleNextStep}>
                  Next
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Additional Information</CardTitle>
                <CardDescription className="text-center">Please provide some additional details</CardDescription>
              </CardHeader>
              <CardContent>{renderAdditionalInfoFields()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

