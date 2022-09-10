import { useRef, useState } from "react"

import { useSafeLayoutEffect } from "./useSafeLayoutEffect"

interface ResultBox<T> {
  v: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useExecOnce<T>(fn: () => T, deps: any[] = []): T {
  const ref = useRef<ResultBox<T>>()
  const [firstRun, setFirstRun] = useState(() => true)

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  useSafeLayoutEffect(() => {
    if (firstRun) {
      setFirstRun(false)
      return
    }
    ref.current = { v: fn() }
  }, deps)

  return ref.current?.v as T
}
