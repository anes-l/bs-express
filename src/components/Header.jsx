import React from 'react';
import { Package, Wrench, Power, ArrowLeft } from 'lucide-react';

export default function Header({ user, handleLogout, setCurrentPage, currentPage }) {
  const showBackButton = ['checkout', 'my-orders'].includes(currentPage);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100">
        <div className="flex justify-between items-center p-4">
          {showBackButton ? (
            <button 
              onClick={() => setCurrentPage('shop')} 
              className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 active:scale-95 transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <ArrowLeft size={20} />
              </div>
              <span>Retour</span>
            </button>
          ) : (
            <img src="/logo.webp" alt="BS EXPRESS" className="h-12 object-contain" />
          )}
          <div className="flex gap-2">
            {!showBackButton && !user?.isAdmin && (
              <button
                onClick={() => setCurrentPage('my-orders')}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
              >
                <Package size={22} />
              </button>
            )}
            {!showBackButton && user?.isAdmin && (
              currentPage.startsWith('admin') ? (
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
                >
                  <Package size={22} />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
                >
                  <Wrench size={22} />
                </button>
              )
            )}
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
            >
              <Power size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
