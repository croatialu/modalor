import { Input } from '@chakra-ui/react'
import { useModalor } from '@modalor/react'
import { useEffect, useState } from 'react'

export function UserProfile({ name: initialName }: { name: string }) {
  const { onOk, resolve, setOkDisabled } = useModalor<{ name: string }>()

  const [name, setName] = useState(initialName)

  onOk(() => {
    resolve({ name })
  })

  useEffect(() => {
    setOkDisabled(name === initialName || !name)
  }, [name])

  return (
    <div>

      <h1>User Profile</h1>
      <p>
        Old Name:
        {name}
      </p>
      <br />
      <br />
      Input new name:

      <Input value={name} onChange={e => setName(e.target.value)} />
    </div>
  )
}
