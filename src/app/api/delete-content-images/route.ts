import { NextRequest, NextResponse } from 'next/server';
import { getFtpClient } from '@/lib/ftp';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer): Readable {
  return Readable.from(buffer);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = bufferToStream(buffer);
  const fileName = `${Date.now()}-${file.name}`;

  const client = await getFtpClient();

  try {
    await client.ensureDir('/imgs/blog/content');
    await client.uploadFrom(stream, `/imgs/blog/content/${fileName}`);
    client.close();

    return NextResponse.json({
      imageUrl: `/imgs/blog/content/${fileName}`,
    });
  } catch (error) {
    console.error('FTP upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

