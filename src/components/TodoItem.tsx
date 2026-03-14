import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item" data-completed={todo.completed}>
      <button
        type="button"
        className="todo-item__checkbox"
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? '标记未完成' : '标记完成'}
      >
        {todo.completed && <span className="todo-item__check" />}
      </button>
      <span className="todo-item__title">{todo.content}</span>
      <button
        type="button"
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
        aria-label="删除"
      >
        删除
      </button>
    </li>
  )
}
