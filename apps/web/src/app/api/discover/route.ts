import { NextResponse } from 'next/server';
import { detectKeyType } from '@vybot/discovery';

export const dynamic = 'force-static';

export async function POST(req: Request) {
  try {
    const { value, hint } = await req.json();
    if (!value) {
      return NextResponse.json({ error: 'value is required' }, { status: 400 });
    }
    const result = detectKeyType(value, hint);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Detection failed', details: String(err) }, { status: 500 });
  }
}
