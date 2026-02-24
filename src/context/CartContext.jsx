import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const storageKey = 'bridge_cart'

function loadCart() {
  try {
    const s = localStorage.getItem(storageKey)
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items))
  } catch (_) {}
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item } = action
      const existing = state.find(
        (i) => i.serviceSlug === item.serviceSlug && i.serviceCategory === item.serviceCategory
      )
      let next
      if (existing) {
        next = state.map((i) =>
          i === existing ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
        )
      } else {
        next = [...state, { ...item, quantity: item.quantity || 1 }]
      }
      saveCart(next)
      return next
    }
    case 'REMOVE': {
      const next = state.filter((_, i) => i !== action.index)
      saveCart(next)
      return next
    }
    case 'UPDATE_QUANTITY': {
      const { index, quantity } = action
      if (quantity < 1) return cartReducer(state, { type: 'REMOVE', index })
      const next = state.map((item, i) => (i === index ? { ...item, quantity } : item))
      saveCart(next)
      return next
    }
    case 'CLEAR':
      saveCart([])
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD', item })
  }, [])

  const removeItem = useCallback((index) => {
    dispatch({ type: 'REMOVE', index })
  }, [])

  const updateQuantity = useCallback((index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', index, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count: items.reduce((c, i) => c + (i.quantity || 1), 0),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
