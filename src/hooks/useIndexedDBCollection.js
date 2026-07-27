import { useCallback, useEffect, useRef, useState } from 'react'
import { getCollection, saveCollection } from '../services/indexedDB'

export function useIndexedDBCollection(key, initialValue) {
  const [data, setDataState] = useState(initialValue)
  const dataRef = useRef(data)

  useEffect(() => {
    let active = true
    getCollection(key, initialValue).then((storedValue) => {
      if (!active) return
      dataRef.current = storedValue
      setDataState(storedValue)
    }).catch(() => {})
    return () => { active = false }
  }, [key, initialValue])

  const setData = useCallback((nextValue) => {
    const resolved = typeof nextValue === 'function' ? nextValue(dataRef.current) : nextValue
    dataRef.current = resolved
    setDataState(resolved)
    saveCollection(key, resolved).catch(() => {})
  }, [key])

  return [data, setData]
}
