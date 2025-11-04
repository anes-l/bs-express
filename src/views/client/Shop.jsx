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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg sticky top-0 z-50 rounded-t-2xl">
          <div className="flex justify-between items-center p-4">
            <img src="/logo.png" alt="BS EXPRESS" className="h-12" />
            <div className="flex gap-2">
              {!user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('my-orders')}
                  className="w-11 h-11 bg-[#006b9c] text-white rounded-xl flex items-center justify-center hover:bg-[#005b85] transition"
                >
                  <Package size={24} />
                </button>
              )}
              {user?.isAdmin && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="w-11 h-11 bg-[#e89b2b] text-white rounded-xl flex items-center justify-center hover:bg-[#cf8726] transition"
                >
                  <Wrench size={24} />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-11 h-11 bg-[#e0161e] text-white rounded-xl flex items-center justify-center hover:bg-[#c40712] transition"
              >
                <Power size={24} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#e89b2b66] rounded-t-2xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg"><ShoppingCart size={24} className="inline-block mr-2" /> Panier ({getTotalItems()})</h2>
              <div className="font-black text-[#002f45] text-xl">{getTotalPrice()} DZD</div>
            </div>
            {cart.length > 0 && (
              <div>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-[#F9FAFB] rounded-xl p-3 shadow">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-[#ffffff00] rounded-lg font-bold hover:bg-gray-100 flex items-center justify-center">−</button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-[#ffffff00] rounded-lg font-bold hover:bg-gray-100 flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('checkout')} className="w-full bg-[#239186] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1f7e74] transition shadow-lg">
                  <CreditCard size={24} className="inline-block mr-2" /> Passer commande
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6 bg-gradient-to-r from-[#002f45] to-[#002f45] text-white p-5 rounded-2xl shadow-lg">
            <p className="font-bold text-lg"><Hand size={24} className="inline-block mr-2" /> Bienvenue, {user?.name}!</p>
            <p className="text-sm text-white mt-1">{user?.isAdmin ? 'Compte Administrateur' : 'Compte Client'}</p>
          </div>

          <h2 className="text-2xl font-black mb-4"><ShoppingBag size={32} className="inline-block mr-2" /> Nos Produits</h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4"><Package size={64} /></div>
              <p className="text-gray-500 font-bold text-lg">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden active:scale-95 transition" onClick={() => addToCart(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-40 md:h-56 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-black text-[#002f45]">{product.price} DZD</p>
                      <button className="w-9 h-9 bg-[#002f45] text-white rounded-lg hover:bg-[#002f45] transition flex items-center justify-center text-xl">+</button>
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
