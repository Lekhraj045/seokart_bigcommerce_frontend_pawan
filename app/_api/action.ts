'use server'
import { cookies } from 'next/headers'

export const updateLanguage = async (language:any) => {
  cookies().set('language', language, { secure: true, sameSite: 'none' })
  return 'success'
}