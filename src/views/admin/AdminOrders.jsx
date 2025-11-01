import React from 'react';
import { Ban, Wrench, Store, Power, Package, ShoppingBag, Users, X, Check, User, Phone, MapPin } from 'lucide-react';

export default function AdminOrders({
  user,
  orders,
  showCompletedOrders,
  setShowCompletedOrders,
  setCurrentPage,
  updateOrderStatus,
  handleLogout
}) {
  const [showCancelledOnly, setShowCancelledOnly] = React.useState(false);
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <div className="text-6xl mb-4"><Ban size={64} /></div>
          <h2 className="text-2xl font-black mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions d'accéder à cette page.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-black text-purple-600"><Wrench size={24} className="inline-block mr-2" /> Admin</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="w-11 h-11 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600">
              <Store size={24} />
            </button>
            <button onClick={handleLogout} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600">
              <Power size={24} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold whitespace-nowrap shadow-lg">
            <Package size={20} className="inline-block mr-2" /> Commandes
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 whitespace-nowrap shadow"
          >
            <ShoppingBag size={20} className="inline-block mr-2" /> Produits
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 whitespace-nowrap shadow"
          >
            <Users size={20} className="inline-block mr-2" /> Comptes
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            onClick={() => { setShowCompletedOrders(false); setShowCancelledOnly(false); }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-1 text-blue-100">En cours</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'En cours' || o.status === 'En attente').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCancelledOnly(true); setShowCompletedOrders(false); }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-1 text-orange-100">Annulées</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Annulée').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCompletedOrders(true); setShowCancelledOnly(false); }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-1 text-green-100">Traitées</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Traitée').length}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-black mb-4">
          {showCancelledOnly ? <><X size={24} className="inline-block mr-2" /> Annulées</> : showCompletedOrders ? <><Check size={24} className="inline-block mr-2" /> Traitées</> : <><Package size={24} className="inline-block mr-2" /> En Cours</>}
        </h2>

        {orders.filter(o => {
          if (showCancelledOnly) return o.status === 'Annulée';
          if (showCompletedOrders) return o.status === 'Traitée';
          return o.status === 'En cours' || o.status === 'En attente';
        }).length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4"><Package size={64} /></div>
            <p className="text-gray-500 font-bold text-lg">
              {showCancelledOnly ? 'Aucune annulée' : showCompletedOrders ? 'Aucune traitée' : 'Aucune en cours'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.filter(o => {
              if (showCancelledOnly) return o.status === 'Annulée';
              if (showCompletedOrders) return o.status === 'Traitée';
              return o.status === 'En cours' || o.status === 'En attente';
            }).map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-lg">{order.orderNumber}</h3>
                    <p className="text-xs text-gray-600">{order.date} · {order.time}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 outline-none ${
                      order.status === 'Traitée' ? 'bg-green-100 text-green-700 border-green-300' : 
                      order.status === 'Annulée' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                      'bg-blue-100 text-blue-700 border-blue-300'
                    }`}
                  >
                    <option value="En cours">En cours</option>
                    <option value="Annulée">Annulée</option>
                    <option value="Traitée">Traitée</option>
                  </select>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-3 mb-3">
                  <p className="font-bold"><User size={16} className="inline-block mr-2" /> {order.clientName}</p>
                  <p className="text-xs text-purple-600 font-semibold"><Phone size={16} className="inline-block mr-2" /> {order.clientPhone}</p>
                  <p className="text-xs text-purple-600 truncate"><MapPin size={16} className="inline-block mr-2" /> {order.clientAddress}</p>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                      <span className="truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                      <span className="font-bold whitespace-nowrap">{item.price * item.quantity} DZD</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-purple-200 pt-3 flex justify-between items-center">
                  <span className="font-black">Total</span>
                  <span className="font-black text-xl text-purple-600">{order.total} DZD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}