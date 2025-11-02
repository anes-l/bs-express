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
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="BS EXPRESS" className="h-16 mx-auto mb-2" />
            <p className="text-gray-500">Accédez à votre boutique</p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:border-indigo-500"
              placeholder="Email"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:border-indigo-500"
              placeholder="Mot de passe"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
