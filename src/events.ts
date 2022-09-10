import { createEvent } from "./mediator"

/**
 * Add a `{system}:` name before the event is a good way to don't have conflicts
 */
enum Events {
  increment = "counter:INCREMENT",
  decrement = "counter:DECREMENT",
}

export const increment = createEvent<number>(Events.increment)
export const decrement = createEvent<number>(Events.decrement)
