import React from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

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
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-purple-600">
                {editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
              </h2>
              <button onClick={closeProductModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: Montre élégante"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Prix (DZD)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: 2500"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">URL de l'image</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="https://exemple.com/image.jpg"
                />
                {productForm.image && (
                  <img 
                    src={productForm.image} 
                    alt="Aperçu" 
                    className="mt-3 w-full h-48 object-cover rounded-xl"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
                >
                  {editingProduct ? '💾 Enregistrer' : '➕ Ajouter'}
                </button>
                <button
                  onClick={closeProductModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sticky top-0 z-40">
        <h1 className="text-xl sm:text-2xl font-black text-purple-600">🛍️ Gestion Produits</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setCurrentPage('shop')} className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-600 whitespace-nowrap">
            Boutique
          </button>
          <button onClick={handleLogout} className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-red-600 whitespace-nowrap">
            Déconnexion
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center sm:justify-start">
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="px-4 sm:px-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-300 whitespace-nowrap"
          >
            📦 Commandes
          </button>
          <button className="px-4 sm:px-6 py-3 bg-purple-600 text-white rounded-xl text-sm sm:text-base font-bold whitespace-nowrap">
            🛍️ Produits
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="px-4 sm:px-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-300 whitespace-nowrap"
          >
            👥 Comptes
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black">📦 Catalogue ({products.length})</h2>
          <button 
            onClick={() => openProductModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 font-bold text-xl mb-4">Aucun produit dans le catalogue</p>
            <button 
              onClick={() => openProductModal()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
            >
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-black text-purple-600 mb-4">{product.price} DZD</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openProductModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                      <Edit2 size={16} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
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