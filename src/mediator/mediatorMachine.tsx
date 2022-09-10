import { assign, createMachine, InterpreterFrom, StateFrom } from "xstate"
import { Events } from "./events"

export type Listener<T = any> = (data: T) => any
type SubscriberMap = Map<Events, Map<string, Listener>>

type MachineContext = {
  subscribers: SubscriberMap
}

type MachineEvents =
  | {
      type: "register"
      data: { id: string; event: Events; listener: Listener }
    }
  | {
      type: "unregister"
      data: { id: string; event: Events }
    }

export const mediatorMachine = createMachine(
  {
    tsTypes: {} as import("./mediatorMachine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "(machine)",
    initial: "idle",
    context: {
      subscribers: new Map() as SubscriberMap,
    },
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    states: {
      idle: {
        on: {
          register: {
            actions: "addSubscriber",
          },
          unregister: {
            actions: "removeSubscriber",
          },
          /** We need this to attach all events from the enum in the machine */
          ...Object.values(Events).reduce((obj, key) => {
            return { ...obj, [key]: { actions: "runListeners" } }
          }, {}),
        },
      },
    },
  },
  {
    actions: {
      addSubscriber: assign({
        /**
         * This action will create like a map for each subscriber
         * something like that will be create
         *
         * Map[Events.increment]: {
         *   Map[id]: listener
         * }
         *
         * We need this structure in order to clean up the listeners when
         * some component in unmount
         */
        subscribers: (ctx, { data }) => {
          const oldMap = ctx.subscribers.get(data.event)
          if (oldMap) {
            oldMap.set(data.id, data.listener)
          } else {
            const map = new Map<string, Listener>()
            map.set(data.id, data.listener)
            ctx.subscribers.set(data.event, map)
          }
          return ctx.subscribers
        },
      }),
      /**
       * Here is the action that removes the listener[id] in unmount
       */
      removeSubscriber: assign({
        subscribers: (ctx, { data }) => {
          const listeners = ctx.subscribers.get(data.event)
          listeners?.delete(data.id)
          return ctx.subscribers
        },
      }),
      /**
       * This action is responsible to just run the listeners attached to the event
       */
      /* @ts-ignore */
      runListeners: async (ctx, ev: any) => {
        const type = ev.type
        const listeners = ctx.subscribers.get(type)
        if (!listeners) return

        for (const listener of listeners.values()) {
          const res = listener?.(ev.data)
          res?.then && res.then(() => null)
        }
      },
    },
  },
)

export type MediatorMachine = typeof mediatorMachine
export type MediatorMachineState = StateFrom<MediatorMachine>
export type MediatorMachineService = InterpreterFrom<MediatorMachine>
