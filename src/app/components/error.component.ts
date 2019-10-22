import { Component } from './../models/component.class';
import { ErrorPage, Loader } from "../models/leaves";
import { BehaviorSubject } from "rxjs";

class Error extends Component {

    template$: BehaviorSubject<string>;

    constructor() {
        super(new Component(""))
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