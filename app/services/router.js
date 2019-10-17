import { BehaviorSubject, fromEvent, Subscription } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import { tap, filter, switchMap, distinctUntilChanged, auditTime } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { Helper } from '../models/helper.class.js';

export class Router {

    constructor(routes) {
        this.routerOutlet = document.querySelector("#app");
        this.routes = routes;
        this.page$ = new BehaviorSubject({});
        this.sub = new Subscription();
        this.eventSub = new Subscription();
        this.page = routes[0];
        this.init();
    }

    get page() {
        return this.page$.getValue();
    }
    set page(page) {
        this.page$.next(page);
    }

    get $page() {
        return this.page$.asObservable();
    }

    init() {
        this.sub = this.$page
            .pipe(
                distinctUntilChanged(),
                tap(page => (page.component.init(), console.log("executed", page))),
                auditTime(300),
                switchMap(page => page.component.template$),
                tap(template => this.routerOutlet.innerHTML = template)
            )
            .subscribe();

        this.eventSub = this.$routerListener()
            .subscribe(() => console.log("routerEvents"));
    }

    $routerListener() {
        const $routerListener = fromEvent(document, "click")
            .pipe(
                filter(event => event.target.matches("[data-path]")),
                distinctUntilChanged(),
                tap(event => {
                    Helper.eventHandler(event, true);
                    const path = event.target.dataset.path;
                    this.navigate(path);
                })
            );
        return $routerListener;
    }

    navigate(path) {
        const page = this.routes.find(route => {
            return route.path === path
        });
        if (this.page.component) {
            this.page.component.destroy();
        }
        window.location.hash = page.path;
        this.page = page;
    }

    destroy() {
        this.sub.unsubscribe();
        this.eventSub.unsubscribe();
    }

}