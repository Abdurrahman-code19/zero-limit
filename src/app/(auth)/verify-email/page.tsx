"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme/theme-provider"

export default function VerifyEmailPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <Link href="/" className="inline-block mb-10">
            <Image src="/primary-logo.png" alt="Zero Limit" width={140} height={40} className="h-8 w-auto" priority />
          </Link>

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-3xl font-bold mb-3">Verify your email</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent a verification link to your email address. Check your inbox and click the link to activate your account.
          </p>

          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full h-12 text-[13px] tracking-widest uppercase">
                Go to Sign In
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/register" className="text-foreground font-medium hover:underline">
                try again
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-zinc-900" : "bg-stone-100"}`} />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center overflow-hidden rounded-full bg-foreground/5">
              <img src="/favicon.png" alt="Zero Limit" className="w-16 h-16 object-contain" />
            </div>
            <h2 className={`text-4xl font-light mb-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>One more step.</h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Verify your email to unlock the full Zero Limit experience.
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
