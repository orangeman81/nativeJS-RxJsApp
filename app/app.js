import { Router } from "./services/router.js";
import { routes } from "./models/routes.js";
import { SearchService } from "./services/searchService.js";

window.onload = () => {
    const router = new Router(routes);
    const searchListener = new SearchService();
}

window.onbeforeunload = () => {
    router.destroy();
    searchListener.destroy();
}