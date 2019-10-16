import { Store } from "../models/store.class.js";
import { from } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import { tap, filter, concatMap } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { Card, detailsPage, cardList } from "../models/elements.js";

class DataService extends Store {

    constructor() {
        super(new Store());
        this.template = document.querySelector('#template');
    }

    get query() {
        const id = this.store.query;
        return id;
    }

    fetchMusic(query) {
        fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "6d76812301mshae66073ae2beca5p1e12adjsnc9f2b3725389"
            }
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                this.store = {
                    ...this.store,
                    data: response.data,
                    query: query
                };
                this.displayList(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    fetchTrack(id) {
        fetch(`https://deezerdevs-deezer.p.rapidapi.com/track/${id}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "6d76812301mshae66073ae2beca5p1e12adjsnc9f2b3725389"
            }
        })
            .then(response => {
                return response.json();
            });
    }

    $search(query) {
        const promise = fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "6d76812301mshae66073ae2beca5p1e12adjsnc9f2b3725389"
            }
        }).then(res => res.json());

        const $http = from(promise)
            .pipe(
                tap(res => {
                    this.store = {
                        ...this.store,
                        data: res.data,
                        query: query
                    };
                }),
                concatMap(() => this.$render())
            )

        return $http;
    }

    $render() {
        return this.$store
            .pipe(
                filter(state => state.data),
                tap(state => {
                    this.displayList(state.data);
                })
            );
    }

    displayList(list) {
        return this.template.innerHTML = cardList(list);
    }

    displayDetails(details) {
        const data = this.store.data.find(e => e.id === details);
        this.fetchTrack(details);
        this.template.innerHTML = detailsPage(data);
    }

}

export const data = new DataService();