import { Component } from './../models/component.class';
import { ErrorPage, Loader } from "../models/leaves";

class Error extends Component {

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