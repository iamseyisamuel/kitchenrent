import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TermsPage() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-slate-900">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: January 2025</p>
          <p className="mt-4 text-slate-600">Please read these terms carefully before renting any equipment.</p>
        </div>

        <section className="prose prose-slate max-w-none">
          <h2>1. RENTAL AGREEMENT</h2>
          <p>By renting equipment from KitchenRent, you enter into a legally binding rental agreement. You agree to return all rented equipment in the same condition it was received, normal wear and tear excepted.</p>

          <h2>2. CUSTOMER IDENTIFICATION & VERIFICATION</h2>
          <p>One of the following valid government-issued IDs must be provided during account registration: NIN, BVN, Driver's License, International Passport, or Voter's Card (PVC).</p>
          <ul>
            <li>Valid government-issued ID required before equipment is released (NIN, Driver's License, or International Passport).</li>
            <li>Customers must provide a verifiable delivery address.</li>
            <li>Phone number must be active and reachable during rental period.</li>
            <li>Business accounts require CAC registration documents.</li>
          </ul>

          <h2>3. EQUIPMENT CARE & RESPONSIBILITY</h2>
          <ul>
            <li>Customer is fully responsible for all equipment from time of delivery to time of pickup.</li>
            <li>Any damage, loss, or theft must be reported immediately to KitchenRent.</li>
            <li>Customer bears full replacement cost for lost or stolen equipment at current market value.</li>
            <li>Damaged equipment repair costs will be charged to the customer; if repair costs exceed available funds, the customer will be invoiced for the difference.</li>
            <li>Equipment must not be sublet, loaned, or transferred to any third party.</li>
            <li>Equipment must only be used for its intended purpose.</li>
          </ul>

          <h2>4. LATE RETURNS</h2>
          <ul>
            <li>Equipment must be returned by the agreed end date and time.</li>
            <li>Late returns are charged at 1.5x the daily rate for each additional day.</li>
            <li>If equipment is not returned within 7 days of the rental end date without communication, KitchenRent reserves the right to report the matter to law enforcement authorities and pursue full legal recovery.</li>
          </ul>

          <div className="rounded-3xl border-l-4 border-orange-500 bg-orange-50 p-5">
            <h2 className="text-orange-700">5. ANTI-THEFT POLICY</h2>
            <p>KitchenRent takes equipment theft very seriously. The following measures are in place:</p>
            <ul>
              <li>All high-value equipment is registered and tracked.</li>
              <li>Customers who fail to return equipment will be reported to the Nigeria Police Force and EFCC.</li>
              <li>Legal action will be pursued for recovery of stolen equipment and damages.</li>
              <li>Customer's name, address, and ID details will be shared with relevant authorities.</li>
              <li>A blacklist record will be filed with the Equipment Rental Association of Nigeria.</li>
              <li>Criminal charges may be pressed under the Nigerian Criminal Code Act.</li>
            </ul>
          </div>

          {/* Section 6 removed: Security deposit policy has been removed from these Terms. */}

          <h2>7. CANCELLATION POLICY</h2>
          <ul>
            <li>Cancellations made 48+ hours before rental start: full refund minus 5% processing fee.</li>
            <li>Cancellations made 24-48 hours before: 50% refund.</li>
            <li>Cancellations made less than 24 hours before: no refund.</li>
            <li>No-shows forfeit 100% of payment.</li>
          </ul>

          <h2>8. LIABILITY</h2>
          <ul>
            <li>KitchenRent is not liable for any injuries, accidents, or property damage caused by equipment use.</li>
            <li>Customer assumes all risk associated with equipment operation.</li>
            <li>KitchenRent is not responsible for food spoilage or business losses due to equipment malfunction.</li>
          </ul>

          <h2>9. GOVERNING LAW</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.</p>

          <h2>10. CONTACT</h2>
          <p>For questions about these terms, contact us at <a href="mailto:kitchenrentng@gmail.com" className="text-orange-700 underline">kitchenrentng@gmail.com</a> or +234 906 057 7186.</p>
        </section>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-orange-600 border-slate-300 rounded" />
            <span>I have read and agree to these Terms & Conditions.</span>
          </label>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-white hover:bg-orange-700">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
