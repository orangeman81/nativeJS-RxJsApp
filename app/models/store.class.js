import { BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';

export class Store {

    constructor() {
        this.store$ = new BehaviorSubject({
            data: [],
            query: ""
        });
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