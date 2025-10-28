import React from 'react';
import { Plus, Edit2, Trash2, X, Phone, MapPin } from 'lucide-react';

export default function AdminAccounts({
  user,
  accounts,
  showAccountModal,
  editingAccount,
  accountForm,
  setCurrentPage,
  openAccountModal,
  closeAccountModal,
  setAccountForm,
  handleSaveAccount,
  handleDeleteAccount,
}) {
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
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-purple-600">
                {editingAccount ? '✏️ Modifier le compte' : '➕ Créer un compte client'}
              </h2>
              <button onClick={closeAccountModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nom d'utilisateur *</label>
                <input
                  type="text"
                  value={accountForm.username}
                  onChange={(e) => setAccountForm({...accountForm, username: e.target.value})}
                  disabled={editingAccount}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${editingAccount ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-purple-500'}`}
                  placeholder="Ex: client123"
                />
                {editingAccount && <p className="text-xs text-gray-500 mt-1">Le nom d'utilisateur ne peut pas être modifié</p>}
              </div>
              
              <div>
                <label className="block font-bold mb-2">
                  Mot de passe {editingAccount ? '(laisser vide pour ne pas changer)' : '*'}
                </label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({...accountForm, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Nom complet *</label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: Mohammed Ali"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="+213 555 123 456"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Adresse *</label>
                <input
                  type="text"
                  value={accountForm.address}
                  onChange={(e) => setAccountForm({...accountForm, address: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: Tlemcen, Imama"
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveAccount}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
                >
                  {editingAccount ? '💾 Enregistrer' : '➕ Créer le compte'}
                </button>
                <button
                  onClick={closeAccountModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-black text-purple-600">👥 Gestion des Comptes</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage('shop')} className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600">
            Boutique
          </button>
          <button onClick={() => { setCurrentPage('login'); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">
            Déconnexion
          </button>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
          >
            📦 Commandes
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
          >
            🛍️ Produits
          </button>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">
            👥 Comptes Clients
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black">👥 Comptes Clients ({accounts.length})</h2>
          <button 
            onClick={() => openAccountModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            <Plus size={20} />
            Créer un compte
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 font-bold text-xl mb-4">Aucun compte client créé</p>
            <button 
              onClick={() => openAccountModal()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
            >
              Créer le premier compte
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <div key={account.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{account.name}</h3>
                    <p className="text-sm text-gray-500">@{account.username}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 bg-purple-50 rounded-xl p-3">
                  <p className="text-sm flex items-center gap-2">
                    <Phone size={16} className="text-purple-600" />
                    <span className="font-semibold">{account.phone}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin size={16} className="text-purple-600" />
                    <span>{account.address}</span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openAccountModal(account)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


