import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EquipmentCard from '../components/EquipmentCard'
import { ChevronLeft, Grid, Utensils, Cake, Zap, Factory, Thermometer } from 'lucide-react'

const categories = [
  { key: 'All', label: 'All Equipment', icon: Grid },
  { key: 'Cookware', label: 'Cookware', icon: Utensils },
  { key: 'Baking', label: 'Baking', icon: Cake },
  { key: 'Appliances', label: 'Appliances', icon: Zap },
  { key: 'Industrial', label: 'Industrial', icon: Factory },
  { key: 'Refrigeration', label: 'Refrigeration', icon: Thermometer }
]

export default function EquipmentPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [inStockOnly, setInStockOnly] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    fetch('/src/data/equipment.json')
      .then((r) => r.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false))
  }, [])

  const toggleType = (t) => {
    setSelectedTypes((current) =>
      current.includes(t) ? current.filter((item) => item !== t) : [...current, t]
    )
  }

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (cat !== 'All' && i.category !== cat) return false
      if (q && !(`${i.name} ${i.category} ${i.description}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (inStockOnly && !i.inStock) return false
      if (selectedTypes.length > 0) {
        const has = i.type && i.type.some((t) => selectedTypes.includes(t))
        if (!has) return false
      }
      return true
    })
  }, [items, q, cat, selectedTypes, inStockOnly])

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 font-medium">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>
      <div className="md:flex gap-6">
        <aside className="w-full md:w-64 mb-4 md:mb-0">
          <div className="card p-4 mb-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Search for ovens, mixers, or refrigeration..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setInStockOnly((s) => !s)}
                className={`px-3 py-1 rounded-full ${inStockOnly ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                In Stock {inStockOnly && <span className="ml-2">×</span>}
              </button>
              {['Electric', 'Gas', 'Countertop', 'Floor Model'].map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1 rounded-full ${selectedTypes.includes(t) ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h4 className="font-semibold mb-2">Categories</h4>
            <ul className="space-y-2">
              {categories.map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setCat(key)}
                    className={`w-full text-left flex items-center gap-2 ${key === cat ? 'font-semibold text-brand' : 'text-gray-700'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Commercial Kitchen Equipment</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filtered.map((it) => (
                <EquipmentCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
