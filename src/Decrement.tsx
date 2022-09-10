import * as events from "./events"

export function Decrement() {
  return <button onClick={() => events.decrement(2)}>Decrement</button>
}
