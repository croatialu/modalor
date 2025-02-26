import { Input } from '@chakra-ui/react'
import { useModalor } from '@modalor/react'
import { useEffect, useState } from 'react'

export function Confirm() {
  const { onOk, resolve, setOkDisabled, setOkLoading } = useModalor()

  const [value, setValue] = useState('')

  useEffect(() => {
    console.log('value', value)
    setOkDisabled(value !== 'confirm')
  }, [value, setOkDisabled])

  onOk(() => {
    setOkLoading(true)
    setTimeout(() => {
      resolve(value)
      setOkLoading(false)
    }, 1000)
  })

  return (
    <div>
      type "confirm" to confirm:

      <br />

      <Input value={value} onChange={e => setValue(e.target.value)} />
    </div>
  )
}
