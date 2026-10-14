import { Category, Testimonial } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ghee',
    nameBn: 'খাঁটি ঘি',
    nameEn: 'Bilona Ghee',
    subtitleBn: 'গাওয়া ও মহিষের বিলোনা ঘি',
    subtitleEn: 'Desi Cow & Bilona Ghee',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGJZ6T82ZtbpixasguVBa34UhR1GztWvGlswCTaEsv12AT0yR_WyskEh86sdRPBTeXYeHMgULwKk1g7DERqOVypG9zx4qt339inRMWSH6ADSS4prSXUBHFCQBAhxjB9ZwEB9JvhOHwqnF-W1ooPqRFJFyf6rG6W4RGFa4xmbBVHbe5ZXGrukqjXxjAYk0hFwcGjL-8gmSIbsEbM3H3SZANO_vKI_D5lNurD1mUcnAkIz17G7kBdlU',
    itemCount: 4
  },
  {
    id: 'honey',
    nameBn: 'সুন্দরবনের মধু',
    nameEn: 'Wild Honey',
    subtitleBn: 'খলিসা ও তুলসী ফুল মধু',
    subtitleEn: 'Raw Mangrove Nectar',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNxoD--DscKzTMjYhEfntY4Ur2PZ_UUHAv1D5dKzU4Ufb4t3wWo4thKgO0igKD02tTjD1V1sLHwDmZhDEZlKerHeTJqytxXu_WeyPXdWjq3YPr13KSelsVkbVEefhs7rYwbcHzeKSbs2V2CVZ9iPebQyPHW5PJWCOYzexrnrH1z1yy38mMxOLrgaeE_mo1v7rwG4b__ShCiRY3OI1NtDwPPbx-aXr4rxgKjMB7cbnAe1SZb2en-iU',
    itemCount: 6
  },
  {
    id: 'oil',
    nameBn: 'ঘানি সরিষার তেল',
    nameEn: 'Mustard Oil',
    subtitleBn: 'কাঠের ঘানি ভাঙা প্রথম চাপ',
    subtitleEn: 'Wood Pressed Oils',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxcHILdmO_X6eSpBzaHsVY5RHUA3qc9tG98jtSAgfy6r4lHKT1BgkPJeSx7gKhO_W032EzqfPlQk9W7zDfzua4azLGYP-KX2oRqh-I89YF2_9oevBGC9QNV4OP-XWewjtftrk3vHpndd3tCvhpVpw5Tv6w5Hr7meNlkFGGXpVs0BdJ8UlP7oGCeOsr7mpUpZJJCaA2M1-jTCQbtFm-X3jqKy3LuredQLfkRljJQMCYnHhEVFCSe7E',
    itemCount: 7
  },
  {
    id: 'oil',
    nameBn: 'অলিভ অয়েল',
    nameEn: 'Olive Oil',
    subtitleBn: 'এক্সট্রা ভার্জিন স্প্যানিশ তেল',
    subtitleEn: 'Extra Virgin Olive Oil',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6xTHc2i8bZOZ0mjy7VaSbnEpKuyARcIFkDTa03GYNOgCS7USx0RDwTtltEVchh2tbhWDfbGdyGJPrDqajpSI6O--zgUt0C8Fsct_qxm7VHR_-fVC7uarI-Q1uPHjcf_gXpNQp63odBUpaqPQGPkbb9F79PGxhyoyV40p_f-lQq-h9i772lZVVu2ssngU1I0ECZmF0YitdVAblHfrWfCpVWK-ALAJdkr6LxHbb1bJfEjqTNxCqx5Q',
    itemCount: 3
  },
  {
    id: 'spices',
    nameBn: 'কালোজিরা ও মসলা',
    nameEn: 'Spices & Oil',
    subtitleBn: 'কালোজিরা, হলুদ ও জাফরান',
    subtitleEn: 'Hill Spices & Seed Oils',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxkBgq00V06YS4Agu5dvTH_J2s5SOPT66oR_UD-V-unF-Huup2ka1b7c6qwZ2tJ98ahfTZcc_r67hh8gEqEcZ6avz36WA_eVYzK2HaJVRerC1VsBKVcMLA0_10AFjiZpHr8jPltUXjkMfa7t3LNY977eP-aXh1OLmmR4R9vW5i3ucyQvjIPsNeV2FZUHFItcI4fcwinOLpDJBJs-mKnqg9GMZZCFqLYvSmkoCmQ5vKHTY5Bs8IMyo',
    itemCount: 9
  },
  {
    id: 'grains',
    nameBn: 'দেশি চাল ও ডাল',
    nameEn: 'Rice & Lentils',
    subtitleBn: 'নাজিরশাইল, লাল আটা ও ডাল',
    subtitleEn: 'Heritage Grains & Pulses',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4BD9uqNqMgUz-qyXGBGpqf4IhBPsq-7Lo-_toZTvbgzQjGXcNhHphvj3A5eiGoVcJ2W-4105V1hm_uhB_FBT7-nrlz_b7RXjpX0SUONg08XqmtZy4XogppNb4gfNWA9p3tf2Yb0E0cHYy7EC2h6-Efx4NKLtkhSjYYhgIuYtXkqvrxaS-RUzxsbgVwaga0gFDRiF3T_yxdXVlh8ks2yoXZvuehJGl3ZhsKLRQBl_zeodDj-PTI98',
    itemCount: 8
  },
  {
    id: 'dry-fruits',
    nameBn: 'বাদাম ও বীজ',
    nameEn: 'Nuts & Seeds',
    subtitleBn: 'কাজু, পেস্তা ও চিয়া সিড',
    subtitleEn: 'Dry Fruits & Super Seeds',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2jVJnxcH-aQiZ4Zs0-O7q00O5GUmo3MFJUiXgP5trqkJIw0ZyL9gC3I_R_caFFeNpTVuOBeZzIMuQGQl9eKSR0KZHNeWgjAwCPuj3o6bVjuMKnsXzcaJ_URx_cG3d8LzTAZ2TdffobU90BJjAoPaDTiXcx1b-1cbIdo5mm0uH0QfSVOh8YFPHPODo6B1Niw6EEd1ssuIA83jni_Bg2W6iUEwpyvRm8r5g3keF5vOUvp8dki_nUgI',
    itemCount: 7
  },
  {
    id: 'dry-fruits',
    nameBn: 'খেজুর ও ফ্রুটস',
    nameEn: 'Dates & Fruits',
    subtitleBn: 'আজওয়া ও মরিয়ম খেজুর',
    subtitleEn: 'Ajwa & Medjool Dates',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb93jJorQYYJBnsCHJ4x9QoSvo-DKcJ-HEjP6pCkaaSuon4wKUo7VwKmaH1FBz6YYBrPuP2K0FnO_ijGqPINJykGd_qDMN-IRjV540Bi9ccUwHux8-fvnaEPKs4WtoVRVhy7NmFrWiYOfmXSWfFqp5KVvEEOjCGd_Q0jwESQUzuxnQoQCWo-WblSaQB6bGBKemaGVmDZMv6Qnr6cMZORAk1OxLWEZA5r0PhMmpxvGPJB0KnrDJ-Zw',
    itemCount: 5
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    nameBn: 'তানজিমুল হাসান',
    nameEn: 'Tanjimul Hasan',
    initials: 'তান',
    locationBn: 'ধানমন্ডি, ঢাকা • ভেরিফাইড ক্রেতা',
    locationEn: 'Dhanmondi, Dhaka • Verified Buyer',
    rating: 5,
    commentBn: '"গাওয়া ঘিয়ের ঘ্রাণটা অসাধারণ! একদম ছোটবেলায় গ্রামের বাড়ির তৈরি ঘির স্বাদ পেলাম। কোয়ালিটিতে কোনো আপোষ নেই।"',
    commentEn: '"The aroma of the cow ghee is marvelous! Reminds me of the pure handmade ghee from our ancestral village. No compromise in quality."',
    verified: true
  },
  {
    id: 'test-2',
    nameBn: 'সাদিয়া রহমান',
    nameEn: 'Sadia Rahman',
    initials: 'সা',
    locationBn: 'উত্তরা, ঢাকা • ভেরিফাইড ক্রেতা',
    locationEn: 'Uttara, Dhaka • Verified Buyer',
    rating: 5,
    commentBn: '"সুন্দরবনের খলিসা মধু অনেকদিন পর আসলটা পেলাম। মধুর ঘনত্ব ও প্রাকৃতিক স্বাদ ১০০% খাঁটি।"',
    commentEn: '"Finally found genuine Sundarbans Khalisha flower raw honey after years. Natural viscosity and taste is 100% genuine."',
    verified: true
  },
  {
    id: 'test-3',
    nameBn: 'মোঃ আশরাফুল',
    nameEn: 'Md. Ashraful',
    initials: 'মো',
    locationBn: 'সিলেট সদর • ভেরিফাইড ক্রেতা',
    locationEn: 'Sylhet Sadar • Verified Buyer',
    rating: 5,
    commentBn: '"কাঠের ঘানির সরিষার তেল ঝাঁঝ ও স্বাদে অতুলনীয়। পরিবারের সবাই খুব খুশি। WhatsApp এ খুব সহজে অর্ডার করা যায়।"',
    commentEn: '"The wood-pressed mustard oil has unmatched pungency and flavor. Ordering on WhatsApp is delightfully seamless."',
    verified: true
  },
  {
    id: 'test-4',
    nameBn: 'মাহমুদা খাতুন',
    nameEn: 'Mahmuda Khatun',
    initials: 'মাহ',
    locationBn: 'জিইসি মোড়, চট্টগ্রাম • ভেরিফাইড ক্রেতা',
    locationEn: 'GEC Circle, Chittagong • Verified Buyer',
    rating: 5,
    commentBn: '"চিয়া সিড এবং কালোজিরা তেল রেগুলার নিচ্ছি। প্যাকেজিং চমৎকার এবং ক্যাশ অন ডেলিভারিতে চেক করে পেমেন্ট করেছি।"',
    commentEn: '"Regular consumer of chia seeds and black seed oil. Eco packaging is great and Cash on Delivery allowed me to verify before paying."',
    verified: true
  }
];
