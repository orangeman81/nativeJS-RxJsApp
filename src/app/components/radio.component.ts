import { LifeCycle } from './../core/lifeCycle';
import { data } from "../services/data.service";
import { fromEvent, Subscription, Observable } from 'rxjs';
import {
    filter,
    tap,
    pluck,
    distinctUntilChanged,
    switchMap
} from 'rxjs/operators';
import { Loader } from "../core/leaves";
import { Helper } from "../core/helper.class";
import { Component } from "../core/component.class";

class RadioComponent extends Component implements LifeCycle {

    renderSub: Subscription;
    actionSub: Subscription;

    constructor() {
        super();
        this.renderSub = new Subscription();
        this.actionSub = new Subscription();
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
        this.renderSub.unsubscribe();
        this.actionSub.unsubscribe();
    }

}

const radioComponent = new RadioComponent();
export default radioComponent;