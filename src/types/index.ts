export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  subtitleEn: string;
  category: 'ghee' | 'honey' | 'oil' | 'grains' | 'spices' | 'dry-fruits';
  price: number;
  originalPrice: number;
  weight: string;
  availableSizes?: string[];
  imageUrl: string;
  altText: string;
  discountBadgeBn?: string;
  discountBadgeEn?: string;
  stockStatusBn: string;
  stockStatusEn: string;
  rating: number;
  reviewsCount: number;
  popularScore: number;
  descriptionBn: string;
  descriptionEn: string;
  benefitsBn: string[];
  benefitsEn: string[];
  originBn: string;
  originEn: string;
  labCertified: boolean;
  featured?: boolean;
}

export interface Category {
  id: 'all' | 'ghee' | 'honey' | 'oil' | 'grains' | 'spices' | 'dry-fruits';
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Testimonial {
  id: string;
  nameBn: string;
  nameEn: string;
  initials: string;
  locationBn: string;
  locationEn: string;
  rating: number;
  commentBn: string;
  commentEn: string;
  verified: boolean;
}

export type TabType = 'home' | 'products-catalog' | 'categories' | 'whatsapp-order' | 'account' | 'admin-dashboard';

export type Language = 'bn' | 'en';

export interface AdminUser {
  email: string;
  name: string;
  role: 'Super Admin' | 'Store Manager';
  lastLogin: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productNameBn: string;
    productNameEn: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  statusBn: 'নতুন অর্ডার' | 'প্রসেসিং' | 'ডেলিভারিতে আছে' | 'সম্পন্ন' | 'বাতিল';
  statusEn: 'New Order' | 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  orderDate: string;
}

