import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, clearUser } from '../store/authSlice'
import { account, databases } from '../lib/appwrite'
import { Query } from 'appwrite'
import LogoutConfirmationModal from '../components/common/LogoutConfirmationModal'
import defaultAvatar from '../assets/user_person_black.jpg'

// Appwrite collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarRef = useRef(null)
  const dispatch = useDispatch()
  
  // Get user data from Redux store
  const currentUser = useSelector(selectCurrentUser)
  // Extract user role from the embedded profile data
  const userRole = currentUser?.profile?.role || 'client'
  const userName = currentUser?.name || 'User'
  const userAvatar = currentUser?.profile?.profileImage || defaultAvatar
  
  // Fetch notifications when user is logged in
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?.$id) return

      setIsLoadingNotifications(true)
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          [Query.equal('userId', currentUser.$id)]
        )

        if (response.documents.length > 0) {
          const notificationDoc = response.documents[0]
          const parsedNotifications = notificationDoc.notifications
            .map(n => JSON.parse(n))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          
          setNotifications(parsedNotifications)
          setUnreadCount(notificationDoc.unreadCount || 0)
        } else {
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setIsLoadingNotifications(false)
      }
    }

    fetchNotifications()
  }, [currentUser?.$id])

  // Function to mark a single notification as read
  const markNotificationAsRead = async (notificationId) => {
    if (!currentUser?.$id) return

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      )

      if (response.documents.length > 0) {
        const notificationDoc = response.documents[0]
        const updatedNotifications = notificationDoc.notifications.map(n => {
          const parsed = JSON.parse(n)
          if (parsed.id === notificationId) {
            return JSON.stringify({ ...parsed, read: true })
          }
          return n
        })

        // Calculate new unread count
        const newUnreadCount = updatedNotifications.reduce((count, n) => {
          const parsed = JSON.parse(n)
          return parsed.read ? count : count + 1
        }, 0)

        await databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          notificationDoc.$id,
          {
            notifications: updatedNotifications,
            unreadCount: newUnreadCount,
            lastRead: new Date().toISOString()
          }
        )

        // Update local state
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ))
        setUnreadCount(newUnreadCount)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Function to handle notification click
  const handleNotificationClick = (notification) => {
    if (notification.url) {
      markNotificationAsRead(notification.id)
      navigate(notification.url)
      setNotificationsOpen(false)
    }
  }

  // Open notifications and mark as read
  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen)
    setDropdownOpen(false)
    if (!notificationsOpen && unreadCount > 0) {
      markNotificationsAsRead()
    }
  }

  // Toggle sidebar on small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  // --- Logout Logic ---
  // Function to open the confirmation modal
  const openLogoutModal = () => {
    setDropdownOpen(false)
    setIsLogoutModalOpen(true)
  }

  // Function to handle the actual logout after confirmation
  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await account.deleteSession('current')
      dispatch(clearUser())
      setIsLogoutModalOpen(false)
      navigate('/')
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
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
  
  // Generate nav links based on user role from Redux state
  const getNavLinks = () => {
    if (userRole === 'lawyer') {
      return [
        { name: 'Dashboard', path: '/lawyer/dashboard', dynamicpath: [], icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Available Cases', path: '/lawyer/available-cases', dynamicpath: [], icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { name: 'My Cases', path: '/lawyer/my-cases', dynamicpath: [], icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'My Applications', path: '/lawyer/my-applications', dynamicpath: [], icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { name: 'My Clients', path: '/lawyer/my-clients', dynamicpath: [], icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Profile', path: '/lawyer/profile', dynamicpath: [], icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    } else {
      return [
        { name: 'Dashboard', path: '/client/dashboard', dynamicpath: [], icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Create Case', path: '/client/create-case', dynamicpath: [], icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { name: 'My Cases', path: '/client/my-cases', dynamicpath: ['/client/case/:id'], icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: 'Find Lawyer', path: '/client/find-lawyer', dynamicpath: ['/client/lawyer/:lawyerId'], icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { name: 'Profile', path: '/client/profile', dynamicpath: [], icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    }
  }
  
  const navLinks = getNavLinks()
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop - Only visible when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
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
              className="lg:hidden text-white hover:text-primary transition-colors"
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
                  location.pathname === link.path || 
                  location.pathname.startsWith(link.path + '/') || 
                  link.dynamicpath?.some(dp => new RegExp(`^${dp.replace(/:\w+/g, '[^/]+')}$`).test(location.pathname))
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
          
          {/* User Profile Summary - Updated */}
          <div className="p-4 border-t border-secondary-700">
            <div className="flex items-center">
              <img
                src={userAvatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full mr-3 bg-gray-300 object-contain" 
              />
              <div className='text-left mr-auto'>
                <div className="font-medium">{userName}</div>
                <div className="text-xs text-gray-300 capitalize">{userRole}</div>
              </div>
            </div>
            <button
              onClick={openLogoutModal}
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
        {/* Header - Updated */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Hamburger for mobile */}
            <button
              onClick={toggleSidebar}
              className="text-gray-600 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Placeholder for potential Breadcrumbs or Title */}
            <div className="hidden lg:block">
              {/* Maybe display current page title here */}
            </div>

            {/* Header Right - Updated */}
            <div className="ml-auto flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleNotificationsClick}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100 relative"
                >
                  <span className="sr-only">View notifications</span>
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
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-primary">{unreadCount} unread</span>
                        )}
                      </div>
                      
                      {isLoadingNotifications ? (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification, index) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`flex-shrink-0 rounded-full p-1 ${
                                  notification.type === 'case_created' ? 'bg-primary' :
                                  notification.type === 'application' ? 'bg-green-500' :
                                  notification.type === 'message' ? 'bg-blue-500' :
                                  'bg-gray-500'
                                }`}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    {notification.type === 'case_created' && (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                    {notification.type === 'application' && (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    )}
                                    {notification.type === 'message' && (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    )}
                                  </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                  {notification.url && (
                                    <button
                                      onClick={() => handleNotificationClick(notification)}
                                      className="mt-1 text-xs text-primary hover:underline"
                                    >
                                      {notification.type === 'case_created' ? 'View Case' :
                                       notification.type === 'application' ? 'View Application' :
                                       notification.type === 'message' ? 'View Message' :
                                       'View Details'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 text-center border-t border-gray-100">
                          <button
                            onClick={() => {
                              setNotificationsOpen(false)
                              navigate(`/${userRole}/notifications`)
                            }}
                            className="text-sm text-primary hover:underline"
                          >
                            View all notifications
                          </button>
                        </div>
                      )}
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
                  className="flex items-center space-x-2 focus:outline-none p-1 rounded-md hover:bg-gray-100"
                >
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full bg-gray-300 object-contain"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">{userName}</div>
                    <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 hidden md:block"
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
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5"
                  >
                    <Link
                      to={`/${userRole}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to={`/${userRole}/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={`/${userRole}/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={openLogoutModal}
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Logout Confirmation Modal Render */}
      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        isLoading={isLoggingOut}
      />
    </div>
  )
}

export default DashboardLayout 