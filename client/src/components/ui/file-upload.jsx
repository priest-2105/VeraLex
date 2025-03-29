

import { useState, useRef } from "react"
import React from "react"
import { cn } from "../../utils/cn"
import { Upload, X, File, FileText, Image, Film } from "lucide-react"

export const FileUpload = ({
  accept,
  multiple = false,
  maxSize = 5242880, // 5MB
  onChange,
  value,
  error,
  label,
  helperText,
  className,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)
  const [files, setFiles] = useState(value || [])
  const [fileError, setFileError] = useState(error || "")

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / 1048576}MB limit`
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim())
      const fileType = file.type

      // Handle wildcards like image/* or application/*
      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const category = type.split("/")[0]
          return fileType.startsWith(`${category}/`)
        }
        return type === fileType
      })

      if (!isAccepted) {
        return "File type not accepted"
      }
    }

    return null
  }

  const processFiles = (fileList) => {
    const fileArray = Array.from(fileList)
    let errorMessage = ""

    const validFiles = fileArray.filter((file) => {
      const error = validateFile(file)
      if (error) {
        errorMessage = error
        return false
      }
      return true
    })

    if (errorMessage) {
      setFileError(errorMessage)
    } else {
      setFileError("")
    }

    const newFiles = multiple ? [...files, ...validFiles] : validFiles
    setFiles(newFiles)

    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleClick = () => {
    inputRef.current.click()
  }

  const removeFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)

    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0] || null)
    }
  }

  const getFileIcon = (file) => {
    const type = file.type
    if (type.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />
    if (type.startsWith("video/")) return <Film className="h-5 w-5 text-purple-500" />
    if (type.startsWith("application/pdf")) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-500",
          fileError ? "border-red-500" : "",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          {...props}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drag and drop your {multiple ? "files" : "file"} here, or click to browse
          </p>
          {accept && (
            <p className="text-xs text-gray-500">Accepted file types: {accept.replace(/\./g, "").toUpperCase()}</p>
          )}
          <p className="text-xs text-gray-500">Maximum file size: {maxSize / 1048576}MB</p>
        </div>
      </div>

      {helperText && !fileError && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}

      {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div className="text-sm truncate max-w-xs">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

