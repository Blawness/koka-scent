import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only once the client has hydrated. Used to gate rendering of values
 * derived from the persisted (localStorage) cart store, so the server-
 * rendered pass and the pre-hydration client pass agree (both "not yet
 * hydrated") and React doesn't report a hydration mismatch.
 *
 * Implemented with useSyncExternalStore's getServerSnapshot/getSnapshot
 * split instead of the classic `useState(false) + useEffect(() =>
 * setMounted(true))` pattern, since the latter calls setState synchronously
 * inside an effect (flagged by react-hooks/set-state-in-effect).
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
