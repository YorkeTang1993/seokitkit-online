import { NextResponse } from 'next/server';
import { getAllUrls, submitToIndexNow } from '@/lib/indexnow';

export async function GET() {
  const urls = getAllUrls();
  const result = await submitToIndexNow(urls);

  return NextResponse.json({
    submitted: urls.length,
    urls,
    result,
  });
}
