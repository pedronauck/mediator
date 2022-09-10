import { useMediator } from "./mediator"

export function Decrement() {
  const { send, events } = useMediator()
  return <button onClick={() => send(events.decrement, 2)}>Decrement</button>
}
