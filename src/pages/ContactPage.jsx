import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function ContactPage(){
  const navigate = useNavigate()
  const [form,setForm] = useState({ name:'', email:'', subject:'', message:'' })
  function submit(e){ e.preventDefault(); alert('Message sent') }

  return (
    <div className="md:flex gap-6">
      <form onSubmit={submit} className="flex-1 space-y-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-6 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} className="w-full p-2 border rounded" />
        <textarea placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} className="w-full p-2 border rounded" />
        <button className="btn-brand p-2 rounded">Send Message</button>
      </form>
      <aside className="w-full md:w-96">
        <div className="card p-4">
          <h3 className="font-semibold">Contact Details</h3>
          <div className="mt-2 text-sm text-gray-600">Email: kitchenrentng@gmail.com</div>
          <div className="text-sm text-gray-600">Phone: +234 906 057 7186</div>
          <div className="mt-4 card p-4">Map placeholder</div>
        </div>
      </aside>
    </div>
  )
}
