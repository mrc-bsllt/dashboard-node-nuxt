export interface User {
  _id?: string
  username?: string
  image_path?: string | null
  email: string
  password: string
  confirm_password?: string
}

export interface FormInput {
  label: string
  type: string
  field: string
  error: boolean
  error_message: string
}

export interface ErrorInput {
  param: string
  msg: string
}