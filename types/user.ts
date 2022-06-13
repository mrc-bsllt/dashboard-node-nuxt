export interface User {
  username?: String,
  email: String
  password: String
  confirm_password?: String
}

export interface FormInput {
  label: String
  type: string
}