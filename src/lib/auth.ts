import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_OPTIONS } from './constants';

export interface SessionData {
  authenticated?: boolean;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
  return session;
}

export async function getSessionFromRequest(request: NextRequest, response: NextResponse) {
  const session = await getIronSession<SessionData>(request, response, SESSION_OPTIONS);
  return session;
}
