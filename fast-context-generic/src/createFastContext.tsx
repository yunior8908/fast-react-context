import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

export default function createFastContext<Store>(initialState: Store) {
  let subscribers = new Set<(data: Partial<Store>) => void>();

  function subscribe(callback: (data: Partial<Store>) => void) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }
  let store = {...initialState}

  const get = () => store

  const set = (value: Partial<Store>) => {
    store = { ...store, ...value };
    subscribers.forEach((callback) => callback(store));
  }

  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

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

  return {
    useStore,
  };
}
