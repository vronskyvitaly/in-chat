import { z } from 'zod'
import { signUpSchema } from '@/features/auth/ui/sign-up-form/hook'

export type TSignUpFormValues = z.infer<typeof signUpSchema>
