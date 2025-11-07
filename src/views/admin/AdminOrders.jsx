import React from 'react';
import { Ban, Store, Power, Package, ShoppingBag, Users, X, Check, User, Phone, MapPin, TrendingUp } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ban size={40} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-black mb-3 text-gray-900">Accès refusé</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg text-gray-900">Dashboard Admin</h1>
              <p className="text-xs text-gray-500">{orders.length} commande(s)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage('shop')} 
              className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
            >
              <Store size={20} />
            </button>
            <button 
              onClick={handleLogout} 
              className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
            >
              <Power size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation bottom fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-3 z-50 shadow-2xl border-t border-gray-100">
        <div className="flex justify-around gap-2 max-w-md mx-auto">
          <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
            <Package size={20} />
            <span className="text-xs">Commandes</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 active:scale-95 transition-all hover:border-blue-500"
          >
            <ShoppingBag size={20} />
            <span className="text-xs">Produits</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 active:scale-95 transition-all hover:border-blue-500"
          >
            <Users size={20} />
            <span className="text-xs">Comptes</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div 
            onClick={() => { setShowCancelledOnly(false); setShowCompletedOrders(false); }}
            className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-3xl p-4 shadow-xl active:scale-95 transition-all"
          >
            <p className="text-xs mb-1 opacity-90 font-semibold">En cours</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'En cours' || o.status === 'En attente').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCancelledOnly(true); setShowCompletedOrders(false); }}
            className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl p-4 shadow-xl active:scale-95 transition-all"
          >
            <p className="text-xs mb-1 opacity-90 font-semibold">Annulées</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Annulée').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCompletedOrders(true); setShowCancelledOnly(false); }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-4 shadow-xl active:scale-95 transition-all"
          >
            <p className="text-xs mb-1 opacity-90 font-semibold">Traitées</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Traitée').length}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-black mb-4 text-gray-900 flex items-center gap-2">
          {showCancelledOnly ? (
            <><X size={24} className="text-red-600" /> Commandes Annulées</>
          ) : showCompletedOrders ? (
            <><Check size={24} className="text-green-600" /> Commandes Traitées</>
          ) : (
            <><Package size={24} className="text-orange-600" /> Commandes En Cours</>
          )}
        </h2>

        {orders.filter(o => {
          if (showCancelledOnly) return o.status === 'Annulée';
          if (showCompletedOrders) return o.status === 'Traitée';
          return o.status === 'En cours' || o.status === 'En attente';
        }).length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold text-base">
              {showCancelledOnly ? 'Aucune commande annulée' : showCompletedOrders ? 'Aucune commande traitée' : 'Aucune commande en cours'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.filter(o => {
              if (showCancelledOnly) return o.status === 'Annulée';
              if (showCompletedOrders) return o.status === 'Traitée';
              return o.status === 'En cours' || o.status === 'En attente';
            }).map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-lg text-gray-900">{order.orderNumber}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{order.date} · {order.time}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold border-2 outline-none transition-all ${
                      order.status === 'Traitée' ? 'bg-green-50 text-green-700 border-green-300' : 
                      order.status === 'Annulée' ? 'bg-red-50 text-red-700 border-red-300' :
                      'bg-blue-50 text-blue-700 border-blue-300'
                    }`}
                  >
                    <option value="En cours">En cours</option>
                    <option value="Annulée">Annulée</option>
                    <option value="Traitée">Traitée</option>
                  </select>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-3 mb-3">
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
                
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-3 flex justify-between items-center text-white">
                  <span className="font-black">Total</span>
                  <span className="font-black text-xl">{order.total} DZD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}