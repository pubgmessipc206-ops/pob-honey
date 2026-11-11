'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ShoppingBag, Plus, Trash2, ArrowRight, Video } from 'lucide-react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State - Product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('1 كيلو');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // Form State - Video
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: vData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (pData) setProducts(pData);
      if (vData) setVideos(vData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([
      { name, price: parseFloat(price), size, image, description }
    ]);
    if (!error) {
      setName(''); setPrice(''); setImage(''); setDescription('');
      fetchAdminData();
      alert('تم إضافة المنتج بنجاح! 🍯');
    } else {
      alert('حدث خطأ في إضافة المنتج');
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

  return (
    <div className="min-h-screen bg-amber-50/30 text-stone-900 font-sans p-4 sm:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-md">
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-amber-950">
            <ShoppingBag className="w-7 h-7 text-amber-700" />
            <span>لوحة تحكم متجر POB~Honey</span>
          </div>
          <Link href="/" className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition">
            <ArrowRight className="w-4 h-4" />
            عرض المتجر 🍯
          </Link>
        </div>

        {/* 1. قسم إضافة منتج / باقة أسعار جديدة */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-700" />
            إضافة منتج أو باقة عسل جديدة
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">اسم المنتج أو البقة</label>
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
              <label className="block text-xs font-bold text-stone-700 mb-1">رابط صورة المنتج (URL)</label>
              <input type="url" placeholder="https://example.com/honey.jpg" required value={image} onChange={e => setImage(e.target.value)} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
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

        {/* 3. قائمة المنتجات الحالية */}
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

        {/* 4. قائمة الفيديوهات الحالية */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-amber-950">فيديوهات اليوتيوب المضافة ({videos.length})</h2>
          {videos.length === 0 ? (
            <p className="text-stone-500 text-sm bg-amber-50 p-4 rounded-xl">لا توجد فيديوهات مضافة حتى الآن.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map(v => (
                <div key={v.id} className="bg-amber-50/30 p-4 rounded-2xl border border-amber-200 flex justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-stone-500 text-xs truncate max-w-xs">{v.youtube_url}</p>
                  </div>
                  <button onClick={() => handleDeleteVideo(v.id)} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> حذف
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
