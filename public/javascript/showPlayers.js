let divPlayers = document.getElementById("players");
let idChamp = document.getElementById("idChamp");

fetch(`/campeonato/${idChamp.innerHTML}/players`)
    .then(res => res.json())
    .then(players => {
        players.forEach(player => {
            let div = document.createElement('div');
            div.style.border = "2px solid red"
            let br = document.createElement('br');
            let name = document.createElement('h2');
            name.innerHTML = "Nome: " + player.nmUser;
            let detalhes = document.createElement('h3');
            detalhes.innerHTML = `<a href="campeonato/player/${player.idUserRole}/${player.idChampionship}"> Detalhes </a>`;
            div.appendChild(br);
            div.appendChild(name);
            divPlayers.appendChild(div);
        });
    })
    .catch(err => console.log(err));