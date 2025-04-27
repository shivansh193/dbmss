import { NextRequest, NextResponse } from 'next/server';
import { getCachedSearchResults, getCachedSearchSuggestions } from '@/lib/search';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const suggest = searchParams.get('suggest');
  if (!q) return new NextResponse('Missing search term', { status: 400 });
  try {
    if (suggest) {
      const suggestions = await getCachedSearchSuggestions(q);
      // Convert any BigInt in suggestions to string for JSON response
      function convertBigIntToString(obj: any): any {
        if (Array.isArray(obj)) return obj.map(convertBigIntToString);
        if (obj && typeof obj === 'object') {
          const out: any = {};
          for (const k in obj) {
            const v = obj[k];
            out[k] = typeof v === 'bigint' ? v.toString() : convertBigIntToString(v);
          }
          return out;
        }
        return obj;
      }
      return NextResponse.json({ suggestions: convertBigIntToString(suggestions) });
    } else {
      const results = await getCachedSearchResults(q);
      // Convert any BigInt in results to string for JSON response
      function convertBigIntToString(obj: any): any {
        if (Array.isArray(obj)) return obj.map(convertBigIntToString);
        if (obj && typeof obj === 'object') {
          const out: any = {};
          for (const k in obj) {
            const v = obj[k];
            out[k] = typeof v === 'bigint' ? v.toString() : convertBigIntToString(v);
          }
          return out;
        }
        return obj;
      }
      return NextResponse.json({ results: convertBigIntToString(results) });
    }
  } catch (error: any) {
    console.error('Search API error:', error);
    return new NextResponse('Search failed', { status: 500 });
  }
}
