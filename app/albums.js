import { data } from "./services/data.service.js";
import { Helper } from "./models/helper.class.js";
import { fromEvent } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    debounceTime,
    distinctUntilChanged,
    auditTime,
    filter,
    map,
    tap,
    pluck,
    switchMap,
    mergeMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';

window.onload = () => {
    data.fetchMusic("Jimmy Page");
    const query = document.querySelector("#queryForm");
    const $query = fromEvent(query, "input");

    const sub = $query
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
            switchMap(query => data.$search(query)),
            auditTime(3000),
            tap(() => (query.reset(), query.elements[0].blur()))
        )
        .subscribe();

    const $actions = fromEvent(document, "click");
    const actionSub = $actions
        .pipe(
            filter(event => event.target.matches("[data-action]")),
            tap(event => {
                Helper.eventHandler(event, true);
            }),
            pluck("target"),
            mergeMap(element => {
                const action = element.dataset.action;
                switch (action) {
                    case "details": {
                        const id = Number(element.dataset.id);
                        return data.$fetchAlbum(id);
                    }
                    case "back": {
                        return data.$search(data.query);
                    }
                    default: {
                        return false
                    }
                }
            })
        )
        .subscribe()
}

window.onbeforeunload = () => {
    sub.unsubscribe();
    actionSub.unsubscribe();
    console.log("closed", sub.closed, actionSub.closed);
}