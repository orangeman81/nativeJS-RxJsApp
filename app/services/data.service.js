import { Store } from "../models/store.class.js";
import { map, tap, filter } from 'https://unpkg.com/@reactivex/rxjs@6.5.3/dist/esm2015/operators';

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
                console.log(this.store$.value);
                this.displayData();
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayData() {
        return this.$store
            .pipe(
                filter(state => state.data),
                tap(() => {
                    this.template.innerHTML = "";
                }),
                map(state => {
                    state.data.map(e => {
                        let element = document.createElement("div");
                        element.classList.add('col', 's12', 'm6', 'bouncing');
                        element.innerHTML = `
                            <div class="card">
                                <div class="card-image">
                                    <img src="${e.album.cover_big}">
                                    <span class="card-title">${e.album.title}</span>
                                </div>
                                <div class="card-content">
                                    <p>${e.artist.name}</p>
                                </div>
                                <div class="card-action">
                                    <a href="${e.artist.link}" target="_blank">Info</a>
                                    <a href="" data-id="${e.id}">Details</a>
                                </div>
                            </div>
                        `;
                        return this.template.appendChild(element);
                    })
                })
            )
            .subscribe();
    }

    setDetails(details) {
        const item = this.store.data.find(e => e.id === details);
        console.log(item, details);
        this.template.innerHTML = `
            <div class="card">
                <div class="card-image">
                    <img src="${item.album.cover_xl}">
                    <span class="card-title">${item.album.title}</span>
                </div>
                <div class="card-content">
                    <h4>${item.title}</h4>
                    <p>${item.artist.name}</p>
                </div>
                <div class="card-action">
                    <button class="waves-effect waves-teal btn-flat" id="back">List</button>
                </div>
            </div>
        `
        console.log(this.store);
    }

}

export const data = new DataService();