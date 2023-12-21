export module Enumerable {
    export function *where<T>(gen: Generator<T>, predicate: (elem: T) => boolean): Generator<T> {
        for (const item of gen) {
            if (predicate(item)) {
                yield item;
            }
        }
    }

    export function *select<TIn, TOut>(gen: Generator<TIn>, selector: (elem: TIn) => TOut): Generator<TOut> {
        for (const item of gen) {
            yield selector(item);
        }
    }
}