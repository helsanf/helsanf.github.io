var base_url = "https://api.football-data.org/v2/";
const apiToken = "4756306d4d1b4eaeb157d617b5c30aa4";
const defaultHeaders = {
  'X-Auth-Token': apiToken
}

const ligas = [{
    id: 2001,
    name: "Champions League",
    image: "cl.svg"
  },
  {
    id: 2014,
    name: "Liga Spanyol",
    image: "ligabbva.png"
  },
  {
    id: 2002,
    name: "Liga German",
    image: "bundesliga.svg"
  },
  {
    id: 2003,
    name: "Liga Belanda",
    image: "eredivisie.svg"
  },
  {
    id: 2015,
    name: "Liga Perancis",
    image: "ligue1.svg"
  }
];

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}


function getLigaStandingsById(id,callback) {
  // Ambil nilai query parameter (?id=)
  if ("caches" in window) {
    caches.match(base_url + "competitions/" + id + "/standings").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          callback(data);
        });
      }else{
        fetch(base_url + "competitions/" + id + "/standings", {
            method: "GET",
            headers: defaultHeaders
          })
          .then(status)
          .then(json)
          .then(function (data) {
            callback(data);
          });
      }
    });
  }
}

function getScheduledMatchById(id,matchDay, callback) {
  // Ambil nilai query parameter (?id=)
  if ("caches" in window) {
    caches.match(base_url + "competitions/" + id + "/matches?status=SCHEDULED&matchday="+matchDay).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          callback(data);
        });
      } else {
        fetch(base_url + "competitions/" + id + "/matches?status=SCHEDULED&matchday=" + matchDay, {
            method: "GET",
            headers: defaultHeaders
          })
          .then(status)
          .then(json)
          .then(function (data) {
            callback(data);
          });
      }
    });
  }
}

function getTeamById(id, callback) {
  // Ambil nilai query parameter (?id=)
  if ("caches" in window) {
    caches.match(base_url + "teams/" + id).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          callback(data);
        });
      }else{
        fetch(base_url + "teams/" + id, {
            method: "GET",
            headers: defaultHeaders
          })
          .then(status)
          .then(json)
          .then(function (data) {
            callback(data);
          });
      }
    });
  }
  

}

function getMatchById(id, callback) {
  // Ambil nilai query parameter (?id=)
  if ("caches" in window) {
    caches.match(base_url + "matches/" + id).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          callback(data);
        });
      } else {
        fetch(base_url + "matches/" + id, {
            method: "GET",
            headers: defaultHeaders
          })
          .then(status)
          .then(json)
          .then(function (data) {
            callback(data);
          });
      }
    });
  }


}