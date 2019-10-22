import { BehaviorSubject, Observable, Subject } from 'rxjs';
export class Component {

    template$: BehaviorSubject<string>;

    constructor(template) {
        this.template$ = new BehaviorSubject<string>(template);
    }

    get $template(): Observable<string> {
        return this.template$.asObservable();
    }
    set template(value: string) {
        this.template$.next(value);
    }


}