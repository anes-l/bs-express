import React from 'react';
import { Package, Store, Wrench, Power, User, Phone, MapPin } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 pb-6">
        {/* Header */}
        <div className="bg-white shadow-lg sticky top-0 z-50">
          <div className="flex justify-between items-center p-3">
            <img src="/logo.png" alt="BS EXPRESS" className="h-10" />
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage('shop')} 
                className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition"
              >
                <Store size={20} />
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('admin')} 
                  className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 active:scale-95 transition"
                >
                  <Wrench size={20} />
                </button>
              )}
              <button 
                onClick={handleLogout} 
                className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition"
              >
                <Power size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg mt-6">
              <Package size={56} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 font-bold text-base mb-4">Aucune commande</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition text-sm"
              >
                Commencer vos achats
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-3 shadow-lg border-2 border-blue-100">
                  <div className="flex justify-between items-start mb-2.5">
                    <div>
                      <h3 className="font-black text-base">{order.orderNumber}</h3>
                      <p className="text-xs text-gray-600">{order.date} · {order.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Traitée' ? 'bg-green-100 text-green-700' : 
                      order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-2.5 mb-2.5">
                    <p className="font-bold text-sm flex items-center gap-1.5">
                      <User size={14} />
                      {order.clientName}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Phone size={14} />
                      {order.clientPhone}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-1.5 mt-0.5 truncate">
                      <MapPin size={14} className="flex-shrink-0" />
                      {order.clientAddress}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5 mb-2.5">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                        <span className="font-bold whitespace-nowrap">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-blue-200 pt-2.5 flex justify-between items-center">
                    <span className="font-black text-sm">Total</span>
                    <span className="font-black text-lg text-blue-600">{order.total} DZD</span>
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