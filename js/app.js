function router() {
    let url = window.location.hash.substr(1).split("/");
    switch (url[1]) {
        case "tim":
            timPageRoute(url[2]);
            break;
        case "liga":
            ligaPageRoute(url[2]);
            break;
        case "favorit":
            favoritPageRoute();
            break;
        case "match":
            matchPageRoute();
            break;
        case "home":
            homePageRoute();
            break;
        default:
            homePageRoute();
            break;
    }
}

function matchPageRoute(){
    loadPage("follow-match");
    setTimeout(() => {
        loadScheduleOnMatchPage();
    }, 300);
}

function loadScheduleOnMatchPage() {

    let trx = dbPromise.result.transaction(["followingMatches"], "readwrite");
    trx.oncomplete = function () {
        console.log('Following Match transaction sukses');
    }

    trx.onerror = function () {
        console.error('Oops, terjadi kesalahan');
    }
    let store = trx.objectStore('followingMatches');
    let storeAction = store.getAll();

    // console.log(storeAction);
    storeAction.onsuccess = function (event) {
        let el = document.getElementById('followingMatches');
        let results = event.target.result;

        html = `<ul class="collection with-header">`;
        results.forEach(function (data) {
            let matchDate = new Date(data.utcDate);
            html += `
                    <li class="collection-item">
                        <div>
                            <p>
                                <a href="#/tim/${data.homeTeam.id}">${data.homeTeam.name}</a> vs <a href="#/tim/${data.awayTeam.id}">${data.awayTeam.name}</a> <br />    
                                ${matchDate}
                                <a onclick="unFollowMatch(${data.id})" class="secondary-content btn" style="position:relative;top:-20px;">unFollow</a>
                            </p>
                        </div>
                    </li>
            `;
        });

        html += `</ul>`;

        el.innerHTML = html;
    }
}

function unFollowMatch(id){
    let trx = dbPromise.result.transaction(["followingMatches"], "readwrite");
    trx.oncomplete = function () {
        console.log('Following Matches transaction sukses');
    }

    trx.onerror = function () {
        console.error('Oops, terjadi kesalahan');
    }
    let store = trx.objectStore('followingMatches');
    let storeAction = store.delete(id);

    // console.log(storeAction);
    storeAction.onsuccess = function (event) {
        loadScheduleOnMatchPage();
        M.toast({
            html: 'Success to unfollow match'
        });
    }
}

function timPageRoute(id){
    loadPage('tim');
    setTimeout(() => {
        var tabElems = document.querySelectorAll(".tabs");
        M.Tabs.init(tabElems);
        getTeamById(id,function(data){
            loadTeamImageOnTimPage(data);
            loadTeamHeaderOnTimPage(data);
            loadDetailsOnTimPage(data);
            loadSquadsOnTimPage(data);
        });
    }, 300);
}

function loadTeamImageOnTimPage(data){
    let el = document.getElementById('team-image');
    html = `
        <img src="${data.crestUrl}" style="width:100%;">
    `;
    el.innerHTML = html;
}

function loadTeamHeaderOnTimPage(data){
    let el = document.getElementById('team-header');
    html = `
        <h3>${data.name}</h3>
        <a class="waves-effect waves-light btn" style="color: #fff;"
        onclick="addToFavorite(${data.id})">Favorit</a>
    `;
    el.innerHTML = html;
}

function addToFavorite(id){
    getTeamById(id, function (data) { 
        let trx = dbPromise.result.transaction(["favoriteClubs"], "readwrite");
        trx.oncomplete = function () {
            console.log('Favorite Clubs transaction sukses');
        }

        trx.onerror = function () {
            console.error('Oops, terjadi kesalahan');
            M.toast({html: 'Oops, something wrong'});
        }
        let store = trx.objectStore('favoriteClubs');
        let storeAction = store.put(data,data.id);

        storeAction.onsuccess = function(){
            console.log('Favorite Club berhasil disimpan.');
            M.toast({html: 'Success add to favorite'})
        }
    });
}

