import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Lock, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function RegisterPage() {
  const [type, setType] = useState('Customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [idType, setIdType] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idTouched, setIdTouched] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const { setAuth } = useCart()
  const navigate = useNavigate()

  const isNameValid = name.trim().length >= 2
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPhoneValid = /^(070|080|081|090|091)\d{8}$/.test(phone)

  const isIdNumberValid = (type, number) => {
    if (!type || !number) return false
    switch (type) {
      case 'NIN': return /^\d{11}$/.test(number)
      case 'BVN': return /^\d{11}$/.test(number)
      case 'Driver': return /^[A-Za-z0-9]{10,12}$/.test(number)
      case 'Passport': return /^[A-Za-z]\d{8}$/.test(number)
      case 'PVC': return /^[A-Za-z0-9]{9,19}$/.test(number)
      default: return false
    }
  }

  const isPasswordValid = password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password)
  const isConfirmValid = confirmPassword === password
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && idType !== '' && idNumber.trim().length > 0 && isIdNumberValid(idType, idNumber) && isPasswordValid && isConfirmValid && terms

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }
  function handleIdBlur() {
    setIdTouched(true)
    setTouched((prev) => ({ ...prev, idNumber: true }))
  }

  function handleCreate(e) {
    e.preventDefault()
    setSubmitAttempted(true)
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true, terms: true, idNumber: true })
    setIdTouched(true)

    if (!isFormValid) return

    const userData = { name, email, phone, idType, idNumber, password, accountType: type, createdAt: new Date().toISOString(), isVerified: true }
    localStorage.setItem('kitchenrent_user', JSON.stringify(userData))
    // append to global users list
    try {
      const existing = JSON.parse(localStorage.getItem('kitchenrent_users') || '[]')
      existing.push({ name, email, phone, idType, idNumber, password, joinDate: userData.createdAt, totalOrders: 0, totalSpent: 0, avatar: null, accountType: type, isVerified: true })
      localStorage.setItem('kitchenrent_users', JSON.stringify(existing))
    } catch (e) { console.error(e) }
    setAuth({ loggedIn: true, email, name, profilePic: null, isAdmin: false })
    navigate('/profile')
  }

  return (
    <div className="md:flex bg-white rounded overflow-hidden">
      <div className="hidden md:block md:w-1/2 bg-accent p-8">
        <h2 className="text-2xl font-semibold">KitchenRent</h2>
        <p className="mt-4">Create your account to start renting equipment.</p>
      </div>
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
            <option>Customer</option>
            <option>Business</option>
          </select>

          <div>
            <input
              className="w-full p-2 border rounded"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            {!isNameValid && (touched.name || submitAttempted) && (
              <p className="mt-1 text-sm text-red-600">Full name must be at least 2 characters.</p>
            )}
          </div>

          <div>
            <input
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {!isEmailValid && (touched.email || submitAttempted) && (
              <p className="mt-1 text-sm text-red-600">Enter a valid email address.</p>
            )}
          </div>

          <div>
            <input
              className="w-full p-2 border rounded"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone')}
            />
            {!isPhoneValid && (touched.phone || submitAttempted) && (
              <p className="mt-1 text-sm text-red-600">Enter a valid 11-digit Nigerian phone number.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold">Identity Verification</div>
                <div className="text-sm text-slate-600">Required for equipment rental. Your ID is encrypted and secured.</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <select value={idType} onChange={(e) => setIdType(e.target.value)} className="p-2 border rounded">
                <option value="" disabled>Select ID Type</option>
                <option value="NIN">National Identification Number (NIN)</option>
                <option value="BVN">Bank Verification Number (BVN)</option>
                <option value="Driver">Driver's License</option>
                <option value="Passport">International Passport</option>
                <option value="PVC">Voter's Card (PVC)</option>
              </select>

              <div className="relative">
                <input
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  onBlur={handleIdBlur}
                  placeholder={(() => {
                    switch (idType) {
                      case 'NIN': return 'Enter 11-digit NIN (e.g. 12345678901)'
                      case 'BVN': return 'Enter 11-digit BVN'
                      case 'Driver': return "Enter license number (e.g. ABC123456789)"
                      case 'Passport': return 'Enter passport number (e.g. A12345678)'
                      case 'PVC': return 'Enter PVC number'
                      default: return 'Select ID type first'
                    }
                  })()}
                  className="w-full p-2 border rounded"
                />
                {isIdNumberValid(idType, idNumber) && (
                  <Check className="absolute right-3 top-3 text-emerald-600" />
                )}
              </div>
            </div>

            {(idTouched || submitAttempted) && !isIdNumberValid(idType, idNumber) && (
              <p className="mt-2 text-sm text-red-600">Enter a valid ID number for the selected ID type.</p>
            )}

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-3">
              <Lock className="w-3 h-3" />
              Your ID information is encrypted and only used for rental verification purposes. We do not share your ID with third parties except when required by law enforcement.
            </p>
          </div>

          <div>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
            />
            {!isPasswordValid && (touched.password || submitAttempted) && (
              <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters and include letter and number.</p>
            )}
          </div>

          <div>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
            />
            {!isConfirmValid && (touched.confirmPassword || submitAttempted) && (
              <p className="mt-1 text-sm text-red-600">Passwords must match exactly.</p>
            )}
          </div>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              onBlur={() => handleBlur('terms')}
              className="mt-1"
            />
            <span className="text-sm text-slate-700">I agree to the <Link to="/terms" className="text-orange-700 underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-orange-700 underline">Privacy Policy</Link>.</span>
          </label>
          {!terms && (touched.terms || submitAttempted) && (
            <p className="mt-1 text-sm text-red-600">You must agree to the terms to continue.</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-2 rounded ${isFormValid ? 'bg-orange-700 text-white cursor-pointer' : 'bg-gray-400 text-white opacity-50 cursor-not-allowed'}`}
          >
            Create Account
          </button>

          <div className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-brand">Sign in</Link></div>
        </form>
      </div>
    </div>
  )
}
