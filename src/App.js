import React from 'react';
import { ShoppingCart, Plus, LogOut, User, Phone, MapPin, Edit2, Trash2, X, Users } from 'lucide-react';
import Toasts from './components/Toasts';
import AdminOrders from './views/AdminOrders';
import AdminProducts from './views/AdminProducts';
import AdminAccounts from './views/AdminAccounts';
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

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
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const [showProductModal, setShowProductModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [productForm, setProductForm] = React.useState({
    name: '',
    price: '',
    image: ''
  });
  const [showCompletedOrders, setShowCompletedOrders] = React.useState(false);
  
  const [accounts, setAccounts] = React.useState([]);
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState(null);
  const [accountForm, setAccountForm] = React.useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });

  // Toasts
  const [toasts, setToasts] = React.useState([]);
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  const showToast = (type, message, duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
    window.setTimeout(() => removeToast(id), duration);
  };
  const renderToasts = () => <Toasts toasts={toasts} />;

  const loadOrders = React.useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      console.log(`✅ ${snapshot.size} commandes trouvées.`);
      const firebaseOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(firebaseOrders.reverse());
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
    }
  }, []);

  const loadProducts = React.useCallback(async () => {
    try {
      console.log('🔍 Tentative de chargement des produits...');
      const snapshot = await getDocs(collection(db, "products"));
      console.log(`✅ ${snapshot.size} produits trouvés.`);
      const firebaseProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(firebaseProducts);
    } catch (error) {
      console.error('❌ Erreur chargement produits:', error);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      setProducts([]);
    }
  }, []);

  const loadAccounts = React.useCallback(async () => {
    try {
      console.log('🔍 Tentative de chargement des comptes...');
      const snapshot = await getDocs(collection(db, "accounts"));
      console.log(`✅ ${snapshot.size} comptes trouvés dans Firebase.`);
      const firebaseAccounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(firebaseAccounts);
    } catch (error) {
      console.error('❌ Erreur chargement comptes:', error);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      setAccounts([]);
    }
  }, []);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadOrders(), loadProducts(), loadAccounts()]);
      setLoading(false);
    };
    loadData();
  }, [loadOrders, loadProducts, loadAccounts]);

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', price: '', image: '' });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({ name: '', price: '', image: '' });
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.image) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      image: productForm.image
    };

    console.log('💾 Tentative de sauvegarde produit:', productData);

    try {
      if (editingProduct) {
        console.log('📝 Modification du produit:', editingProduct.id);
        await updateDoc(doc(db, "products", editingProduct.id), productData);
        console.log('✅ Produit modifié');
        showToast('success', 'Produit modifié avec succès !');
      } else {
        console.log('➕ Ajout nouveau produit');
        const docRef = await addDoc(collection(db, "products"), productData);
        console.log('✅ Produit ajouté avec ID:', docRef.id);
        showToast('success', 'Produit ajouté avec succès !');
      }
      await loadProducts();
      closeProductModal();
    } catch (error) {
      console.error('❌ Erreur sauvegarde produit:', error);
      console.error('Code erreur:', error.code);
      console.error('Message:', error.message);
      showToast('error', 'Erreur: ' + error.message + '\nVérifiez les règles Firestore.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      console.log('✅ Produit supprimé');
      showToast('success', 'Produit supprimé avec succès !');
      await loadProducts();
    } catch (error) {
      console.error('❌ Erreur suppression produit:', error);
      showToast('error', 'Erreur: ' + error.message);
    }
  };

  const openAccountModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setAccountForm({
        username: account.username,
        password: '',
        name: account.name,
        phone: account.phone,
        address: account.address
      });
    } else {
      setEditingAccount(null);
      setAccountForm({ username: '', password: '', name: '', phone: '', address: '' });
    }
    setShowAccountModal(true);
  };

  const closeAccountModal = () => {
    setShowAccountModal(false);
    setEditingAccount(null);
    setAccountForm({ username: '', password: '', name: '', phone: '', address: '' });
  };

  const handleSaveAccount = async () => {
    if (!accountForm.username || !accountForm.name || !accountForm.phone || !accountForm.address) {
      showToast('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!editingAccount && !accountForm.password) {
      showToast('error', 'Le mot de passe est obligatoire pour un nouveau compte');
      return;
    }

    const accountData = {
      username: accountForm.username,
      name: accountForm.name,
      phone: accountForm.phone,
      address: accountForm.address,
      isAdmin: false
    };

    if (accountForm.password) {
      accountData.passwordHash = hashPassword(accountForm.password);
    }

    console.log('💾 Tentative de sauvegarde compte:', accountData);

    try {
      if (editingAccount) {
        console.log('📝 Modification du compte:', editingAccount.id);
        await updateDoc(doc(db, "accounts", editingAccount.id), accountData);
        console.log('✅ Compte modifié dans Firebase');
        showToast('success', 'Compte modifié avec succès !');
      } else {
        const existingAccount = accounts.find(a => a.username === accountForm.username);
        if (existingAccount) {
          showToast('error', 'Ce nom d\'utilisateur existe déjà !');
          return;
        }
        
        console.log('➕ Ajout nouveau compte');
        const docRef = await addDoc(collection(db, "accounts"), accountData);
        console.log('✅ Compte créé dans Firebase avec ID:', docRef.id);
        showToast('success', 'Compte créé avec succès !');
      }
      await loadAccounts();
      closeAccountModal();
    } catch (error) {
      console.error('❌ Erreur sauvegarde compte:', error);
      console.error('Code erreur:', error.code);
      console.error('Message:', error.message);
      showToast('error', 'Erreur: ' + error.message + '\nVérifiez les règles Firestore.');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      return;
    }

    try {
      console.log('🗑️ Suppression du compte:', accountId);
      await deleteDoc(doc(db, "accounts", accountId));
      console.log('✅ Compte supprimé de Firebase');
      showToast('success', 'Compte supprimé avec succès !');
      await loadAccounts();
    } catch (error) {
      console.error('❌ Erreur suppression compte:', error);
      console.error('Code erreur:', error.code);
      console.error('Message:', error.message);
      showToast('error', 'Erreur: ' + error.message);
    }
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

  const handleCheckout = async () => {
    if (!checkoutName || !checkoutPhone || !checkoutAddress) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }

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
      showToast('success', 'Commande confirmée ! Numéro: ' + newOrder.orderNumber);
      setCart([]);
      setCheckoutName('');
      setCheckoutPhone('');
      setCheckoutAddress('');
      setCurrentPage('my-orders');
      await loadOrders(); 
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde Firebase:', error);
      showToast('error', 'Erreur lors de la commande: ' + error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log('🔄 Tentative de mise à jour:', { orderId, newStatus, type: typeof orderId });
    
    if (!orderId || typeof orderId !== 'string') {
      console.error('❌ ID invalide:', orderId);
      showToast('error', 'Erreur: ID de commande invalide');
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
      showToast('error', 'Erreur lors de la mise à jour: ' + error.message);
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
      <>
        {renderToasts()}
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
                  const foundFirebaseAccount = accounts.find(
                    a => a.username === loginUsername && a.passwordHash === hashPassword(loginPassword)
                  );
                  
                  const finalUser = foundUser || foundFirebaseAccount;
                  
                  if (finalUser) {
                    setUser(finalUser);
                    setCurrentPage('shop');
                    setLoginUsername('');
                    setLoginPassword('');
                    showToast('success', 'Connexion réussie');
                  } else {
                    showToast('error', 'Identifiants incorrects');
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
                const foundFirebaseAccount = accounts.find(
                  a => a.username === loginUsername && a.passwordHash === hashPassword(loginPassword)
                );
                
                const finalUser = foundUser || foundFirebaseAccount;
                
                if (finalUser) {
                  setUser(finalUser);
                  setCurrentPage('shop');
                  setLoginUsername('');
                  setLoginPassword('');
                  showToast('success', 'Connexion réussie');
                } else {
                  showToast('error', 'Identifiants incorrects');
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
      </>
    );
  }

  if (currentPage === 'shop') {
    return (
      <>
        {renderToasts()}
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg p-4 sticky top-0 z-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <h1 className="text-2xl font-black text-indigo-600">BS EXPRESS</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => setCurrentPage('my-orders')} 
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-600 transition whitespace-nowrap"
              >
                📦 Commandes
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('admin')} 
                  className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-purple-600 transition whitespace-nowrap"
                >
                  🔧 Admin
                </button>
              )}
              <button 
                onClick={() => { setUser(null); setCurrentPage('login'); setCart([]) }} 
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-red-600 transition whitespace-nowrap"
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
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-bold text-xl">Aucun produit disponible</p>
            </div>
          ) : (
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
          )}
        </div>
        </div>
      </>
    );
  }

  if (currentPage === 'checkout') {
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
      </>
    );
  }

  if (currentPage === 'my-orders') {
    const userOrders = user?.isAdmin ? orders : orders.filter(o => o.userId === user?.username);
    
    return (
      <>
        {renderToasts()}
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sticky top-0 z-50">
          <h1 className="text-xl sm:text-2xl font-black text-blue-600">📦 Mes Commandes</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setCurrentPage('shop')} className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-600 whitespace-nowrap">
              Boutique
            </button>
            {user?.isAdmin && (
              <button onClick={() => setCurrentPage('admin')} className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-purple-600 whitespace-nowrap">
                🔧 Admin
              </button>
            )}
            <button onClick={() => { setUser(null); setCurrentPage('login'); }} className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-red-600 whitespace-nowrap">
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
      </>
    );
  }

  if (currentPage === 'admin') {
    return (
      <>
        {renderToasts()}
        <AdminOrders 
          user={user}
          orders={orders}
          showCompletedOrders={showCompletedOrders}
          setShowCompletedOrders={setShowCompletedOrders}
          setCurrentPage={setCurrentPage}
          updateOrderStatus={updateOrderStatus}
        />
      </>
    );
  }

  if (currentPage === 'admin-products') {
    return (
      <>
        {renderToasts()}
        <AdminProducts
          user={user}
          products={products}
          showProductModal={showProductModal}
          editingProduct={editingProduct}
          productForm={productForm}
          setCurrentPage={setCurrentPage}
          openProductModal={openProductModal}
          closeProductModal={closeProductModal}
          setProductForm={setProductForm}
          handleSaveProduct={handleSaveProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </>
    );
  }

  if (currentPage === 'admin-accounts') {
    return (
      <>
        {renderToasts()}
        <AdminAccounts
          user={user}
          accounts={accounts}
          showAccountModal={showAccountModal}
          editingAccount={editingAccount}
          accountForm={accountForm}
          setCurrentPage={setCurrentPage}
          openAccountModal={openAccountModal}
          closeAccountModal={closeAccountModal}
          setAccountForm={setAccountForm}
          handleSaveAccount={handleSaveAccount}
          handleDeleteAccount={handleDeleteAccount}
        />
      </>
    );
  }

  return null;
}

export default App;