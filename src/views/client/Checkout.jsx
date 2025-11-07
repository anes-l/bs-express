import React from 'react';
import { FileText, ArrowLeft, MapPin, Check, ShoppingCart } from 'lucide-react';

export default function Checkout({
  cart,
  renderToasts,
  setCurrentPage,
  checkoutName,
  checkoutPhone,
  setCheckoutPhone,
  checkoutAddress,
  setCheckoutAddress,
  generateInvoice,
  handleCheckout,
  getTotalPrice,
}) {
  return (
    <>
      {renderToasts()}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
        <div className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 p-4 mb-5 border-b border-gray-100">
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowLeft size={20} />
            </div>
            <span>Retour</span>
          </button>
        </div>

        <div className="px-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mx-auto mb-3 flex items-center justify-center shadow-xl">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Finaliser la commande</h1>
            <p className="text-gray-500">Vérifiez vos informations</p>
          </div>
          
          <div className="space-y-4">
            {/* Formulaire */}
            <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
              <h2 className="font-black text-lg mb-4 text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                Informations
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700">Nom complet</label>
                  <input
                    type="text"
                    value={checkoutName}
                    readOnly
                    disabled
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed outline-none text-base"
                    placeholder="Votre nom..."
                  />
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">🔒 Non modifiable</p>
                </div>
                
                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition text-base"
                    placeholder="+213 555 123 456"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700">Adresse de livraison</label>
                  <input
                    type="text"
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition text-base"
                    placeholder="Adresse complète..."
                  />
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-sm">Zone de livraison</p>
                    <p className="text-blue-600 text-sm">Tlemcen uniquement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-5 shadow-xl text-white">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">🧾</span>
                </div>
                Résumé de commande
              </h2>
              <div className="space-y-2.5 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm bg-white/10 backdrop-blur rounded-2xl p-3">
                    <span className="truncate flex-1 mr-2 font-semibold">{item.name} ×{item.quantity}</span>
                    <span className="font-black whitespace-nowrap">{item.price * item.quantity} DZD</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 flex justify-between items-center">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-2xl">{getTotalPrice()} DZD</span>
              </div>
            </div>

            {/* Boutons */}
            <div className="space-y-3">
              <button 
                onClick={generateInvoice} 
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 active:scale-[0.98] transition-all text-base shadow-lg"
              >
                <FileText size={22} />
                Télécharger la facture
              </button>
              <button 
                onClick={handleCheckout} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={24} />
                Confirmer la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}