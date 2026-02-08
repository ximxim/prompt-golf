"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // For now, just redirect to challenges (Supabase auth will be connected later)
      setMessage(
        "Authentication will be available when Supabase is configured. Redirecting..."
      );
      setTimeout(() => router.push("/challenges"), 1500);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      setMessage("Magic link feature requires Supabase configuration.");
      setTimeout(() => router.push("/challenges"), 1500);
    } catch (err) {
      setError("Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithoutAuth = () => {
    router.push("/challenges");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">⛳</span>
            <span className="text-3xl font-bold text-white">Prompt Golf</span>
          </Link>
          <p className="text-slate-400 mt-2">
            Sign in to track your progress and compete
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <Tabs defaultValue="password" className="space-y-4">
              <TabsList className="grid grid-cols-2 bg-slate-700">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="magic-link">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Magic Link"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <p className="text-sm text-red-400 mt-3 text-center">{error}</p>
            )}
            {message && (
              <p className="text-sm text-emerald-400 mt-3 text-center">
                {message}
              </p>
            )}

            <Separator className="my-6 bg-slate-700" />

            {/* Continue without auth */}
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white"
              onClick={handleContinueWithoutAuth}
            >
              Continue without signing in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">
              Progress saved locally. Sign in later to sync to the cloud.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
