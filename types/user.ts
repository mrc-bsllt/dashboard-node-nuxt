export interface User {
  username?: String,
  email: String
  password: String
  confirm_password?: String
  created_at?: Date | null
  updated_at?: Date | null
}

export interface FormInput {
  label: String
  type: string
}