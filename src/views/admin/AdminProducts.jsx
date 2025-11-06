import React from 'react';
import { Plus, Edit2, Trash2, X, Ban, Edit, Save, ShoppingBag, Store, Power, Package, Users } from 'lucide-react';

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
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <Ban size={48} className="mx-auto mb-3 text-gray-400" />
          <h2 className="text-xl font-black mb-3">Accès refusé</h2>
          <p className="text-gray-600 mb-4 text-sm">Vous n'avez pas les permissions d'accéder à cette page.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="px-5 py-2.5 bg-[#E3A750] text-white rounded-lg font-bold hover:bg-[#cf8726] active:scale-95 transition text-sm"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-4 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b-2">
              <h2 className="text-lg font-black text-[#002F45] flex items-center gap-2">
                {editingProduct ? <><Edit size={18} /> Modifier</> : <><Plus size={18} /> Ajouter</>}
              </h2>
              <button 
                onClick={closeProductModal} 
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg active:scale-95 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1.5 text-sm">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2.5 border-2 rounded-lg focus:border-[#E3A750] outline-none text-base"
                  placeholder="Ex: Lait entier 1L"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-1.5 text-sm">Prix (DZD)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-3 py-2.5 border-2 rounded-lg focus:border-[#E3A750] outline-none text-base"
                  placeholder="150"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-1.5 text-sm">URL de l'image</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-3 py-2.5 border-2 rounded-lg focus:border-[#E3A750] outline-none text-base"
                  placeholder="https://..."
                />
                {productForm.image && (
                  <img 
                    src={productForm.image} 
                    alt="Aperçu" 
                    className="mt-2 w-full h-40 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>
              
            <div className="flex gap-2 mt-4 pt-3 border-t-2 sticky bottom-0 bg-white">
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-[#E3A750] text-white py-2.5 rounded-lg font-bold hover:bg-[#cf8726] active:scale-98 transition flex items-center justify-center gap-2 text-sm"
              >
                {editingProduct ? <><Save size={16} /> Enregistrer</> : <><Plus size={16} /> Ajouter</>}
              </button>
              <button
                onClick={closeProductModal}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 active:scale-98 transition text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
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
          <button 
            onClick={() => setCurrentPage('admin')} 
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-white text-gray-700 rounded-lg font-bold border-2 border-gray-200 active:scale-95 transition"
          >
            <Package size={18} />
            <span className="text-xs">Commandes</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 bg-[#002F45] text-white rounded-lg font-bold shadow-lg active:scale-95 transition">
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
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Package size={20} />
            {products.length} produits
          </h2>
          <button 
            onClick={() => openProductModal()}
            className="w-11 h-11 bg-[#E3A750] text-white rounded-lg flex items-center justify-center hover:bg-[#cf8726] active:scale-95 transition shadow-lg"
          >
            <Plus size={22} />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <Package size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 font-bold text-sm mb-3">Aucun produit</p>
            <button 
              onClick={() => openProductModal()}
              className="px-5 py-2.5 bg-[#002F45] text-white rounded-lg font-bold hover:bg-[#00283b] active:scale-95 transition text-sm"
            >
              Ajouter le premier
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-3">
                <div className="flex gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xl font-black text-[#002F45] mb-2">{product.price} DZD</p>
                    
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#239186] text-white rounded-lg font-semibold active:scale-95 transition text-xs"
                      >
                        <Edit2 size={14} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#e0161e] text-white rounded-lg font-semibold active:scale-95 transition text-xs"
                      >
                        <Trash2 size={14} />
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