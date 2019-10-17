import { data } from "../services/data.service.js";
import { Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    tap,
    switchMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { Loader } from "../models/leaves.js";

class Home {

    constructor() {
        this.template$ = new BehaviorSubject("");
        this.renderSub = new Subscription();
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
    }

    $render() {
        return data.$store
            .pipe(
                filter(state => state.page != ""),
                tap(state => {
                    console.log("rendering", state);
                    this.template = state.page;
                })
            );
    }

    destroy() {
        this.template = Loader();
        this.renderSub.unsubscribe();
    }

}

const HomeComponent = new Home();
export default HomeComponent;