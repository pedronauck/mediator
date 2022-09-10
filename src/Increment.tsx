import { useMediator } from "./mediator"

export function Increment() {
  const { send, events } = useMediator()
  return <button onClick={() => send(events.increment, 2)}>Increment</button>
}
