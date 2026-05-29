import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronDown, ChevronUp, Heart } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import ImageWithFallback from '../components/ImageWithFallback'
import { useCart } from '../context/CartContext'
import equipmentData from '../data/equipment.json'
import { equipmentImages } from '../assets/images'

const tabs = ['Dashboard', 'Rental Orders', 'Saved Items', 'Settings', 'Support']

const statusStyles = {
  Completed: 'bg-green-100 text-green-800',
  Processing: 'bg-orange-100 text-orange-800',
  Active: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800'
}

function loadUserData() {
  try {
    return JSON.parse(localStorage.getItem('kitchenrent_user') || '{}')
  } catch {
    return {}
  }
}

function loadSavedItems() {
  try {
    const raw = localStorage.getItem('kitchenrent_wishlist') || '[]'
    const parsed = JSON.parse(raw)
    // normalize to array of id strings
    return parsed.map((id) => String(id)).filter(Boolean)
  } catch {
    return []
  }
}

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('kitchenrent_orders') || '[]')
  } catch {
    return []
  }
}

function persistSavedItems(items) {
  try {
    // store wishlist as array of id strings under a single canonical key
    const normalized = (items || []).map((id) => String(id))
    localStorage.setItem('kitchenrent_wishlist', JSON.stringify(normalized))
  } catch (err) {
    console.error('Unable to persist saved items', err)
  }
}

class ProfileErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ProfilePage error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
            <p className="text-gray-500 mb-6">We couldn&apos;t load your profile content. Please refresh the page or try again.</p>
            <Link to="/equipment" className="bg-orange-700 text-white px-6 py-3 rounded-lg">Browse Equipment</Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function ProfilePage() {
  const { auth, setAuth, cart } = useCart()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [orders, setOrders] = useState(() => loadOrders())
  const [savedItems, setSavedItems] = useState([])
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', avatar: '' })
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [orderFilter, setOrderFilter] = useState('All')
  const [toast, setToast] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [expandedOrders, setExpandedOrders] = useState([])
  const [removingSavedIds, setRemovingSavedIds] = useState([])

  useEffect(() => {
    const user = loadUserData()
    const savedAvatar = localStorage.getItem('kitchenrent_profile_pic') || ''
    setProfile({
      name: user.name || auth?.name || '',
      email: user.email || auth?.email || '',
      phone: user.phone || '',
      avatar: savedAvatar
    })
    setSavedItems(loadSavedItems())
  }, [auth?.name, auth?.email])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  // savedItems is an array of id strings; compute equipment objects for display
  const savedEquipment = equipmentData.filter((item) => savedItems.includes(String(item.id)))
  const totalRentals = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const activeRentals = orders.filter((order) => order.status === 'Processing').length

  const orderCounts = {
    all: orders.length,
    ongoing: orders.filter((order) => order.status === 'Processing' || order.status === 'Active').length,
    completed: orders.filter((order) => order.status === 'Completed').length
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
  const filteredOrders = sortedOrders.filter((order) => {
    if (orderFilter === 'All') return true
    if (orderFilter === 'Ongoing') return order.status === 'Processing' || order.status === 'Active'
    if (orderFilter === 'Completed') return order.status === 'Completed'
    return true
  })

  function persistSavedItemsState(items) {
    setSavedItems(items)
    persistSavedItems(items)
  }

  function handleRemoveSavedItem(itemId) {
    setRemovingSavedIds((prev) => [...prev, itemId])
    const next = savedItems.filter((id) => String(id) !== String(itemId))
    window.setTimeout(() => {
      persistSavedItemsState(next)
      setRemovingSavedIds((prev) => prev.filter((id) => id !== itemId))
      showToast('Removed from wishlist', 'success')
    }, 260)
  }

  // when user opens Saved Items tab, refresh wishlist from localStorage
  useEffect(() => {
    if (activeTab === 'Saved Items') {
      setSavedItems(loadSavedItems())
    }
  }, [activeTab])

  function markOrderCompleted(orderId) {
    const nextOrders = orders.map((order) => (order.id === orderId ? { ...order, status: 'Completed' } : order))
    setOrders(nextOrders)
    localStorage.setItem('kitchenrent_orders', JSON.stringify(nextOrders))
    showToast('Order marked as completed!', 'success')
  }

  function toggleOrderDetails(orderId) {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  function handleLogout() {
    setAuth({ loggedIn: false })
    navigate('/login')
  }

  function showToast(message, type = 'success') {
    setToastType(type)
    setToast(message)
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    const userData = { name: profile.name, email: profile.email, phone: profile.phone }
    localStorage.setItem('kitchenrent_user', JSON.stringify(userData))
    if (profile.avatar) {
      localStorage.setItem('kitchenrent_profile_pic', profile.avatar)
    }
    setAuth((prev) => ({ ...prev, name: profile.name, email: profile.email, profilePic: profile.avatar }))

    const storedPassword = localStorage.getItem('kitchenrent_password') || ''
    if (password.current || password.newPass || password.confirm) {
      if (!storedPassword || password.current !== storedPassword) {
        showToast('Current password does not match', 'error')
        return
      }
      if (password.newPass.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(password.newPass)) {
        showToast('New password must be at least 8 characters and include a letter and number', 'error')
        return
      }
      if (password.newPass !== password.confirm) {
        showToast('Passwords do not match', 'error')
        return
      }
      localStorage.setItem('kitchenrent_password', password.newPass)
      setPassword({ current: '', newPass: '', confirm: '' })
      showToast('Password changed successfully!', 'success')
      return
    }

    showToast('Profile updated successfully!', 'success')
  }

  return (
    <ProfileErrorBoundary>
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="md:flex gap-6">
          <aside className="w-full md:w-72 card p-4 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center pb-4 border-b mb-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">{profile.name?.charAt(0) || 'U'}</div>
              )}
              <div className="font-semibold mt-3">{profile.name || auth?.email}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
              <div className="mt-2 inline-flex items-center rounded-full bg-brand/10 text-brand px-3 py-1 text-xs font-semibold">Verified</div>
            </div>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left rounded-lg px-3 py-2 font-medium transition ${activeTab === tab ? 'bg-brand/10 text-brand' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 w-full rounded-md bg-brand text-white py-2 font-semibold">Logout</button>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="card p-6 bg-white shadow-lg border-l-4 border-brand">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-semibold">{profile.name?.charAt(0).toUpperCase() || 'U'}</div>
              )}
              <div>
                <h1 className="text-2xl font-semibold">Welcome back, {profile.name || auth?.email}</h1>
                <p className="text-gray-600">Manage your rentals, saved items, and account settings.</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 text-sm text-gray-600">
              <span className="font-semibold">Current cart:</span>
              <span>{cart.length} items</span>
            </div>
          </div>
        </div>

        {toast && (
          <div className={`rounded-lg px-4 py-3 ${toastType === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {toast}
          </div>
        )}

        {activeTab === 'Dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card p-5 bg-white shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total rentals</p>
                <p className="text-2xl font-semibold mt-2">{totalRentals}</p>
              </div>
              <div className="card p-5 bg-white shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total spent</p>
                <p className="text-2xl font-semibold mt-2">₦{totalSpent.toLocaleString()}</p>
              </div>
              <div className="card p-5 bg-white shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Active rentals</p>
                <p className="text-2xl font-semibold mt-2">{activeRentals}</p>
              </div>
              <div className="card p-5 bg-white shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Your status</p>
                <p className="text-2xl font-semibold mt-2">Loyal Customer</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Rental Orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No rental orders yet</h3>
                <p className="text-gray-400 mb-6">Your completed bookings will appear here</p>
                <Link to="/equipment" className="bg-orange-700 text-white px-6 py-3 rounded-lg">Browse Equipment</Link>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderFilter('All')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${orderFilter === 'All' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All Orders ({orderCounts.all})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('Ongoing')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${orderFilter === 'Ongoing' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Ongoing ({orderCounts.ongoing})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('Completed')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${orderFilter === 'Completed' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Completed ({orderCounts.completed})
                  </button>
                </div>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 rounded-lg bg-white shadow-sm border border-gray-100">
                    <p className="text-gray-500">No orders found for this filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const item = order.items?.[0] || {}
                      const status = order.status || 'Completed'
                      const isExpanded = expandedOrders.includes(order.id)
                      const badgeClass = statusStyles[status] || statusStyles.Completed

                      return (
                        <div key={order.id} className="card p-5 bg-white shadow-sm border border-gray-100">
                          <div className="md:flex md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-28 h-24 overflow-hidden rounded-3xl bg-gray-100">
                                <ImageWithFallback
                                  src={equipmentImages[item.id] || item.image || item.images?.[0]}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  placeholderText={item.name}
                                />
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Order ID</div>
                                <div className="text-base font-semibold text-gray-900">{order.id}</div>
                                <div className="mt-2 text-xl font-semibold text-gray-900">{item.name || 'Kitchen equipment'}</div>
                                <div className="text-sm text-gray-500 mt-1">{order.rentalStartDate || 'N/A'} — {order.rentalEndDate || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start gap-3 md:items-end mt-4 md:mt-0">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{status}</span>
                              <div className="text-sm text-gray-500">Total</div>
                              <div className="text-2xl font-semibold">₦{(order.total || 0).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 items-center">
                            {order.status === 'Processing' && (
                              <button
                                type="button"
                                onClick={() => markOrderCompleted(order.id)}
                                className="rounded border border-green-500 text-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-50"
                              >
                                Mark as Completed
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleOrderDetails(order.id)}
                              className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                  <div className="font-semibold">Itemized Breakdown</div>
                                  {order.items?.map((itemRow) => (
                                    <div key={`${itemRow.id}-${itemRow.sku || itemRow.name}`} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                                      <div>
                                        <div className="font-medium">{itemRow.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {itemRow.quantity} x ₦{(itemRow.price || 0).toLocaleString()} x {itemRow.rentalDays || 1} days
                                        </div>
                                      </div>
                                      <div className="font-semibold">₦{((itemRow.price || 0) * (itemRow.quantity || 1) * (itemRow.rentalDays || 1)).toLocaleString()}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-4">
                                  <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="font-semibold">Delivery Address</div>
                                    <div>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</div>
                                    <div>{order.deliveryAddress?.address}</div>
                                    <div>{order.deliveryAddress?.city}</div>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="font-semibold">Payment Method</div>
                                    <div>Card ending •••• {order.paymentLast4 || '0000'}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-3 md:grid-cols-3 text-sm">
                                <div className="rounded-lg bg-gray-50 p-4">
                                  <div className="text-gray-500">Subtotal</div>
                                  <div className="font-semibold">₦{(order.subtotal || 0).toLocaleString()}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                  <div className="text-gray-500">Delivery Fee</div>
                                  <div className="font-semibold">₦{(order.deliveryFee || 0).toLocaleString()}</div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                  <div className="text-gray-500">Created</div>
                                  <div>{new Date(order.createdAt || order.date).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'Saved Items' && (
          <div className="space-y-4">
            {savedEquipment.length === 0 ? (
              <div className="card p-6 bg-white shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-semibold">No saved items yet</h3>
                <p className="text-gray-600 mt-2">Save equipment while browsing and return here later.</p>
                <button onClick={() => navigate('/equipment')} className="mt-4 rounded bg-brand px-4 py-2 text-white font-semibold">Browse Equipment</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedEquipment.map((item) => {
                  const isRemoving = removingSavedIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/equipment/${item.id}`)}
                      className={`group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveSavedItem(item.id)
                        }}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-sm text-orange-500 hover:bg-orange-50"
                      >
                        <Heart fill="currentColor" className="w-5 h-5" />
                      </button>
                      <ImageWithFallback
                        src={equipmentImages[item.id] || item.image}
                        alt={item.name}
                        className="w-full h-56 object-cover"
                        placeholderText={item.name}
                      />
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">₦{item.price?.toLocaleString()}/day</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <RatingStars rating={item.rating || 4.0} />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/equipment/${item.id}`)
                          }}
                          className="w-full rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                          Rent Now
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="grid gap-6">
            <form onSubmit={handleProfileSave} className="card p-6 bg-white shadow-sm border border-gray-100 space-y-5">
              <div>
                <h3 className="text-xl font-semibold">Account Settings</h3>
                <p className="text-gray-600 mt-1">Update your profile details and contact information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-2 w-full rounded border p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-2 w-full rounded border p-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-2 w-full rounded border p-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        const dataUrl = reader.result
                        setProfile((prev) => ({ ...prev, avatar: dataUrl }))
                        localStorage.setItem('kitchenrent_profile_pic', dataUrl)
                        setAuth((prev) => ({ ...prev, profilePic: dataUrl }))
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="mt-2 w-full rounded border p-3"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your current password for greater security.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input type="password" placeholder="Current Password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} className="rounded border p-3" />
                  <input type="password" placeholder="New Password" value={password.newPass} onChange={(e) => setPassword({ ...password, newPass: e.target.value })} className="rounded border p-3" />
                  <input type="password" placeholder="Confirm Password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} className="rounded border p-3" />
                </div>
              </div>
              <button type="submit" className="rounded bg-brand px-5 py-3 text-white font-semibold">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'Support' && (
          <div className="card p-6 bg-white shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold">Support</h3>
            <p className="mt-2 text-gray-600">Need help? Reach out to our team for assistance with your rental orders.</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div>Email: kitchenrentng@gmail.com</div>
              <div>Phone: +234 906 057 7186</div>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
    </ProfileErrorBoundary>
  )
}
