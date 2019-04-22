let campeonatoDiv = document.getElementById("campeonato");

fetch("/campeonato/get")
    .then(res => res.json())
    .then(campeonatos => {

    })
    .catch(err => console.log(err));