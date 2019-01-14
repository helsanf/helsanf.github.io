function loadNav() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status != 200) return;

      document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
        elm.innerHTML = xhttp.responseText;
      });

      document
        .querySelectorAll(".sidenav a, .topnav a")
        .forEach(function (elm) {
          elm.addEventListener("click", function (event) {
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
          });
        });
    }
  };
  xhttp.open("GET", "nav.html", true);
  xhttp.send();
}

function loadPage(page) {
  var thePage = "pages/" + page + ".html";
  var myRequest = new Request(thePage);
  var content = document.querySelector("#body-content");

  caches.match(myRequest).then(function (response) {
    if (response) {
      response.text().then(function (text) {
        content.innerHTML = text;
      });
    }else{
      fetch(myRequest).then(function(response) {
        if(response.status == 404){
          throw Error("Halaman tidak ditemukan.");
        }
        return response.text().then(function(text) {
          content.innerHTML = text;
        });
      }).catch(error =>{
        content.innerHTML = "<p>"+error+"</p>";
      });
    }
  }).catch( err => {
    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
  });
  
  
}


document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var sidenav = M.Sidenav.init(elems);
  setTimeout(() => {
    var tabElems = document.querySelectorAll(".tabs");
    M.Tabs.init(tabElems);
  }, 200);
  loadNav();
  router();
});



window.addEventListener("hashchange", function (e) {
  router();
},false);

