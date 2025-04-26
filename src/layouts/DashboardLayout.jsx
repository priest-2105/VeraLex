import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarRef = useRef(null)
  
  // Mock user data - this would come from auth context in a real app
  const mockUser = {
    role: location.pathname.includes('/lawyer') ? 'lawyer' : 'client',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
  }
  
  // Toggle sidebar on small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  // Mock logout function
  const handleLogout = () => {
    // In a real app, you would clear auth state/tokens here
    navigate('/auth/signin')
  }

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          isSidebarOpen && 
          window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen])
  
  // Generate nav links based on user role
  const getNavLinks = () => {
    if (mockUser.role === 'lawyer') {
      return [
        { name: 'Dashboard', path: '/lawyer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Available Cases', path: '/lawyer/available-cases', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { name: 'My Applications', path: '/lawyer/my-applications', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { name: 'My Clients', path: '/lawyer/my-clients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Profile', path: '/lawyer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    } else {
      return [
        { name: 'Dashboard', path: '/client/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Create Case', path: '/client/create-case', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { name: 'My Cases', path: '/client/my-cases', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: 'Find Lawyer', path: '/client/find-lawyer', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { name: 'Profile', path: '/client/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    }
  }
  
  const navLinks = getNavLinks()
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop - Only visible when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#00000021] bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar - Fixed */}
      <aside 
        ref={sidebarRef}
        className={`fixed lg:static h-full z-30 bg-secondary text-white w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo with Close Button for Mobile */}
          <div className="p-4 border-b border-secondary-700 flex items-center justify-between">
            <Link to="/" className="flex items-center w-fit">
              <span className="font-bold text-xl">Vera<span className="text-primary">Lex</span></span>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-white hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Nav Links - scrollable */}
          <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-white hover:bg-secondary-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Profile Summary */}
          <div className="p-4 border-t border-secondary-700">
            <div className="flex items-center">
              <img
                src={mockUser.avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className='text-start mr-auto'>
                <div className="font-medium">{mockUser.name}</div>
                <div className="text-xs text-gray-300 capitalize">{mockUser.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center px-4 py-2 text-sm text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Header Right */}
            <div className="ml-auto md:space-x-5 space-x-2 flex items-center">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setDropdownOpen(false)
                  }}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100 relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                      </div>
                      
                      <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-primary rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New application</p>
                            <p className="text-xs text-gray-500">John Doe applied to your case</p>
                            <p className="text-xs text-gray-500 mt-1">Just now</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500 rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New message</p>
                            <p className="text-xs text-gray-500">You have a new message from Jane Smith</p>
                            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-2 text-center">
                        <a href="#" className="text-sm text-primary hover:underline">View all notifications</a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen)
                    setNotificationsOpen(false)
                  }}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={mockUser.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">{mockUser.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{mockUser.role}</div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                  >
                    <Link
                      to={mockUser.role === 'lawyer' ? '/lawyer/profile' : '/client/profile'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to={mockUser.role === 'lawyer' ? '/lawyer/dashboard' : '/client/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 