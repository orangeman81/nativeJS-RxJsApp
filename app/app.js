import router from "./services/router.js";
import { AppService } from "./services/appService.js";

window.onload = () => {
    const appListener = new AppService();
    router.init();
}

window.onbeforeunload = () => {
    router.destroy();
    appListener.destroy();
}