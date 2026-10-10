import { NextResponse } from 'next/server';
import { encrypt } from '@vybot/crypto';

export async function POST(req: Request) {
  try {
    const { name, type, platform, value } = await req.json();
    if (!name || !value) {
      return NextResponse.json({ error: 'name and value are required' }, { status: 400 });
    }

    const masterKey = process.env.VYBOT_MASTER_KEY;
    if (!masterKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Encrypt the credential
    const encrypted = encrypt(value, masterKey);

    // TODO: Save to database via @vybot/db
    const connection = {
      id: crypto.randomUUID(),
      name,
      type: type ?? 'api_key',
      platform: platform ?? 'custom',
      encryptedCredentials: encrypted.ciphertext,
      credentialsIv: encrypted.iv,
      credentialsAuthTag: encrypted.authTag,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, connection });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create connection', details: String(err) }, { status: 500 });
  }
}

export async function GET() {
  // TODO: Fetch from database
  return NextResponse.json({ connections: [] });
}
