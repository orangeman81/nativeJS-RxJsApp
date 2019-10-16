import { Store } from "../models/store.class.js";
import { from } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import { tap, filter, concatMap } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { detailsPage, cardList } from "../models/elements.js";
import { AppState } from "../models/AppState.class.js";

class DataService extends Store {

    constructor() {
        super(new AppState());
        this.template = document.querySelector('#template');
    }

    get query() {
        const query = this.store.query;
        return query;
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
                this.store = new AppState(response.data, query, "list")
                return this.template.innerHTML = cardList(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    $fetchAlbum(id) {
        const promise = fetch(`https://deezerdevs-deezer.p.rapidapi.com/album/${id}`, {
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
                        data: res,
                        page: "details"
                    };
                }),
                concatMap(() => this.$render())
            )

        return $http;
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
                        query: query,
                        page: "list"
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
                    console.log(state);
                    switch (state.page) {
                        case "list": {
                            return this.template.innerHTML = cardList(state.data);
                        }
                        case "details": {
                            return this.template.innerHTML = detailsPage(state.data);
                        }
                        default: {
                            return this.template.innerHTML = cardList(state.data);
                        }
                    }
                })
            );
    }

}

export const data = new DataService();