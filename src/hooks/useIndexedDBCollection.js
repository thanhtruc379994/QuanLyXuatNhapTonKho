import { useCallback, useEffect, useRef, useState } from 'react'
import { getCollection, saveCollection } from '../services/indexedDB'

export function useIndexedDBCollection(key, initialValue) {
  const [data, setDataState] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dataRef = useRef(data)

  useEffect(() => {
    let active = true
    getCollection(key, initialValue).then((storedValue) => {
      if (!active) return
      dataRef.current = storedValue
      setDataState(storedValue)
    }).catch((reason) => {
      if (active) setError(reason)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [key, initialValue])

  const setData = useCallback((nextValue) => {
    const resolved = typeof nextValue === 'function' ? nextValue(dataRef.current) : nextValue
    dataRef.current = resolved
    setDataState(resolved)
    saveCollection(key, resolved).catch((reason) => setError(reason))
  }, [key])

  return [data, setData, { loading, error }]
}
