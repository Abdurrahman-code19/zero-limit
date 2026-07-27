"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="font-medium mb-8">{email}</p>
            <Button asChild className="w-full h-12 text-[13px] tracking-widest uppercase">
              <Link href="/login">Back to Sign In</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Didn&apos;t receive it?{" "}
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
                className="text-foreground font-medium hover:underline"
              >
                Try again
              </button>
            </p>
          </motion.div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Reset password</h1>
            <p className="text-muted-foreground mb-8">
              Enter your email and we&apos;ll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>
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

              <Button
                type="submit"
                className="w-full h-12 text-[13px] tracking-widest uppercase"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
