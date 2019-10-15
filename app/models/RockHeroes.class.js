export class RockHeroes {
    constructor(heroes, element) {
        this.roles = {
            1: "guitar",
            2: "Singer",
            3: "Bass",
            4: "Drums"
        }
        this.heroes = heroes;
        this.loop = element;
        this.loop.setAttribute = ("id", "#loop");
        document.querySelector('main').appendChild(this.loop);
    }

    loopHeroes() {
        this.heroes.forEach((e, i) => {
            e.role = this.roles[e.role];
            let element = document.createElement("div");
            element.classList.add('col', 's12', 'm6');
            element.innerHTML = `
                <div class="card">
                    <div class="card-image">
                        <img src="${e.img}">
                        <span class="card-title">${e.name}</span>
                    </div>
                    <div class="card-content">
                        <p>${e.role}</p>
                    </div>
                    <div class="card-action">
                        <a href="#">This is a link</a>
                    </div>
                </div>
            `;
            return this.loop.appendChild(element);
        });
    }

    addHero(hero) {
        hero = {
            ...hero,
            role: this.roles[hero.role]
        };
        this.heroes = {
            ...this.heroes,
            hero
        }
        let element = document.createElement("div");
        element.classList.add('col', 's12', 'm6');
        element.innerHTML = `
            <div class="card">
                <div class="card-image">
                    <img src="${hero.img}">
                    <span class="card-title">${hero.name}</span>
                </div>
                <div class="card-content">
                    <p>${hero.role}</p>
                </div>
                <div class="card-action">
                    <a href="#">This is a link</a>
                </div>
            </div>
        `;
        return this.loop.appendChild(element);
    }
}