let db = require("mssql");

let config = {
    user: "tower",
    password: "!Carbon6",
    server: "servercarbontower.database.windows.net",
    database: "carbontower",
    options: {
        encrypt: true
    }
}

let T_MACHINE_METRIC = "T_MACHINE_METRIC";
let T_USER_MACHINE = "T_USER_MACHINE";
let T_MACHINE = "T_MACHINE";
let T_METRIC = "T_METRIC";
let T_STREAM = "T_STREAM";
let T_TEAM_IN_MATCH = "T_TEAM_IN_MATCH";
let T_MATCH = "T_MATCH";
let T_PLAYER_IN_TEAM = "T_PLAYER_IN_TEAM";
let T_TEAM = "T_TEAM";
let T_ADMINISTRATOR_CHAMPIONSHIP = "T_ADMINISTRATOR_CHAMPIONSHIP";
let T_PLAYER_IN_CHAMPIONSHIP = "T_PLAYER_IN_CHAMPIONSHIP";
let T_CHAMPIONSHIP = "T_CHAMPIONSHIP";
let T_GAME = "T_GAME";
let T_USER_ROLE = "T_USER_ROLE";
let T_ROLE = "T_ROLE";
let T_USER = "T_USER";
let T_INVITE_PLAYER = "T_INVITE_PLAYER";

let jogador = 3;
let administrador = 2;
let empresa = 1;

let g = false;

function SQLQuery(queryLine)
{
    if(g)
    {
        return global.conn.request().
        query(queryLine).
        then(results => {
            return results.recordset;
        })
    }
    else
    {
        return db.connect(config)
            .then(conn => {
                global.conn = conn;
                g = true;
                return global.conn.request().query(queryLine);
            })
            .then(results => {
                return results.recordset;
            })
    }
}

module.exports.Campeonato = {
    insertCampeonato: (campeonato) => {
        let idGame_fk = campeonato.game;
        let owner_fk = campeonato.owner;
        let nmChampionship = campeonato.name;
        return SQLQuery(`insert into ${T_CHAMPIONSHIP} values (${idGame_fk}, '${owner_fk}', '${nmChampionship}')`);
    },
    getCampeonatosParticipo: (userData) => {
        let idUser = userData;
        
        return SQLQuery(`select * from ${T_USER}, ${T_USER_ROLE}, ${T_CHAMPIONSHIP}, ${T_PLAYER_IN_CHAMPIONSHIP} 
            where ${T_USER}.idUser = '${idUser}' and ${T_USER_ROLE}.idUser_fk = '${idUser}' and
            ${T_USER_ROLE}.idRole_fk = ${jogador} and ${T_PLAYER_IN_CHAMPIONSHIP}.idPlayer_fk = 
            ${T_USER_ROLE}.idUserRole and ${T_PLAYER_IN_CHAMPIONSHIP}.idChampionship_fk = 
            ${T_CHAMPIONSHIP}.idChampionship`);
    },
    getCampeonatosEmpresa: (userData) => {
        let idUser = userData;
        return SQLQuery(`select * from T_USER, ${T_GAME}, T_USER_ROLE, T_CHAMPIONSHIP where T_USER.idUser = '${idUser}' 
        and T_USER_ROLE.idUser_fk = '${idUser}' and T_USER_ROLE.idRole_fk = 1 and 
        T_CHAMPIONSHIP.owner_fk = T_USER_ROLE.idUserRole and ${T_GAME}.idGame = ${T_CHAMPIONSHIP}.idGame_fk`);
    },
    getCampeonatoEmpresa: (userData, idUserRole, idCampeonato) => {
        let idUser = userData;
        return SQLQuery(`select * from T_USER, ${T_GAME}, T_USER_ROLE, T_CHAMPIONSHIP where T_USER.idUser = '${idUser}' 
        and T_USER_ROLE.idUser_fk = '${idUser}' and T_USER_ROLE.idRole_fk = 1 and 
        T_CHAMPIONSHIP.owner_fk = ${idUserRole} and ${T_GAME}.idGame = ${idCampeonato}`);
    },
    insertInvite: (championshipId, playerId) => {
        let user;
        return SQLQuery(`select * from ${T_USER_ROLE} where 
                ${T_USER_ROLE}.idUser_fk = '${playerId}' and ${T_USER_ROLE}.idRole_fk = ${jogador}`)
            .then(resultado => {
                if(resultado.length == 0) {
                    return new Error("Não existe esse usuario");
                } else {
                    user = resultado[0];
                    return SQLQuery(`select * from  ${T_INVITE_PLAYER} where ${T_INVITE_PLAYER}.idPlayer_fk = ${user.idUserRole}
                        and ${T_INVITE_PLAYER}.idChampionship_fk = ${championshipId}`)
                }
            })
            .then(resultado => {
                if(resultado.length != 0) {
                    return new Error("Usuário já tem o convite");
                } else {
                    return SQLQuery(`insert into ${T_INVITE_PLAYER} values (${user.idUserRole}, ${championshipId}, 0, 0)`)
                }
            });
    },
    getInvitePlayer: (idUser) => {
        return SQLQuery(`select * from ${T_USER_ROLE} where ${T_USER_ROLE}.idUser_fk = '${idUser}' and 
            ${T_USER_ROLE}.idRole_fk = ${jogador}`).then(jogador => {
                console.log(jogador);
                let idUserRole = jogador[0].idUserRole;
                console.log(idUserRole);
                
                return SQLQuery(`select * from ${T_INVITE_PLAYER}, ${T_CHAMPIONSHIP} 
                    where ${T_INVITE_PLAYER}.idPlayer_fk = ${idUserRole} and 
                        ${T_CHAMPIONSHIP}.idChampionship = ${T_INVITE_PLAYER}.idChampionship_fk and
                        ${T_INVITE_PLAYER}.alreadyAnswered = 0`);
            })
            .then(resultado => {
                console.log(resultado);
                return resultado;
            })
    }
}

module.exports.Users = {
    insertUser: (user) => {
        let userPassword = user.userPassword;
        let idUser = user.userData;
        let nmUser = user.nmUser;
        return SQLQuery(`insert into ${T_USER} values('${idUser}', '${userPassword}', '${nmUser}')`)
            .then(res => {
                if(idUser.length == 11) {
                    return SQLQuery(`insert into ${T_USER_ROLE} values ('${idUser}', ${jogador})`);
                }
                else 
                {
                    return SQLQuery(`insert into ${T_USER_ROLE} values ('${idUser}', ${empresa})`);
                }
            });
    },
    getUser: (user) => {
        return SQLQuery(`select * from ${T_USER} where ${T_USER}.idUser = '${user.userData}'`);
    },
    getUserData: (userData) => {
        return SQLQuery(`select * from ${T_USER}, ${T_ROLE}, ${T_USER_ROLE} where 
        ${T_USER}.idUser = '${userData}' and ${T_USER_ROLE}.idUser_fk = '${userData}'
         and ${T_ROLE}.idRole = ${T_USER_ROLE}.idRole_fk`);
    }
}