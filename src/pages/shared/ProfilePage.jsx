import { useState } from 'react'

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'client',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    joinDate: 'January 2023',
    profileImage: 'https://via.placeholder.com/150'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(user)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUser(formData)
    setIsEditing(false)
    // In a real app, you would send this data to your API
    alert('Profile updated successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-primary w-full"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {/* Profile Details */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="input"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="text-base">{user.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-base">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="text-base capitalize">{user.role}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-base">{user.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-base">{user.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="text-base">{user.joinDate}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="text-base">{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 