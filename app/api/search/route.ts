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
      return NextResponse.json({ suggestions });
    } else {
      const results = await getCachedSearchResults(q);
      return NextResponse.json({ results });
    }
  } catch (error: any) {
    return new NextResponse('Search failed', { status: 500 });
  }
}
