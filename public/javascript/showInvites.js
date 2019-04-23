let divInvites = document.getElementById("invites");

fetch("/campeonato/invite/get")
    .then(res => res.json())
    .then(invites => {
        console.log(invites);
        
        invites.forEach(invite => {
            let div = document.createElement('div');
            div.style.border = "2px solid red"
            let br = document.createElement('br');
            let name = document.createElement('h3');
            let aceitar = document.createElement('h3');
            let recusar = document.createElement('h3');
            name.innerHTML = "Nome: " + invite.nmChampionship;
            aceitar.innerHTML = `<a href="/campeonato/invite/${invite.idChampionship}/accept"> Aceitar </a>`;
            recusar.innerHTML = `<a href="/campeonato/invite/${invite.idChampionship}/refuse"> Recusar </a>`;
            div.appendChild(aceitar);
            div.appendChild(recusar);
            div.appendChild(br);
            div.appendChild(name);
            divInvites.appendChild(div);
        });
    })
    .catch(err => console.log(err));