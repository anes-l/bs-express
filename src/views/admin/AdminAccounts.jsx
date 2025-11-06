import React from 'react';
import { Plus, Edit2, Trash2, X, Phone, MapPin, Mail, Ban, Edit, Save, Users, Store, Power, Package, ShoppingBag } from 'lucide-react';

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
  handleLogout
}) {
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <div className="text-6xl mb-4"><Ban size={64} /></div>
          <h2 className="text-2xl font-black mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions d'accéder à cette page.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="px-6 py-3 bg-[#e89b2b] text-white rounded-xl font-bold hover:bg-[#cf8726]"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-purple-600">
                {editingAccount ? <><Edit size={20} className="inline-block mr-2" /> Modifier</> : <><Plus size={20} className="inline-block mr-2" /> Créer</>}
              </h2>
              <button onClick={closeAccountModal} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block font-bold mb-2 text-sm">Email *</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                  disabled={editingAccount}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none ${editingAccount ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-purple-500'}`}
                  placeholder="client@example.com"
                />
                {editingAccount && <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>}
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">
                  Mot de passe {editingAccount ? '(vide = pas de changement)' : '*'}
                </label>
                 className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                {!editingAccount && <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>}
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">Nom complet *</label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#E3A750] outline-none"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">Téléphone *</label>
                <input
                  type="tel"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-[#E3A750] outline-none"
                  placeholder="+213 555 123 456"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">Adresse *</label>
                <input
                  type="text"
                  value={accountForm.address}
                  onChange={(e) => setAccountForm({...accountForm, address: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Tlemcen, Imama"
                />
              </div>
            </div>
              
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveAccount}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
              >
                {editingAccount ? <><Save size={20} className="inline-block mr-2" /> Enregistrer</> : <><Plus size={20} className="inline-block mr-2" /> Créer</>}
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
      )}

      <div className="bg-white shadow sticky top-0 z-40">
        <div className="flex justify-between items-center p-4">
          <img src="/logo.png" alt="BS EXPRESS" className="h-12" />
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="w-11 h-11 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600">
              <Store size={24} />
            </button>
            <button onClick={handleLogout} className="w-11 h-11 bg-[#E0161E] text-white rounded-xl flex items-center justify-center hover:bg-[#E0161E]">
              <Power size={24} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-0">
        <div className="md:relative fixed bottom-0 left-0 right-0 bg-white p-4 z-50 shadow-lg flex justify-around md:justify-start md:gap-2 md:mb-6 md:overflow-x-auto md:pb-2">
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="flex-1 flex items-center justify-center gap-2 md:flex-none md:px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 md:whitespace-nowrap shadow"
          >
            <Package size={20} />
            <span className="hidden md:inline">Commandes</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-products')} 
            className="flex-1 flex items-center justify-center gap-2 md:flex-none md:px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 md:whitespace-nowrap shadow"
          >
            <ShoppingBag size={20} />
            <span className="hidden md:inline">Produits</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 md:flex-none md:px-5 py-3 bg-purple-600 text-white rounded-xl font-bold md:whitespace-nowrap shadow-lg">
            <Users size={20} />
            <span className="hidden md:inline">Comptes</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black"><Users size={24} className="inline-block mr-2" /> {accounts.length} comptes</h2>
          <button 
            onClick={() => openAccountModal()}
            className="w-12 h-12 bg-gradient-to-r from-[#E3A750] to-[#E3A750] text-white rounded-xl flex items-center justify-center hover:shadow-lg transition active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4"><Users size={64} /></div>
            <p className="text-gray-500 font-bold text-lg mb-4">Aucun compte</p>
            <button 
              onClick={() => openAccountModal()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
            >
              Créer le premier
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div key={account.id} className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg truncate">{account.name}</h3>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                      <Mail size={12} />
                      {account.email}
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-3 mb-3 space-y-1">
                  <p className="text-sm flex items-center gap-2">
                    <Phone size={14} className="text-purple-600 flex-shrink-0" />
                    <span className="font-semibold truncate">{account.phone}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin size={14} className="text-purple-600 flex-shrink-0" />
                    <span className="truncate">{account.address}</span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openAccountModal(account)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#239186] text-white rounded-xl font-semibold hover:bg-[#239186] transition text-sm active:scale-95"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#E0161E] text-white rounded-xl font-semibold hover:bg-[#E0161E] transition text-sm active:scale-95"
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