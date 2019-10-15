import { data } from "./services/data.service.js";
import { fromEvent } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import { debounceTime } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { distinctUntilChanged } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';


window.onload = () => {
    data.fetchMusic("Bon Iver");
    
    let sub;
    const query = document.querySelector("#queryForm");
    const $query = fromEvent(query, "input");


    const setDetails = (details) => {
        data.setDetails(details);
    }

    sub = $query
        .pipe(
            distinctUntilChanged(),
            debounceTime(400)
        )
        .subscribe(e => {
            const query = e.target.value.trim()
            data.fetchMusic(query);
        });

    document.addEventListener("click", (event) => {
        if (event.target.matches("[data-id]")) {
            event.preventDefault();
            const id = Number(event.target.dataset.id);
            setDetails(id);
        }

        if (event.target.matches("#back")) {
            event.preventDefault();
            console.log(data.query)
            data.fetchMusic(data.query);
        }
    })
}

window.onbeforeunload = () => {
    sub.unsubscribe();
    console.log("closed", sub.closed);
}