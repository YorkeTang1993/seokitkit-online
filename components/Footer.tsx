import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { categories } from '@/lib/tools';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand + trust text */}
          <div>
            <p className="font-semibold text-gray-900 mb-2">{siteConfig.name}</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Free, fast, and privacy-friendly online tools. All processing happens in your browser — your data never leaves your device.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="font-semibold text-gray-900 mb-2">Categories</p>
            <nav className="flex flex-col gap-1.5 text-sm">
              {categories.map(cat => (
                <Link key={cat.id} href={`/#${cat.id}`} className="text-gray-500 hover:text-gray-900">
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-gray-900 mb-2">Links</p>
            <nav className="flex flex-col gap-1.5 text-sm">
              <Link href="/about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link>
              <a href="https://github.com/YorkeTang1993/devtoolkit-online" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                GitHub
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
