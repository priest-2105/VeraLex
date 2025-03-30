import React from "react"
import {  Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"


export default function PublicFooter() {
  
    

  const footerLinks = {
    products: ["Case Management", "Document Automation", "Time & Billing", "Client Portal"],
    features: ["Deadline Tracking", "Document Assembly", "Billing & Payments", "Reporting & Analytics"],
  }

 

  return (
   <footer className="bg-gray-900 text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
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
            <p className="text-gray-400 text-sm mb-6">
              We provide the tools and resources legal professionals need to streamline their practice and focus on what
              matters most.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.products.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.features.map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Accelerate your company with BrightLegal</h4>
            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-gray-800 text-white focus:ring-amber-500 border-gray-700"
              />
            </div>
            <Button variant="primary" className="w-full">
              Sign Up
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
          <p>© 2023 Smart Case Inc. • 123 Legal Street, San Francisco, CA 94103</p>
        </div>
      </footer>
  )
}

