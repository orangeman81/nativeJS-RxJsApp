import { fromEvent, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    auditTime,
    filter,
    map,
    tap,
    switchMap
} from "rxjs/operators"
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
                    Helper.eventHandler(event);
                }),
                distinctUntilChanged(),
                debounceTime(800),
                filter(event => event.target.value.trim() != ""),
                map(event => {
                    const queryValue = event.target.value.trim();
                    return queryValue;
                }),
                switchMap(query => data.$search(query).pipe(tap(() => router.navigate("home")))),
                auditTime(4000),
                tap(() => (query.reset(), query.elements[0].blur()))
            )
            .subscribe();
    }

    destroy() {
        this.sub.unsubscribe();
        this.actionSub.unsubscribe();
    }

}