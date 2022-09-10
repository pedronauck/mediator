import { useState } from "react"
import { useMediator } from "./mediator"

export function Counter() {
  const { register, events } = useMediator()
  const [count, setCount] = useState(0)

  register<number>(events.increment, (num) => {
    setCount((count) => count + num)
  })

  register<number>(events.decrement, (num) => {
    setCount((count) => count - num)
  })

  return <div>{count}</div>
}
