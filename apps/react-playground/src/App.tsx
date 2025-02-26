import {
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { ColorModeButton } from './components/ui/color-mode'
import { confirmModal } from './modals/confirm'
import { userProfile } from './modals/userProfile'
import './App.css'

function App() {
  const handleShowUserProfile = async () => {
    const [isOk, result] = await userProfile.show({ name: 'John Doe' })
    if (isOk) {
      console.log(result)
    }
  }

  const handleShowConfirm = async () => {
    const [isOk] = await confirmModal.show()
    if (isOk) {
      console.log('confirm ok')
    }
  }

  return (
    <VStack>
      <HStack p={2} w="100%" borderBottom="1px solid" borderColor="gray.200" justifyContent="end">
        <ColorModeButton />
      </HStack>

      <HStack h="50vh" justifyContent="center" alignItems="center">
        <Button onClick={handleShowUserProfile}>
          Show User Profile
        </Button>

        <Button onClick={handleShowConfirm}>
          Show Confirm
        </Button>
      </HStack>

    </VStack>
  )
}

export default App
