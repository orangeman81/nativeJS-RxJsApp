import { setForm, unsetForm } from "./form.js";

window.onload = () => {
    setForm();
}

window.onbeforeunload = () => {
    unsetForm()
}