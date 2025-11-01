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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow sticky top-0 z-50">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-black text-blue-600"><Package size={24} className="inline-block mr-2" /> Commandes</h1>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage('shop')} className="w-11 h-11 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600">
                <Store size={24} />
              </button>
              {user?.isAdmin && (
                <button onClick={() => setCurrentPage('admin')} className="w-11 h-11 bg-purple-500 text-white rounded-xl flex items-center justify-center hover:bg-purple-600">
                  <Wrench size={24} />
                </button>
              )}
              <button onClick={handleLogout} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600">
                <Power size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg mt-8">
              <div className="text-6xl mb-4"><Package size={64} /></div>
              <p className="text-gray-500 font-bold text-lg mb-4">Aucune commande</p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                Commencer vos achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg">{order.orderNumber}</h3>
                      <p className="text-xs text-gray-600">{order.date} · {order.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Traitée' ? 'bg-green-100 text-green-700' : order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <p className="font-bold"><User size={16} className="inline-block mr-2" /> {order.clientName}</p>
                    <p className="text-xs text-blue-600 font-semibold"><Phone size={16} className="inline-block mr-2" /> {order.clientPhone}</p>
                    <p className="text-xs text-blue-600"><MapPin size={16} className="inline-block mr-2" /> {order.clientAddress}</p>
                  </div>
                  <div className="space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                    <span className="font-black">Total</span>
                    <span className="font-black text-xl text-blue-600">{order.total} DZD</span>
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
