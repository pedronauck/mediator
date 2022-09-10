import { useEffect, useId } from "react"
import { interpret, InterpreterStatus } from "xstate"
import { Listener, mediatorMachine } from "./mediatorMachine"

/**
 * This will start the service outside React just one time
 */
const _service = interpret(mediatorMachine)
if (_service.status !== InterpreterStatus.Running) {
  _service.start()
}

/**
 * This function will create an event that will be used to send/register
 * inside the mediator
 */
export function createEvent<T>(name: any) {
  const fn = (data: T) => {
    _service.send("send", { name, data })
  }
  fn._name = name
  return fn
}

type Event<T> = (data: T) => void

export function useSubscribe<T>(
  event: Event<T>,
  listener: Listener<T>,
  deps?: any[],
) {
  const id = useId()
  const evName = (event as any)._name
  useEffect(() => {
    _service.send("register", { data: { event: evName, id, listener } })
    return () => {
      _service.send("unregister", { data: { event: evName, id } })
    }
  }, deps)
}
