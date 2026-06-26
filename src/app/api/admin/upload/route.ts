import { NextResponse } from 'next/server';
import { uploadFile, getFileUrl } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${file.name}`;
    const key = await uploadFile(buffer, filename, file.type);

    return NextResponse.json({ url: getFileUrl(key) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
