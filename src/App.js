import React from 'react';
import { ShoppingCart, Plus, LogOut, User, Phone, MapPin } from 'lucide-react';
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const users = {
  admin: {
    username: 'admin',
    passwordHash: hashPassword('admin123'),
    name: 'BS EXPRESS Admin',
    phone: '+213 555 123 456',
    address: 'Tlemcen Centre',
    isAdmin: true
  },
  user: {
    username: 'user',
    passwordHash: hashPassword('user123'),
    name: 'Client Test',
    phone: '+213 666 789 012',
    address: 'Tlemcen, Imama',
    isAdmin: false
  }
};

const products = [
  { id: 1, name: 'Produit Premium 1', price: 2500, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { id: 2, name: 'Produit Exclusif 2', price: 3200, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { id: 3, name: 'Article de Luxe 3', price: 4100, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
  { id: 4, name: 'Collection Spéciale 4', price: 2800, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600' },
  { id: 5, name: 'Édition Limitée 5', price: 5500, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600' },
  { id: 6, name: 'Produit Tendance 6', price: 3900, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600' }
];

function App() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [user, setUser] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [loginUsername, setLoginUsername] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [checkoutName, setCheckoutName] = React.useState('');
  const [checkoutPhone, setCheckoutPhone] = React.useState('');
  const [checkoutAddress, setCheckoutAddress] = React.useState('');
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      console.log(`✅ Connexion Firebase OK. ${snapshot.size} commandes trouvées.`);
      
      const firebaseOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(firebaseOrders.reverse());
    } catch (error) {
      console.error('❌ ERREUR CRITIQUE DE CONNEXION FIREBASE/CHARGEMENT:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    if (!checkoutName || !checkoutPhone || !checkoutAddress) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Nettoyer les items pour Firebase (supprimer toute fonction ou données complexes)
    const cleanItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const newOrder = {
      orderNumber: 'CMD-' + Date.now(),
      clientName: checkoutName,
      clientPhone: checkoutPhone,
      clientAddress: checkoutAddress,
      items: cleanItems,
      total: getTotalPrice(),
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      status: 'En attente',
      userId: user?.username || 'guest'
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      console.log('✅ Commande créée avec ID:', docRef.id);
      alert('Commande confirmée! Numéro: ' + newOrder.orderNumber);
      setCart([]);
      setCheckoutName('');
      setCheckoutPhone('');
      setCheckoutAddress('');
      setCurrentPage('my-orders');
      await loadOrders(); 
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde Firebase:', error);
      alert('Erreur lors de la commande: ' + error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log('🔄 Tentative de mise à jour:', { orderId, newStatus, type: typeof orderId });
    
    // Vérifier que orderId est bien une chaîne
    if (!orderId || typeof orderId !== 'string') {
      console.error('❌ ID invalide:', orderId);
      alert('Erreur: ID de commande invalide');
      return;
    }

    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log('✅ Statut mis à jour avec succès:', orderId, '->', newStatus);
    } catch (error) {
      console.error("❌ Erreur de mise à jour Firebase:", error);
      console.error("Details:", error.message);
      console.error("Code d'erreur:", error.code);
      alert('Erreur lors de la mise à jour: ' + error.message);
      await loadOrders(); 
    }
  };

  React.useEffect(() => {
    if (currentPage === 'checkout' && user) {
      setCheckoutName(user.name);
      setCheckoutPhone(user.phone);
      setCheckoutAddress(user.address);
    }
  }, [currentPage, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Chargement...</div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">BS EXPRESS</h1>
            <p className="text-gray-500">Accédez à votre boutique</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:border-indigo-500"
              placeholder="Nom d'utilisateur"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const foundUser = Object.values(users).find(
                    u => u.username === loginUsername && u.passwordHash === hashPassword(loginPassword)
                  );
                  if (foundUser) {
                    setUser(foundUser);
                    setCurrentPage('shop');
                    setLoginUsername('');
                    setLoginPassword('');
                  } else {
                    alert('Identifiants incorrects');
                  }
                }
              }}
              className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:border-indigo-500"
              placeholder="Mot de passe"
            />
            <button
              onClick={() => {
                const foundUser = Object.values(users).find(
                  u => u.username === loginUsername && u.passwordHash === hashPassword(loginPassword)
                );
                if (foundUser) {
                  setUser(foundUser);
                  setCurrentPage('shop');
                  setLoginUsername('');
                  setLoginPassword('');
                } else {
                  alert('Identifiants incorrects');
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition"
            >
              Se connecter
            </button>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm">
            <p className="font-bold mb-2 text-gray-700">Comptes de test :</p>
            <p className="text-gray-600">👤 User: <span className="font-mono">user</span> / <span className="font-mono">user123</span></p>
            <p className="text-gray-600">🔧 Admin: <span className="font-mono">admin</span> / <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'shop') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg p-4 sticky top-0 z-50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-indigo-600">BS EXPRESS</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage('my-orders')} 
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                📦 Mes Commandes
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('admin')} 
                  className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
                >
                  🔧 Admin
                </button>
              )}
              <button 
                onClick={() => { setUser(null); setCurrentPage('login'); setCart([]) }} 
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
          
          <div className="mt-4 bg-indigo-100 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">🛒 Panier ({getTotalItems()})</h2>
              <div className="font-black text-indigo-600">{getTotalPrice()} DZD</div>
            </div>
            {cart.length > 0 && (
              <div>
                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white rounded p-2 text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-semibold">{item.name} x{item.quantity}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-200 rounded font-bold hover:bg-gray-300">−</button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-gray-200 rounded font-bold hover:bg-gray-300">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('checkout')} className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600 transition">
                  💳 Acheter
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-indigo-600 text-white p-4 rounded-xl">
            <p className="font-bold">👋 Bienvenue, {user?.name}!</p>
            <p className="text-sm text-indigo-200">{user?.isAdmin ? 'Compte Administrateur' : 'Compte Client'}</p>
          </div>
          
          <h2 className="text-3xl font-black mb-6">Nos Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition" onClick={() => addToCart(product)}>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-indigo-600">{product.price} DZD</p>
                    <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'checkout') {
    return (
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
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 outline-none"
                  placeholder="Votre nom..."
                />
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
              <button onClick={handleCheckout} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition">
                ✅ Confirmer la commande
              </button>
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
    );
  }

  if (currentPage === 'my-orders') {
    const userOrders = user?.isAdmin ? orders : orders.filter(o => o.userId === user?.username);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-black text-blue-600">📦 Mes Commandes</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600">
              Boutique
            </button>
            {user?.isAdmin && (
              <button onClick={() => setCurrentPage('admin')} className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600">
                🔧 Admin
              </button>
            )}
            <button onClick={() => { setUser(null); setCurrentPage('login'); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">
              Déconnexion
            </button>
          </div>
        </div>
        
        <div className="p-8">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-bold text-xl">Aucune commande pour le moment</p>
              <button 
                onClick={() => setCurrentPage('shop')} 
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                Commencer vos achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.date} à {order.time}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'Traitée' ? 'bg-green-100 text-green-700' : order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="font-bold text-lg">👤 {order.clientName}</p>
                    <p className="text-sm text-blue-600 font-semibold">📞 {order.clientPhone}</p>
                    <p className="text-sm text-blue-600">📍 {order.clientAddress}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-blue-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-2xl text-blue-600">{order.total} DZD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'admin') {
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
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-black text-purple-600">🔧 Panel Admin</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600">
              Boutique
            </button>
            <button onClick={() => { setUser(null); setCurrentPage('login'); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">
              Déconnexion
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <p className="text-sm mb-2 text-blue-100">Total Commandes</p>
              <p className="text-5xl font-black">{orders.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <p className="text-sm mb-2 text-green-100">Traitées</p>
              <p className="text-5xl font-black">{orders.filter(o => o.status === 'Traitée').length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <p className="text-sm mb-2 text-orange-100">En attente</p>
              <p className="text-5xl font-black">{orders.filter(o => o.status === 'En attente').length}</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-black mb-6">📦 Toutes les Commandes</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-bold text-xl">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.date} à {order.time}</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 outline-none cursor-pointer ${
                        order.status === 'Traitée' ? 'bg-green-100 text-green-700 border-green-300' : 
                        order.status === 'En cours' ? 'bg-blue-100 text-blue-700 border-blue-300' : 
                        'bg-orange-100 text-orange-700 border-orange-300'
                      }`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Traitée">Traitée</option>
                    </select>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="font-bold text-lg">👤 {order.clientName}</p>
                    <p className="text-sm text-purple-600 font-semibold">📞 {order.clientPhone}</p>
                    <p className="text-sm text-purple-600">📍 {order.clientAddress}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-purple-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-2xl text-purple-600">{order.total} DZD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;