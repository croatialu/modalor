import { h } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import { createModal } from '../modal'

export const userProfileModal = createModal<{ name: string }>(({ name }) => {
  return h(UserProfile, { name })
}, {
  title: 'User Profile',
  description: 'This is a user profile',
})
