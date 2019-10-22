import '../styles.scss';
import router from "./services/router.js";
import appService from "./services/appService.js";

window.onload = () => {
    router.init();
    appService.init();
}

window.onbeforeunload = () => {
    router.destroy();
    appService.destroy();
}