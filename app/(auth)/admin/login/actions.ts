"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
    return {};
  } catch (error) {
    // signIn throws a redirect on success — that must propagate.
    if (error instanceof AuthError) {
      return { error: "Email atau kata sandi salah." };
    }
    throw error;
  }
}
