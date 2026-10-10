'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = '/dashboard'; }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] to-[#0d0d1a] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-vybot-600 flex items-center justify-center font-bold">V</div>
            <span className="text-2xl font-bold">VyBot</span>
          </Link>
          <h1 className="text-2xl font-bold">Hesap Oluştur</h1>
          <p className="text-zinc-500 mt-2">Ücretsiz başla, sınırsız ölçekle</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Ad Soyad</label>
            <input type="text" className="input" placeholder="Ahmet Yılmaz" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
            <input type="email" className="input" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Şifre</label>
            <input type="password" className="input" placeholder="En az 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Oluşturuluyor...' : 'Ücretsiz Başla'}
          </button>
          <p className="text-xs text-zinc-600 text-center">Kayıt olarak Kullanım Şartlarını kabul edersiniz.</p>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Zaten hesabın var mı?{' '}<Link href="/login" className="text-vybot-400 hover:text-vybot-300">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
