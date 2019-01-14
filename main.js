var webPush = require('web-push');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
const express = require('express');
const app = express()
const port = 3000;

app.use(express.static(path.join(__dirname)))

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/send-notification',(req,res) =>{
    var pushSubscription = {
        "endpoint": req.headers['push-endpoint'],
        "keys": {
            "p256dh": req.headers['push-p256dh'],
            "auth": req.headers['push-auth']
        }
    };

    var payload = req.body.message;
    var options = {
        gcmAPIKey: 'AIzaSyD-Ot5mWb40TgpwF7l9_H1IgIodBD6klr8',
        TTL: 60
    };

    webPush.setVapidDetails(
        'mailto:helsanfirmansyah@gmail.com',
        'BGNIV9CZwYCFSkcl9BidYa-G3pUVUu8S-z-OsnYOhygyRYFDA91G__n05VHQ3LNp6qLh4j6A0N7Fo1EEmh3h-us',
        'Cjk4pm0pg7uaACJwymk-6uZpV1Usm-dn6yIBaCVZfKM'
    );

    webPush.sendNotification(
        pushSubscription,
        payload,
        options
    )
    .catch(err => console.log(err));
    res.json(req.body);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// var pushSubscription = {
//     "endpoint": "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABcO4j3brNXMlH7nNxxl52tD0v9N1BuoF6Cf3VPHPkiC9LX4t0rtA6Osk9Pbjg-zrVW6DhrUNh5RymjciDOwbyo07V_S6ADyy1hXQvqKs_p9xQxYNH7dlOa3L1_qbExCxHa6BKr_Olf6NQ4Wo5TTxEo2tTGi_IMJDVM8KJEpoSDbxKmQEU",
//     "keys": {
//         "p256dh": "BOVmIOipU0HYJISGK0RZTjS2v3RFQ1aE3TBoL5FCW9teTVitlDTaoWL7yjoJz4X0DdgPL3uv2Mu-Ghqb-ubiVXA",
//         "auth": "Niv5HAHvJqzSFXzZiHD6Qw"
//     }
// };

// var payload = "Here is payload";
// var options = {
//     // gcmAPIKey: 'AIzaSyD-Ot5mWb40TgpwF7l9_H1IgIodBD6klr8',
//     TTL: 60
// };

// webPush.setVapidDetails(
//     'mailto:helsanfirmansyah@gmail.com',
//     'BGNIV9CZwYCFSkcl9BidYa-G3pUVUu8S-z-OsnYOhygyRYFDA91G__n05VHQ3LNp6qLh4j6A0N7Fo1EEmh3h-us',
//     'Cjk4pm0pg7uaACJwymk-6uZpV1Usm-dn6yIBaCVZfKM'
// );

// webPush.sendNotification(
//     pushSubscription,
//     payload,
//     options
// )
// .catch(err => console.log(err));