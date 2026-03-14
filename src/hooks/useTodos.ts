import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Todo, TodoInsert } from '@/types/todo'

const TODOS_COLUMNS = 'id, content, completed, created_at'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleFetchError = useCallback((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg === 'Failed to fetch' || msg.includes('fetch')) {
      setError(
        '无法连接 Supabase：请检查网络、确认 Supabase 项目未暂停（免费版不活跃会暂停，需在控制台恢复），以及 .env 中的 URL 是否正确。'
      )
    } else {
      setError(msg)
    }
  }, [])

  const fetchTodos = useCallback(async (showLoading = true) => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url?.trim() || !key?.trim()) {
      setError('请配置 .env 中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
      setLoading(false)
      setTodos([])
      return
    }
    if (showLoading) {
      setLoading(true)
    }
    setError(null)
    try {
      const { data, error: e } = await supabase
        .from('todos')
        .select(TODOS_COLUMNS)
        .order('created_at', { ascending: false })
      if (e) {
        setError(e.message)
        setTodos([])
      } else {
        setTodos((data ?? []) as Todo[])
      }
    } catch (err) {
      handleFetchError(err)
      setTodos([])
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [handleFetchError])

  useEffect(() => {
    fetchTodos()

    const url = import.meta.env.VITE_SUPABASE_URL ?? ''
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
    const isPlaceholder =
      !url || !key || url.includes('your-project') || key.includes('your-anon-key')

    if (isPlaceholder) {
      return
    }

    const channel = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => {
        fetchTodos()
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Supabase Realtime 未启用或连接失败，列表将依赖手动刷新与操作后刷新')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTodos])

  const addTodo = useCallback(
    async (payload: TodoInsert) => {
      setError(null)
      try {
        const { error: e } = await supabase
          .from('todos')
          .insert({ content: payload.content, completed: payload.completed ?? false })
        if (e) {
          setError(e.message)
          return
        }
        await fetchTodos(false)
      } catch (err) {
        handleFetchError(err)
      }
    },
    [fetchTodos, handleFetchError]
  )

  const toggleTodo = useCallback(
    async (id: string, completed: boolean) => {
      setError(null)
      try {
        const { error: e } = await supabase.from('todos').update({ completed }).eq('id', id)
        if (e) {
          setError(e.message)
          return
        }
        await fetchTodos(false)
      } catch (err) {
        handleFetchError(err)
      }
    },
    [fetchTodos, handleFetchError]
  )

  const deleteTodo = useCallback(
    async (id: string) => {
      setError(null)
      try {
        const { error: e } = await supabase.from('todos').delete().eq('id', id)
        if (e) {
          setError(e.message)
          return
        }
        await fetchTodos(false)
      } catch (err) {
        handleFetchError(err)
      }
    },
    [fetchTodos, handleFetchError]
  )

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, refetch: fetchTodos }
}
