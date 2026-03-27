'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ---- Minimal QR Code encoder (Version 1-6, Mode: Byte, ECC: L/M/Q/H) ----

const EC_LEVELS: Record<string, number> = { L: 0, M: 1, Q: 2, H: 3 };

// Capacity table: [version][ecLevel] = max bytes
const CAPACITY: number[][] = [
  [17, 14, 11, 7],     // v1
  [32, 26, 20, 14],    // v2
  [53, 42, 32, 24],    // v3
  [78, 62, 46, 34],    // v4
  [106, 84, 60, 44],   // v5
  [134, 106, 74, 58],  // v6
  [154, 122, 86, 64],  // v7
  [192, 152, 108, 84], // v8
  [230, 180, 130, 98], // v9
  [271, 213, 151, 119],// v10
];

// Error correction codewords per block: [version][ecLevel]
const EC_CODEWORDS: number[][] = [
  [7, 10, 13, 17],
  [10, 16, 22, 28],
  [15, 26, 18, 22],
  [20, 18, 26, 16],
  [26, 24, 18, 22],
  [18, 16, 24, 28],
  [20, 18, 18, 26],
  [24, 22, 22, 26],
  [30, 22, 20, 24],
  [18, 26, 24, 28],
];

// Number of blocks: [version][ecLevel]
const NUM_BLOCKS: number[][] = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 2, 2],
  [1, 2, 2, 4],
  [1, 2, 2, 2],
  [2, 4, 4, 4],
  [2, 4, 2, 4],
  [2, 2, 4, 4],
  [2, 3, 4, 4],
  [2, 4, 6, 6],
];

function getVersion(dataLen: number, ecLevel: number): number {
  for (let v = 0; v < CAPACITY.length; v++) {
    if (CAPACITY[v][ecLevel] >= dataLen) return v + 1;
  }
  return -1;
}

// GF(256) with polynomial 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGenPoly(nsym: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < nsym; i++) {
    const ng = new Uint8Array(g.length + 1);
    for (let j = 0; j < g.length; j++) {
      ng[j] ^= g[j];
      ng[j + 1] ^= gfMul(g[j], GF_EXP[i]);
    }
    g = ng;
  }
  return g;
}

function rsEncode(data: Uint8Array, nsym: number): Uint8Array {
  const gen = rsGenPoly(nsym);
  const out = new Uint8Array(data.length + nsym);
  out.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = out[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        out[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return out.slice(data.length);
}

function encodeData(text: string, ecLevel: number) {
  const dataBytes = new TextEncoder().encode(text);
  const version = getVersion(dataBytes.length, ecLevel);
  if (version < 0) throw new Error('Data too long');

  const vi = version - 1;
  const totalCodewords = CAPACITY[vi][ecLevel] + EC_CODEWORDS[vi][ecLevel] * NUM_BLOCKS[vi][ecLevel];

  // Build data stream: mode(4 bits) + count(8 bits for v1-9) + data + terminator + padding
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  pushBits(0b0100, 4); // Byte mode
  pushBits(dataBytes.length, version <= 9 ? 8 : 16);
  for (const b of dataBytes) pushBits(b, 8);

  const dataCodewords = CAPACITY[vi][ecLevel];
  const totalDataBits = dataCodewords * 8;

  // Terminator
  const termLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, termLen);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);

  // Pad codewords
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bits.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert to bytes
  const dataArr = new Uint8Array(dataCodewords);
  for (let i = 0; i < dataCodewords; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | (bits[i * 8 + b] || 0);
    dataArr[i] = byte;
  }

  // Split into blocks and generate EC
  const numBlocks = NUM_BLOCKS[vi][ecLevel];
  const ecPerBlock = EC_CODEWORDS[vi][ecLevel];
  const shortBlockLen = Math.floor(dataCodewords / numBlocks);
  const longBlocks = dataCodewords % numBlocks;

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let b = 0; b < numBlocks; b++) {
    const blockLen = shortBlockLen + (b >= numBlocks - longBlocks ? 1 : 0);
    const block = dataArr.slice(offset, offset + blockLen);
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, ecPerBlock));
    offset += blockLen;
  }

  // Interleave data blocks
  const result: number[] = [];
  const maxDataLen = shortBlockLen + (longBlocks > 0 ? 1 : 0);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  // Interleave EC blocks
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }

  return { version, codewords: result };
}

function createMatrix(version: number): { matrix: number[][]; size: number } {
  const size = 17 + version * 4;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(-1));

  // Finder patterns
  const placeFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r, cc = col + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const outer = r === 0 || r === 6 || c === 0 || c === 6;
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[rr][cc] = (outer || inner) ? 1 : 0;
        } else {
          matrix[rr][cc] = 0;
        }
      }
    }
  };

  placeFinderPattern(0, 0);
  placeFinderPattern(0, size - 7);
  placeFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === -1) matrix[6][i] = i % 2 === 0 ? 1 : 0;
    if (matrix[i][6] === -1) matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Dark module
  matrix[size - 8][8] = 1;

  // Alignment patterns (version >= 2)
  if (version >= 2) {
    const positions = getAlignmentPositions(version);
    for (const r of positions) {
      for (const c of positions) {
        if (matrix[r][c] !== -1) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const rr = r + dr, cc = c + dc;
            const border = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const center = dr === 0 && dc === 0;
            matrix[rr][cc] = (border || center) ? 1 : 0;
          }
        }
      }
    }
  }

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    if (matrix[8][i] === -1) matrix[8][i] = 0;
    if (matrix[i][8] === -1) matrix[i][8] = 0;
    if (matrix[8][size - 1 - i] === -1) matrix[8][size - 1 - i] = 0;
    if (matrix[size - 1 - i][8] === -1) matrix[size - 1 - i][8] = 0;
  }
  if (matrix[8][8] === -1) matrix[8][8] = 0;

  return { matrix, size };
}

