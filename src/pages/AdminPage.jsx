import React, { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, ShoppingBag, Package, Users, Wrench, Settings, Bell, Search, LogOut, LifeBuoy, MoreHorizontal, Plus, Pencil, Trash2, MessageSquare, XCircle } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import equipmentData from '../data/equipment.json'
import ImageWithFallback from '../components/ImageWithFallback'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const SIDEBAR_ITEMS = [
  { key: 'Overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'Rental Orders', label: 'Rental Orders', icon: ShoppingBag },
  { key: 'Equipment Catalog', label: 'Equipment Catalog', icon: Package },
  { key: 'Customers', label: 'Customers', icon: Users },
  { key: 'Maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'Support', label: 'Support', icon: MessageSquare },
  { key: 'Settings', label: 'Settings', icon: Settings }
]

const defaultSettings = {
  siteName: 'KitchenRent',
  contactEmail: 'kitchenrentng@gmail.com',
  contactPhone: '+234 906 057 7186',
  deliveryFee: 5000,
  freeDeliveryThreshold: 150000,
  currencySymbol: '₦',
  maintenanceMode: false
}

const sampleUsers = [
  { email: 'adebayo@gmail.com', name: 'Adebayo Okonkwo', phone: '+234 906 057 7186', accountType: 'Customer', joinDate: '2024-01-15', totalOrders: 0, totalSpent: 0, suspended: false },
  { email: 'ngozi@yahoo.com', name: 'Ngozi Adeyemi', phone: '+234 906 057 7186', accountType: 'Business', joinDate: '2024-02-20', totalOrders: 0, totalSpent: 0, suspended: false },
  { email: 'emeka@outlook.com', name: 'Emeka Chukwu', phone: '+234 906 057 7186', accountType: 'Customer', joinDate: '2024-03-10', totalOrders: 0, totalSpent: 0, suspended: false }
]

const sampleMaintenance = [
  { id: 1, equipment: 'Vulcan Convection Oven', issue: 'Annual servicing', status: 'Scheduled', date: 'next 4 hours', technician: 'Taiwo Adebisi' },
  { id: 2, equipment: 'Pitco 40lb Deep Fryer', issue: 'Oil system check', status: 'In Progress', date: 'today', technician: 'Chidi Okafor' },
  { id: 3, equipment: 'High-Temp Dishwasher', issue: 'Filter replacement', status: 'Completed', date: '2 days ago', technician: 'Emeka Nwosu' }
]

const sampleRevenueData = [
  { name: 'Mon', total: 45000 },
  { name: 'Tue', total: 78000 },
  { name: 'Wed', total: 62000 },
  { name: 'Thu', total: 95000 },
  { name: 'Fri', total: 125000 },
  { name: 'Sat', total: 88000 },
  { name: 'Sun', total: 55000 }
]

function formatNGN(value) {
  return `${defaultSettings.currencySymbol}${Number(value || 0).toLocaleString()}`
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : parsed
  } catch {
    return fallback
  }
}

function AdminPageContent() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [orders, setOrders] = useState([])
  const [equipment, setEquipment] = useState([])
  const [users, setUsers] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [settings, setSettings] = useState(defaultSettings)
  const [orderFilter, setOrderFilter] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [equipmentSearch, setEquipmentSearch] = useState('')
  const [equipmentCategory, setEquipmentCategory] = useState('All')
  const [customerSearch, setCustomerSearch] = useState('')
  const [maintenanceFilter, setMaintenanceFilter] = useState('All')
  const [supportFilter, setSupportFilter] = useState('All')
  const [modal, setModal] = useState({ type: '', data: null })
  const [toast, setToast] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  const saveNotifications = (next) => { setNotifications(next); localStorage.setItem('kitchenrent_notifications', JSON.stringify(next)) }
  const createNotification = (message, type = 'info') => {
    const note = { id: `${Date.now()}-${Math.random()}`, message, type, timestamp: new Date().toISOString(), read: false }
    setNotifications((prev) => {
      const next = [note, ...prev]
      localStorage.setItem('kitchenrent_notifications', JSON.stringify(next))
      return next
    })
  }
  const markAllNotificationsRead = () => saveNotifications(notifications.map((note) => ({ ...note, read: true })))
  const dismissNotification = (id) => saveNotifications(notifications.filter((note) => note.id !== id))

  useEffect(() => {
    const loadAll = () => {
      const storedOrders = loadJSON('kitchenrent_orders', [])
      setOrders(storedOrders)

      const storedUsers = loadJSON('kitchenrent_users', [])
      if (!storedUsers.length) {
        localStorage.setItem('kitchenrent_users', JSON.stringify(sampleUsers))
        setUsers(sampleUsers)
      } else {
        setUsers(storedUsers)
      }

      const storedEquipment = loadJSON('kitchenrent_equipment', [])
      if (!storedEquipment.length) {
        localStorage.setItem('kitchenrent_equipment', JSON.stringify(equipmentData))
        setEquipment(equipmentData)
      } else {
        setEquipment(storedEquipment)
      }

      const storedMaintenance = loadJSON('kitchenrent_maintenance', [])
      if (!storedMaintenance.length) {
        localStorage.setItem('kitchenrent_maintenance', JSON.stringify(sampleMaintenance))
        setMaintenance(sampleMaintenance)
      } else {
        setMaintenance(storedMaintenance)
      }

      const storedSupport = loadJSON('kitchenrent_support', [])
      setSupportTickets(storedSupport)

      const storedNotifications = loadJSON('kitchenrent_notifications', [])
      if (!storedNotifications.length) {
        const initialNotifications = [
          ...storedEquipment.filter((item) => !item.inStock).map((item) => ({ id: `${Date.now()}-${Math.random()}`, message: `${item.name} is Out of Stock`, type: 'warning', timestamp: new Date().toISOString(), read: false })),
          ...storedMaintenance.filter((entry) => entry.status !== 'Completed').map((entry) => ({ id: `${Date.now()}-${Math.random()}`, message: `${entry.equipment} scheduled for maintenance`, type: 'maintenance', timestamp: new Date().toISOString(), read: false }))
        ]
        localStorage.setItem('kitchenrent_notifications', JSON.stringify(initialNotifications))
        setNotifications(initialNotifications)
      } else {
        setNotifications(storedNotifications)
      }

      const storedSettings = (() => {
        try { return JSON.parse(localStorage.getItem('kitchenrent_settings') || 'null') || defaultSettings } catch { return defaultSettings }
      })()
      setSettings({ ...defaultSettings, ...storedSettings })
    }

    loadAll()
    const handler = () => loadAll()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const saveOrders = (next) => { setOrders(next); localStorage.setItem('kitchenrent_orders', JSON.stringify(next)) }
  const saveEquipment = (next) => { setEquipment(next); localStorage.setItem('kitchenrent_equipment', JSON.stringify(next)) }
  const saveUsers = (next) => { setUsers(next); localStorage.setItem('kitchenrent_users', JSON.stringify(next)) }
  const saveMaintenance = (next) => { setMaintenance(next); localStorage.setItem('kitchenrent_maintenance', JSON.stringify(next)) }
  const saveSupport = (next) => { setSupportTickets(next); localStorage.setItem('kitchenrent_support', JSON.stringify(next)) }
  const saveSettings = (next) => { setSettings(next); localStorage.setItem('kitchenrent_settings', JSON.stringify(next)); setToast('Settings saved successfully') }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const customerOrdersMap = useMemo(() => {
    const map = {}
    orders.forEach((order) => {
      const key = order.deliveryAddress?.email || `${order.deliveryAddress?.firstName || ''} ${order.deliveryAddress?.lastName || ''}`.trim()
      if (!map[key]) map[key] = []
      map[key].push(order)
    })
    return map
  }, [orders])

  const ordersWithCustomer = useMemo(() => orders.map((order) => ({
    ...order,
    customerName: `${order.deliveryAddress?.firstName || ''} ${order.deliveryAddress?.lastName || ''}`.trim()
  })), [orders])

  const filteredOrders = useMemo(() => {
    return ordersWithCustomer.filter((order) => {
      const matchesStatus = orderFilter === 'All' || order.status === orderFilter
      const lower = orderSearch.toLowerCase()
      const matchesSearch = !lower || order.id.toLowerCase().includes(lower) || order.customerName.toLowerCase().includes(lower) || order.deliveryAddress?.email?.toLowerCase().includes(lower)
      return matchesStatus && matchesSearch
    })
  }, [ordersWithCustomer, orderFilter, orderSearch])

  const equipmentCategories = useMemo(() => ['All', ...Array.from(new Set(equipment.map((item) => item.category || 'General')))], [equipment])

  const filteredEquipment = useMemo(() => {
    const lower = equipmentSearch.toLowerCase()
    return equipment.filter((item) => {
      const matchesCategory = equipmentCategory === 'All' || (item.category || 'General') === equipmentCategory
      const matchesSearch = !lower || item.name.toLowerCase().includes(lower) || (item.category || '').toLowerCase().includes(lower) || (item.sku || '').toLowerCase().includes(lower)
      return matchesCategory && matchesSearch
    })
  }, [equipment, equipmentSearch, equipmentCategory])

  const equipmentStats = useMemo(() => ({
    total: equipment.length,
    inStock: equipment.filter((item) => item.inStock).length,
    outOfStock: equipment.filter((item) => !item.inStock).length
  }), [equipment])

  const unreadNotificationCount = useMemo(() => notifications.filter((note) => !note.read).length, [notifications])

  const filteredUsers = useMemo(() => {
    const lower = customerSearch.toLowerCase()
    return users.map((user) => {
      const ordersForUser = customerOrdersMap[user.email] || []
      const totalSpent = ordersForUser.reduce((sum, order) => sum + (order.total || 0), 0)
      return { ...user, totalOrders: ordersForUser.length, totalSpent }
    }).filter((user) => !lower || user.name.toLowerCase().includes(lower) || user.email.toLowerCase().includes(lower))
  }, [users, customerSearch, customerOrdersMap])

  const maskId = (user) => {
    try {
      const id = user?.idNumber || ''
      if (!id) return ''
      const last = String(id).slice(-6)
      return `${user.idType || 'ID'}: ***${last}`
    } catch { return '' }
  }

  const filteredMaintenance = useMemo(() => {
    return maintenance.filter((entry) => maintenanceFilter === 'All' || entry.status === maintenanceFilter)
  }, [maintenance, maintenanceFilter])

  const filteredSupport = useMemo(() => {
    return supportTickets.filter((ticket) => supportFilter === 'All' || ticket.status === supportFilter)
  }, [supportTickets, supportFilter])

  const revenueChartData = useMemo(() => {
    if (!orders.length) return sampleRevenueData
    const now = new Date()
    const week = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - index))
      return { name: date.toLocaleDateString(undefined, { weekday: 'short' }), total: 0, date }
    })
    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt || order.date || Date.now())
      const match = week.find((item) => item.date.toDateString() === createdAt.toDateString())
      if (match) match.total += order.total || 0
    })
    return week.map((item) => ({ name: item.name, total: item.total }))
  }, [orders])

  const monthlyRevenue = useMemo(() => {
    const now = new Date()
    return orders.reduce((sum, order) => {
      const createdAt = new Date(order.createdAt || order.date || Date.now())
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear() ? sum + (order.total || 0) : sum
    }, 0)
  }, [orders])

  const statusCounts = useMemo(() => ({
    All: orders.length,
    Processing: orders.filter((order) => order.status === 'Processing').length,
    Completed: orders.filter((order) => order.status === 'Completed').length,
    Cancelled: orders.filter((order) => order.status === 'Cancelled').length
  }), [orders])

  const supportCounts = useMemo(() => ({
    All: supportTickets.length,
    Open: supportTickets.filter((ticket) => ticket.status === 'Open').length,
    'In Progress': supportTickets.filter((ticket) => ticket.status === 'In Progress').length,
    Resolved: supportTickets.filter((ticket) => ticket.status === 'Resolved').length
  }), [supportTickets])

  const toggleOrderStatus = (id, status) => {
    const next = orders.map((order) => order.id === id ? { ...order, status } : order)
    saveOrders(next)
    setToast(`Order ${status}`)
  }

  const openOrderModal = (order) => setModal({ type: 'order', data: order })
  const openCustomerModal = (user) => setModal({ type: 'customer', data: user })
  const openEquipmentModal = (item) => setModal({ type: 'equipment', data: item || null })
  const openMaintenanceModal = (entry) => setModal({ type: 'maintenance', data: entry || null })
  const openSupportModal = (ticket) => setModal({ type: 'support', data: ticket || null })
  const closeModal = () => setModal({ type: '', data: null })

  const handleEquipmentSave = (payload) => {
    const next = payload.id ? equipment.map((item) => item.id === payload.id ? payload : item) : [{ ...payload, id: Date.now() }, ...equipment]
    const existing = equipment.find((item) => item.id === payload.id)
    saveEquipment(next)
    if (!payload.id) {
      createNotification(`New equipment added: ${payload.name}`, 'info')
    } else if (existing?.inStock && !payload.inStock) {
      createNotification(`${payload.name} is Out of Stock`, 'warning')
    }
    setToast('Equipment saved')
    closeModal()
  }

  const handleEquipmentDelete = (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return
    const next = equipment.filter((eq) => eq.id !== item.id)
    saveEquipment(next)
    setToast('Equipment deleted')
  }

  const handleUserSuspend = (user) => {
    const next = users.map((u) => u.email === user.email ? { ...u, suspended: !u.suspended } : u)
    saveUsers(next)
    setToast(`${user.name} ${user.suspended ? 'unsuspended' : 'suspended'}`)
  }

  const handleMaintenanceSave = (payload) => {
    const next = payload.id ? maintenance.map((item) => item.id === payload.id ? payload : item) : [{ ...payload, id: Date.now() }, ...maintenance]
    const existing = maintenance.find((item) => item.id === payload.id)
    saveMaintenance(next)
    if (!payload.id) {
      createNotification(`${payload.equipment} scheduled for maintenance`, 'maintenance')
    } else if (existing?.status !== payload.status && payload.status !== 'Completed') {
      createNotification(`${payload.equipment} scheduled for maintenance`, 'maintenance')
    }
    setToast('Maintenance log saved')
    closeModal()
  }

  const handleMaintenanceDelete = (entry) => {
    if (!window.confirm(`Are you sure you want to delete ${entry.equipment}?`)) return
    saveMaintenance(maintenance.filter((item) => item.id !== entry.id))
  }

  const handleSupportReply = (ticket, reply) => {
    const next = supportTickets.map((item) => item.id === ticket.id ? { ...item, adminReply: reply, status: 'In Progress' } : item)
    saveSupport(next)
    setToast('Replied to ticket')
    closeModal()
  }

  const handleSupportResolve = (ticket) => {
    saveSupport(supportTickets.map((item) => item.id === ticket.id ? { ...item, status: 'Resolved' } : item))
    setToast('Ticket marked resolved')
  }

  const handleSupportDelete = (ticket) => {
    if (!window.confirm(`Delete ticket ${ticket.id}?`)) return
    saveSupport(supportTickets.filter((item) => item.id !== ticket.id))
  }

  const supportTicketCount = supportTickets.length
  const categories = Array.from(new Set(equipment.map((item) => item.category || 'General')))

  const exportOrdersCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Email', 'Status', 'Start Date', 'End Date', 'Total'],
      ...orders.map((order) => [
        order.id,
        `${order.deliveryAddress?.firstName || ''} ${order.deliveryAddress?.lastName || ''}`.trim(),
        order.deliveryAddress?.email || '',
        order.status,
        order.rentalStartDate,
        order.rentalEndDate,
        order.total
      ])
    ]
    const csvContent = rows.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'kitchenrent_orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const modalTitle = useMemo(() => {
    if (!modal.type) return ''
    if (modal.type === 'order') return 'Order Details'
    if (modal.type === 'equipment') return modal.data ? 'Edit Equipment' : 'Add Equipment'
    if (modal.type === 'customer') return 'Customer Profile'
    if (modal.type === 'maintenance') return modal.data ? 'Edit Maintenance' : 'Add Maintenance'
    if (modal.type === 'support') return `Reply to ${modal.data?.id || ''}`
    return ''
  }, [modal.type, modal.data])

  return (
    <div className="md:flex min-h-[75vh] bg-slate-50">
      <aside className="w-80 bg-[#1a1a2e] text-white p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">KR</div>
            <div>
              <div className="text-lg font-semibold">KitchenRent</div>
              <div className="text-xs text-gray-300">Management Panel</div>
            </div>
          </div>
          <nav className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <button key={item.key} onClick={() => setActiveTab(item.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.key ? 'bg-orange-600 text-white' : 'text-gray-200 hover:bg-[#2a2a44]'}`}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.key === 'Support' && supportTicketCount > 0 && <span className="ml-auto rounded-full bg-white text-black text-[10px] px-2 py-0.5">{supportTicketCount}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-[#2a2a44]"><LifeBuoy className="w-4 h-4" /> Support</button>
          <button onClick={() => { localStorage.removeItem('kitchenrent_auth'); window.location.href = '/login' }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-[#2a2a44]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">{activeTab}</h1>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input value={activeTab === 'Rental Orders' ? orderSearch : activeTab === 'Equipment Catalog' ? equipmentSearch : activeTab === 'Customers' ? customerSearch : ''} onChange={(e) => {
                if (activeTab === 'Rental Orders') setOrderSearch(e.target.value)
                if (activeTab === 'Equipment Catalog') setEquipmentSearch(e.target.value)
                if (activeTab === 'Customers') setCustomerSearch(e.target.value)
              }} placeholder={activeTab === 'Rental Orders' ? 'Search orders...' : activeTab === 'Equipment Catalog' ? 'Search equipment...' : activeTab === 'Customers' ? 'Search customers...' : 'Search...'} className="w-full md:w-80 pl-10 pr-4 py-3 border rounded-lg" />
            </div>
            <div className="relative">
              <Bell className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full text-[10px] px-2">3</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white grid place-items-center font-semibold">A</div>
              <div>
                <div className="font-semibold">Admin</div>
                <div className="text-xs text-gray-500">Head of Operations</div>
              </div>
            </div>
          </div>
        </div>

        {toast && <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-200 p-3 text-sm text-emerald-800">{toast}</div>}

        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-500">Total Rentals</div>
                    <div className="text-3xl font-semibold mt-2">{orders.length}</div>
                  </div>
                  <ShoppingBag className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-sm text-emerald-600">+12%</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-500">Monthly Revenue</div>
                    <div className="text-3xl font-semibold mt-2">{formatNGN(monthlyRevenue)}</div>
                  </div>
                  <span className="text-orange-500">₦</span>
                </div>
                <div className="text-sm text-emerald-600">+8.4%</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-500">Active Users</div>
                    <div className="text-3xl font-semibold mt-2">{users.length}</div>
                  </div>
                  <Users className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-sm text-rose-600">-2%</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-500">Equipment Units</div>
                    <div className="text-3xl font-semibold mt-2">{equipment.length}</div>
                  </div>
                  <Package className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-sm text-emerald-600">94% Active</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Recent Bookings</h3>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border rounded-lg">Filter</button>
                    <button onClick={exportOrdersCSV} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Export CSV</button>
                  </div>
                </div>
                {orders.length ? (
                  <div className="overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-slate-500 border-b">
                        <tr>
                          <th className="py-3">Order ID</th>
                          <th className="py-3">Customer</th>
                          <th className="py-3">Date Range</th>
                          <th className="py-3">Status</th>
                          <th className="py-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 8).map((order) => (
                          <tr key={order.id} className="border-b last:border-b-0">
                            <td className="py-4">{order.id}</td>
                            <td className="py-4"><div className="font-medium">{order.deliveryAddress?.firstName || 'Guest'} {order.deliveryAddress?.lastName || ''}</div><div className="text-xs text-slate-500">{order.deliveryAddress?.email || ''}</div></td>
                            <td className="py-4">{order.rentalStartDate} - {order.rentalEndDate}</td>
                            <td className="py-4"><span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span></td>
                            <td className="py-4">{formatNGN(order.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3" />
                    <div className="font-semibold">No bookings yet</div>
                    <div className="text-sm">Customer rentals will appear here once orders are placed.</div>
                  </div>
                )}
                <div className="mt-4 text-xs text-slate-500">Showing 1 to {Math.min(8, orders.length)} of {orders.length} bookings</div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
                  <div className="h-64">
                    <Bar data={{
                      labels: revenueChartData.map((entry) => entry.name),
                      datasets: [{ label: 'Revenue', data: revenueChartData.map((entry) => entry.total), backgroundColor: '#B94B0C' }]
                    }} options={{
                      responsive: true,
                      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `₦${Number(context.parsed.y).toLocaleString()}` } } },
                      scales: { y: { ticks: { callback: (value) => `₦${Number(value).toLocaleString()}` } } }
                    }} />
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4">Equipment Status</h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between"><span>In Use</span><span>{orders.filter((order) => ['Processing', 'Active'].includes(order.status)).length}</span></div>
                    <div className="flex justify-between"><span>Available</span><span>{Math.max(0, equipment.length - orders.filter((order) => ['Processing', 'Active'].includes(order.status)).length)}</span></div>
                    <div className="flex justify-between"><span>In Maintenance</span><span>{maintenance.length}</span></div>
                    <button className="mt-4 w-full rounded-xl border border-orange-600 text-orange-600 px-4 py-2">View Maintenance Logs</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Rental Orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Rental Orders</h3>
                  <p className="mt-1 text-sm text-slate-500">Manage and track all customer rental bookings</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                    <button key={status} onClick={() => setOrderFilter(status)} className={`px-4 py-2 rounded-full border ${orderFilter === status ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                      {status} <span className="text-xs text-slate-400">({statusCounts[status] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Total Orders</div>
                  <div className="mt-2 text-3xl font-semibold">{statusCounts.All}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Processing</div>
                  <div className="mt-2 text-3xl font-semibold">{statusCounts.Processing}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Completed</div>
                  <div className="mt-2 text-3xl font-semibold">{statusCounts.Completed}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Cancelled</div>
                  <div className="mt-2 text-3xl font-semibold">{statusCounts.Cancelled}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search orders, customers, or emails"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm"
                  />
                </div>
                <button onClick={exportOrdersCSV} className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-white">Export CSV</button>
              </div>
            </div>

            {filteredOrders.length ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500 border-b bg-slate-50">
                    <tr>
                      <th className="px-4 py-4">Order ID</th>
                      <th className="px-4 py-4">Equipment</th>
                      <th className="px-4 py-4">Customer</th>
                      <th className="px-4 py-4">Date Range</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Total</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-b-0">
                        <td className="px-4 py-4 font-medium">{order.id}</td>
                        <td className="px-4 py-4">{(order.items || []).map((item) => item.name).join(', ')}</td>
                        <td className="px-4 py-4">
                          <div>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</div>
                          <div className="text-xs text-slate-400">{order.deliveryAddress?.email}</div>
                        </td>
                        <td className="px-4 py-4">{order.rentalStartDate || order.items?.[0]?.startDate || 'Not specified'} — {order.rentalEndDate || order.items?.[0]?.endDate || 'Not specified'}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-4">{formatNGN(order.total)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <button onClick={() => openOrderModal(order)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left">View</button>
                            <button onClick={() => toggleOrderStatus(order.id, 'Completed')} className="w-full rounded-xl border border-slate-200 px-3 py-2">Complete</button>
                            <button onClick={() => toggleOrderStatus(order.id, 'Cancelled')} className="w-full rounded-xl border border-rose-200 px-3 py-2 text-rose-600">Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <div className="text-lg font-semibold">No orders found</div>
                <div className="mt-2 text-sm">Orders placed by customers will appear here.</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Equipment Catalog' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Equipment Catalog</h3>
                  <p className="mt-1 text-sm text-slate-500">Manage your rental equipment inventory</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button type="button" onClick={() => setShowNotifications((visible) => !visible)} className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                      <Bell className="h-5 w-5" />
                      {unreadNotificationCount > 0 && (
                        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-600 px-1.5 text-[10px] font-semibold text-white">{unreadNotificationCount}</span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 top-14 z-50 w-[320px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div>
                            <div className="text-sm font-semibold">Notifications</div>
                            <div className="text-xs text-slate-500">{unreadNotificationCount} unread</div>
                          </div>
                          <button onClick={() => markAllNotificationsRead()} className="text-xs text-orange-600">Mark all as read</button>
                        </div>
                        <div className="mt-3 space-y-3 max-h-72 overflow-y-auto">
                          {notifications.length ? notifications.map((note) => (
                            <div key={note.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-slate-900">{note.message}</div>
                                  <div className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleString()}</div>
                                </div>
                                <button onClick={() => dismissNotification(note.id)} className="text-slate-400 hover:text-slate-700">×</button>
                              </div>
                            </div>
                          )) : (
                            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No notifications</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => openEquipmentModal(null)} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-white shadow-sm"><Plus className="w-4 h-4" /> Add Equipment</button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Total Equipment</div>
                <div className="mt-2 text-3xl font-semibold">{equipmentStats.total}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">In Stock</div>
                <div className="mt-2 text-3xl font-semibold">{equipmentStats.inStock}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Out of Stock</div>
                <div className="mt-2 text-3xl font-semibold">{equipmentStats.outOfStock}</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
                    placeholder="Search equipment, SKU, or category"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {equipmentCategories.map((category) => (
                    <button key={category} onClick={() => setEquipmentCategory(category)} className={`px-4 py-2 rounded-full border ${equipmentCategory === category ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500 border-b bg-slate-50">
                  <tr>
                    <th className="px-4 py-4">Image</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">SKU</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price/day</th>
                    <th className="px-4 py-4">Stock Status</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="px-4 py-4">
                        <ImageWithFallback src={item.image || '/src/assets/mixing-bowl-set.jpg'} alt={item.name} className="h-16 w-20 rounded-lg object-cover" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{item.sku}</td>
                      <td className="px-4 py-4">{item.category || 'General'}</td>
                      <td className="px-4 py-4">{formatNGN(item.price)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${item.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <button onClick={() => openEquipmentModal(item)} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:border-orange-600 hover:text-orange-600"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleEquipmentDelete(item)} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-rose-600 hover:border-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Customers' && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold">Customers</h3>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Join Date</th>
                    <th className="px-4 py-4">Total Orders</th>
                    <th className="px-4 py-4">Total Spent</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.email} className="border-b last:border-b-0">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 grid place-items-center font-semibold">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{user.email}</td>
                      <td className="px-4 py-4">{user.phone}</td>
                      <td className="px-4 py-4 text-slate-600">{maskId(user)}</td>
                      <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{user.accountType}</span></td>
                      <td className="px-4 py-4">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-4">{user.totalOrders}</td>
                      <td className="px-4 py-4">{formatNGN(user.totalSpent)}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button onClick={() => openCustomerModal(user)} className="px-3 py-2 rounded-xl border border-slate-200">View</button>
                        <button onClick={() => handleUserSuspend(user)} className={`px-3 py-2 rounded-xl border ${user.suspended ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'}`}>{user.suspended ? 'Unsuspend' : 'Suspend'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Maintenance' && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold">Maintenance Logs</h3>
              <button onClick={() => openMaintenanceModal(null)} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-white shadow-sm"><Plus className="w-4 h-4" /> Add Maintenance Log</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {['All', 'Scheduled', 'In Progress', 'Completed'].map((status) => (
                  <button key={status} onClick={() => setMaintenanceFilter(status)} className={`px-4 py-2 rounded-full border ${maintenanceFilter === status ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {status}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredMaintenance.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-lg">{entry.equipment}</div>
                        <div className="text-slate-500 mt-2">{entry.issue}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs ${entry.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : entry.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{entry.status}</span>
                    </div>
                    <div className="mt-4 text-sm text-slate-600">Scheduled: {entry.date}</div>
                    <div className="mt-2 text-sm text-slate-600">Technician: {entry.technician}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => openMaintenanceModal(entry)} className="px-4 py-2 rounded-xl border border-slate-200">Edit</button>
                      <button onClick={() => handleMaintenanceDelete(entry)} className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Support' && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold">Support Tickets</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
                  <button key={status} onClick={() => setSupportFilter(status)} className={`px-4 py-2 rounded-full border ${supportFilter === status ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {status} <span className="text-xs text-slate-400">({supportCounts[status] || 0})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {filteredSupport.length ? filteredSupport.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-slate-500 text-xs">{ticket.id}</div>
                      <div className="text-lg font-semibold">{ticket.subject}</div>
                      <div className="text-slate-600 mt-2">{ticket.message}</div>
                      <div className="mt-2 text-xs text-slate-400">{ticket.userName || ticket.userEmail || 'Unknown User'}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{ticket.status}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => openSupportModal(ticket)} className="px-4 py-2 rounded-xl border border-slate-200">Reply</button>
                    <button onClick={() => handleSupportResolve(ticket)} className="px-4 py-2 rounded-xl border border-slate-200">Mark Resolved</button>
                    <button onClick={() => handleSupportDelete(ticket)} className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600">Delete</button>
                  </div>
                  {ticket.adminReply && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><span className="font-semibold">Admin Reply:</span> {ticket.adminReply}</div>}
                </div>
              )) : (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <div className="text-lg font-semibold">No tickets found</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Platform Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm"><span>Platform Name</span><input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full rounded-xl border p-3" /></label>
              <label className="space-y-2 text-sm"><span>Contact Email</span><input value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full rounded-xl border p-3" /></label>
              <label className="space-y-2 text-sm"><span>Contact Phone</span><input value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} className="w-full rounded-xl border p-3" /></label>
              <label className="space-y-2 text-sm"><span>Delivery Fee (₦)</span><input type="number" value={settings.deliveryFee} onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })} className="w-full rounded-xl border p-3" /></label>
              <label className="space-y-2 text-sm"><span>Free Delivery Threshold (₦)</span><input type="number" value={settings.freeDeliveryThreshold} onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })} className="w-full rounded-xl border p-3" /></label>
              <label className="space-y-2 text-sm"><span>Currency Symbol</span><input value={settings.currencySymbol} onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })} className="w-full rounded-xl border p-3" /></label>
              <label className="flex items-center gap-3 mt-2"><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="h-4 w-4" /> <span>Maintenance Mode</span></label>
            </div>
            <button onClick={() => saveSettings(settings)} className="mt-6 rounded-full bg-orange-600 px-6 py-3 text-white">Save Settings</button>
          </div>
        )}
      </main>

      {modal.type && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">{modalTitle}</h2>
              <button onClick={closeModal} className="rounded-full p-2 border border-slate-200"><XCircle className="w-5 h-5" /></button>
            </div>
            {modal.type === 'order' && modal.data && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="text-slate-500">Order ID</span>
                    <div className="font-medium">{modal.data.id}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Status</span>
                    <div className="font-medium">{modal.data.status}</div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="text-slate-500">Customer</span>
                    <div className="font-medium">
                      {modal.data.userName || modal.data.user?.name || `${modal.data.deliveryAddress?.firstName || ''} ${modal.data.deliveryAddress?.lastName || ''}`.trim() || 'Guest'}
                    </div>
                    {(modal.data.userEmail || modal.data.user?.email || modal.data.deliveryAddress?.email) && (
                      <div className="text-xs text-slate-500">{modal.data.userEmail || modal.data.user?.email || modal.data.deliveryAddress?.email}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500">Rental Period</span>
                    <div className="font-medium">
                      {modal.data.rentalStartDate && modal.data.rentalEndDate
                        ? `${modal.data.rentalStartDate} — ${modal.data.rentalEndDate}`
                        : modal.data.items?.[0]?.startDate && modal.data.items?.[0]?.endDate
                          ? `${modal.data.items[0].startDate} — ${modal.data.items[0].endDate}`
                          : 'Not specified'}
                    </div>
                  </div>
                </div>
                {modal.data.deliveryAddress && (
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-orange-600 font-medium mb-2">Delivery Address</p>
                    <p>{modal.data.deliveryAddress.firstName} {modal.data.deliveryAddress.lastName}</p>
                    <p>{modal.data.deliveryAddress.address}</p>
                    <p>{modal.data.deliveryAddress.city}</p>
                    {modal.data.deliveryAddress.deliveryInstructions && <p className="text-sm text-slate-500 mt-2">{modal.data.deliveryAddress.deliveryInstructions}</p>}
                  </div>
                )}
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="font-semibold mb-3">Equipment</div>
                  <div className="space-y-3">
                    {(modal.data.items || []).map((item, idx) => {
                      const itemQuantity = item.quantity || item.qty || 1
                      const itemDays = item.rentalDays || item.days || 1
                      const itemTotal = (item.price || 0) * itemQuantity * itemDays
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.image || '/src/assets/mixing-bowl-set.jpg'} alt={item.name} className="h-14 w-20 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">{itemQuantity} units × {itemDays} days</div>
                          </div>
                          <div className="ml-auto font-semibold">{formatNGN(itemTotal)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-orange-600 font-medium mb-2">Payment Info</p>
                    <p>Card ending in {modal.data.paymentLast4 || 'XXXX'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-orange-600 font-medium mb-2">Order Summary</p>
                    <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatNGN((modal.data.items || []).reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || item.qty || 1) * (item.rentalDays || item.days || 1)), 0))}</span></div>
                    <div className="flex justify-between text-sm text-slate-600"><span>Delivery Fee</span><span>{formatNGN(modal.data.deliveryFee ?? 5000)}</span></div>
                    <div className="mt-3 flex justify-between text-base font-semibold text-orange-700"><span>Total</span><span>{formatNGN(modal.data.total ?? ((modal.data.items || []).reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || item.qty || 1) * (item.rentalDays || item.days || 1)), 0) + (modal.data.deliveryFee ?? 5000)))}</span></div>
                  </div>
                </div>
              </div>
            )}
            {modal.type === 'equipment' && <EquipmentForm item={modal.data} categories={categories} onCancel={closeModal} onSave={handleEquipmentSave} />}
            {modal.type === 'customer' && modal.data && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="text-slate-500">Name</span><div className="font-medium">{modal.data.name}</div></div>
                  <div><span className="text-slate-500">Email</span><div className="font-medium">{modal.data.email}</div></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="text-slate-500">Phone</span><div>{modal.data.phone}</div></div>
                  <div><span className="text-slate-500">Account Type</span><div>{modal.data.accountType}</div></div>
                </div>
                <div>
                  <span className="text-slate-500">ID Verification</span>
                  <div className="font-medium">{modal.data.idType ? `${modal.data.idType}: ${modal.data.idNumber || 'Not provided'}` : 'No ID on file'}</div>
                </div>
                <div><span className="text-slate-500">Join Date</span><div>{modal.data.joinDate}</div></div>
                <div><span className="text-slate-500">Total Orders</span><div>{(customerOrdersMap[modal.data.email] || []).length}</div></div>
                <div><span className="text-slate-500">Total Spent</span><div>{formatNGN((customerOrdersMap[modal.data.email] || []).reduce((sum, order) => sum + (order.total || 0), 0))}</div></div>
              </div>
            )}
            {modal.type === 'maintenance' && <MaintenanceForm entry={modal.data} equipmentList={equipment} onCancel={closeModal} onSave={handleMaintenanceSave} />}
            {modal.type === 'support' && modal.data && <SupportReplyForm ticket={modal.data} onCancel={closeModal} onSave={handleSupportReply} />}
          </div>
        </div>
      )}
    </div>
  )
}

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Error</h2>
          <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="bg-orange-700 text-white px-6 py-2 rounded">
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function AdminPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageContent />
    </AdminErrorBoundary>
  )
}

