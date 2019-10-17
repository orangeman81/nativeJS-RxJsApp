import { data } from "../services/data.service.js";
import { Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    tap,
    pluck,
    distinctUntilChanged,
    switchMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { Loader } from "../models/leaves.js";

class RadioComponent {

    constructor() {
        this.renderSub = new Subscription();
        this.template$ = new BehaviorSubject("");
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.renderSub = data.$fetchRadio()
            .pipe(
                switchMap(() => this.$render()),
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
    }

}

const radioComponent = new RadioComponent();
export default radioComponent;