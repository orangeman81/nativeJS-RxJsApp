import { Loader } from './leaves';
import { BehaviorSubject, Observable } from 'rxjs';
export abstract class Component {

    private template$: BehaviorSubject<string>;

    protected constructor(public initialTemplate = Loader()) {
        this.template$ = new BehaviorSubject<string>(initialTemplate);
    }

    get $template(): Observable<string> {
        return this.template$.asObservable();
    }
    set template(value: string) {
        this.template$.next(value);
    }

}