function EquipmentForm({ item, categories, onCancel, onSave }) {
  const [form, setForm] = useState({
    id: item?.id,
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || categories[0] || 'General',
    description: item?.description || '',
    fullDescription: item?.fullDescription || '',
    price: item?.price || 0,
    rating: item?.rating || 4,
    inStock: item?.inStock ?? true,
    image: item?.image || '',
    features: item?.features || ['']
  })

  const updateFeature = (index, value) => {
    const features = [...form.features]
    features[index] = value
    setForm({ ...form, features })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border p-3" /></label>
        <label className="space-y-2 text-sm"><span>SKU</span><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded-xl border p-3" /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Category</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border p-3">{categories.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
        <label className="space-y-2 text-sm"><span>Image URL</span><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border p-3" /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm"><span>Price / day</span><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-xl border p-3" /></label>
        <label className="space-y-2 text-sm"><span>Rating</span><input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-xl border p-3" /></label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock</label>
      </div>
      <label className="space-y-2 text-sm"><span>Description</span><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border p-3" /></label>
      <label className="space-y-2 text-sm"><span>Full Description</span><textarea value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} className="w-full rounded-xl border p-3" rows="4" /></label>
      <div className="space-y-2 text-sm">
        <div className="font-medium">Features</div>
        {form.features.map((feature, idx) => (
          <div key={idx} className="flex gap-3">
            <input value={feature} onChange={(e) => updateFeature(idx, e.target.value)} className="flex-1 rounded-xl border p-3" />
            <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, index) => index !== idx) })} className="rounded-xl bg-rose-100 px-3 text-rose-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => setForm({ ...form, features: [...form.features, ''] })} className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700">Add feature</button>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-3">Cancel</button>
        <button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-white">Save</button>
      </div>
    </form>
  )
}

