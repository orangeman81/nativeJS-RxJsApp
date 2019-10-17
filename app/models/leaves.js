export const Tile = (data) => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("col", "s4", "m3")
    const background = `background: #fff url('${data.album.cover_big}') no-repeat;background-size:cover`;
    const template = `
        <a href style="${background}" class="tile imgTile reverse" data-action="details" data-id="${data.album.id}">
            <h4>${data.album.title}</h4>
            <h5>${data.artist.name}</h5>
        </a>
    `
    wrapper.innerHTML = template;
    return wrapper.outerHTML;
}

export const TileList = (list) => {
    let tileList = "";
    list.forEach(data => {
        const tile = Tile(data)
        tileList = tileList.concat(tile);
    })
    const header = Header(list[0]);
    tileList = header.concat(tileList);
    return tileList;
}

export const Details = (data) => {
    const trackList = data.tracks.data;
    const header = TrackHeader(data);

    let ul = document.createElement("ul");
    ul.classList.add("col", "s12", "list");

    let list = "";

    trackList.forEach(element => {
        let template = `
            <h5>${element.title_short}</h5>
            <audio controls>
                <source src="${element.preview}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        let li = document.createElement("li");
        li.innerHTML = template;
        list = list.concat(li.outerHTML);
    });

    ul.innerHTML = list;
    const results = header.concat(ul.outerHTML);

    return results;
};

const TrackHeader = (data) => `
    <div class="col s12">
        <header class="mainHeader">
            <span class="d-flex f-center">
                <img src="${data.artist.picture}" class="imgRound mr-24">
                <span>
                    <h1>${data.artist.name}</h1>
                    <p class="d-flex f-center">${data.type}&ensp;&VerticalSeparator;&ensp;${data.title}</p>
                </span>
            </span>
            <span class="actions">
                <a href>
                    <i data-action="back" class="material-icons tile-icon">list</i>
                </a>
            </span>
        </header>
        <hr>
    </div>
`;

const Header = (data) => `
    <div class="col s12">
        <header class="mainHeader">
                <span class="d-flex f-center">
                    <img src="${data.artist.picture}" class="imgRound mr-24">
                    <span>
                        <h1>${data.artist.name}</h1>
                        <p class="d-flex f-center">${data.artist.type}&ensp;&VerticalSeparator;&ensp;<i class="material-icons tile-icon">favorite</i>&thinsp;${data.rank}</p>
                    </span>
                </span>
        </header>
        <hr>
    </div>
`;