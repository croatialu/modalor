import { UserProfile } from "@/components/UserProfile"
import { createModal } from "../modal"


interface Input {
  name: string
}

interface Output {
  name: string
}

export const userProfile = createModal<Input, Output>(({ name }) => <UserProfile name={name} />, {
  title: 'User Profile',
  description: 'This is a user profile',
})
