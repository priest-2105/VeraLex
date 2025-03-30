import React, { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "../../../ui/button"
import { cn } from '../../../../utils/cn'
import Logo from '../../../../assets/Logo.png'

export default function PublicNavbar() {

    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
  
    // Sample navigation data with dropdowns
    const navLinks = [
      {
        title: "Products",
        hasDropdown: true,
        dropdownItems: [
          { label: "Case Management", href: "#" },
          { label: "Document Automation", href: "#" },
          { label: "Time & Billing", href: "#" },
          { label: "Client Portal", href: "#" },
        ],
      },
      {
        title: "Features",
        hasDropdown: true,
        dropdownItems: [
          { label: "Deadline Tracking", href: "#" },
          { label: "Document Assembly", href: "#" },
          { label: "Billing & Payments", href: "#" },
          { label: "Reporting & Analytics", href: "#" },
        ],
      },
      { title: "Pricing", hasDropdown: false },
      { title: "Resources", hasDropdown: false },
      { title: "About", hasDropdown: false },
    ]
  
    // Handle scroll effect
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          setIsScrolled(true)
        } else {
          setIsScrolled(false)
        }
      }
  
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])
  
    // Handle dropdown toggle
    const handleDropdownToggle = (index) => {
      if (activeDropdown === index) {
        setActiveDropdown(null)
      } else {
        setActiveDropdown(index)
      }
    }
  
    // Close mobile menu when window is resized to desktop size
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false)
        }
      }
  
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    // Close mobile menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (isMobileMenuOpen && !event.target.closest(".mobile-menu") && !event.target.closest(".menu-button")) {
          setIsMobileMenuOpen(false)
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobileMenuOpen])
  
    return (
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full py-4 px-4 md:px-8 lg:px-16 z-50 transition-all duration-300",
          isScrolled ? "bg-white shadow-md" : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center z-20">
            <div className="w-24 rounded-md flex items-center justify-center mr-2">
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
            <span className="text-xl font-light">VeraleX</span>
          </div>
  
          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center absolute left-0 right-0 mx-auto">
            <div className="flex space-x-8">
              {navLinks.map((link, index) => (
                <div key={index} className="relative group">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-amber-600 flex items-center py-2"
                    onClick={(e) => {
                      if (link.hasDropdown) {
                        e.preventDefault()
                      }
                    }}
                  >
                    {link.title}
                    {link.hasDropdown && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </a>
  
                  {/* Desktop Dropdown Menu (on hover) */}
                  {link.hasDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {link.dropdownItems.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
  
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 z-20">
            <a href="#" className="text-gray-700 hover:text-amber-600 hidden md:block">
              Login
            </a>
            <Button variant="primary">Get Started</Button>
  
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden menu-button p-1 text-gray-700 hover:text-amber-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
  
          {/* Mobile Menu */}
          <div
            className={cn(
              "mobile-menu fixed inset-0 bg-white z-10 pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <div key={index} className="border-b border-gray-100 pb-2">
                  <div
                    className="flex justify-between items-center py-2 cursor-pointer"
                    onClick={() => link.hasDropdown && handleDropdownToggle(index)}
                  >
                    <a
                      href={link.hasDropdown ? "#" : "#"}
                      className="text-gray-700 hover:text-amber-600"
                      onClick={(e) => {
                        if (link.hasDropdown) {
                          e.preventDefault()
                        }
                      }}
                    >
                      {link.title}
                    </a>
                    {link.hasDropdown && (
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-gray-500 transition-transform",
                          activeDropdown === index ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
  
                  {/* Mobile Dropdown Menu (on click) */}
                  {link.hasDropdown && activeDropdown === index && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 border-amber-100">
                      {link.dropdownItems.map((item, itemIndex) => (
                        <a key={itemIndex} href={item.href} className="block py-2 text-gray-600 hover:text-amber-600">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
  
              {/* Mobile Login Button */}
              <div className="pt-4">
                <a href="#" className="block py-2 text-gray-700 hover:text-amber-600">
                  Login
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>
    )
}
