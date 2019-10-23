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
import { data } from "./data.service";
import { Helper } from '../core/helper.class';
import router from '../core/router';

class AppService {

    sub: Subscription;
    actionSub: Subscription;

    constructor() {
        this.sub = new Subscription();
        this.actionSub = new Subscription();
    }

    init() {
        // global search handler
        const query: HTMLFormElement = document.querySelector("#queryForm");
        const $query = fromEvent(query, "input");
        this.sub = $query
            .pipe(
                tap(event => {
                    Helper.eventHandler(event);
                }),
                distinctUntilChanged(),
                debounceTime(800),
                filter((event: InputEvent) => (event.target as HTMLInputElement).value.trim() != ""),
                map((event: InputEvent) => {
                    const queryValue = (event.target as HTMLInputElement).value.trim();
                    return queryValue;
                }),
                switchMap(query => data.$search(query).pipe(tap(() => router.navigate("home")))),
                auditTime(4000),
                tap(() => (query.reset(), (query.elements[0] as HTMLInputElement).blur()))
            )
            .subscribe();
    }

    destroy() {
        this.sub.unsubscribe();
        this.actionSub.unsubscribe();
    }

}

const appService = new AppService();
export default appService;