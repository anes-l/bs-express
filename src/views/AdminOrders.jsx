import React from 'react';

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
          <div className="text-6xl mb-4">🚫</div>
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
      <div className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sticky top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-black text-purple-600">🔧 Panel Admin</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setCurrentPage('shop')} className="px-4 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 whitespace-nowrap">
            Boutique
          </button>
          <button onClick={handleLogout} className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 whitespace-nowrap">
            Déconnexion
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          <button className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold whitespace-nowrap">
            📦 Commandes
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 whitespace-nowrap"
          >
            🛍️ Produits
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 whitespace-nowrap"
          >
            👥 Comptes
          </button>
        </div>

        {/* 🎯 GRANDES CARTES STATISTIQUES CLIQUABLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => { setShowCompletedOrders(false); setShowCancelledOnly(false); }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 shadow-lg cursor-pointer hover:shadow-2xl transition transform hover:scale-105"
          >
            <p className="text-sm mb-2 text-blue-100">En cours</p>
            <p className="text-5xl font-black">{orders.filter(o => o.status === 'En cours' || o.status === 'En attente').length}</p>
            <p className="text-xs mt-2 text-blue-100">Cliquez pour voir →</p>
          </div>
          
          <div 
            onClick={() => { setShowCancelledOnly(true); setShowCompletedOrders(false); }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-8 shadow-lg cursor-pointer hover:shadow-2xl transition transform hover:scale-105"
          >
            <p className="text-sm mb-2 text-orange-100">Annulées</p>
            <p className="text-5xl font-black">{orders.filter(o => o.status === 'Annulée').length}</p>
            <p className="text-xs mt-2 text-orange-100">Cliquez pour voir →</p>
          </div>
          
          <div 
            onClick={() => { setShowCompletedOrders(true); setShowCancelledOnly(false); }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 shadow-lg cursor-pointer hover:shadow-2xl transition transform hover:scale-105"
          >
            <p className="text-sm mb-2 text-green-100">Traitées</p>
            <p className="text-5xl font-black">{orders.filter(o => o.status === 'Traitée').length}</p>
            <p className="text-xs mt-2 text-green-100">Cliquez pour voir →</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black">
            {showCancelledOnly ? '❌ Commandes Annulées' : showCompletedOrders ? '✅ Commandes Traitées' : '📦 Commandes En Cours'}
          </h2>
        </div>

        {orders.filter(o => {
          if (showCancelledOnly) return o.status === 'Annulée';
          if (showCompletedOrders) return o.status === 'Traitée';
          return o.status === 'En cours' || o.status === 'En attente';
        }).length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 font-bold text-xl">
              {showCancelledOnly ? 'Aucune commande annulée' : showCompletedOrders ? 'Aucune commande traitée' : 'Aucune commande en cours'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.filter(o => {
              if (showCancelledOnly) return o.status === 'Annulée';
              if (showCompletedOrders) return o.status === 'Traitée';
              return o.status === 'En cours' || o.status === 'En attente';
            }).map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-purple-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <h3 className="font-black text-lg sm:text-xl">{order.orderNumber}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{order.date} à {order.time}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold border-2 outline-none cursor-pointer w-full sm:w-auto ${
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
                
                <div className="bg-purple-50 rounded-xl p-3 sm:p-4 mb-4">
                  <p className="font-bold text-base sm:text-lg">👤 {order.clientName}</p>
                  <p className="text-xs sm:text-sm text-purple-600 font-semibold">📞 {order.clientPhone}</p>
                  <p className="text-xs sm:text-sm text-purple-600">📍 {order.clientAddress}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs sm:text-sm bg-gray-50 p-2 rounded">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-bold">{item.price * item.quantity} DZD</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-purple-200 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-black text-base sm:text-lg">Total</span>
                  <span className="font-black text-xl sm:text-2xl text-purple-600">{order.total} DZD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}