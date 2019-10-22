import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { Helper } from '../models/helper.class.js';
import { routes } from '../models/routes.js';

class Router {

    constructor(routes) {
        this.routerOutlet = document.querySelector("#app");
        this.routes = routes;
        this.page$ = new BehaviorSubject({});
        this.sub = new Subscription();
        this.eventSub = new Subscription();
        this.page = routes[0];
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
                tap(page => page.component.init()),
                switchMap(page => page.component.template$),
                tap(template => this.routerOutlet.innerHTML = template)
            )
            .subscribe();

        this.eventSub = this.$routerListener()
            .subscribe(event => console.log("routerEvents", event));
    }

    $routerListener() {
        const $routerListener = fromEvent(document, "click")
            .pipe(
                filter(event => event.target.matches("[data-path]")),
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

const router = new Router(routes);
export default router;