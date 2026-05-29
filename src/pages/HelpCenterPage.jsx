import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, MessageSquare, Clock3 } from 'lucide-react'

export default function HelpCenterPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900">Help Center</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Find answers to common questions about rentals, delivery, payments, and account support.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Phone size={20} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">Contact Support</h2>
            <p className="mt-3 text-slate-600">Reach us by phone or email for booking help, equipment support, or account issues.</p>
            <div className="mt-5 space-y-2 text-sm text-slate-700">
              <p><strong>Phone:</strong> +234 906 057 7186</p>
              <p><strong>Email:</strong> <a href="mailto:kitchenrentng@gmail.com" className="text-orange-700 underline">kitchenrentng@gmail.com</a></p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <MessageSquare size={20} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">Live Assistance</h2>
            <p className="mt-3 text-slate-600">We respond quickly to live chat requests and urgent equipment questions.</p>
            <p className="mt-4 text-sm text-slate-700">Chat support is available Monday through Friday, 8am to 6pm.</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Clock3 size={20} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">Hours & Response</h2>
            <p className="mt-3 text-slate-600">Support is available daily, with the fastest response to rental and delivery concerns.</p>
            <p className="mt-4 text-sm text-slate-700">We aim to respond within 1 business hour for urgent support requests.</p>
          </article>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6 text-slate-700">
            <div>
              <p className="font-semibold">How do I book equipment?</p>
              <p className="mt-2 text-sm leading-7">Add equipment to your cart, complete checkout, and choose delivery or pickup. We will confirm availability before finalizing.</p>
            </div>
            <div>
              <p className="font-semibold">What identification do I need?</p>
              <p className="mt-2 text-sm leading-7">Provide a valid ID like NIN, Driver's License, or International Passport. Business rentals may require CAC documents.</p>
            </div>
            <div>
              <p className="font-semibold">Can I change my delivery date?</p>
              <p className="mt-2 text-sm leading-7">Contact support as soon as possible. We will do our best to update your rental if the equipment is still available.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-white hover:bg-orange-700">Back to Home</Link>
            <a href="mailto:kitchenrentng@gmail.com" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-100">Email Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
