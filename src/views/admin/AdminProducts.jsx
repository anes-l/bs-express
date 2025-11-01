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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-purple-600">
                {editingProduct ? '✏️ Modifier' : '➕ Ajouter'}
              </h2>
              <button onClick={closeProductModal} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block font-bold mb-2 text-sm">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: Montre élégante"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">Prix (DZD)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none"
                  placeholder="Ex: 2500"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-sm">URL de l'image</label>
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
      )}

      <div className="bg-white shadow sticky top-0 z-40">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-black text-purple-600">🛍️ Produits</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="w-11 h-11 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600">
              🏪
            </button>
            <button onClick={handleLogout} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600">
              ⏻
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 whitespace-nowrap shadow"
          >
            📦 Commandes
          </button>
          <button className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold whitespace-nowrap shadow-lg">
            🛍️ Produits
          </button>
          <button 
            onClick={() => setCurrentPage('admin-accounts')} 
            className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 whitespace-nowrap shadow"
          >
            👥 Comptes
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black">📦 {products.length} produits</h2>
          <button 
            onClick={() => openProductModal()}
            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 font-bold text-lg mb-4">Aucun produit</p>
            <button 
              onClick={() => openProductModal()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
            >
              Ajouter le premier
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-4">
                <div className="flex gap-4">
                  <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-black text-purple-600 mb-3">{product.price} DZD</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition text-sm active:scale-95"
                      >
                        <Edit2 size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition text-sm active:scale-95"
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