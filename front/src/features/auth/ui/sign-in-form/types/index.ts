import { z } from 'zod'
import { signInSchema } from '@/features/auth/ui/sign-in-form/hook'

export type TSignInFormValues = z.infer<typeof signInSchema>
