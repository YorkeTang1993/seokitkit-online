'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SIZES = [16, 32, 48, 180, 192, 512];

function drawFavicon(
  canvas: HTMLCanvasElement,
  text: string,
  bgColor: string,
  textColor: string,
  shape: 'circle' | 'square' | 'rounded',
  size: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  // Draw background shape
  ctx.fillStyle = bgColor;
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    const r = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, size, size);
  }

  // Draw text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = size * 0.55;
  ctx.font = `bold ${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif`;
  ctx.fillText(text, size / 2, size / 2 + size * 0.03);
}

export default function ToolClient() {
  const [text, setText] = useState('S');
  const [bgColor, setBgColor] = useState('#2563eb');
  const [textColor, setTextColor] = useState('#ffffff');
  const [shape, setShape] = useState<'circle' | 'square' | 'rounded'>('rounded');
  const [copied, setCopied] = useState(false);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  const setCanvasRef = useCallback((size: number) => (el: HTMLCanvasElement | null) => {
    if (el) {
      canvasRefs.current.set(size, el);
    } else {
      canvasRefs.current.delete(size);
    }
  }, []);

  useEffect(() => {
    canvasRefs.current.forEach((canvas, size) => {
      drawFavicon(canvas, text, bgColor, textColor, shape, size);
    });
  }, [text, bgColor, textColor, shape]);

  const htmlCode = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [htmlCode]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text / Emoji</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value.slice(0, 2))}
            maxLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
          <select
            value={shape}
            onChange={e => setShape(e.target.value as 'circle' | 'square' | 'rounded')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="rounded">Rounded Square</option>
          </select>
        </div>
      </div>

      {/* Preview grid */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Preview (all sizes)</h3>
        <div className="flex flex-wrap items-end gap-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          {SIZES.map(size => {
            const displaySize = Math.min(size, 128);
            return (
              <div key={size} className="flex flex-col items-center gap-2">
                <canvas
                  ref={setCanvasRef(size)}
                  width={size}
                  height={size}
                  style={{ width: displaySize, height: displaySize }}
                  className="border border-gray-200 rounded"
                />
                <span className="text-xs text-gray-500">{size}x{size}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser tab preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Browser Tab Preview</h3>
        <div className="bg-gray-200 rounded-t-lg p-2 inline-flex items-center gap-2 max-w-xs">
          <canvas
            ref={el => {
              if (el) drawFavicon(el, text, bgColor, textColor, shape, 16);
            }}
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <span className="text-xs text-gray-700 truncate">My Website Title</span>
          <span className="text-gray-400 text-xs ml-auto">x</span>
        </div>
      </div>

      {/* HTML code */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">HTML Link Tags</label>
          <button onClick={copyHtml} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
        <pre className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
          {htmlCode}
        </pre>
      </div>
    </div>
  );
}
