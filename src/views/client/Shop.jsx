import React from 'react';
import { Package, Wrench, Power, ShoppingCart, CreditCard, Hand, ShoppingBag } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-lg sticky top-0 z-50">
          <div className="flex justify-between items-center p-3">
            <img src="/logo.png" alt="BS EXPRESS" className="h-10" />
            <div className="flex gap-2">
              {!user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('my-orders')}
                  className="w-10 h-10 bg-[#006b9c] text-white rounded-lg flex items-center justify-center hover:bg-[#005b85] active:scale-95 transition"
                >
                  <Package size={20} />
                </button>
              )}
              {user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="w-10 h-10 bg-[#e89b2b] text-white rounded-lg flex items-center justify-center hover:bg-[#cf8726] active:scale-95 transition"
                >
                  <Wrench size={20} />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-[#e0161e] text-white rounded-lg flex items-center justify-center hover:bg-[#c40712] active:scale-95 transition"
              >
                <Power size={20} />
              </button>
            </div>
          </div>

          {/* Panier */}
          <div className="p-3 bg-[#e89b2b66]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-base flex items-center gap-2">
                <ShoppingCart size={20} /> 
                Panier ({getTotalItems()})
              </h2>
              <div className="font-black text-[#002f45] text-lg">{getTotalPrice()} DZD</div>
            </div>
            {cart.length > 0 && (
              <div>
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white rounded-lg p-2.5 shadow">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          className="w-8 h-8 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 active:scale-95 flex items-center justify-center"
                        >
                          −
                        </button>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="w-8 h-8 bg-gray-100 rounded-lg font-bold hover:bg-gray-200 active:scale-95 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage('checkout')} 
                  className="w-full bg-[#239186] text-white py-3 rounded-lg font-bold text-base hover:bg-[#1f7e74] active:scale-98 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Passer commande
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-3">
          {/* Bienvenue */}
          <div className="mb-4 bg-gradient-to-r from-[#002f45] to-[#002f45] text-white p-4 rounded-xl shadow-lg">
            <p className="font-bold text-base flex items-center gap-2">
              <Hand size={20} />
              Bienvenue, {user?.name}!
            </p>
            <p className="text-xs text-white mt-1">
              {user?.isAdmin ? 'Compte Administrateur' : 'Compte Client'}
            </p>
          </div>

          {/* Produits */}
          <h2 className="text-xl font-black mb-3 flex items-center gap-2">
            <ShoppingBag size={24} />
            Nos Produits
          </h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <Package size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 font-bold">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden active:scale-95 transition"
                  onClick={() => addToCart(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-36 object-cover" />
                  <div className="p-2.5">
                    <h3 className="font-bold text-sm mb-1.5 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-base font-black text-[#002f45]">{product.price} DZD</p>
                      <button className="w-8 h-8 bg-[#002f45] text-white rounded-lg hover:bg-[#00283b] active:scale-95 transition flex items-center justify-center text-lg font-bold">
                        +
                      </button>
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