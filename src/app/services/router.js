import { BehaviorSubject, fromEvent, Subscription, forkJoin } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { Helper } from '../models/helper.class';
import { routes } from '../models/routes';

class Router {

    constructor(routes) {
        this.routerOutlet = document.querySelector("#app");
        this.routes = routes;
        this.page$ = new BehaviorSubject({});
        this.sub = new Subscription();
        this.eventSub = new Subscription();
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
        // router initialization
        if (window.location.hash) {
            this.navigate(window.location.hash.slice(1))
        } else {
            const initialPage = routes[0].path;
            this.navigate(initialPage);
        }

        // page rendering
        this.sub = this.$page
            .pipe(
                tap(page => page.component.init()),
                switchMap(page => page.component.template$),
                tap(template => this.routerOutlet.innerHTML = template)
            )
            .subscribe();

        // router event listener
        this.eventSub = this.$routerListener()
            .subscribe();
    }

    $routerListener() {
        // listener to window location hash change
        const $hashListener = fromEvent(window, "hashchange")
            .pipe(
                tap(event => this.navigate(event.path[0].location.hash.slice(1)))
            )
        // listener to navbar links click
        const $linksListener = fromEvent(document, "click")
            .pipe(
                filter(event => event.target.matches("[data-path]")),
                tap(event => {
                    Helper.eventHandler(event, true);
                    const path = event.target.dataset.path;
                    window.location.hash = path;
                })
            );
        return forkJoin($linksListener, $hashListener);
    }

    navigate(path) {
        let page = this.routes.find(route => {
            return route.path === path
        });
        if (page === undefined) {
            page = this.routes.find(route => {
                return route.path === "error"
            })
        }
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