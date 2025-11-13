import React from 'react';
import Toasts from './components/Toasts';
import AdminOrders from './views/admin/AdminOrders';
import AdminProducts from './views/admin/AdminProducts';
import AdminAccounts from './views/admin/AdminAccounts';
import Login from './views/client/Login';
import Shop from './views/client/Shop';
import Checkout from './views/client/Checkout';
import MyOrders from './views/client/MyOrders';
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
      console.log('État auth changé:', firebaseUser?.uid);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        try {
          const userDoc = await getDoc(doc(db, "accounts", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() };
            setUser(userData);
            console.log('Utilisateur chargé:', userData);
            
            if (currentPage === 'login') {
              setCurrentPage('shop');
            }
          } else {
            console.log('Pas de données utilisateur dans Firestore');
            setUser(null);
            setCurrentPage('login');
          }
        } catch (error) {
          console.error('Erreur chargement user:', error);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setCurrentPage('login');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentPage]);

  const loadOrders = React.useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      console.log(`${snapshot.size} commandes trouvées.`);
      const firebaseOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(firebaseOrders.reverse());
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  }, []);

  const loadProducts = React.useCallback(async () => {
    try {
      console.log('Tentative de chargement des produits...');
      const snapshot = await getDocs(collection(db, "products"));
      console.log(`${snapshot.size} produits trouvés.`);
      const firebaseProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(firebaseProducts);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts([]);
    }
  }, []);

  const loadAccounts = React.useCallback(async () => {
    try {
      console.log('Tentative de chargement des comptes...');
      const snapshot = await getDocs(collection(db, "accounts"));
      console.log(`${snapshot.size} comptes trouvés dans Firebase.`);
      const firebaseAccounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(firebaseAccounts);
    } catch (error) {
      console.error('Erreur chargement comptes:', error);
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
      console.log('Tentative de connexion:', loginEmail);
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
      showToast('success', 'Connexion réussie !');
    } catch (error) {
      console.error('Erreur connexion:', error);
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
      console.error('Erreur déconnexion:', error);
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
      console.error('Erreur sauvegarde produit:', error);
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
      console.error('Erreur suppression produit:', error);
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
      console.error('Erreur sauvegarde compte:', error);
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
      console.error('Erreur suppression compte:', error);
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

const generateInvoice = async () => {
  const pdfDoc = new jsPDF();
  
  // Couleurs modernes
  const primaryBlue = [37, 99, 235];
  const darkGray = [31, 41, 55];
  const lightGray = [243, 244, 246];
  const mediumGray = [156, 163, 175];
  
  // Logo - Chargement depuis le dossier public
  const addImageToPdf = () => {
    return new Promise((resolve) => {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.src = `${window.location.origin}/logo.webp`;
      
      logo.onload = () => {
        try {
          // Créer un canvas pour convertir le webp
          const canvas = document.createElement('canvas');
          canvas.width = logo.width;
          canvas.height = logo.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(logo, 0, 0);
          
          // Convertir en dataURL (PNG pour compatibilité)
          const imgData = canvas.toDataURL('image/png');
          
          // Ajouter au PDF
          pdfDoc.addImage(imgData, 'PNG', 15, 10, 35, 35);
          resolve();
        } catch (error) {
          console.error('Erreur lors du chargement du logo:', error);
          resolve(); // Continue même si erreur
        }
      };
      
      logo.onerror = (error) => {
        console.error('Erreur de chargement du logo:', error);
        resolve(); // Continue sans logo
      };
    });
  };

  await addImageToPdf();
  
  // En-tête bleu
  pdfDoc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdfDoc.rect(0, 0, 210, 55, 'F');
  
  // Titre "FACTURE"
  pdfDoc.setTextColor(255, 255, 255);
  pdfDoc.setFontSize(28);
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.text('FACTURE', 145, 25);
  
  // Numéro et date
  const invoiceNumber = 'CMD-' + Date.now();
  pdfDoc.setFontSize(10);
  pdfDoc.setFont('helvetica', 'normal');
  pdfDoc.text('Numero: ' + invoiceNumber, 145, 35);
  pdfDoc.text('Date: ' + new Date().toLocaleDateString('fr-FR'), 145, 42);
  
  // Section client
  pdfDoc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  pdfDoc.roundedRect(15, 65, 180, 32, 3, 3, 'F');
  
  pdfDoc.setFontSize(9);
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  pdfDoc.text('CLIENT', 20, 72);
  
  pdfDoc.setFontSize(12);
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdfDoc.text(checkoutName, 20, 81);
  
  pdfDoc.setFontSize(9);
  pdfDoc.setFont('helvetica', 'normal');
  pdfDoc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  pdfDoc.text('Tel: ' + checkoutPhone, 20, 87);
  pdfDoc.text('Adresse: ' + checkoutAddress, 20, 93);
  
  // Tableau des articles
  const tableData = cart.map((item, index) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const total = price * quantity;
    
    return [
      String(index + 1),
      item.name,
      String(quantity),
      String(price) + ' DZD',
      String(total) + ' DZD'
    ];
  });
  
  autoTable(pdfDoc, {
    startY: 107,
    head: [['#', 'Article', 'Qte', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [darkGray[0], darkGray[1], darkGray[2]],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: [lightGray[0], lightGray[1], lightGray[2]],
      halign: 'left'
    },
    bodyStyles: {
      textColor: [darkGray[0], darkGray[1], darkGray[2]],
      fontSize: 9,
      cellPadding: 5,
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [lightGray[0], lightGray[1], lightGray[2]],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 80, halign: 'left' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 38, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 15, right: 15 }
  });
  
  // Total
  const finalY = pdfDoc.lastAutoTable.finalY + 8;
  const totalAmount = getTotalPrice();
  
  // Box pour le total
  pdfDoc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  pdfDoc.roundedRect(120, finalY, 75, 18, 3, 3, 'F');
  
  pdfDoc.setFontSize(12);
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.setTextColor(255, 255, 255);
  pdfDoc.text('TOTAL', 127, finalY + 7);
  
  pdfDoc.setFontSize(16);
  pdfDoc.text(String(totalAmount) + ' DZD', 188, finalY + 12, { align: 'right' });
  
  // Pied de page
  const pageHeight = pdfDoc.internal.pageSize.height;
  
  pdfDoc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  pdfDoc.setLineWidth(0.3);
  pdfDoc.line(15, pageHeight - 30, 195, pageHeight - 30);
  
  pdfDoc.setFontSize(10);
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  pdfDoc.text('Merci pour votre confiance !', 105, pageHeight - 22, { align: 'center' });
  
  pdfDoc.setFontSize(8);
  pdfDoc.setFont('helvetica', 'normal');
  pdfDoc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  pdfDoc.text('BS EXPRESS - Zone de livraison: Tlemcen', 105, pageHeight - 16, { align: 'center' });
  pdfDoc.text('Cette facture est generee automatiquement', 105, pageHeight - 11, { align: 'center' });
  
  // Sauvegarde
  pdfDoc.save('facture-' + invoiceNumber + '.pdf');
  showToast('success', 'Facture telechargee avec succes !');
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
      console.error('Erreur lors de la sauvegarde Firebase:', error);
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
      console.error("Erreur de mise à jour Firebase:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    </div>
  );
}

  if (currentPage === 'login') {
    return (
      <Login
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        loading={loading}
        renderToasts={renderToasts}
      />
    );
  }

  if (currentPage === 'shop') {
    return (
      <Shop
        user={user}
        products={products}
        cart={cart}
        renderToasts={renderToasts}
        handleLogout={handleLogout}
        setCurrentPage={setCurrentPage}
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
        updateQuantity={updateQuantity}
        addToCart={addToCart}
      />
    );
  }

  if (currentPage === 'checkout') {
    return (
      <Checkout
        cart={cart}
        renderToasts={renderToasts}
        setCurrentPage={setCurrentPage}
        checkoutName={checkoutName}
        checkoutPhone={checkoutPhone}
        setCheckoutPhone={setCheckoutPhone}
        checkoutAddress={checkoutAddress}
        setCheckoutAddress={setCheckoutAddress}
        generateInvoice={generateInvoice}
        handleCheckout={handleCheckout}
        getTotalPrice={getTotalPrice}
      />
    );
  }

  if (currentPage === 'my-orders') {
    return (
      <MyOrders
        user={user}
        orders={orders}
        firebaseUser={firebaseUser}
        renderToasts={renderToasts}
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
      />
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