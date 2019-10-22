import { data } from "../services/data.service";
import { fromEvent, Subscription, BehaviorSubject } from 'rxjs';
import {
    filter,
    tap,
    pluck,
    distinctUntilChanged,
    switchMap
} from 'rxjs/operators';
import { Loader } from "../models/leaves.js";
import { Helper } from "../models/helper.class.js";

class Home {

    constructor() {
        this.template$ = new BehaviorSubject("");
        this.renderSub = new Subscription();
        this.actionSub = new Subscription();
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.renderSub = data.$search(data.query)
            .pipe(
                switchMap(() => this.$render())
            )
            .subscribe();

        // details navigation handler
        const $actions = fromEvent(document, "click");
        this.actionSub = $actions
            .pipe(
                filter(event => event.target.matches("[data-action]")),
                tap(event => {
                    Helper.eventHandler(event, true);
                }),
                pluck("target"),
                switchMap(element => {
                    const action = element.dataset.action;
                    switch (action) {
                        case "details": {
                            this.template = Loader();
                            const id = Number(element.dataset.id);
                            return data.$fetchAlbum(id);
                        }
                        case "back": {
                            this.template = Loader();
                            return data.$search(data.query);
                        }
                        default: {
                            return false
                        }
                    }
                })
            )
            .subscribe();
    }

    $render() {
        return data.$store
        .pipe(
            pluck("page"),
            distinctUntilChanged(),
            filter(page => page != ""),
            tap(page => {
                console.log("rendering tails");
                this.template = page;
            })
        );
    }

    destroy() {
        this.template = Loader();
        this.renderSub.unsubscribe();
        this.actionSub.unsubscribe();
    }

}

const HomeComponent = new Home();
export default HomeComponent;