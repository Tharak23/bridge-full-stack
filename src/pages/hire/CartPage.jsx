import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@clerk/clerk-react'
import { fetchApiJson } from '@/lib/api'
import { useLocationContext } from '@/context/LocationContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { getToken } = useAuth()
  const { location } = useLocationContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      for (const item of items) {
        await fetchApiJson(
          '/api/bookings',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceName: item.serviceName,
              serviceSlug: item.serviceSlug,
              serviceCategory: item.serviceCategory,
              price: Number(item.price),
              quantity: item.quantity || 1,
              locationText: location || undefined,
            }),
          },
          () => Promise.resolve(token)
        )
      }
      clearCart()
      navigate('/hiredashboard/bookings')
    } catch (e) {
      setError(e?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Cart</h1>
      <p className="text-slate-500 mb-8">Review your items and proceed to checkout</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <Card className="p-12 text-center overflow-hidden">
              <ShoppingBag className="h-14 w-14 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">Add services from the home page to get started.</p>
              <Link to="/hiredashboard">
                <Button variant="outline" className="mt-6 rounded-lg">Browse services</Button>
              </Link>
            </Card>
          ) : (
            items.map((item, index) => (
              <Card key={`${item.serviceSlug}-${index}`} className="overflow-hidden">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900">{item.serviceName}</h2>
                    <p className="text-sm text-slate-500 capitalize">{item.serviceCategory?.replace(/_/g, ' ')}</p>
                    <p className="text-xl font-bold text-teal-600 mt-1">₹{Number(item.price) * (item.quantity || 1)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-slate-700">{item.quantity || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="lg:min-w-[320px]">
          <Card className="sticky top-24 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-6 flex flex-col">
              <h2 className="font-bold text-slate-900 text-lg mb-5">Order summary</h2>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">You pay after the service is completed.</p>
              <Link to="/hiredashboard/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">View my bookings →</Link>
              {error && <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
              <Button
                className="w-full rounded-lg h-11 font-medium"
                variant="default"
                disabled={items.length === 0 || loading}
                onClick={handleCheckout}
              >
                {loading ? 'Booking…' : 'Continue to checkout'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
