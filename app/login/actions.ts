"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";
import { createSessionCookie } from "@/lib/session";

export async function loginAction(formData: FormData): Promise<void> {
  const login = getRequiredString(formData, "login");
  const password = getRequiredString(formData, "password");

  const user = await prisma.user.findUnique({
    where: { login },
  });

  if (!user) {
    redirectWithError("/login", "Неверный логин или пароль.");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    redirectWithError("/login", "Неверный логин или пароль.");
  }

  await createSessionCookie(user);
  redirect("/");
}
