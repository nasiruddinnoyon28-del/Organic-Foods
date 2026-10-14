import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, TabType, Language, AdminUser, OrderRecord } from '../types';
import { PRODUCTS } from '../data/products';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lang: Language;
  toggleLang: () => void;
  products: Product[];
  addNewProduct: (prod: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'popularScore'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: OrderRecord[];
  addOrder: (order: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: OrderRecord['items'];
    totalAmount: number;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  }) => OrderRecord;
  updateOrderStatus: (orderId: string, statusBn: OrderRecord['statusBn'], statusEn: OrderRecord['statusEn']) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  deliveryFee: number;
  couponCode: string;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCertModalOpen: boolean;
  setIsCertModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  navigateToCatalogWithCategory: (catId: string) => void;
  // Admin Features
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'OBD-1094',
    customerName: 'তানজিমুল হাসান',
    customerPhone: '01711223344',
    deliveryAddress: 'বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা',
    items: [
      {
        productNameBn: 'খাঁটি গাওয়া ঘি',
        productNameEn: 'Pure Artisanal Cow Ghee',
        quantity: 2,
        size: '500g',
        price: 950
      },
      {
        productNameBn: 'সুন্দরবনের প্রাকৃতিক মধু',
        productNameEn: 'Raw Sundarbans Wild Honey',
        quantity: 1,
        size: '500g',
        price: 720
      }
    ],
    totalAmount: 2620,
    paymentMethod: 'Cash on Delivery',
    statusBn: 'নতুন অর্ডার',
    statusEn: 'New Order',
    orderDate: '১৩ অক্টোবর ২০২৬, দুপুর ১২:৩০'
  },
  {
    id: 'OBD-1093',
    customerName: 'সাদিয়া রহমান',
    customerPhone: '01855667788',
    deliveryAddress: 'সেক্টর ৩, রোড ৯, উত্তরা, ঢাকা',
    items: [
      {
        productNameBn: 'ঘানি ভাঙা সরিষার তেল',
        productNameEn: 'Cold Pressed Mustard Oil',
        quantity: 1,
        size: '1 Litre',
        price: 340
      },
      {
        productNameBn: 'প্রাকৃতিক চিয়া সিড',
        productNameEn: 'Raw Superfood Chia Seeds',
        quantity: 1,
        size: '250g',
        price: 420
      }
    ],
    totalAmount: 760,
    paymentMethod: 'bKash',
    statusBn: 'ডেলিভারিতে আছে',
    statusEn: 'In Transit',
    orderDate: '১২ অক্টোবর ২০২৬, বিকাল ৪:১৫'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [lang, setLang] = useState<Language>('bn');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Products state with local persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('organic_bd_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('organic_bd_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Admin Auth state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('organic_bd_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('organic_bd_cart');
      if (saved) return JSON.parse(saved);
      const ghee = PRODUCTS[0];
      const honey = PRODUCTS[1];
      return [
        { product: ghee, quantity: 2, selectedSize: '500g' },
        { product: honey, quantity: 1, selectedSize: '500g' }
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('organic_bd_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1'];
    }
  });

  useEffect(() => {
    localStorage.setItem('organic_bd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('organic_bd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('organic_bd_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('organic_bd_admin');
    }
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem('organic_bd_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('organic_bd_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleLang = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Admin Login Logic
  const loginAdmin = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Valid demo admin accounts:
    // 1) admin@organicfoods.bd / admin123
    // 2) nasiruddinnoyon28@gmail.com / admin123 (matching user account)
    // 3) or any user with password 'admin123' / 'organic123'
    const isMasterAdmin =
      cleanEmail === 'admin@organicfoods.bd' ||
      cleanEmail === 'nasiruddinnoyon28@gmail.com' ||
      cleanEmail === 'admin@gmail.com';

    const isValidPassword =
      cleanPass === 'admin123' ||
      cleanPass === 'organic123' ||
      cleanPass === '123456' ||
      cleanPass.length >= 6;

    if (!cleanEmail.includes('@')) {
      return { success: false, error: lang === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Please provide a valid email address' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters' };
    }

    if (isValidPassword) {
      const user: AdminUser = {
        email: cleanEmail,
        name: cleanEmail === 'nasiruddinnoyon28@gmail.com' ? 'নাসির উদ্দিন নয়ন' : 'এডমিন ম্যানেজার',
        role: isMasterAdmin ? 'Super Admin' : 'Store Manager',
        lastLogin: new Date().toLocaleTimeString()
      };
      setAdminUser(user);
      setIsAdminModalOpen(false);
      showToast(lang === 'bn' ? `স্বাগতম, ${user.name}! এডমিন মোড চালু হয়েছে` : `Welcome, ${user.name}! Admin session active`);
      setActiveTab('admin-dashboard');
      return { success: true };
    } else {
      return { success: false, error: lang === 'bn' ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়' : 'Invalid email or password' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    if (activeTab === 'admin-dashboard') {
      setActiveTab('home');
    }
    showToast(lang === 'bn' ? 'এডমিন লগআউট সফল হয়েছে' : 'Admin logged out successfully');
  };

  // Add Product (Admin)
  const addNewProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'popularScore'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      popularScore: 90
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(lang === 'bn' ? `"${newProduct.nameBn}" পণ্যটি যুক্ত হয়েছে!` : `"${newProduct.nameEn}" added to catalog!`);
  };

  // Update Product (Admin)
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast(lang === 'bn' ? 'পণ্য আপডেট সম্পন্ন হয়েছে' : 'Product updated');
  };

  // Delete Product (Admin)
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(lang === 'bn' ? 'পণ্যটি মুছে ফেলা হয়েছে' : 'Product removed');
  };

  // Add Order
  const addOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: OrderRecord['items'];
    totalAmount: number;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  }): OrderRecord => {
    const newRecord: OrderRecord = {
      id: `OBD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      statusBn: 'নতুন অর্ডার',
      statusEn: 'New Order',
      orderDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setOrders(prev => [newRecord, ...prev]);
    return newRecord;
  };

  // Update Order Status (Admin)
  const updateOrderStatus = (
    orderId: string,
    statusBn: OrderRecord['statusBn'],
    statusEn: OrderRecord['statusEn']
  ) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, statusBn, statusEn } : o))
    );
    showToast(lang === 'bn' ? `অর্ডার ${orderId} স্ট্যাটাস আপডেট হয়েছে: ${statusBn}` : `Order ${orderId} status: ${statusEn}`);
  };

  const addToCart = (product: Product, quantity = 1, selectedSize = product.weight) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    showToast(lang === 'bn' ? `"${product.nameBn}" কার্টে যোগ হয়েছে!` : `"${product.nameEn}" added to cart!`);
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId: string, selectedSize: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast(lang === 'bn' ? 'ফেভারিট লিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast(lang === 'bn' ? 'ফেভারিট লিস্টে যুক্ত হয়েছে' : 'Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PUJA20' || clean === 'PUJO20' || clean === 'ORGANIC20' || clean === 'RAMADAN20') {
      setAppliedCoupon(clean);
      showToast(lang === 'bn' ? 'কুপন সফলভাবে প্রয়োগ হয়েছে! ২০% ছাড়' : 'Coupon applied! 20% discount');
      return true;
    } else {
      showToast(lang === 'bn' ? 'অবৈধ কুপন কোড' : 'Invalid coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast(lang === 'bn' ? 'কুপন সরানো হয়েছে' : 'Coupon removed');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? Math.round(cartSubtotal * 0.2) : 0;
  const deliveryFee = cartSubtotal >= 1500 || cartSubtotal === 0 ? 0 : 70;
  const cartTotal = cartSubtotal - cartDiscount + deliveryFee;

  const navigateToCatalogWithCategory = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('products-catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        lang,
        toggleLang,
        products,
        addNewProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrderStatus,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        deliveryFee,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        selectedProduct,
        setSelectedProduct,
        isCertModalOpen,
        setIsCertModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toastMessage,
        showToast,
        navigateToCatalogWithCategory,
        // Admin
        adminUser,
        isAdminLoggedIn: !!adminUser,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
