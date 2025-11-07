import React from 'react';
import { Plus, Edit2, Trash2, X, Phone, MapPin, Mail, Ban, Edit, Save, Users, Store, Power, Package, ShoppingBag, UserCircle } from 'lucide-react';

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
      {/* Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-5 max-w-lg w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-gray-100">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {editingAccount ? <><Edit size={22} /> Modifier compte</> : <><Plus size={22} /> Nouveau compte</>}
              </h2>
              <button 
                onClick={closeAccountModal} 
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl active:scale-90 transition-all"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Email *</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                  disabled={editingAccount}
                  className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition text-base ${
                    editingAccount ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500' : 'bg-gray-50 border-gray-200 focus:border-purple-500 focus:bg-white'
                  }`}
                  placeholder="client@example.com"
                />
                {editingAccount && <p className="text-xs text-gray-500 mt-2 ml-1">🔒 L'email ne peut pas être modifié</p>}
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">
                  Mot de passe {editingAccount ? '(vide = inchangé)' : '*'}
                </label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({...accountForm, password: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition text-base"
                  placeholder={editingAccount ? "Laisser vide pour conserver" : "Minimum 6 caractères"}
                />
                {!editingAccount && <p className="text-xs text-gray-500 mt-2 ml-1">🔑 Minimum 6 caractères</p>}
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Nom complet *</label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition text-base"
                  placeholder="Mohamed Ali"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Téléphone *</label>
                <input
                  type="tel"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition text-base"
                  placeholder="+213 555 123 456"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Adresse *</label>
                <input
                  type="text"
                  value={accountForm.address}
                  onChange={(e) => setAccountForm({...accountForm, address: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition text-base"
                  placeholder="Tlemcen, Imama"
                />
              </div>
            </div>
              
            <div className="flex gap-2 mt-5 pt-4 border-t-2 border-gray-100">
              <button
                onClick={handleSaveAccount}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {editingAccount ? <><Save size={18} /> Enregistrer</> : <><Plus size={18} /> Créer</>}
              </button>
              <button
                onClick={closeAccountModal}
                className="px-5 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-gray-100">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg text-gray-900">Gestion Comptes</h1>
              <p className="text-xs text-gray-500">{accounts.length} compte(s)</p>
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
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 active:scale-95 transition-all hover:border-blue-500"
          >
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
          <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
            <Users size={20} />
            <span className="text-xs">Comptes</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <UserCircle size={24} className="text-indigo-600" />
            Utilisateurs
          </h2>
          <button 
            onClick={() => openAccountModal()}
            className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-xl active:scale-95 transition-all shadow-lg"
          >
            <Plus size={26} />
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold text-base mb-2">Aucun compte</p>
            <p className="text-gray-400 text-sm mb-5">Commencez par créer un compte utilisateur</p>
            <button 
              onClick={() => openAccountModal()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all"
            >
              Créer un compte
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div key={account.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 hover:shadow-2xl transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg truncate text-gray-900">{account.name}</h3>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} />
                      {account.email}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-3 mb-3 space-y-2">
                  <p className="text-sm flex items-center gap-2 text-gray-900">
                    <Phone size={16} className="text-purple-600 flex-shrink-0" />
                    <span className="font-bold truncate">{account.phone}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2 text-gray-700">
                    <MapPin size={16} className="text-purple-600 flex-shrink-0" />
                    <span className="truncate">{account.address}</span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openAccountModal(account)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-bold active:scale-95 transition-all text-sm border-2 border-blue-200 hover:bg-blue-100"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition-all text-sm border-2 border-red-200 hover:bg-red-100"
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