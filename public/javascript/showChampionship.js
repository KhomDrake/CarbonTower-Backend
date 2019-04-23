let campeonatoDiv = document.getElementById("campeonato");

fetch("/campeonato/get")
    .then(res => res.json())
    .then(campeonatos => {
        console.log(campeonatos);
        campeonatos.forEach(campeonato => {
            let div = document.createElement('div');
            div.style.border = "2px solid red"
            let br = document.createElement('br');
            let name = document.createElement('h2');
            name.innerHTML = "Nome: " + campeonato.nmChampionship;
            let game = document.createElement('h2');
            game.innerHTML = "Game: " + campeonato.nmGame;
            let detail = document.createElement('h2');
            detail.innerHTML = `<a href="/campeonato/detail/${campeonato.idChampionship}"> Detalhes </a>`;
            div.appendChild(br);
            div.appendChild(name);
            div.appendChild(game);
            div.appendChild(detail);
            campeonatoDiv.appendChild(div);
        });
    })
    .catch(err => console.log(err));