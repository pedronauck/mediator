import * as events from "./events"

export function Increment() {
  return <button onClick={() => events.increment(2)}>Increment</button>
}
