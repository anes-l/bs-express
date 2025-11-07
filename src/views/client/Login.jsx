import React from 'react';

export default function Login({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loading,
  renderToasts,
}) {
  return (
    <>
      {renderToasts()}
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center px-5 py-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="BS EXPRESS" className="h-12" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Bienvenue</h1>
            <p className="text-gray-500 text-sm">Connectez-vous pour continuer</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition text-base"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition text-base"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 active:scale-[0.98] mt-6"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}