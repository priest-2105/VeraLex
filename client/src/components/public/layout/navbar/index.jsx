import React from 'react'
import { ChevronDown } from "lucide-react"
import { Button } from "../../../ui/button"


export default function PublicNavbar() {

    
  const navLinks = [
    { title: "Products", hasDropdown: true },
    { title: "Features", hasDropdown: true },
    { title: "Pricing", hasDropdown: false },
  ]

  return (
    <div>
      <header className="w-full py-4 px-4 md:px-8 lg:px-16 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center mr-8">
            <div className="w-8 h-8 bg-amber-600 rounded-md flex items-center justify-center mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="text-xl font-semibold">Legal</span>
          </div>
          <nav className="hidden md:flex space-x-6 mx-auto">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center">
                  {link.title} {link.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </a>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900 hidden md:block">
            Login
          </a>
          <Button variant="primary">Get Started</Button>
        </div>
      </header>
    </div>
  )
}
