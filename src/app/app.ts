import '../styles.scss';
import router from "./services/router";
import appService from "./services/appService";

window.onload = () => {
    router.init();
    appService.init();
}

window.onbeforeunload = () => {
    router.destroy();
    appService.destroy();
}