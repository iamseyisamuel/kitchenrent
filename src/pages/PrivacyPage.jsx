import React from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-500">This policy explains how KitchenRent collects and uses your personal information.</p>
        </div>

        <section className="prose prose-slate max-w-none">
          <h2>Information We Collect</h2>
          <p>We collect information necessary to process rentals and keep our service secure. This includes:</p>
          <ul>
            <li>Name, email, phone number, and delivery address.</li>
            <li>Valid identification details such as NIN, Driver's License, or International Passport.</li>
            <li>Payment details, including card information and transaction records.</li>
            <li>Rental history and equipment usage data.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process equipment rentals, verify identity, and confirm orders.</li>
            <li>To manage deliveries, pickups, and customer service requests.</li>
            <li>To comply with legal obligations, including fraud prevention and regulatory requirements.</li>
            <li>To communicate important updates and support information.</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>KitchenRent does not sell your personal data to third parties. We may share information when required by law or to protect our rights.</p>
          <ul>
            <li>Law enforcement agencies when required by court order or regulation.</li>
            <li>Relevant authorities in cases of theft, fraud, or safety incidents.</li>
            <li>Service providers who help us operate our platform under confidentiality terms.</li>
          </ul>

          <h2>Data Security</h2>
          <ul>
            <li>We use encrypted storage and secure payment processing to protect your data.</li>
            <li>Access to personal information is limited to authorized personnel only.</li>
            <li>We continuously monitor and improve our security practices.</li>
          </ul>

          <h2>Your Rights</h2>
          <ul>
            <li>You may request access to the personal information we hold about you.</li>
            <li>You can request correction or deletion of inaccurate data.</li>
            <li>You may contact us to restrict or object to certain processing activities.</li>
          </ul>

          <h2>Cookies Policy</h2>
          <p>We use cookies and similar technologies to improve site performance and user experience. These may include session cookies, analytics cookies, and functional cookies.</p>

          <h2>Contact</h2>
          <p>For privacy inquiries, contact us at <a href="mailto:kitchenrentng@gmail.com" className="text-orange-700 underline">kitchenrentng@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
