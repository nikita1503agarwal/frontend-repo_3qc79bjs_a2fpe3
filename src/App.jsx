import { useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'

function App() {
  // Sample services
  const services = useMemo(
    () => [
      { id: 1, name: 'Wash & Fold', price: 8 },
      { id: 2, name: 'Dry Cleaning', price: 12 },
      { id: 3, name: 'Ironing', price: 6 },
      { id: 4, name: 'Express Service', price: 18 },
    ],
    []
  )

  // Cart state
  const [cart, setCart] = useState([]) // array of {id, name, price, qty}

  const addToCart = (service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === service.id)
      if (existing) {
        return prev.map((i) =>
          i.id === service.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...service, qty: 1 }]
    })
  }

  const removeFromCart = (service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === service.id)
      if (!existing) return prev
      if (existing.qty === 1) {
        return prev.filter((i) => i.id !== service.id)
      }
      return prev.map((i) =>
        i.id === service.id ? { ...i, qty: i.qty - 1 } : i
      )
    })
  }

  const clearService = (service) => {
    setCart((prev) => prev.filter((i) => i.id !== service.id))
  }

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  )

  // Booking form
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [bookingMsg, setBookingMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBookNow = async () => {
    setBookingMsg('')
    if (!form.name || !form.email || !form.phone) {
      setBookingMsg('Please fill in all details to continue.')
      return
    }
    setLoading(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const templateParams = {
      user_name: form.name,
      user_email: form.email,
      user_phone: form.phone,
      order_summary: cart
        .map((i) => `${i.name} x ${i.qty} = $${(i.price * i.qty).toFixed(2)}`)
        .join('\n') || 'No items selected',
      order_total: `$${total.toFixed(2)}`,
    }

    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, templateParams, {
          publicKey,
        })
      }
      setBookingMsg(
        'Thank you For Booking the Service We will get back to you soon!'
      )
      setCart([])
      setForm({ name: '', email: '', phone: '' })
    } catch (e) {
      setBookingMsg(
        'We could not send the confirmation email right now, but your booking was noted.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Newsletter
  const [newsletter, setNewsletter] = useState({ name: '', email: '' })
  const [subMsg, setSubMsg] = useState('')

  const handleSubscribe = () => {
    if (!newsletter.name || !newsletter.email) {
      setSubMsg('Please enter your name and email.')
      return
    }
    setSubMsg('You are subscribed! We will keep you posted with updates.')
    setNewsletter({ name: '', email: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero / Title */}
      <section className="px-6 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Laundry Booking Services
          </h1>
          <p className="mt-3 text-gray-600">
            Add services to your cart, book in seconds, and get instant confirmation.
          </p>
        </div>
      </section>

      {/* Booking Services Section */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Left Div: Services List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Available Services</h2>
            <div className="space-y-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-gray-500">${s.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(s)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Remove Now
                    </button>
                    <button
                      onClick={() => addToCart(s)}
                      className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Add Items
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">Add items to the cart</p>
          </div>

          {/* Right Div: Cart + Book Now */}
          <div className="space-y-6">
            {/* First div: Cart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Your Selection</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">No added items.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium">{i.name}</p>
                        <p className="text-sm text-gray-500">
                          ${i.price.toFixed(2)} x {i.qty} = ${
                            (i.price * i.qty).toFixed(2)
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(i)}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          -
                        </button>
                        <button
                          onClick={() => addToCart(i)}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          +
                        </button>
                        <button
                          onClick={() => clearService(i)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between pt-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Second div: Book Now */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Book Now</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full name"
                  className="col-span-3 sm:col-span-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="col-span-3 sm:col-span-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="col-span-3 sm:col-span-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <button
                onClick={handleBookNow}
                disabled={loading}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Book Now'}
              </button>
              {bookingMsg && (
                <p className="mt-3 text-sm text-green-700">{bookingMsg}</p>
              )}
              {!import.meta.env.VITE_EMAILJS_SERVICE_ID && (
                <p className="mt-2 text-xs text-gray-500">
                  Tip: Add your EmailJS keys in environment variables to enable email sending.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Description Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold">Why Choose Our Laundry Service</h2>
          <p className="mt-2 text-gray-600 max-w-3xl">
            We focus on the details so you don’t have to. Here are the qualities that set us apart.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QualityCard title="Premium Services" desc="Top-notch care for every fabric, using safe detergents and modern equipment." />
            <QualityCard title="Quick Support" desc="Friendly, responsive help whenever you need it—online or by phone." />
            <QualityCard title="Timely Delivery" desc="Punctual pickups and on-time drop-offs to match your schedule." />
            <QualityCard title="Affordable Prices" desc="Clear, competitive rates with excellent value for money." />
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold">Subscribe to our Newsletter</h2>
          <p className="mt-1 text-gray-600">
            Stay informed about updates, promotions, and news.
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="col-span-3 sm:col-span-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newsletter.name}
              onChange={(e) =>
                setNewsletter((n) => ({ ...n, name: e.target.value }))
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="col-span-3 sm:col-span-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newsletter.email}
              onChange={(e) =>
                setNewsletter((n) => ({ ...n, email: e.target.value }))
              }
            />
            <button
              onClick={handleSubscribe}
              className="col-span-3 sm:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md"
            >
              Subscribe
            </button>
          </div>
          {subMsg && <p className="mt-3 text-sm text-green-700">{subMsg}</p>}
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Laundry Co. All rights reserved.
      </footer>
    </div>
  )
}

function QualityCard({ title, desc }) {
  return (
    <div className="p-5 border border-gray-200 rounded-xl">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

export default App
