import React from 'react';
import { ShoppingCart, Plus, LogOut, User, Phone, MapPin } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [user, setUser] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [loginUsername, setLoginUsername] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [checkoutName, setCheckoutName] = React.useState('');
  const [checkoutPhone, setCheckoutPhone] = React.useState('');
  const [orders, setOrders] = React.useState([]);

  const products = [
    { id: 1, name: 'Produit Premium 1', price: 2500, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
    { id: 2, name: 'Produit Exclusif 2', price: 3200, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
    { id: 3, name: 'Article de Luxe 3', price: 4100, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
    { id: 4, name: 'Collection Spéciale 4', price: 2800, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600' },
    { id: 5, name: 'Édition Limitée 5', price: 5500, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600' },
    { id: 6, name: 'Produit Tendance 6', price: 3900, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600' }
  ];

  const defaultUser = {
    username: 'admin',
    password: 'admin123',
    name: 'BS EXPRESS Admin',
    phone: '+213 555 123 456',
    isAdmin: true
  };

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

  const handleCheckout = () => {
    if (!checkoutName || !checkoutPhone) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    const newOrder = {
      id: Date.now(),
      orderNumber: 'CMD-' + Date.now(),
      clientName: checkoutName,
      clientPhone: checkoutPhone,
      items: [...cart],
      total: getTotalPrice(),
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      status: 'En attente'
    };
    setOrders([newOrder, ...orders]);
    alert('Commande confirmée!');
    setCart([]);
    setCheckoutName('');
    setCheckoutPhone('');
    setCurrentPage('shop');
  };

  React.useEffect(() => {
    if (currentPage === 'checkout' && user) {
      setCheckoutName(user.name);
      setCheckoutPhone(user.phone);
    }
  }, [currentPage, user]);

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
              className="w-full px-4 py-3 border-2 rounded-xl outline-none"
              placeholder="admin"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl outline-none"
              placeholder="admin123"
            />
            <button
              onClick={() => {
                if (loginUsername === defaultUser.username && loginPassword === defaultUser.password) {
                  setUser(defaultUser);
                  setCurrentPage('shop');
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold"
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setUser(defaultUser);
                setCurrentPage('admin');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold"
            >
              🔧 Accès Admin
            </button>
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
              {user?.isAdmin && (
                <button onClick={() => setCurrentPage('admin')} className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold">
                  Admin
                </button>
              )}
              <button onClick={() => { setUser(null); setCurrentPage('login'); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold">
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
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-200 rounded font-bold">−</button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-gray-200 rounded font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('checkout')} className="w-full bg-green-500 text-white py-2 rounded font-bold">
                  💳 Acheter
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-3xl font-black mb-6">Nos Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition" onClick={() => addToCart(product)}>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-indigo-600">{product.price} DZD</p>
                    <button className="bg-indigo-600 text-white p-2 rounded-lg">+</button>
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
          <button onClick={() => setCurrentPage('shop')} className="mb-6 text-indigo-600 font-bold">← Retour</button>
          <h1 className="text-3xl font-black mb-6 text-indigo-600">Finaliser la commande</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Nom du magasin</label>
                <input
                  type="text"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="Superette..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl"
                  placeholder="+213..."
                />
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-bold text-blue-800">📍 Zone: Tlemcen</p>
              </div>
              <button onClick={handleCheckout} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg">
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

  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-black text-purple-600">🔧 Panel Admin</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage('shop')} className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold">
              Boutique
            </button>
            <button onClick={() => { setUser(null); setCurrentPage('login'); }} className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold">
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
          
          <h2 className="text-3xl font-black mb-6">📦 Commandes</h2>
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
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'Traitée' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="font-bold text-lg">👤 {order.clientName}</p>
                    <p className="text-sm text-purple-600 font-semibold">📞 {order.clientPhone}</p>
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