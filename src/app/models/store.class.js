import { BehaviorSubject } from "rxjs";

export class Store {

    constructor(state) {
        this.store$ = new BehaviorSubject(state);
    }

    get $store() {
        return this.store$.asObservable();
    }
    get store() {
        return this.store$.getValue();
    }
    set store(value) {
        this.store$.next(value);
    }

}