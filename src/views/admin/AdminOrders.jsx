import React from 'react';
import { Ban, Store, Power, Package, ShoppingBag, Users, X, Check, User, Phone, MapPin } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <Ban size={48} className="mx-auto mb-3 text-gray-400" />
          <h2 className="text-xl font-black mb-3">Accès refusé</h2>
          <p className="text-gray-600 mb-4 text-sm">Vous n'avez pas les permissions d'accéder à cette page.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="px-5 py-2.5 bg-[#239186] text-white rounded-lg font-bold hover:bg-[#1f7e74] active:scale-95 transition text-sm"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="flex justify-between items-center p-3">
          <img src="/logo.png" alt="BS EXPRESS" className="h-10" />
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage('shop')} 
              className="w-10 h-10 bg-[#002F45] text-white rounded-lg flex items-center justify-center hover:bg-[#00283b] active:scale-95 transition"
            >
              <Store size={20} />
            </button>
            <button 
              onClick={handleLogout} 
              className="w-10 h-10 bg-[#e0161e] text-white rounded-lg flex items-center justify-center hover:bg-[#c40712] active:scale-95 transition"
            >
              <Power size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation bottom fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-2 z-50 shadow-lg border-t-2 border-gray-200">
        <div className="flex justify-around gap-1.5">
          <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-[#002F45] text-white rounded-lg font-bold shadow-lg active:scale-95 transition">
            <Package size={18} />
            <span className="text-xs">Commandes</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-white text-gray-700 rounded-lg font-bold border-2 border-gray-200 active:scale-95 transition"
          >
            <ShoppingBag size={18} />
            <span className="text-xs">Produits</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-white text-gray-700 rounded-lg font-bold border-2 border-gray-200 active:scale-95 transition"
          >
            <Users size={18} />
            <span className="text-xs">Comptes</span>
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div 
            onClick={() => { setShowCancelledOnly(false); setShowCompletedOrders(false); }}
            className="bg-[#E3A750] text-white rounded-lg p-3 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-0.5 opacity-80">En cours</p>
            <p className="text-2xl font-black">{orders.filter(o => o.status === 'En cours' || o.status === 'En attente').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCancelledOnly(true); setShowCompletedOrders(false); }}
            className="bg-[#002F45] text-white rounded-lg p-3 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-0.5 opacity-80">Annulées</p>
            <p className="text-2xl font-black">{orders.filter(o => o.status === 'Annulée').length}</p>
          </div>
          
          <div 
            onClick={() => { setShowCompletedOrders(true); setShowCancelledOnly(false); }}
            className="bg-[#239186] text-white rounded-lg p-3 shadow-lg active:scale-95 transition"
          >
            <p className="text-xs mb-0.5 opacity-80">Traitées</p>
            <p className="text-2xl font-black">{orders.filter(o => o.status === 'Traitée').length}</p>
          </div>
        </div>
        
        <h2 className="text-lg font-black mb-3 flex items-center gap-2">
          {showCancelledOnly ? (
            <><X size={20} /> Annulées</>
          ) : showCompletedOrders ? (
            <><Check size={20} /> Traitées</>
          ) : (
            <><Package size={20} /> En Cours</>
          )}
        </h2>

        {orders.filter(o => {
          if (showCancelledOnly) return o.status === 'Annulée';
          if (showCompletedOrders) return o.status === 'Traitée';
          return o.status === 'En cours' || o.status === 'En attente';
        }).length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <Package size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 font-bold text-sm">
              {showCancelledOnly ? 'Aucune annulée' : showCompletedOrders ? 'Aucune traitée' : 'Aucune en cours'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.filter(o => {
              if (showCancelledOnly) return o.status === 'Annulée';
              if (showCompletedOrders) return o.status === 'Traitée';
              return o.status === 'En cours' || o.status === 'En attente';
            }).map(order => (
              <div key={order.id} className="bg-white rounded-xl p-3 shadow-lg border-2 border-purple-100">
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <h3 className="font-black text-base">{order.orderNumber}</h3>
                    <p className="text-xs text-gray-600">{order.date} · {order.time}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border-2 outline-none ${
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
                
                <div className="bg-purple-50 rounded-lg p-2.5 mb-2.5">
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <User size={14} />
                    {order.clientName}
                  </p>
                  <p className="text-xs text-[#239186] font-semibold flex items-center gap-1.5 mt-0.5">
                    <Phone size={14} />
                    {order.clientPhone}
                  </p>
                  <p className="text-xs text-[#239186] flex items-center gap-1.5 mt-0.5 truncate">
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
                
                <div className="border-t-2 border-purple-200 pt-2.5 flex justify-between items-center">
                  <span className="font-black text-sm">Total</span>
                  <span className="font-black text-lg text-[#002F45]">{order.total} DZD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}