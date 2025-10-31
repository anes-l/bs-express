import React from 'react';
import { ShoppingCart, Plus, LogOut, User, Phone, MapPin, Edit2, Trash2, X, Users, FileText } from 'lucide-react';
import Toasts from './components/Toasts';
import AdminOrders from './views/AdminOrders';
import AdminProducts from './views/AdminProducts';
import AdminAccounts from './views/AdminAccounts';
import { db, auth } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [user, setUser] = React.useState(null);
  const [firebaseUser, setFirebaseUser] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [loginEmail, setLoginEmail] = React.useState('');
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
    email: '',
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

  // Écouter les changements d'authentification Firebase
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 État auth changé:', firebaseUser?.uid);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        try {
          const userDoc = await getDoc(doc(db, "accounts", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() };
            setUser(userData);
            console.log('✅ Utilisateur chargé:', userData);
            
            if (currentPage === 'login') {
              setCurrentPage('shop');
            }
          } else {
            console.log('❌ Pas de données utilisateur dans Firestore');
            setUser(null);
            setCurrentPage('login');
          }
        } catch (error) {
          console.error('❌ Erreur chargement user:', error);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setCurrentPage('login');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      setAccounts([]);
    }
  }, []);

  React.useEffect(() => {
    if (firebaseUser) {
      const loadData = async () => {
        await Promise.all([loadOrders(), loadProducts(), loadAccounts()]);
      };
      loadData();
    }
  }, [firebaseUser, loadOrders, loadProducts, loadAccounts]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Tentative de connexion:', loginEmail);
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
      showToast('success', 'Connexion réussie !');
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      if (error.code === 'auth/invalid-credential') {
        showToast('error', 'Email ou mot de passe incorrect');
      } else if (error.code === 'auth/user-not-found') {
        showToast('error', 'Utilisateur non trouvé');
      } else if (error.code === 'auth/wrong-password') {
        showToast('error', 'Mot de passe incorrect');
      } else {
        showToast('error', 'Erreur de connexion: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCart([]);
      setCurrentPage('login');
      showToast('success', 'Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      showToast('error', 'Erreur lors de la déconnexion');
    }
  };

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

    try {
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
        showToast('success', 'Produit modifié avec succès !');
      } else {
        await addDoc(collection(db, "products"), productData);
        showToast('success', 'Produit ajouté avec succès !');
      }
      await loadProducts();
      closeProductModal();
    } catch (error) {
      console.error('❌ Erreur sauvegarde produit:', error);
      showToast('error', 'Erreur: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
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
        email: account.email || '',
        password: '',
        name: account.name,
        phone: account.phone,
        address: account.address
      });
    } else {
      setEditingAccount(null);
      setAccountForm({ email: '', password: '', name: '', phone: '', address: '' });
    }
    setShowAccountModal(true);
  };

  const closeAccountModal = () => {
    setShowAccountModal(false);
    setEditingAccount(null);
    setAccountForm({ email: '', password: '', name: '', phone: '', address: '' });
  };

  const handleSaveAccount = async () => {
    if (!accountForm.email || !accountForm.name || !accountForm.phone || !accountForm.address) {
      showToast('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!editingAccount && !accountForm.password) {
      showToast('error', 'Le mot de passe est obligatoire pour un nouveau compte');
      return;
    }

    const accountData = {
      email: accountForm.email,
      name: accountForm.name,
      phone: accountForm.phone,
      address: accountForm.address,
      isAdmin: false
    };

    try {
      if (editingAccount) {
        // Modification d'un compte existant
        await updateDoc(doc(db, "accounts", editingAccount.id), accountData);
        showToast('success', 'Compte modifié avec succès !');
      } else {
        // Création d'un nouveau compte
        const existingAccount = accounts.find(a => a.email === accountForm.email);
        if (existingAccount) {
          showToast('error', 'Cet email existe déjà !');
          return;
        }
        
        // Créer le compte dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, accountForm.email, accountForm.password);
        const uid = userCredential.user.uid;
        
        // Créer le document dans Firestore avec l'UID comme ID
        await setDoc(doc(db, "accounts", uid), accountData);
        
        showToast('success', 'Compte créé avec succès !');
      }
      await loadAccounts();
      closeAccountModal();
    } catch (error) {
      console.error('❌ Erreur sauvegarde compte:', error);
      if (error.code === 'auth/email-already-in-use') {
        showToast('error', 'Cet email est déjà utilisé !');
      } else if (error.code === 'auth/weak-password') {
        showToast('error', 'Le mot de passe doit contenir au moins 6 caractères');
      } else {
        showToast('error', 'Erreur: ' + error.message);
      }
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, "accounts", accountId));
      showToast('success', 'Compte supprimé avec succès !');
      await loadAccounts();
    } catch (error) {
      console.error('❌ Erreur suppression compte:', error);
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

  const generateInvoice = () => {
    const pdfDoc = new jsPDF();
    
    pdfDoc.setFontSize(24);
    pdfDoc.setTextColor(99, 102, 241);
    pdfDoc.text('BS EXPRESS', 105, 20, { align: 'center' });
    
    pdfDoc.setFontSize(14);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.text('FACTURE', 105, 30, { align: 'center' });
    
    pdfDoc.setFontSize(10);
    pdfDoc.text('Client:', 20, 45);
    pdfDoc.setFontSize(12);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.text(checkoutName, 20, 52);
    
    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.setFontSize(10);
    pdfDoc.text(`Téléphone: ${checkoutPhone}`, 20, 58);
    pdfDoc.text(`Adresse: ${checkoutAddress}`, 20, 64);
    
    const invoiceNumber = 'CMD-' + Date.now();
    pdfDoc.text(`Numéro: ${invoiceNumber}`, 140, 45);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 140, 51);
    
    const tableData = cart.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `${item.price} DZD`,
      `${item.price * item.quantity} DZD`
    ]);
    
    autoTable(pdfDoc, {
      startY: 70,
      head: [['#', 'Produit', 'Qté', 'Prix unit.', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      margin: { left: 20, right: 20 }
    });
    
    const finalY = pdfDoc.lastAutoTable.finalY + 10;
    pdfDoc.setFontSize(12);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.text(`TOTAL: ${getTotalPrice()} DZD`, 150, finalY, { align: 'right' });
    
    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(100, 100, 100);
    pdfDoc.text('Merci pour votre achat !', 105, 280, { align: 'center' });
    pdfDoc.text('Zone de livraison: Tlemcen', 105, 285, { align: 'center' });
    
    pdfDoc.save(`facture-${invoiceNumber}.pdf`);
    showToast('success', 'Facture générée avec succès !');
  };

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
      status: 'En cours',
      userId: user?.id || firebaseUser?.uid || 'guest'
    };

    try {
      await addDoc(collection(db, "orders"), newOrder);
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
    if (!orderId || typeof orderId !== 'string') {
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
    } catch (error) {
      console.error("❌ Erreur de mise à jour Firebase:", error);
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

  if (currentPage === 'shop') {
    return (
      <>
        {renderToasts()}
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg sticky top-0 z-50">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-black text-indigo-600">BS EXPRESS</h1>
            <div className="flex gap-2">
              {!user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('my-orders')} 
                  className="w-11 h-11 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition"
                >
                  📦
                </button>
              )}
              {user?.isAdmin && (
                <button 
                  onClick={() => setCurrentPage('admin')} 
                  className="w-11 h-11 bg-purple-500 text-white rounded-xl flex items-center justify-center hover:bg-purple-600 transition"
                >
                  🔧
                </button>
              )}
              <button 
                onClick={handleLogout} 
                className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition"
              >
                ⏻
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-indigo-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">🛒 Panier ({getTotalItems()})</h2>
              <div className="font-black text-indigo-600 text-xl">{getTotalPrice()} DZD</div>
            </div>
            {cart.length > 0 && (
              <div>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white rounded-xl p-3 shadow">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 flex items-center justify-center">−</button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('checkout')} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg">
                  💳 Passer commande
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="font-bold text-lg">👋 Bienvenue, {user?.name}!</p>
            <p className="text-sm text-indigo-100 mt-1">{user?.isAdmin ? 'Compte Administrateur' : 'Compte Client'}</p>
          </div>
          
          <h2 className="text-2xl font-black mb-4">🛍️ Nos Produits</h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-bold text-lg">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden active:scale-95 transition" onClick={() => addToCart(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-black text-indigo-600">{product.price} DZD</p>
                      <button className="w-9 h-9 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center text-xl">+</button>
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

  if (currentPage === 'my-orders') {
    const userOrders = user?.isAdmin ? orders : orders.filter(o => o.userId === user?.id || o.userId === firebaseUser?.uid);
    
    return (
      <>
        {renderToasts()}
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow sticky top-0 z-50">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-black text-blue-600">📦 Commandes</h1>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage('shop')} className="w-11 h-11 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600">
                🏪
              </button>
              {user?.isAdmin && (
                <button onClick={() => setCurrentPage('admin')} className="w-11 h-11 bg-purple-500 text-white rounded-xl flex items-center justify-center hover:bg-purple-600">
                  🔧
                </button>
              )}
              <button onClick={handleLogout} className="w-11 h-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600">
                ⏻
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg mt-8">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-bold text-lg mb-4">Aucune commande</p>
              <button 
                onClick={() => setCurrentPage('shop')} 
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                Commencer vos achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg">{order.orderNumber}</h3>
                      <p className="text-xs text-gray-600">{order.date} · {order.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Traitée' ? 'bg-green-100 text-green-700' : order.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <p className="font-bold">👤 {order.clientName}</p>
                    <p className="text-xs text-blue-600 font-semibold">📞 {order.clientPhone}</p>
                    <p className="text-xs text-blue-600">📍 {order.clientAddress}</p>
                  </div>
                  <div className="space-y-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">{item.price * item.quantity} DZD</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                    <span className="font-black">Total</span>
                    <span className="font-black text-xl text-blue-600">{order.total} DZD</span>
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
          handleLogout={handleLogout}
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
          handleLogout={handleLogout}
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
          handleLogout={handleLogout}
        />
      </>
    );
  }

  return null;
}

export default App;