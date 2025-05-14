'use client'

import { useRef, useCallback } from 'react'

export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  return debouncedFunction
}
