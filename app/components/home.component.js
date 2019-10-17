import { data } from "../services/data.service.js";
import { Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    map,
    switchMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';

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
                map(state => {
                    this.template = state.page;
                    return state.page;
                })
            );
    }

    destroy() {
        this.renderSub.unsubscribe();
    }

}

const HomeComponent = new Home();
export default HomeComponent;