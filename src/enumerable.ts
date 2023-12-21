export module Enumerable {
    export type EnumerableType<T> = Generator<T> | Array<T>

    export function *where<T>(gen: EnumerableType<T>, predicate: (elem: T) => boolean): Generator<T> {
        for (const item of gen) {
            if (predicate(item)) {
                yield item;
            }
        }
    }

    export function *select<TIn, TOut>(gen: EnumerableType<TIn>, selector: (elem: TIn) => TOut): Generator<TOut> {
        for (const item of gen) {
            yield selector(item);
        }
    }

    export function any<T>(gen:EnumerableType<T>): boolean {
        for (const {} of gen) {
            return true;
        }
        return false;
    }

    export function all<T>(gen: EnumerableType<T>, predicate: (elem: T) => boolean): boolean {
        for (const item of gen) {
            if (!predicate(item)) {
                return false;
            }
        }
        return true;
    }

    export function first<T>(gen: EnumerableType<T>): T {
        for (const item of gen) {
            return item;
        }
        throw "Empty sequence";
    }
}