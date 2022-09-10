import { useInterpret } from "@xstate/react"
import { createContext, ReactNode, useContext, useEffect, useId } from "react"
import { useExecOnce } from "../hooks/useExecOnce"
import { Events } from "./events"
import {
  Listener,
  mediatorMachine,
  MediatorMachineService,
} from "./mediatorMachine"

type Context = {
  service: MediatorMachineService
}

const ctx = createContext<Context>({} as Context)

type MediatorProps = {
  children: ReactNode
}

export function Mediator({ children }: MediatorProps) {
  const service = useInterpret(() => mediatorMachine)
  return <ctx.Provider value={{ service }}>{children}</ctx.Provider>
}

export function useMediator() {
  const { service } = useContext(ctx)
  const id = useId()

  function register<T = any>(
    event: Events,
    listener: Listener<T>,
    deps?: any[],
  ) {
    useEffect(() => {
      service.send("register", { data: { event, id, listener } })
      return () => {
        service.send("unregister", { data: { event, id } })
      }
    }, deps)
  }

  function send(event: Events, data: any) {
    service.send(event as any, { data })
  }

  return {
    events: Events,
    register,
    send,
  }
}
