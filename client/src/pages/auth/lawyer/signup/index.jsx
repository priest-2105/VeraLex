import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Lock, FileText, Briefcase, Shield } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Checkbox } from "../../../../components/ui/checkbox"
import { FileUpload } from "../../../../components/ui/file-upload"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../../../components/ui/card"
import { Alert } from "../../../../components/ui/alert"

export default function LawyerSignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    role: "",
    barId: "",
    yearsOfExperience: "",
    specialization: [],
    otherSpecialization: "",
    portfolio: null,
    pastCases: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Specialization options
  const specializationOptions = [
    { value: "civil", label: "Civil Law" },
    { value: "criminal", label: "Criminal Law" },
    { value: "family", label: "Family Law" },
    { value: "business", label: "Business Law" },
    { value: "immigration", label: "Immigration Law" },
    { value: "other", label: "Other" },
  ]

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

  // Handle role selection
  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role,
    })

    if (errors.role) {
      setErrors({
        ...errors,
        role: null,
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

  // Handle specialization selection (multi-select)
  const handleSpecializationChange = (value) => {
    let updatedSpecializations = [...formData.specialization]

    if (updatedSpecializations.includes(value)) {
      updatedSpecializations = updatedSpecializations.filter((item) => item !== value)
    } else {
      updatedSpecializations.push(value)
    }

    setFormData({
      ...formData,
      specialization: updatedSpecializations,
    })

    if (errors.specialization) {
      setErrors({
        ...errors,
        specialization: null,
      })
    }
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

    // Professional info validations
    if (step === 2) {
      if (!formData.role) newErrors.role = "Role is required"
      if (!formData.barId.trim()) newErrors.barId = "Bar Association ID is required"
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required"
      if (formData.specialization.length === 0) newErrors.specialization = "Please select at least one specialization"
      if (formData.specialization.includes("other") && !formData.otherSpecialization.trim()) {
        newErrors.otherSpecialization = "Please specify your specialization"
      }
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

  // Render professional info fields
  const renderProfessionalInfoFields = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`cursor-pointer border rounded-lg transition-all hover:border-amber-500 ${formData.role === "prosecutor" ? "border-amber-500 bg-amber-50" : "border-gray-200"}`}
                onClick={() => handleRoleSelect("prosecutor")}
              >
                <div className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Prosecutor</h3>
                    <p className="text-xs text-gray-500">Represents plaintiffs</p>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer border rounded-lg transition-all hover:border-amber-500 ${formData.role === "defense" ? "border-amber-500 bg-amber-50" : "border-gray-200"}`}
                onClick={() => handleRoleSelect("defense")}
              >
                <div className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Defense Attorney</h3>
                    <p className="text-xs text-gray-500">Represents defendants</p>
                  </div>
                </div>
              </div>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="relative">
            <Input
              type="text"
              name="barId"
              value={formData.barId}
              onChange={handleChange}
              placeholder="Bar Association ID"
              label="Bar Association ID"
              required
              error={errors.barId}
              className="pl-10"
            />
            <FileText className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="Years of Experience"
              label="Years of Experience"
              required
              min="0"
              error={errors.yearsOfExperience}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {specializationOptions.map((option) => (
                <div key={option.value} className="flex items-start">
                  <Checkbox
                    checked={formData.specialization.includes(option.value)}
                    onChange={() => handleSpecializationChange(option.value)}
                    label={option.label}
                  />
                </div>
              ))}
            </div>
            {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
          </div>

          {formData.specialization.includes("other") && (
            <div>
              <Input
                type="text"
                name="otherSpecialization"
                value={formData.otherSpecialization}
                onChange={handleChange}
                placeholder="Please specify your specialization"
                label="Other Specialization"
                error={errors.otherSpecialization}
              />
            </div>
          )}

          <div>
            <FileUpload
              label="Portfolio/Resume (Optional)"
              accept=".pdf,.doc,.docx"
              onChange={(file) => handleFileChange("portfolio", file)}
              maxSize={10485760} 
              helperText="Upload your portfolio or resume (PDF, DOC, max 10MB)"
            />
          </div>

          <div>
            <Input
              type="textarea"
              name="pastCases"
              value={formData.pastCases}
              onChange={handleChange}
              placeholder="Briefly describe your past cases or work experience"
              label="Past Cases / Work Experience (Optional)"
              className="h-24"
            />
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
                <span className="ml-2 text-sm font-medium">Professional Info</span>
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
                <CardTitle className="text-2xl text-center">Create Your Lawyer Account</CardTitle>
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
                <CardTitle className="text-2xl text-center">Professional Information</CardTitle>
                <CardDescription className="text-center">Please provide your professional details</CardDescription>
              </CardHeader>
              <CardContent>{renderProfessionalInfoFields()}</CardContent>
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
            <Link to="/auth/lawyer/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

