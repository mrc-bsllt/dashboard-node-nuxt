export interface User {
  username?: String,
  email: String
  password: String
  confirm_password?: String
}

export interface FormInput {
  label: String
  type: string
  field: String
  error: boolean
  error_message: String
}

export interface ErrorInput {
  param: String
  msg: String
}