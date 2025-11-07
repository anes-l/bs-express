import React from 'react';
import { Package, Store, Wrench, Power, User, Phone, MapPin, Clock } from 'lucide-react';

export default function MyOrders({
  user,
  orders,
  firebaseUser,
  renderToasts,
  setCurrentPage,
  handleLogout,
}) {
  const userOrders = user?.isAdmin ? orders : orders.filter(o => o.userId === user?.id || o.userId === firebaseUser?.uid);

  return (
    <>
      {renderToasts()}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-black text-lg text-gray-900">Mes Commandes</h1>
                <p className="text-xs text-gray-500">{userOrders.length} commande(s)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage('shop')} 
                className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
              >
                <Store size={20} />
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('admin')} 
                  className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
                >
                  <Wrench size={20} />
                </button>
              )}
              <button 
                onClick={handleLogout} 
                className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
              >
                <Power size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl mt-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-bold text-lg mb-2">Aucune commande</p>
              <p className="text-gray-400 text-sm mb-5">Commencez vos achats dès maintenant</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all"
              >
                Découvrir les produits
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg text-gray-900">{order.orderNumber}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{order.date} · {order.time}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      order.status === 'Traitée' ? 'bg-green-100 text-green-700' : 
                      order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-3 mb-3">
                    <p className="font-bold text-sm flex items-center gap-2 text-gray-900">
                      <User size={16} />
                      {order.clientName}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-2 mt-1.5">
                      <Phone size={14} />
                      {order.clientPhone}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-2 mt-1 truncate">
                      <MapPin size={14} className="flex-shrink-0" />
                      {order.clientAddress}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-3 rounded-2xl">
                        <span className="truncate flex-1 mr-2 font-semibold text-gray-700">{item.name} ×{item.quantity}</span>
                        <span className="font-black whitespace-nowrap text-gray-900">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3 flex justify-between items-center text-white">
                    <span className="font-black">Total</span>
                    <span className="font-black text-xl">{order.total} DZD</span>
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