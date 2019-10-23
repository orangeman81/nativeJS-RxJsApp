import { Component } from '../core/component.class';
import { ErrorPage, Loader } from "../core/leaves";

class Error extends Component {

    constructor() {
        super(ErrorPage())
    }

    init() { }

    destroy() {
    }

}

const ErrorComponent = new Error();
export default ErrorComponent;