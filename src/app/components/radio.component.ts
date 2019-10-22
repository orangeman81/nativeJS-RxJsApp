import { data } from "../services/data.service";
import { fromEvent, Subscription, BehaviorSubject, Observable } from 'rxjs';
import {
    filter,
    tap,
    pluck,
    distinctUntilChanged,
    switchMap
} from 'rxjs/operators';
import { Loader } from "../models/leaves";
import { Helper } from "../models/helper.class";

class RadioComponent {

    renderSub: Subscription;
    actionSub: Subscription;
    template$: BehaviorSubject<string>;

    constructor() {
        this.renderSub = new Subscription();
        this.actionSub = new Subscription();
        this.template$ = new BehaviorSubject<string>(Loader());
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
        const $actions: Observable<Event> = fromEvent(document, "click");
        this.actionSub = $actions
            .pipe(
                filter((event: Event) => (event.target as HTMLElement).matches("[data-action]")),
                tap(event => {
                    Helper.eventHandler(event, true);
                }),
                pluck("target"),
                switchMap((element: HTMLElement) => {
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
                            return null
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