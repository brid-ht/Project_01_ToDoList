import { useState, FormEvent } from 'react'

interface AddTodoProps {
  onAdd: (content: string) => void
  disabled?: boolean
}

export function AddTodo({ onAdd, disabled }: AddTodoProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const content = value.trim()
    if (!content) return
    onAdd(content)
    setValue('')
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-todo__input"
        placeholder="添加新任务..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        maxLength={200}
        autoFocus
      />
      <button type="submit" className="add-todo__btn" disabled={disabled || !value.trim()}>
        添加
      </button>
    </form>
  )
}
