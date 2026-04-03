import { useTodos } from '@/hooks/useTodos'
import { AddTodo } from '@/components/AddTodo'
import { TodoList } from '@/components/TodoList'
import './App.css'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos()

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Modern Zen Todo</h1>
      </header>
      <main className="app__main">
        {error && (
          <div className="app__error" role="alert">
            {error}
          </div>
        )}
        <AddTodo
          onAdd={(content) => addTodo({ content })}
          disabled={loading}
        />
        <TodoList
          todos={todos}
          loading={loading}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  )
}

export default App
