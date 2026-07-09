"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Admin login — mock phase. No real authentication: submitting simply routes to
 * the dashboard. Real Neon Auth lands in the functional phase.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full max-w-sm py-8">
      <CardContent className="space-y-6">
        <div className="space-y-1 text-center">
          <p className="font-heading text-2xl">Koka Admin</p>
          <p className="text-sm text-muted-foreground">
            Masuk untuk mengelola toko
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/admin");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kokascent.id"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          Demo — kredensial apa pun akan diterima.
        </p>
      </CardContent>
    </Card>
  );
}
