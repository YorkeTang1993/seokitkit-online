import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function Header() {
  const { brand, categories } = siteConfig;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          {brand.text}<span className="text-blue-600">{brand.accent}</span>{brand.suffix}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          {categories.map(cat => (
            <Link key={cat.id} href={`/#${cat.id}`} className="hover:text-gray-900">{cat.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
