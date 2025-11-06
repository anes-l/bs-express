import React from 'react';
import { FileText, ArrowLeft, MapPin, Check, ClipboardList } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-white shadow-lg sticky top-0 z-50 p-3 mb-4">
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="text-[#002F45] font-bold hover:text-[#00283b] active:scale-95 transition flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
        </div>

        <div className="px-3">
          <img src="/logo.png" alt="BS EXPRESS" className="h-10 mb-4" />
          
          <div className="space-y-4">
            {/* Formulaire */}
            <div className="bg-white rounded-xl p-4 shadow-lg space-y-3">
              <h2 className="font-black text-lg flex items-center gap-2 mb-3">
                <ClipboardList size={20} />
                Informations
              </h2>
              
              <div>
                <label className="block font-bold mb-1.5 text-sm">Nom complet / Nom du magasin</label>
                <input
                  type="text"
                  value={checkoutName}
                  readOnly
                  disabled
                  className="w-full px-3 py-2.5 border-2 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed outline-none text-base"
                  placeholder="Votre nom..."
                />
                <p className="text-xs text-gray-500 mt-1">Le nom ne peut pas être modifié</p>
              </div>
              
              <div>
                <label className="block font-bold mb-1.5 text-sm">Téléphone</label>
                <input
                  type="tel"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 rounded-lg focus:border-[#E3A750] outline-none text-base"
                  placeholder="+213..."
                />
              </div>
              
              <div>
                <label className="block font-bold mb-1.5 text-sm">Adresse de livraison</label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 rounded-lg focus:border-[#E3A750] outline-none text-base"
                  placeholder="Adresse complète..."
                />
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-bold text-[#002F45] text-sm flex items-center gap-2">
                  <MapPin size={16} />
                  Zone: Tlemcen
                </p>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-indigo-50 rounded-xl p-4 shadow-lg">
              <h2 className="font-black text-lg mb-3 flex items-center gap-2">
                <ClipboardList size={20} />
                Résumé
              </h2>
              <div className="space-y-2 mb-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-bold whitespace-nowrap">{item.price * item.quantity} DZD</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 pt-3 flex justify-between font-black text-lg">
                <span className="text-[#239186]">Total</span>
                <span className="text-[#239186]">{getTotalPrice()} DZD</span>
              </div>
            </div>

            {/* Boutons */}
            <div className="space-y-2.5">
              <button 
                onClick={generateInvoice} 
                className="w-full flex items-center justify-center gap-2 bg-[#002F45] text-white py-3 rounded-lg font-bold hover:bg-[#00283b] active:scale-98 transition text-base"
              >
                <FileText size={20} />
                Télécharger la facture PDF
              </button>
              <button 
                onClick={handleCheckout} 
                className="w-full bg-[#239186] text-white py-3.5 rounded-lg font-bold text-base hover:bg-[#1f7e74] active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Confirmer la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}