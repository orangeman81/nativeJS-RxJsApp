import { data } from "../services/data.service.js";
import { Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    map,
    switchMap
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';

class RadioComponent {

    constructor() {
        this.renderSub = new Subscription();
        this.template$ = new BehaviorSubject("");
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.renderSub = data.$fetchAlbum(596251)
            .pipe(
                switchMap(() => this.$render()),
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

const radioComponent = new RadioComponent();
export default radioComponent;