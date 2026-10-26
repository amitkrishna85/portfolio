"use client";

import * as React from "react";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Shield, Lock, Mail, Eye, EyeOff, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid-pattern px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border shadow-2xl rounded-xl p-8 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Industrial CMS Gateway
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Protected Admin Portal • Digital Twin Architecture
            </p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-medium flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="director@industrial-twin.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Master Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>IEC 62443 Hardened • Single-Tenant Session</span>
            </p>
            <div className="mt-3">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                ← Return to Public Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
