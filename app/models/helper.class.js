export class Helper {

    static eventHandler(event, scroll = false) {
        event.preventDefault();
        event.stopPropagation();
        scroll ?
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            }) :
            null;
    }

}