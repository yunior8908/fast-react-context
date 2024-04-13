import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

type CallbackSet<T> = ((store: T) => Partial<T>) | Partial<T>

export default function createFastContext<Store>(initialState: Store) {
  let subscribers = new Set<(data: Partial<Store>) => void>();

  function subscribe(callback: (data: Partial<Store>) => void) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }
  let store = {...initialState}

  const get = () => store

  const set = (value: CallbackSet<Store>) => {
    store = { ...store, ...(typeof value === 'function' ? value(store) : value) };
    subscribers.forEach((callback) => callback(store));
  }

  function useStoreData(): {
    get: () => Store;
    set: (value: CallbackSet<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {

    return {
      get,
      set,
      subscribe,
    };
  }


  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store>) => void] {

    const state = useSyncExternalStore(
      subscribe,
      () => selector(get()),
      () => selector(initialState)
    );

    return [state, set];
  }

  useStore.subscribe = subscribe;
  useStore.dispatch = set

  return useStore
}
