import React from 'react';
import { FileText } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
          <button onClick={() => setCurrentPage('shop')} className="mb-6 text-indigo-600 font-bold hover:text-indigo-800">← Retour</button>
          <h1 className="text-3xl font-black mb-6 text-indigo-600">Finaliser la commande</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nom complet / Nom du magasin</label>
                <input
                  type="text"
                  value={checkoutName}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border-2 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
                  placeholder="Votre nom..."
                />
                <p className="text-xs text-gray-500 mt-1">Le nom ne peut pas être modifié</p>
              </div>
              <div>
                <label className="block font-bold mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 outline-none"
                  placeholder="+213..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Adresse de livraison</label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 outline-none"
                  placeholder="Adresse complète..."
                />
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-bold text-blue-800">📍 Zone: Tlemcen</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={generateInvoice} className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition">
                  <FileText size={20} />
                  Télécharger la facture PDF
                </button>
                <button onClick={handleCheckout} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition">
                  ✅ Confirmer la commande
                </button>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="font-black text-xl mb-4">📋 Résumé</h2>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">{item.price * item.quantity} DZD</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 mt-4 pt-4 flex justify-between font-black text-xl">
                <span>Total</span>
                <span className="text-indigo-600">{getTotalPrice()} DZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
