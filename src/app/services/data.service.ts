import { Store } from "../models/store.class";
import { AppState } from "../models/AppState.class";
import { Details, TileList, RadioList, RadioDetails } from "../core/leaves";
import { from, forkJoin, Observable } from "rxjs";
import { first, tap } from "rxjs/operators";

class DataService extends Store<AppState> {

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

    $fetch(query, method = "GET"): Observable<any> {
        const promise = fetch(`https://deezerdevs-deezer.p.rapidapi.com/${query}`, {
            "method": method,
            "headers": {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "6d76812301mshae66073ae2beca5p1e12adjsnc9f2b3725389"
            }
        })
            .then(response => {
                return response.json();
            })
            .catch(err => {
                console.log(err);
            });

        return from(promise);
    }

    fetchMusic(query): Promise<any> {
        return fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
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

    $fetchAlbum(id): Observable<any> {
        return this.$fetch(`album/${id}`)
            .pipe(
                tap(res => {
                    this.store = {
                        ...this.store,
                        page: Details(res)
                    };
                }),
            )
    }

    $fetchRadioList(): Observable<any> {
        return this.$fetch(`radio/lists`)
            .pipe(
                tap(res => {
                    this.store = {
                        ...this.store,
                        page: RadioList(res.data)
                    };
                }),
            )
    }

    $fetchRadio(id): Observable<any> {
        const $radioDetails = forkJoin(this.$fetch(`radio/${id}`), this.$fetch(`radio/${id}/tracks`))
        return $radioDetails
            .pipe(
                tap(radio => {
                    this.store = {
                        ...this.store,
                        page: RadioDetails(radio)
                    };
                }),
            )

    }

    $search(query): Observable<any> {
        return this.$fetch(`search?q=${query}`)
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
    }

}

export const data = new DataService();