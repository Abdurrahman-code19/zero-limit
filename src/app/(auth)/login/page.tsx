"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme/theme-provider"
import { createClient } from "@/lib/supabase/client"

const MAX_ATTEMPTS_BEFORE_LOCK = 6
const MAX_LOCK_SECONDS = 600

function getLockKey(email: string) {
  return `zl_login_attempts_${email.trim().toLowerCase()}`
}

interface LockState {
  count: number
  lockedUntil: number | null
}

function readLockState(email: string): LockState {
  try {
    const raw = localStorage.getItem(getLockKey(email))
    if (!raw) return { count: 0, lockedUntil: null }
    const parsed = JSON.parse(raw)
    return {
      count: Number(parsed.count) || 0,
      lockedUntil: parsed.lockedUntil || null,
    }
  } catch {
    return { count: 0, lockedUntil: null }
  }
}

function recordLockState(email: string, state: LockState) {
  try {
    localStorage.setItem(getLockKey(email), JSON.stringify(state))
  } catch {}
}

function clearLockState(email: string) {
  try {
    localStorage.removeItem(getLockKey(email))
  } catch {}
}

function lockForFailures(failCount: number): number {
  if (failCount < MAX_ATTEMPTS_BEFORE_LOCK) return 0
  const steps = failCount - MAX_ATTEMPTS_BEFORE_LOCK
  return Math.min(30 * 2 ** steps, MAX_LOCK_SECONDS)
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get("redirect")
  const redirect =
    rawRedirect &&
    rawRedirect.startsWith("/") &&
    !rawRedirect.startsWith("//") &&
    !rawRedirect.startsWith("/\\")
      ? rawRedirect
      : "/store"
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get("deactivated") === "1"
      ? "This account has been deactivated. Please contact support for assistance."
      : null
  )
  const [message, setMessage] = useState<string | null>(null)
  const [lockUntil, setLockUntil] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const supabase = createClient()

  useEffect(() => {
    if (!lockUntil) return
    const tick = () => {
      const diff = lockUntil - Date.now()
      if (diff <= 0) {
        setRemaining(0)
        setLockUntil(null)
        setError(null)
        return
      }
      setRemaining(Math.ceil(diff / 1000))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [lockUntil])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const lockState = readLockState(email)
    if (lockState.lockedUntil && lockState.lockedUntil > Date.now()) {
      setLockUntil(lockState.lockedUntil)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      const failCount = readLockState(email).count + 1
      const lockSeconds = lockForFailures(failCount)
      if (lockSeconds > 0) {
        recordLockState(email, {
          count: failCount,
          lockedUntil: Date.now() + lockSeconds * 1000,
        })
        setLockUntil(Date.now() + lockSeconds * 1000)
        setMessage(null)
        setError(null)
      } else {
        recordLockState(email, { count: failCount, lockedUntil: null })
        if (/rate limit|security purposes|too many attempts/i.test(authError.message)) {
          setError(authError.message)
        } else {
          setError("Invalid email or password. Please try again.")
        }
      }
      setIsLoading(false)
      return
    }

    clearLockState(email)

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", data.user.id)
        .single()

      if (profile && profile.is_active === false) {
        setIsLoading(false)
        setError("This account has been deactivated. Please contact support for assistance.")
        return
      }

      if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
        router.push("/admin/dashboard")
        router.refresh()
        return
      }
    }

    router.push(redirect)
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-block mb-10">
            <Image
              src="/primary-logo.png"
              alt="Zero Limit"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {remaining > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Too many failed attempts. Please try again in {remaining}s.
              </p>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-[13px] tracking-widest uppercase"
              disabled={isLoading || remaining > 0}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-foreground font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-zinc-900" : "bg-stone-100"}`} />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-sm"
          >
            <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center overflow-hidden rounded-full bg-foreground/5">
              <img src="/favicon.png" alt="Zero Limit" className="w-16 h-16 object-contain" />
            </div>
            <h2 className={`text-4xl font-light mb-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              Beyond Limits.
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Access your orders, saved items, and exclusive member benefits.
            </p>
            <div className={`mt-8 w-16 h-px mx-auto ${isDark ? "bg-white/20" : "bg-black/20"}`} />
          </motion.div>
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>
    </div>
  )
}
