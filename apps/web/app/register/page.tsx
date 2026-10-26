import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleButton } from "@/components/auth/google-button";
import { LogoMark } from "@/components/auth/logo-mark";
import Link from "next/link";

const RegisterPage = () => {
  const handleCreateAccount = async () => {
    try {
    } catch {}
  };

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background px-4 py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-8%,rgba(124,58,237,0.32),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_100%,rgba(99,102,241,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.32)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_95%_85%_at_50%_45%,black,transparent_100%)] animate-grid-pan motion-reduce:animate-none" />
        <div className="absolute -left-32 -top-32 size-150 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.50),transparent_70%)] blur-[120px] animate-drift-a motion-reduce:animate-none" />
        <div className="absolute -right-32 top-8 size-140 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.42),transparent_70%)] blur-[120px] animate-drift-b motion-reduce:animate-none" />
        <div className="absolute -bottom-40 left-1/3 size-150 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.40),transparent_70%)] blur-[130px] animate-drift-c motion-reduce:animate-none" />
        <div className="absolute left-1/2 top-[42%] size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[120px] animate-aura motion-reduce:animate-none" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-card">
            <LogoMark />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            TradeVision
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
            Create account
          </h1>

          <form className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  size="lg"
                  autoComplete="name"
                  placeholder="Jane Trader"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  size="lg"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  size="lg"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  size="lg"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <label
              htmlFor="terms"
              className="flex select-none items-start gap-2 text-sm text-muted-foreground"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 size-4 rounded border-input accent-primary"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-foreground underline underline-offset-4 hover:text-primary"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-foreground underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button type="submit" size="lg" className="mt-1 w-full">
              Create account
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <GoogleButton label="Continue with Google" />
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
