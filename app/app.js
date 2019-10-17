import { Router } from "./services/router.js";
import { routes } from "./models/routes.js";
import { AppService } from "./services/appService.js";

window.onload = () => {
    const router = new Router(routes);
    const searchListener = new AppService();
}

window.onbeforeunload = () => {
    router.destroy();
    searchListener.destroy();
}