function MaintenanceForm({ entry, equipmentList, onCancel, onSave }) {
  const [form, setForm] = useState({
    id: entry?.id,
    equipment: entry?.equipment || equipmentList[0]?.name || '',
    issue: entry?.issue || '',
    status: entry?.status || 'Scheduled',
    date: entry?.date || '',
    technician: entry?.technician || ''
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Equipment</span><select value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className="w-full rounded-xl border p-3">{equipmentList.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
        <label className="space-y-2 text-sm"><span>Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border p-3"><option>Scheduled</option><option>In Progress</option><option>Completed</option></select></label>
      </div>
      <label className="space-y-2 text-sm"><span>Technician</span><input value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} className="w-full rounded-xl border p-3" /></label>
      <label className="space-y-2 text-sm"><span>Scheduled date</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border p-3" /></label>
      <label className="space-y-2 text-sm"><span>Issue description</span><textarea value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className="w-full rounded-xl border p-3" rows="4" /></label>
      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-3">Cancel</button>
        <button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-white">Save</button>
      </div>
    </form>
  )
}

function SupportReplyForm({ ticket, onCancel, onSave }) {
  const [reply, setReply] = useState(ticket?.adminReply || '')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(ticket, reply) }} className="space-y-4">
      <div>
        <div className="text-sm text-slate-500">Original message</div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mt-2">{ticket.message}</div>
      </div>
      <label className="space-y-2 text-sm"><span>Reply</span><textarea value={reply} onChange={(e) => setReply(e.target.value)} className="w-full rounded-xl border p-3" rows="5" /></label>
      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-3">Cancel</button>
        <button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-white">Send Reply</button>
      </div>
    </form>
  )
}
