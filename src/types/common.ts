export type ViewModel<S, A> = Readonly<{
  state: Readonly<S>;
  actions: Readonly<A>;
}>;
