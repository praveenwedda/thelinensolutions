import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Login() {
  const { signIn, mode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen-100 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary font-serif text-lg text-primary-foreground">
            L
          </span>
          <span className="font-serif text-xl text-foreground">The Linen Solutions</span>
        </Link>

        <div className="rounded-2xl border border-linen-200 bg-card p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-linen-700">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-serif text-2xl text-foreground">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your store content.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "firebase" && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@thelinensolutions.com"
                />
              </div>
            )}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" size="lg" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {mode === "local" && (
            <p className="mt-5 rounded-md bg-secondary px-4 py-3 text-center text-xs text-muted-foreground">
              Demo mode · default password{" "}
              <code className="font-semibold text-foreground">linen-admin</code>
              <br />
              Edits are saved to this browser. Connect Firebase for live data.
            </p>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
