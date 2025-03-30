import React, { useRef } from "react"
import { ChevronRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Button } from "../../../../components/ui/button"

export default function HomePageHeroSectionOne() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const statsData = [
    { value: "94%", label: "Success Rate" },
    { value: "20K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section ref={ref} className="py-12 px-4 md:px-8 md-py-18 lg:px-16 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div>
          <motion.div variants={itemVariants} className="text-sm text-blue-800 font-medium mb-2">
            SIMPLIFY YOUR LEGAL WORK
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Legal Research and Briefing Software
          </motion.h1>

          <motion.p variants={itemVariants} className="text-gray-600 mb-8 md:my-18 text-lg">
            A comprehensive solution designed to simplify legal research, analysis, and preparation for your clients.
            The last thing you need is wasted time searching for the right information.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Button variant="primary" className="flex items-center">
              Request a Demo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center">
              Play Demo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex items-center">
            {statsData.map((stat, index) => (
              <div key={index} className="mr-8 last:mr-0">
                <div className="text-amber-600 font-bold text-2xl">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Legal professionals discussing case"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

