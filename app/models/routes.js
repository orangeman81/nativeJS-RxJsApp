import HomeComponent from "../components/home.component.js";
import DetailsComponent from "../components/details.component.js";

export const routes = [
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "albums",
        component: DetailsComponent
    }
];