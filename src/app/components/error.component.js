import { ErrorPage, Loader } from "../models/leaves";
import { BehaviorSubject } from "rxjs";

class Error {

    constructor() {
        this.template$ = new BehaviorSubject("");
    }

    set template(value) {
        this.template$.next(value);
    }

    init() {
        this.template = ErrorPage();
    }

    destroy() {
        this.template = Loader();
    }

}

const ErrorComponent = new Error();
export default ErrorComponent;