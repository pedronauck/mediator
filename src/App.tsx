import { Counter } from "./Counter"
import { Decrement } from "./Decrement"
import { Increment } from "./Increment"
import { Mediator } from "./mediator"

export function App() {
  return (
    <Mediator>
      <Counter />
      <Increment />
      <Decrement />
    </Mediator>
  )
}
