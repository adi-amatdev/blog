import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { password } = await request.json();

  // Check env var first (backward compat)
  if (process.env.ADMIN_PASSWORD) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    const session = await getSession();
    session.authenticated = true;
    await session.save();
    return NextResponse.json({ ok: true });
  }

  // Fall back to DB-stored hash
  const stored = await prisma.siteSetting.findUnique({ where: { key: 'admin_password' } });
  if (!stored) {
    return NextResponse.json({ needsSetup: true, error: 'No password set' }, { status: 400 });
  }

  const valid = await bcrypt.compare(password, stored.value);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const session = await getSession();
  session.authenticated = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
