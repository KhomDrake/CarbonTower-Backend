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
        return SQLQuery(`insert into TableCampeonato values ('${campeonato.nome}', ${campeonato.campeonatoOwner})`);
    },
    getCampeonatosParticipo: (userData) => {
        return SQLQuery(`select * from TableUser, TableUserPaper, TableCampeonato, TableParticipaCampeonato where TableUser.userData = '${userData}'
        and TableUserPaper.userData = '${userData}' and TableUserPaper.idPaper = 1 and TableParticipaCampeonato.idUserPaper = 
            TableUserPaper.idUserPaper and TableParticipaCampeonato.idCampeonato = TableCampeonato.idCampeonato;`);
    }
}

module.exports.Users = {
    insertUser: (user) => {
        return SQLQuery(`insert into tableuser(userData, nmUser, userPassword) values('${user.userData}', '${user.nmUser}', '${user.userPassword}')`)
            .then(res => {
                if(user.userData.length == 11) {
                    return SQLQuery(`insert into TableUserPaper values ('${user.userData}', 1)`);
                }
                else 
                {
                    return SQLQuery(`insert into TableUserPaper values ('${user.userData}', 2)`);
                }
            });
    },
    getUser: (user) => {
        return SQLQuery(`select * from tableuser where tableuser.userData = '${user.userData}'`);
    },
    getUserData: (userData) => {
        return SQLQuery(`select * from tableuser, tablepaper, tableuserpaper where tableuser.userData = '${userData}' and tableuserpaper.userData = '${userData}' and tablepaper.idpaper = tableuserpaper.idpaper`);
    }
}