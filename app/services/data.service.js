import { Store } from "../models/store.class.js";
import { from } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/index.js';
import { tap, first } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';
import { AppState } from "../models/AppState.class.js";
import { Details, TileList } from "../models/leaves.js";

class DataService extends Store {

    constructor() {
        super(new AppState([], "jimi hendrix", ""));
    }

    get data() {
        return this.store.data;
    }

    get query() {
        return this.store.query;
    }

    get page() {
        return this.store.page;
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
                this.store = new AppState(response.data, query, TileList(response.data))
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
                        page: Details(res)
                    };
                }),
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
                first(),
                tap(res => {
                    this.store = {
                        ...this.store,
                        query: query,
                        page: TileList(res.data)
                    };
                }),
            )

        return $http;
    }

}

export const data = new DataService();