export interface User {
  _id?: string
  username?: string
  image_path?: string
  email?: string
  password?: string
  confirm_password?: string
  requests_received?: User[]
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

export interface Community {
  friends: User[]
  requests_sent: User[]
  requests_received: User[]
}