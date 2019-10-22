import { BehaviorSubject, Observable } from "rxjs";

export class Store<T> {

    store$: BehaviorSubject<T>

    constructor(state: T) {
        this.store$ = new BehaviorSubject(state);
    }

    get $store(): Observable<T> {
        return this.store$.asObservable();
    }
    get store(): T {
        return this.store$.getValue();
    }
    set store(value: T) {
        this.store$.next(value);
    }

}