export const Card = (data) => `
    <div class="col s12 m6 l4 bouncing">
        <article class="card">
            <div class="card-image">
                <img src="${data.album.cover_big}">
                <span class="card-title">${data.album.title}</span>
            </div>
            <div class="card-content">
                <h5 class="mb-16">${data.artist.name}</h5>
                <audio controls>
                    <source src="${data.preview}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div class="card-action">
                <a href="${data.artist.link}" target="_blank">Info</a>
                <button type="button" class="waves-effect waves-teal btn-flat" data-id="${data.album.id}">Details</button>
            </div>
        </article>
    </div>
`;

export const CardDetails = (data) => `
    <div class="col s12">
        <article class="card">
            <div class="card-content">
                <h3 class="mb-16">${data.title}</h3>
                <audio controls>
                    <source src="${data.preview}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div class="card-action">
                <a href="${data.link}" target="_blank">Info</a>
                <button type="button" class="waves-effect waves-teal btn-flat" id="back">List</button>
            </div>
        </article>
    </div>
`;

export const TrackList = (data) => {
    const trackList = data.tracks.data;

    let ul = document.createElement("ul");
    ul.classList.add("collection", "with-header");

    let wrapper = document.createElement("div");
    wrapper.classList.add("col", "s12");

    let list = `
        <li class="collection-header">
            <h4>Tracks</h4>
            <button type="button" class="waves-effect waves-teal btn-flat" id="back">List</button>
        </li>
    `;

    trackList.forEach(element => {
        let template = `
            <h5 class="mb-16">${element.title_short}</h5>
            <audio controls>
                <source src="${element.preview}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        let li = document.createElement("li");
        li.classList.add("collection-item");
        li.innerHTML = template;
        list = list.concat(li.outerHTML);
    });
    ul.innerHTML = list;
    wrapper.appendChild(ul);
    return wrapper.outerHTML;
};

export const ArtistCard = (data) => `
    <div class="col s12">
        <article class="card-panel grey lighten-5 z-depth-1">
            <div class="row noMargins">
                <div class="col s2">
                    <img src="${data.artist.picture_medium}" alt="${data.artist.name}" class="circle responsive-img">
                </div>
                <div class="col s10">
                    <h2>
                        ${data.artist.name}
                    </h2>
                </div>
            </div>
        </article>
    </div>
`;

export const detailsPage = (data) => {
    // const results = ArtistCard(data).concat(CardDetails(data));
    const results = ArtistCard(data).concat(TrackList(data));
    return results;
}

export const cardList = (list) => {
    let cardList = "";
    list.forEach(data => {
        const card = Card(data)
        cardList = cardList.concat(card);
    })
    return cardList;
}