function loadDetailsOnTimPage(data){
    let el = document.getElementById('details');
    html = `
    <h5>Team Details</h5>
    <table>
        <tr>
            <td width="20%">Short Name</td>
            <td>${data.shortName}</td>
        </tr>
        <tr>
            <td width="20%">Acronym</td>
            <td>${data.tla}</td>
        </tr>
        <tr>
            <td width="20%">Year Founded</td>
            <td>${data.founded}</td>
        </tr>
        <tr>
            <td width="20%">Website</td>
            <td><a href="${data.website}">${data.website}</a></td>
        </tr>
        <tr>
            <td width="20%">Email</td>
            <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
            <td width="20%">Club Colors</td>
            <td><a href="${data.clubColors}">${data.clubColors}</a></td>
        </tr>
        <tr>
            <td width="20%">Venue</td>
            <td><a href="${data.venue}">${data.venue}</a></td>
        </tr>
    </table>
    `;

    el.innerHTML = html;
}

function loadSquadsOnTimPage(data){
    let el = document.getElementById('squads');
    html = `
    <table>
        <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Position</th>
            <th>Nationality</th>
        </tr>
    `;

    data.squad.filter( d => d.role == "PLAYER").forEach(data =>{
        let shirtNumber = data.shirtNumber? data.shirtNumber : '';
        html += `
        <tr>
            <td>${shirtNumber}</td>
            <td>${data.name}</td>
            <td>${data.position}</td>
            <td>${data.nationality}</td>
        </tr>
        `;
    })

    html += `</table>`;

    el.innerHTML = html;
}


function ligaPageRoute(id){
    loadPage("liga");

    setTimeout(() => {
        loadLigasOnLigaPage(id);
        
    }, 100);
}

function loadScheduleOnLigaPage(id,matchDay){
    html = `<ul class="collection with-header">
                <li class="collection-header"><h4>Scheduled Match</h4></li>`;
    getScheduledMatchById(id,matchDay,function(data){
            
        data.matches.forEach(function(data){
            let matchDate = new Date(data.utcDate);
            html += `
                    <li class="collection-item">
                        <div>
                            <p>
                                <a href="#/tim/${data.homeTeam.id}">${data.homeTeam.name}</a> vs <a href="#/tim/${data.awayTeam.id}">${data.awayTeam.name}</a> <br />    
                                ${matchDate}
                                <a onclick="followMatch(${data.id})" class="secondary-content btn" style="position:relative;top:-20px;">Follow</a>
                            </p>
                        </div>
                    </li>
            `;
        })

        html += "</ul>";

        document.getElementById("matches").innerHTML = html;
    })
}

function followMatch(id){
    getMatchById(id,function(data){
        let trx = dbPromise.result.transaction(["followingMatches"], "readwrite");
        trx.oncomplete = function () {
            console.log('Follow Match transaction sukses');
        }
    
        trx.onerror = function () {
            console.error('Oops, terjadi kesalahan');
        }
        let store = trx.objectStore('followingMatches');
        let storeAction = store.put(data.match,id);
    
        storeAction.onsuccess = function (event) {
            let match = data.match;
            let message = "Anda menfollow pertandingan "+match.homeTeam.name+" vs "+match.awayTeam.name;
            sendFollowPushNotif(message);
            // M.toast({
            //     html: 'Success to follow match'
            // });
        }
    })
}

function sendFollowPushNotif(message){
    if (('PushManager' in window)) {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: aKey
            }).then(function (sub) {
                console.log("Send Notif");
                subData = sub.toJSON();
                // console.log("endpoint ", subData.endpoint);
                // console.log("p256dh ", subData.keys.p256dh);
                // console.log("auth ", subData.keys.auth);
                sendNotifToServer(subData, message);
            }).catch(function (e) {
                console.error(e);
            });
        });
    }
}

function sendNotifToServer(subs,message){
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("push-endpoint",subs.endpoint);
    headers.append("push-p256dh", subs.keys.p256dh);
    headers.append("push-auth", subs.keys.auth);
    fetch("/send-notification",
    {
        headers: headers,
        method:"POST",
        mode: 'cors',
        body: JSON.stringify({
            message: message
        })
    }).then(res => res.json())
    .then(res => console.log(res))

}

