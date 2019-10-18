import { fromEvent, Subscription } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    debounceTime,
    distinctUntilChanged,
    auditTime,
    filter,
    map,
    tap,
    pluck,
    switchMap
} from "https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators"
import { data } from "./data.service.js";
import { Helper } from '../models/helper.class.js';
import router from './router.js';

export class AppService {

    constructor() {
        this.sub = new Subscription();
        this.actionSub = new Subscription();
        this.init();
    }

    init() {
        // global search handler
        const query = document.querySelector("#queryForm");
        const $query = fromEvent(query, "input");
        this.sub = $query
            .pipe(
                tap(event => {
                    event.preventDefault();
                    event.stopPropagation();
                }),
                distinctUntilChanged(),
                debounceTime(600),
                filter(event => event.target.value.trim() != ""),
                map(event => {
                    const queryValue = event.target.value.trim();
                    return queryValue;
                }),
                switchMap(query => data.$search(query).pipe(tap(() => router.navigate("home")))),
                auditTime(3000),
                tap(() => (query.reset(), query.elements[0].blur()))
            )
            .subscribe();
    }

    destroy() {
        this.sub.unsubscribe();
        this.actionSub.unsubscribe();
    }

}