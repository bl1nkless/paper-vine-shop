import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "paper-vine-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSession = {
  userId: string;
  email: string;
  role: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required for admin sessions.");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

function decodeSession(token: string): AdminSession | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const actual = Buffer.from(expected);

  if (provided.length !== actual.length || !timingSafeEqual(provided, actual)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (session.exp * 1000 < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function createAdminSessionCookie(input: Omit<AdminSession, "exp">) {
  const session: AdminSession = {
    ...input,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
