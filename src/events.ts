import { createEvent } from "./mediator"

enum Events {
  increment = "INCREMENT",
  decrement = "DECREMENT",
}

export const increment = createEvent<number>(Events.increment)
export const decrement = createEvent<number>(Events.decrement)