function getAlignmentPositions(version: number): number[] {
  if (version <= 1) return [];
  const positions = [6];
  const last = 17 + version * 4 - 7;
  const count = Math.floor(version / 7) + 2;
  const step = Math.ceil((last - 6) / (count - 1));
  for (let i = 1; i < count; i++) {
    positions.push(6 + i * step);
  }
  positions[positions.length - 1] = last;
  return positions;
}

function placeData(matrix: number[][], size: number, codewords: number[]) {
  const bits: number[] = [];
  for (const cw of codewords) {
    for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
  }

  let bitIdx = 0;
  let upward = true;

  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const row of rows) {
      for (const c of [col, col - 1]) {
        if (c < 0 || c >= size) continue;
        if (matrix[row][c] !== -1) continue;
        matrix[row][c] = bitIdx < bits.length ? bits[bitIdx++] : 0;
      }
    }
    upward = !upward;
  }
}

function applyMask(matrix: number[][], size: number, maskNum: number): number[][] {
  const masked = matrix.map(row => [...row]);
  const maskFn = (r: number, c: number) => {
    switch (maskNum) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return (r * c) % 2 + (r * c) % 3 === 0;
      case 6: return ((r * c) % 2 + (r * c) % 3) % 2 === 0;
      case 7: return ((r + c) % 2 + (r * c) % 3) % 2 === 0;
      default: return false;
    }
  };

  // Create a reserved mask
  const reserved = createMatrix(Math.round((size - 17) / 4)).matrix;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c] !== -1) continue; // reserved area
      if (maskFn(r, c)) masked[r][c] ^= 1;
    }
  }
  return masked;
}

function placeFormatInfo(matrix: number[][], size: number, ecLevel: number, maskNum: number) {
  const FORMAT_INFOS = [
    0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
    0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0,
    0x355F, 0x3068, 0x3F31, 0x3A06, 0x24B4, 0x2183, 0x2EDA, 0x2BED,
    0x1689, 0x13BE, 0x1CE7, 0x19D0, 0x0762, 0x0255, 0x0D0C, 0x083B,
  ];

  const idx = ecLevel * 8 + maskNum;
  const fmt = FORMAT_INFOS[idx];

  // Horizontal
  const hPos = [0, 1, 2, 3, 4, 5, 7, 8, size - 8, size - 7, size - 6, size - 5, size - 4, size - 3, size - 2];
  for (let i = 0; i < 15; i++) {
    matrix[8][hPos[i]] = (fmt >> (14 - i)) & 1;
  }

  // Vertical
  const vPos = [size - 1, size - 2, size - 3, size - 4, size - 5, size - 6, size - 7, size - 8, 7, 5, 4, 3, 2, 1, 0];
  for (let i = 0; i < 15; i++) {
    matrix[vPos[i]][8] = (fmt >> (14 - i)) & 1;
  }
}

function generateQR(text: string, ecLevelStr: string): number[][] {
  const ecLevel = EC_LEVELS[ecLevelStr] ?? 0;
  const { version, codewords } = encodeData(text, ecLevel);
  const { matrix, size } = createMatrix(version);

  placeData(matrix, size, codewords);

  // Apply mask 0 (simplest for our implementation)
  const masked = applyMask(matrix, size, 0);
  placeFormatInfo(masked, size, ecLevel, 0);

  return masked;
}

export default function ToolClient() {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState('M');
  const [qrSize, setQrSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  const drawQR = useCallback(() => {
    if (!canvasRef.current || !text.trim()) return;
    setError('');

    try {
      const modules = generateQR(text, ecLevel);
      const moduleCount = modules.length;
      const canvas = canvasRef.current;
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d')!;

      const cellSize = qrSize / (moduleCount + 8); // quiet zone
      const offset = cellSize * 4;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, qrSize, qrSize);

      // Modules
      ctx.fillStyle = fgColor;
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (modules[r][c] === 1) {
            ctx.fillRect(
              offset + c * cellSize,
              offset + r * cellSize,
              cellSize + 0.5,
              cellSize + 0.5
            );
          }
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate QR code. Text may be too long.');
    }
  }, [text, fgColor, bgColor, ecLevel, qrSize]);

  useEffect(() => {
    if (text.trim()) drawQR();
  }, [text, fgColor, bgColor, ecLevel, qrSize, drawQR]);

  const downloadPNG = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter URL or Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://example.com"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foreground</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
            <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
            <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Error Correction</label>
          <select value={ecLevel} onChange={e => setEcLevel(e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm">
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
          <select value={qrSize} onChange={e => setQrSize(Number(e.target.value))} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm">
            <option value="128">128</option>
            <option value="256">256</option>
            <option value="512">512</option>
            <option value="1024">1024</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* QR Code Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white inline-block">
          <canvas
            ref={canvasRef}
            width={qrSize}
            height={qrSize}
            className="max-w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {text.trim() && (
          <button
            onClick={downloadPNG}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Download PNG
          </button>
        )}

        {!text.trim() && (
          <p className="text-sm text-gray-400">Enter text or a URL above to generate a QR code</p>
        )}
      </div>
    </div>
  );
}
