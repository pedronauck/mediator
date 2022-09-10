import { useState } from "react"
import { useSubscribe } from "./mediator"
import * as events from "./events"

export function Counter() {
  const [count, setCount] = useState(0)

  useSubscribe(events.increment, (num) => {
    setCount((count) => count + num)
  })

  useSubscribe(events.decrement, (num) => {
    setCount((count) => count - num)
  })

  return <div>{count}</div>
}
