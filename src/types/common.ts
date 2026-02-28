export type ViewModel<S, A> = Readonly<{
  state: Readonly<S>;
  actions: Readonly<A>;
}>;

type WithAnimated<VM extends object, M> = Readonly<
  VM & { animated: Readonly<M> }
>;

export type AnimatedViewModel<S, A, M> = WithAnimated<ViewModel<S, A>, M>;
