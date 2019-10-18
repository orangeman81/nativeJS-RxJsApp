import { data } from "../services/data.service.js";
import { fromEvent, Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    tap,
    pluck,
    distinctUntilChanged,
    switchMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { Loader } from "../models/leaves.js";
import { Helper } from "../models/helper.class.js";

class RadioComponent {

    constructor() {
        this.renderSub = new Subscription();
        this.actionSub = new Subscription();
        this.template$ = new BehaviorSubject("");
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.renderSub = data.$fetchRadioList()
            .pipe(
                switchMap(() => this.$render()),
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
                            return data.$fetchRadio(id);
                        }
                        case "back": {
                            this.template = Loader();
                            return data.$fetchRadioList();
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
                    console.log("rendering radio");
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

const radioComponent = new RadioComponent();
export default radioComponent;