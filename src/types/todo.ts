export interface Todo {
  id: string
  content: string
  completed: boolean
  created_at: string
}

export type TodoInsert = Pick<Todo, 'content'> & Partial<Pick<Todo, 'completed'>>
export type TodoUpdate = Partial<Pick<Todo, 'content' | 'completed'>>
