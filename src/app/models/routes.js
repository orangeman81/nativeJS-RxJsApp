import HomeComponent from "../components/home.component";
import RadioComponent from "../components/radio.component";
import ErrorComponent from "../components/error.component";

export const routes = [
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "radio",
        component: RadioComponent
    },
    {
        path: "error",
        component: ErrorComponent
    }
];