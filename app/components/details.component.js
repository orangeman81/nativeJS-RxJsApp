import { data } from "../services/data.service.js";
import { Subscription, BehaviorSubject } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import {
    filter,
    map
} from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';

class DetailsPage {

    constructor() {
        this.detailsSub = new Subscription();
        this.renderSub = new Subscription();
        this.template$ = new BehaviorSubject("");
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.detailsSub = data.$fetchAlbum(596251).subscribe();
        this.renderSub = this.$render().subscribe();
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
        this.detailsSub.unsubscribe();
        this.renderSub.unsubscribe();
    }

}

const DetailsComponent = new DetailsPage();
export default DetailsComponent;