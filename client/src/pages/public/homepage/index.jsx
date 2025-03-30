import React, { useState } from "react"
import { ChevronDown, ChevronRight, Facebook, Instagram, Linkedin, Twitter, Check, ArrowRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Accordion } from "../../../components/ui/accordion"
import { Card, CardContent } from "../../../components/ui/card"
import HomePageHeroSectionOne from "../../../components/public/pages/homepage/herosection"


export default function Home() {
  
  // Features data
  const featuresData = [
    {
      title: "Generate Documents",
      description: "Create perfectly formatted legal documents automatically from your case data.",
    },
    {
      title: "Access Files",
      description: "Secure, centralized access to all case files from anywhere, anytime.",
    },
    {
      title: "File emails",
      description: "Automatically categorize and file emails related to specific cases.",
    },
    {
      title: "Formulate Papers",
      description: "Draft and review legal papers with AI-assisted formatting and citation.",
    },
  ]

  // Payment tags data
  const paymentTags = [
    { label: "Payment Tracking", active: true },
    { label: "Accounting", active: false },
    { label: "Invoicing", active: false },
  ]

  // Payment data
  const paymentsData = [
    { client: "Johnson Case", date: "Apr 15", amount: "$2,500.00", status: "Pending" },
    { client: "Smith vs. Davis", date: "Apr 18", amount: "$1,750.00", status: "Scheduled" },
    { client: "Roberts LLC", date: "Apr 22", amount: "$3,200.00", status: "Confirmed" },
  ]



  // FAQ data
  const faqData = [
    {
      title: "What does our firm management consulting entail?",
      content:
        "Our firm management consulting provides comprehensive analysis and strategic guidance to optimize your law firm's operations, workflow, and profitability. We assess your current processes, identify inefficiencies, and implement tailored solutions to enhance productivity and client satisfaction.",
    },
    {
      title: "Are you familiar with the latest legal industry trends?",
      content:
        "Yes, our team continuously monitors and analyzes emerging trends in the legal industry, including technological advancements, regulatory changes, and evolving client expectations. We incorporate this knowledge into our recommendations to ensure your firm stays ahead of the curve.",
    },
    {
      title: "What sets your management tools apart?",
      content:
        "Our management tools are specifically designed for legal professionals, with features that address the unique challenges of law practice. Unlike generic solutions, our tools integrate seamlessly with legal workflows, offer industry-specific analytics, and comply with legal ethics and confidentiality requirements.",
    },
    {
      title: "How can I get started with your services?",
      content:
        "Getting started is simple. Schedule a free consultation through our website or by calling our team. We'll conduct an initial assessment of your needs, provide a customized proposal, and guide you through the implementation process with comprehensive training and support.",
    },
    {
      title: "Is my firm's information kept confidential?",
      content:
        "Absolutely. We maintain the highest standards of confidentiality and data security. All client information is protected with enterprise-grade encryption, secure access controls, and strict data handling protocols that comply with attorney-client privilege requirements and relevant data protection regulations.",
    },
    {
      title: "Can you provide examples of your success stories?",
      content:
        "We have numerous success stories across firms of all sizes. For example, we helped a mid-sized litigation firm reduce document processing time by 65% and increase billable hours by 20% through our automation tools. Another solo practitioner was able to expand their client base by 40% within six months by implementing our client management system.",
    },
  ]

  // News articles data
  const articlesData = [
    {
      title: "Making Compliance Easy for Legal Teams in 2023",
      image: "/placeholder.svg?height=200&width=400&text=Legal+Compliance",
      tag: "LAW TECH",
      author: "John Doe",
      readTime: "5 min read",
    },
    {
      title: "Innovative Approaches for Civil Litigation Practice in 2023",
      image: "/placeholder.svg?height=200&width=400&text=Civil+Litigation",
      tag: "NEW TECH",
      author: "Jane Smith",
      readTime: "7 min read",
    },
    {
      title: "Effective Strategies for Simplified Legal Documentation",
      image: "/placeholder.svg?height=200&width=400&text=Legal+Documentation",
      tag: "TECH TIPS",
      author: "Robert Johnson",
      readTime: "4 min read",
    },
  ]

  // Footer links data
  const footerLinks = {
    products: ["Case Management", "Document Automation", "Time & Billing", "Client Portal"],
    features: ["Deadline Tracking", "Document Assembly", "Billing & Payments", "Reporting & Analytics"],
  }

  // State for accordion
  const [openAccordion, setOpenAccordion] = useState(0)

  // State for deadline tabs
  const [activeDeadlineTab, setActiveDeadlineTab] = useState(0)

  const deadlineTabs = [
    {
      id: "strategic",
      label: "Strategic Time Mastery",
      content: (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-gray-600 text-sm">
            Comprehensive time tracking and analytics to understand impact of attorney time allocation. Identify
            bottlenecks, optimize workflows, and ensure deadlines are met with strategic time management features
            designed specifically for legal professionals.
          </p>
        </div>
      ),
    },
    {
      id: "preparations",
      label: "Preparations for Hearing Critical",
      content: (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-gray-600 text-sm">
            Our hearing preparation tools help you organize evidence, prepare witnesses, and create compelling
            arguments. With automated checklists and deadline reminders, you'll never miss a critical step in your
            hearing preparation process.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
 
    
    <HomePageHeroSectionOne/>
    

      {/* Deadline Mastery Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Deadline Mastery Ensuring Success Through Strategic
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            In the fast-paced legal environment, meeting deadlines is crucial. Our platform helps you track, manage, and
            prioritize all your case deadlines to ensure nothing falls through the cracks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Methodical Tracking of Key Responsibilities</h3>

            {deadlineTabs.map((tab, index) => (
              <div key={index} className="border border-gray-200 rounded-md mb-4 last:mb-0">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setActiveDeadlineTab(activeDeadlineTab === index ? -1 : index)}
                >
                  <div className="font-medium">{tab.label}</div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${activeDeadlineTab === index ? "transform rotate-180" : ""}`}
                  />
                </div>
                {activeDeadlineTab === index && tab.content}
              </div>
            ))}

            <Button variant="primary" className="mt-6">
              Explore Features
            </Button>
          </div>

          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <img src="/placeholder.svg?height=400&width=500" alt="Dashboard interface" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Streamline Organization Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-amber-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Legal professionals with documents"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Streamline Organization for Every Civil Litigation Case
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {featuresData.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cash Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Cash, Accelerate Litigation Payouts</h2>

            <div className="flex flex-wrap gap-4 mb-6">
              {paymentTags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-4 py-1 rounded-full text-sm ${
                    tag.active ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <p className="text-gray-600 mb-6">
              Efficient solutions for your client payment processing needs. Our tools provide a seamless way to track
              fees, process payments, and manage your firm's finances all in one place.
            </p>

            <p className="text-gray-600 mb-6">
              Streamline the finances of litigation cases with our payment tracking features. Easily monitor outstanding
              balances, send automated reminders, and provide clients with convenient online payment options to
              accelerate your cash flow.
            </p>

            <a href="#" className="text-amber-600 font-medium flex items-center">
              Learn more about our payment features <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="text-lg font-medium mb-2">April 2023</div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div key={i} className="py-1 text-gray-500">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => (
                      <div key={i} className={`py-2 rounded-full ${i === 12 ? "bg-amber-600 text-white" : ""}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-lg font-medium mb-4">Upcoming Payments</div>
                  {paymentsData.map((payment, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <div className="font-medium">{payment.client}</div>
                        <div className="text-sm text-gray-500">{payment.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{payment.amount}</div>
                        <div
                          className={`text-sm ${payment.status === "Confirmed" ? "text-green-500" : "text-amber-500"}`}
                        >
                          {payment.status}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-amber-600 font-medium">Total for April</div>
                    <div className="text-xl font-bold">$12,450.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-amber-50">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Popular Questions</h2>
        <p className="text-gray-600 text-center mb-12">
          Everything you need to know about the application and product.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="FAQ illustration"
              className="mx-auto w-full max-w-[300px] h-auto"
            />
          </div>

          <div className="space-y-4">
            <Accordion
              items={faqData.map((item) => ({
                title: item.title,
                content: <p className="text-gray-600">{item.content}</p>,
              }))}
              allowMultiple={false}
              defaultOpen={[0]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-amber-50">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">What People Say About Our Product</h2>
        <p className="text-gray-600 text-center mb-12">Real testimonials from satisfied clients.</p>

        <div className="flex justify-center mb-12 space-x-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full overflow-hidden border-2 ${i === 2 ? "border-amber-600" : "border-white"}`}
            >
              <img
                src={`/placeholder.svg?height=48&width=48&text=${i + 1}`}
                alt={`User ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="font-medium mb-4">Elena Jill</div>
          <div className="text-sm text-gray-500 mb-6">Attorney at Law</div>
          <p className="text-lg text-gray-800 italic mb-6">
            "Our experience with Smart Case has been nothing short of exceptional. The platform has streamlined our
            document management, improved our time tracking, and propelled our firm towards unprecedented growth."
          </p>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Latest News</h2>
        <h3 className="text-xl font-medium text-gray-700 text-center mb-12">Legal Research and Briefing Materials</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesData.map((article, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                  {article.tag}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-4">{article.title}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt="Author"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  )
}

