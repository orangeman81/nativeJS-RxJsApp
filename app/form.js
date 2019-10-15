import { RockHeroes } from "./RockHeroes.class.js";

export const setForm = () => {
    let loop = document.createElement("section");
    loop.classList.add("row");

    let rockHeroes = new RockHeroes([], loop);

    rockHeroes.loopHeroes();

    const form = document.querySelector("#addForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        rockHeroes.addHero({
            name: form.elements.name.value,
            img: form.elements.img.value,
            role: form.elements.role.value
        });
        form.reset();
    });
}

export const unsetForm = () => {
    form.removeEventListener("submit");
}