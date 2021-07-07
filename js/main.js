let pokemonName = null;
let pokemonId = null;

let canClick = false;
let visorIsOpen = false;

let pokemonData = [];
let currentPokemon = -1;

window.onload = () => {
    pokemonName = document.getElementById('pokemonName');
    pokemonId = document.getElementById('pokemonId');

    loadResoursces();
};

async function loadResoursces() {
    pokemonData = await getAllPokemonData(await getAllPokemon());

    changePokemon();

    canClick = true;
    currentPokemon = 0;
}

async function getAllPokemon() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=151', { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            return data['results'];
        });
}

/**
 * 
 * @param {Array} allPokemonResults
 */
async function getAllPokemonData(allPokemonResults) {
    let pokemonDatas = [];

    for (let i = 0; i < allPokemonResults.length; i++) {
        let pkData = await fetch(allPokemonResults[i].url, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                return data;
            });

        pokemonDatas.push(
            {
                'name': pkData['name'],
                'sprite': pkData['sprites']['front_default']
            }
        )
    }
    return pokemonDatas;
}


async function changePokemon() {
    let pokemonImage = document.getElementById('pokemonImage');

    let index = currentPokemon < 0 ? 0 : currentPokemon;

    pokemonImage.setAttribute('src', pokemonData[index].sprite);
    pokemonName.innerHTML = pokemonData[index].name;
    pokemonId.innerHTML = index + 1;
}

function changeVisor() {
    let visorAnimationTrigger = document.querySelector('.pokedex__visor-animation');

    let left = visorAnimationTrigger.children[0];
    let right = visorAnimationTrigger.children[1];

    if (!canClick || currentPokemon < 0) return;

    canClick = false;

    if (left.classList.contains('anim__left-activate') || right.classList.contains('anim__right-activate')) {
        left.classList.remove('anim__left-activate');
        right.classList.remove('anim__right-activate');
        visorIsOpen = false;
    }
    else {
        left.classList.add('anim__left-activate');
        right.classList.add('anim__right-activate');
        visorIsOpen = true;
    }

    toggleVisualization();

    setTimeout(() => {
        canClick = true;
    }, 1000);
}

/**
 * 
 * @param {Element} element 
 */
function changeCurrentPokemon(element) {

    if (currentPokemon < 0) return;

    if (element.hasAttribute('next')) {
        currentPokemon++;
    }
    else if (element.hasAttribute('prev')) {
        currentPokemon--;
    }

    currentPokemon = Math.min(Math.max(currentPokemon, 0), pokemonData.length - 1);
    console.log(currentPokemon);
    changePokemon();
}

function toggleVisualization() {
    if (visorIsOpen) {
        pokemonName.classList.remove('hidden');
        pokemonId.classList.remove('hidden');
    }
    else {
        pokemonName.classList.add('hidden');
        pokemonId.classList.add('hidden');
    }
}
