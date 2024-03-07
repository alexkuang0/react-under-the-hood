type Effect = {
  execute: () => void
  deps: Set<Set<Effect>>
}

const globalEffectStack: Effect[] = []

/**
 * Subscribe an effect to a state change
 */
function subscribe(effect: Effect, subscriptions: Set<Effect>) {
  subscriptions.add(effect)
  effect.deps.add(subscriptions)
}

/**
 * Reset the dependencies of an effect
 */
function resetDeps(effect: Effect) {
  effect.deps.forEach((subscriptions) => {
    subscriptions.delete(effect)
  })
  effect.deps.clear()
}

export function useState<T>(value?: T) {
  const effectSubscriptions = new Set<Effect>()

  const getter = () => {
    const [effect] = globalEffectStack.slice(-1)
    if (effect) subscribe(effect, effectSubscriptions)

    return value
  }

  const setter = (nextValue: T) => {
    value = nextValue
    Array.from(effectSubscriptions).forEach((effect) => effect.execute())
  }

  return [getter, setter] as const
}

export function useEffect(callback: () => void) {
  const effect = {
    execute: () => {
      resetDeps(effect)
      globalEffectStack.push(effect)

      try {
        callback()
      } finally {
        globalEffectStack.pop()
      }
    },
    deps: new Set<Set<Effect>>(),
  } satisfies Effect

  effect.execute()
}

export function useMemo<T>(callback: () => T): () => T | undefined {
  const [state, setState] = useState<T>()
  useEffect(() => {
    setState(callback())
  })
  return state
}
