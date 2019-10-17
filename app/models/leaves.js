export const Tile = (data) => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("col", "s6", "m4")
    const background = `background: #fff url('${data.album.cover_big}') no-repeat;background-size:cover`;
    const template = `
        <a href style="${background}" class="tile imgTile reverse" data-id="${data.album.id}">
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
    return tileList;
}

export const Details = (data) => {
    const trackList = data.tracks.data;

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
    const header = Header(data);
    ul.innerHTML = list;
    const results = header.concat(ul.outerHTML);
    return results;
};

const Header = (data) => `
    <div class="col s12">
        <header class="mainHeader">
            <span class="d-flex f-center">
                <img src="${data.cover}" class="imgRound mr-24">
                <span>
                    <h1>${data.artist.name}</h1>
                    <p>Track list</p>
                </span>
            </span>
            <span class="actions">
                <a href id="back">
                    <i class="material-icons tile-icon">list</i>
                </a>
            </span>
        </header>
        <hr>
    </div>
`;