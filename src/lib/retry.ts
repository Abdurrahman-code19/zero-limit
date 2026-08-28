interface RetryOptions {
  maxRetries?: number
  delayMs?: number
  backoff?: number
}

export async function withRetry<T>(
  fn: () => PromiseLike<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoff = 2 } = options

  let lastError: Error | undefined
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(backoff, attempt)))
      }
    }
  }
  throw lastError
}
