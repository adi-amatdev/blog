import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  await prisma.siteSetting.upsert({
    where: { key: 'admin_password' },
    create: { key: 'admin_password', value: hash },
    update: { value: hash },
  });

  const session = await getSession();
  session.authenticated = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
