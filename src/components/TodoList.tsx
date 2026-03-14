import type { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, loading, onToggle, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className="todo-list todo-list--loading">
        <div className="todo-list__spinner" />
        <p>加载中...</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list todo-list--empty">
        <p>暂无任务，在上方添加一条吧</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
