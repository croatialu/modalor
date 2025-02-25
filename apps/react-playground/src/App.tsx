import './App.css'
import { confirmModal } from './modals/confirm'
import { userProfile } from './modals/userProfile'

function App() {

  const handleShowUserProfile = async () => {
    const [isOk, result] = await userProfile.show({ name: 'John Doe' })
    if (isOk) {
      console.log(result)
    }
  }

  const handleShowConfirm = async () => {
    const [isOk,] = await confirmModal.show()
    if (isOk) {
      console.log('confirm ok')
    }
  }


  return (
    <>
      <button onClick={handleShowUserProfile}>
        Show User Profile
      </button>

      <button onClick={handleShowConfirm}>
        Show Confirm
      </button>

    </>
  )
}

export default App
