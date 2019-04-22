let divInvites = document.getElementById("invites");

fetch("/campeonato/invite/get")
    .then(res => res.json())
    .then(invites => {
        console.log(invites);
        
        invites.forEach(invite => {
            let div = document.createElement('div');
            let br = document.createElement('br');
            let name = document.createElement('h3');
            name.innerHTML = "Nome: " + invite.nmChampionship;
            
            div.appendChild(br);
            div.appendChild(name);
            divInvites.appendChild(div);
        });
    })
    .catch(err => console.log(err));