function loadLigasOnLigaPage(id){
    ligaHtml = '';
    getLigaStandingsById(id, function (data) {
        loadScheduleOnLigaPage(id, data.season.currentMatchday);
        let totalStanding = data.standings.filter(d => d.type == "TOTAL")
        document.getElementById('ligaName').innerHTML = data.competition.name;
        totalStanding.forEach(function (data2) {
            ligaHtml += `
                <div class="row">
                <div class="col s12">
                    <h4>Standings</h4>`;

            if (data2.group) {
                let g = data2.group.split("_");
                let group_name = g[0] + " " + g[1];
                ligaHtml += `<h5>${group_name}</h5>`;
            }

            data2.table.forEach(function (data3) {
                ligaHtml += `
                        <div class="col s12 m3">
                            <a href="#/tim/${data3.team.id}">
                                <div class="card horizontal standings">
                                <div class="card-stacked">
                                    <div class="card-content flex">
                                    <div class="position">${data3.position}.</div>
                                    <div class="team">${data3.team.name}</div>
                                    </div>
                                </div>
                                <div class="card-image">
                                    <img src="${data3.team.crestUrl}" width="50px" height="50px">
                                </div>
                                </div>
                            </a>
                        </div>`;
            })

            ligaHtml += `
                                </div>
                            </div>
                            `;
        })
        document.getElementById("liga").innerHTML = ligaHtml;
    })
}

function favoritPageRoute(){
    loadPage("favorit");

    setTimeout(() => {
        loadFavoriteClub();
    }, 300);
}

function loadFavoriteClub(){
    let trx = dbPromise.result.transaction(["favoriteClubs"], "readwrite");
    trx.oncomplete = function () {
        console.log('Favorite Clubs transaction sukses');
    }

    trx.onerror = function () {
        console.error('Oops, terjadi kesalahan');
    }
    let store = trx.objectStore('favoriteClubs');
    let storeAction = store.getAll();

    // console.log(storeAction);
    storeAction.onsuccess = function (event) {
        let el = document.getElementById('favoritClubs');
        let results = event.target.result;

        html = `<div class="col s12">
                        <div class="row">`;
        results.forEach(function (data) {
            html += `
                    <div class="col s12 m4">
                        <div class="card favorites">
                            <div class="card-content flex">
                                <div class="card-image">
                                    <img src="${data.crestUrl}" style="width:100%">
                                </div>
                                <div class="card-title">
                                    <a href="#/tim/${data.id}">${data.name}</a>
                                </div>
                            </div>
                            <div class="card-action">
                                <a href="#/tim/${data.id}" class="btn">Lihat</a>
                                <a onclick="deleteFromFavorite(${data.id})" class="btn">Hapus</a>
                            </div>
                        </div>
                    </div>

                `;
        });

        html += `</div>
                    </div>`;

        el.innerHTML = html;
    }
}

function deleteFromFavorite(id){
    let trx = dbPromise.result.transaction(["favoriteClubs"], "readwrite");
    trx.oncomplete = function () {
        console.log('Favorite Clubs transaction sukses');
    }

    trx.onerror = function () {
        console.error('Oops, terjadi kesalahan');
    }
    let store = trx.objectStore('favoriteClubs');
    let storeAction = store.delete(id);

    // console.log(storeAction);
    storeAction.onsuccess = function (event) {
        loadFavoriteClub();
        M.toast({html: 'Success to delete favorite'});
    }
}

function homePageRoute(){
    loadPage("home");
    setTimeout(() => {
        ligasHtml = '';
        ligas.forEach(function (data) {
            ligasHtml += `
        <div class="col s12 m3">
            <div class="card liga">
                <div class="card-image">
                    <img src="images/${data.image}">
                </div>
                <div class="card-content">
                    <a href="#/liga/${data.id}"><span class="card-title">${data.name}</span></a>
                </div>
            </div>
        </div>
      `;
        });

        document.getElementById("ligas").innerHTML = ligasHtml;
    }, 500);
    
}
