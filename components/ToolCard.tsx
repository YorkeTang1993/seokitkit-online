import Link from 'next/link';
import { Tool } from '@/lib/tools';

const categoryIcons: Record<string, string> = {
  converter: '⇄',
  generator: '⚡',
  formatter: '{ }',
  utility: '#',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg font-mono text-blue-600 bg-blue-50 rounded px-2 py-1">
          {categoryIcons[tool.category] || '~'}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{tool.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
