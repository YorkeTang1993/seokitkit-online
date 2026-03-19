import Link from 'next/link';
import { tools, categories } from '@/lib/tools';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Page not found. The tool you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-12"
      >
        Back to Home
      </Link>

      <div className="text-left mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(0, 6).map(tool => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-gray-900">{tool.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{tool.description.slice(0, 80)}...</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-left mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/#${cat.id}`}
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
