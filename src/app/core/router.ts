import { Loader } from './leaves';
import { Page } from './page.interface';
import { BehaviorSubject, fromEvent, Subscription, forkJoin } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { Helper } from './helper.class';
import { routes } from '../models/routes';

class Router {
    routerOutlet: HTMLElement;
    routes: Page[];
    page$: BehaviorSubject<Page>;
    sub: Subscription;
    eventSub: Subscription;

    constructor(public intialRoutes: Page[]) {
        this.routerOutlet = document.querySelector("#app");
        this.routes = routes;
        this.page$ = new BehaviorSubject<Page>({ path: "", component: null });
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
                tap((template: string) => this.routerOutlet.innerHTML = template)
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
                tap(() => this.navigate(location.hash.slice(1)))
            )
        // listener to navbar links click
        const $linksListener = fromEvent(document, "click")
            .pipe(
                filter((event: Event) => (event.target as HTMLElement).matches("[data-path]")),
                tap(event => {
                    Helper.eventHandler(event, true);
                    const path = (event.target as HTMLElement).dataset.path;
                    window.location.hash = path;
                })
            );
        return forkJoin($linksListener, $hashListener);
    }

    navigate(path: string) {
        let page: Page = this.routes.find(route => {
            return route.path === path
        });
        if (page === undefined) {
            page = this.routes.find(route => {
                return route.path === "error"
            })
        }
        if (this.page.component) {
            this.page.component.template = Loader();
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