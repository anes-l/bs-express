import React from 'react';
import { Package, Wrench, Power, ShoppingCart, CreditCard, Sparkles, Store, Plus } from 'lucide-react';

export default function Shop({
  user,
  products,
  cart,
  renderToasts,
  handleLogout,
  setCurrentPage,
  getTotalItems,
  getTotalPrice,
  updateQuantity,
  addToCart,
}) {
  return (
    <>
      {renderToasts()}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
          <div className="flex justify-between items-center p-4">
            <img src="/logo.webp" alt="BS EXPRESS" className="h-12 object-contain" />
            <div className="flex gap-2">
              {!user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('my-orders')}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
                >
                  <Package size={22} />
                </button>
              )}
              {user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
                >
                  <Wrench size={22} />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
              >
                <Power size={22} />
              </button>
            </div>
          </div>

          {/* Panier */}
          {cart.length > 0 && (
            <div className="px-4 pb-4">
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
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Bienvenue */}
          <div className="mb-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-5 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={24} className="animate-pulse" />
              <div>
                <p className="font-black text-xl">Bonjour {user?.name} !</p>
                <p className="text-sm opacity-90">{user?.isAdmin ? '👑 Administrateur' : '🛍️ Client'}</p>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Store size={28} />
              Nos Produits
            </h2>
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold">
              {products.length}
            </span>
          </div>
          
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-lg">
              <Package size={56} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 font-bold text-lg">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-3xl shadow-lg overflow-hidden active:scale-95 transition-all hover:shadow-xl"
                  onClick={() => addToCart(product)}
                >
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                    <div className="absolute top-2 right-2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                      <Plus size={24} className="text-gray-900" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 min-h-[2.5rem] text-gray-900">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full">
                        <p className="text-base font-black">{product.price} DZD</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}