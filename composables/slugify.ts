import type { FormInput } from '@/types/user'

export const useStringify = (str: keyof FormInput): string => {
  return str.toLowerCase().trim().replaceAll(' ', '-')
}