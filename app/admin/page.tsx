'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ShoppingBag, Plus, Trash2, ArrowRight, Video, Lock, CreditCard, Upload } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  description: string;
}

interface VideoItem {
  id: string;
  title: string;
  youtube_url: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State - Product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('1 كيلو');
  const [imageString, setImageString] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');

  // Form State - Video
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Payment Settings State
  const [vodafoneCash, setVodafoneCash] = useState('');
  const [instaPay, setInstaPay] = useState('');

  // تم تغيير كلمة المرور هنا
  const ADMIN_PASSWORD = '25102005a';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      alert('كلمة المرور غير صحيحة!');
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: vData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      
      const savedCash = localStorage.getItem('pob_vodafone_cash') || '';
      const savedInsta = localStorage.getItem('pob_instapay') || '';
      setVodafoneCash(savedCash);
      setInstaPay(savedInsta);

      if (pData) setProducts(pData);
      if (vData) setVideos(vData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pob_vodafone_cash', vodafoneCash);
    localStorage.setItem('pob_instapay', instaPay);
    alert('تم حفظ بيانات الدفع بنجاح! 💳');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageString(reader.result as string);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageString) {
      alert('يرجى اختيار صورة للمنتج من الجهاز أولاً.');
      return;
    }

    const { error } = await supabase.from('products').insert([
      { name, price: parseFloat(price), size, image: imageString, description }
    ]);

    if (!error) {
      setName(''); setPrice(''); setImageString(''); setImagePreview(''); setDescription('');
      fetchAdminData();
      alert('تم إضافة المنتج بنجاح! 🍯');
    } else {
      alert('حدث خطأ أثناء إضافة المنتج: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await supabase.from('products').delete().eq('id', id);
      fetchAdminData();
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('videos').insert([
      { title: videoTitle, youtube_url: youtubeUrl }
    ]);
    if (!error) {
      setVideoTitle(''); setYoutubeUrl('');
      fetchAdminData();
      alert('تم إضافة الفيديو بنجاح! 🎥');
    } else {
      alert('حدث خطأ في إضافة الفيديو');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      await supabase.from('videos').delete().eq('id', id);
      fetchAdminData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-amber-200 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-amber-950 mb-2">لوحة التحكم المحمية</h1>
            <p className="text-stone-500 text-xs sm:text-sm">يرجى إدخال كلمة المرور للوصول إلى إدارة المتجر</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              required
              className="w-full bg-amber-50/50 border border-amber-300 rounded-2xl px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3.5 rounded-2xl transition shadow-md"
            >
              دخول 🔓
            </button>
          </form>
          <div className="pt-2">
            <Link href="/" className="text-amber-700 text-xs font-bold hover:underline">
              العودة إلى الصفحة الرئيسية للمتجر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 text-stone-900 font-sans p-4 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-md">
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-amber-950">
            <ShoppingBag className="w-7 h-7 text-amber-700" />
            <span>لوحة تحكم متجر POB~Honey</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition border border-red-200">
              قفل الجلسة 🔒
            </button>
            <Link href="/" className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition">
              <ArrowRight className="w-4 h-4" />
              عرض المتجر 🍯
            </Link>
          </div>
        </div>

        {/* إعدادات وسائل الدفع */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-700" />
            إعدادات وسائل الدفع (تظهر للزبون عند الطلب) 💳
          </h2>
          <form onSubmit={handleSavePayments} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">رقم المحفظة (فودافون كاش)</label>
              <input type="text" placeholder="مثال: 01012345678" value={vodafoneCash} onChange={e => setVodafoneCash(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">حساب انستا باي (InstaPay)</label>
              <input type="text" placeholder="مثال: username@instapay" value={instaPay} onChange={e => setInstaPay(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white font-bold p-3 rounded-xl sm:col-span-2 transition text-sm">
              حفظ بيانات الدفع 💾
            </button>
          </form>
        </div>

        {/* 1. قسم إضافة منتج مع رفع الصورة محلياً */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-700" />
            إضافة منتج أو باقة عسل جديدة (اختر صورة من جهازك)
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">اسم المنتج أو الباقة</label>
              <input type="text" placeholder="مثال: عسل سدر ملكي" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">السعر (بالجنيه)</label>
              <input type="number" placeholder="مثال: 450" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">الحجم أو العبوة</label>
              <input type="text" placeholder="مثال: 1 كيلو / نصف كيلو" required value={size} onChange={e => setSize(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">صورة المنتج من الجهاز</label>
              <label className="w-full border border-dashed border-amber-300 bg-amber-50/30 hover:bg-amber-50 rounded-xl p-2.5 text-center cursor-pointer flex items-center justify-center gap-2 text-xs text-stone-700 transition">
                <Upload className="w-4 h-4 text-amber-700" />
                <span>اختر صورة المنتج</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            </div>

            {imagePreview && (
              <div className="sm:col-span-2 text-center">
                <p className="text-xs font-bold text-stone-500 mb-1">معاينة الصورة المختارة:</p>
                <img src={imagePreview} alt="Preview" className="h-28 mx-auto rounded-xl border border-amber-200 object-cover shadow-sm" />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">وصف المنتج</label>
              <textarea placeholder="وصف مختصر لفوائد العسل..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2} />
            </div>
            <button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white font-black p-3.5 rounded-xl sm:col-span-2 transition shadow-md text-sm sm:text-base">
              + حفظ وإضافة المنتج للمتجر
            </button>
          </form>
        </div>

        {/* 2. قسم إضافة فيديو يوتيوب */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-700" />
            إضافة فيديو توضيحي من يوتيوب 🎥
          </h2>
          <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">عنوان الفيديو</label>
              <input type="text" placeholder="مثال: جولة داخل مناحل العسل" required value={videoTitle} onChange={e => setVideoTitle(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">رابط يوتيوب الكامل (URL)</label>
              <input type="url" placeholder="https://www.youtube.com/watch?v=..." required value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white font-black p-3.5 rounded-xl sm:col-span-2 transition shadow-md text-sm sm:text-base">
              + إضافة الفيديو إلى المعرض
            </button>
          </form>
        </div>

        {/* 3. المنتجات الحالية */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950">المنتجات والباقات الحالية ({products.length})</h2>
          {loading ? (
            <p className="text-stone-500 text-sm">جاري التحميل...</p>
          ) : products.length === 0 ? (
            <p className="text-stone-500 text-sm bg-amber-50 p-4 rounded-xl">لا توجد منتجات مضافة حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-amber-50/30 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <img src={p.image} alt={p.name} className="h-36 w-full object-cover rounded-xl mb-3 border border-amber-100" />
                    <h3 className="font-bold text-stone-900">{p.name}</h3>
                    <p className="text-amber-800 font-black text-sm mt-1">{p.price} جنيه <span className="text-xs bg-amber-100 px-2 py-0.5 rounded-md text-amber-900 font-semibold mr-1">{p.size}</span></p>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="mt-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1">
                    <Trash2 className="w-4 h-4" /> حذف المنتج
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
