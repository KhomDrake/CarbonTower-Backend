var express = require('express');
var router = express.Router();
let db = require("../database/db").Campeonato;

const authenticate = require('connect-ensure-login');

/* Information Machine
    Mother Board
    nmManufacturer
    nmModel
    nmOS
*/

/* Metricas
    useRam (255, 0, 0)
    tempGPU (255, 148, 0)
    useGPU (3, 254, 0)
    useDisc (131, 254, 166)
    useCPU (131, 254, 252)
    tempCPU (131, 67, 252)
*/

let use = 50;
let temp = 40;

let useRam = use,
    tempGPU = temp,
    useGPU = use,
    useDisc = use,
    useCPU = use, 
    tempCPU = temp;

function randomMetrics() {
    useRam = randomUse().toFixed(2);
    tempGPU = randomTemp().toFixed(2);;
    useGPU = randomUse().toFixed(2);;
    useDisc = randomUse().toFixed(2);;
    useCPU = randomUse().toFixed(2);;
    tempCPU = randomTemp().toFixed(2);;
}

function randomTemp() {
    return temp + (Math.random() > .5 ? (Math.random() * (temp/2) * 1) : (Math.random() * (temp/2) * -1));
}

function randomUse() {
    return use + (Math.random() > .5 ? (Math.random() * (use/2) * 1) : (Math.random() * (use/2) * -1));
}

router.get('/machine/:idUserRole/graphics/:idChampionship/latest', authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    randomMetrics();
    let data = {
        motherBoard: "SMC 2.27f2",
        nmManufacturer: "Apple Inc",
        nmModel: "MacBook Air",
        nmOS: "Apple macOS 10.13,6 (High Sierra) build 17G65",
        useRam: useRam,
        tempGPU: tempGPU,
        useGPU: useGPU,
        useDisc: useDisc,
        useCPU: useCPU,
        tempCPU: tempCPU
    }
    res.json(data);
});

router.get('/machine/:idUserRole/graphics/:idChampionship/last', authenticate.ensureLoggedIn('/users/login'), (req, res) => {
    randomMetrics();
    let data = {
        useRam: useRam,
        tempGPU: tempGPU,
        useGPU: useGPU,
        useDisc: useDisc,
        useCPU: useCPU,
        tempCPU: tempCPU
    }
    res.json(data)
});

module.exports = router;