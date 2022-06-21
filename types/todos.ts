export interface Todo {
  content: string
  done: boolean
  user_id?: string
  created_at?: Date
  updated_at?: Date
}

export interface UpdatedTodos {
  content: number[]
  done: number[]
}