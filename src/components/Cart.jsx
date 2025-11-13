import React from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';

export default function Cart({
  cart,
  getTotalItems,
  getTotalPrice,
  updateQuantity,
  setCurrentPage,
}) {
  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-40">
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart size={22} className="animate-bounce" />
            <span className="font-bold text-lg">Panier ({getTotalItems()})</span>
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="font-black text-white text-lg">{getTotalPrice()} DZD</span>
          </div>
        </div>
        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white/95 backdrop-blur rounded-2xl p-3 shadow-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-md" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 font-semibold">Quantité: {item.quantity}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="w-9 h-9 bg-red-100 text-red-600 rounded-xl font-black hover:bg-red-200 active:scale-90 transition-all"
                >
                  −
                </button>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="w-9 h-9 bg-green-100 text-green-600 rounded-xl font-black hover:bg-green-200 active:scale-90 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setCurrentPage('checkout')} 
          className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black text-base hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CreditCard size={22} />
          Commander maintenant
        </button>
      </div>
    </div>
  );
}
