import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "logicontrol_session";

type SessionPayload = {
  userId: number;
  login: string;
  expiresAt: number;
};

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET не задан в переменных окружения.");
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "userId" in parsed &&
      "login" in parsed &&
      "expiresAt" in parsed &&
      typeof parsed.userId === "number" &&
      typeof parsed.login === "string" &&
      typeof parsed.expiresAt === "number"
    ) {
      return {
        userId: parsed.userId,
        login: parsed.login,
        expiresAt: parsed.expiresAt,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function verifySignature(value: string, signature: string): boolean {
  const expectedSignature = sign(value);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

function createSessionValue(payload: SessionPayload): string {
  const encodedPayload = encodePayload(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export async function createSessionCookie(user: { id: number; login: string }): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;

  cookieStore.set(SESSION_COOKIE_NAME, createSessionValue({ userId: user.id, login: user.login, expiresAt }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionValue) {
    return null;
  }

  const [encodedPayload, signature] = sessionValue.split(".");

  if (!encodedPayload || !signature || !verifySignature(encodedPayload, signature)) {
    return null;
  }

  const payload = decodePayload(encodedPayload);

  if (!payload || payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
