import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Law Image with Overlay */}
      <div className="hidden lg:block lg:w-1/2 bg-secondary relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70"
        >
          <div className="flex flex-col justify-center items-start h-full px-16">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/" className="text-2xl text-white font-bold mb-6 inline-block">
                Vera<span className="text-primary">Lex</span>
              </Link>
              <h1 className="text-4xl font-bold text-white mb-4">
                Connect with the right legal representation
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                A marketplace connecting clients with lawyers, streamlining case initiation and legal representation.
              </p>
              <div className="flex space-x-4 mt-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-medium">Verified Lawyers</h3>
                    <p className="text-gray-300 text-sm">Bar association verified</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-medium">Secure Messaging</h3>
                    <p className="text-gray-300 text-sm">End-to-end encryption</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589216795213-b3cf0731ff78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')" }}
        />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-2xl font-bold inline-block">
              Vera<span className="text-primary">Lex</span>
            </Link>
          </div>
          
          <Outlet />
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By using VeraLex, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout 