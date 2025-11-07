import React from 'react';
import { Plus, Edit2, Trash2, X, Ban, Edit, Save, ShoppingBag, Store, Power, Package, Users, Sparkles } from 'lucide-react';

export default function AdminProducts({
  user,
  products,
  showProductModal,
  editingProduct,
  productForm,
  setCurrentPage,
  openProductModal,
  closeProductModal,
  setProductForm,
  handleSaveProduct,
  handleDeleteProduct,
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
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-5">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] p-5 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3 border-b-2 border-gray-100">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {editingProduct ? <><Edit size={22} /> Modifier produit</> : <><Plus size={22} /> Nouveau produit</>}
              </h2>
              <button 
                onClick={closeProductModal} 
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl active:scale-90 transition-all"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition text-base"
                  placeholder="Ex: Lait entier 1L"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">Prix (DZD)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition text-base"
                  placeholder="150"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm text-gray-700">URL de l'image</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition text-base"
                  placeholder="https://..."
                />
                {productForm.image && (
                  <img 
                    src={productForm.image} 
                    alt="Aperçu" 
                    className="mt-3 w-full h-48 object-cover rounded-2xl shadow-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>
              
            <div className="flex gap-2 mt-5 pt-4 border-t-2 border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {editingProduct ? <><Save size={18} /> Enregistrer</> : <><Plus size={18} /> Ajouter</>}
              </button>
              <button
                onClick={closeProductModal}
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg text-gray-900">Gestion Produits</h1>
              <p className="text-xs text-gray-500">{products.length} produit(s)</p>
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
          <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles size={24} className="text-orange-500" />
            Catalogue
          </h2>
          <button 
            onClick={() => openProductModal()}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-xl active:scale-95 transition-all shadow-lg"
          >
            <Plus size={26} />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold text-base mb-2">Aucun produit</p>
            <p className="text-gray-400 text-sm mb-5">Commencez par ajouter votre premier produit</p>
            <button 
              onClick={() => openProductModal()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl active:scale-95 transition-all"
            >
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 hover:shadow-2xl transition-all">
                <div className="flex gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 text-gray-900">{product.name}</h3>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full inline-block mb-3">
                      <p className="text-lg font-black">{product.price} DZD</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-bold active:scale-95 transition-all text-sm border-2 border-blue-200 hover:bg-blue-100"
                      >
                        <Edit2 size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition-all text-sm border-2 border-red-200 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}