import React, { useRef } from "react"
import { ChevronRight, Rocket, Users, Zap } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Button } from "../../../../components/ui/button"

export default function HomePageHeroSectionOne() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const statsData = [
    { value: "94%", label: "Success Rate", icon: <Rocket className="w-4 h-4" /> },
    { value: "20K+", label: "Active Users", icon: <Users className="w-4 h-4" /> },
    { value: "99.9%", label: "Uptime", icon: <Zap className="w-4 h-4" /> },
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
    <section ref={ref} className="py-12 px-4 md:px-8 md:py-40 lg:px-16 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div>
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-sm text-blue-800 font-medium mb-2 bg-blue-50 px-3 py-1 rounded-full">
            <Rocket className="w-4 h-4" />
            SIMPLIFY YOUR LEGAL WORK
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A comprehensive platform for legal research and case management
          </motion.h1>

          <motion.p variants={itemVariants} className="text-gray-600 mb-8 md:my-12 text-lg">
            Save time and effort with our all-in-one solution for legal research, case management, and document automation—so you can focus on winning cases.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Button variant="primary" className="flex items-center gap-2">
              Request a Demo <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Play Demo <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 grid grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                {stat.icon}
                <div className="text-amber-600 font-bold text-2xl mt-2">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative">
          <div className="rounded-lg overflow-hidden shadow-xl bg-gradient-to-br from-amber-100 to-amber-50 p-1">
            <img
              src="/assets/images/legal-team.jpg"
              alt="Legal professionals discussing case"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

