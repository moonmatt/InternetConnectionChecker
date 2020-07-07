const express = require('express');
const app = express();
const ejs = require('ejs')
const fs = require('fs');
const moment = require('moment')
var cron = require('node-cron');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


const speedTest = require('@opstalent/speedtest.net');

// Change this to choose the frequency of speedtest https://crontab.guru/
cron.schedule('*/2 * * * *', () => {

    const test = speedTest({
        maxTime: 5000
    });

    test.on('data', data => {
        console.log("##################################")
        console.log("DOWNLOAD: " + data.speeds.download)
        console.log("UPLOAD: " + data.speeds.upload)
        console.log("##################################")

        let content = {
            "date": moment().format("YYYY-M-D H:mm"),
            "download": data.speeds.download,
            "upload": data.speeds.upload
        }
        fs.readFile('./public/file.json', 'utf-8', (err, file) => { // get Json file with older results
            if (err) {
                throw err;
            }

            // parse the results
            const newJson = JSON.parse(file.toString());
            newJson.Speedtests.push(content) // push the new speedtest to the other results

            // write all the results to the file
            fs.writeFile('./public/file.json', JSON.stringify(newJson, null, 4), (err) => {
                if (err) {
                    throw err;
                }
                console.log("JSON data is saved.");
            });
        });

    });

    test.on('error', err => {
        console.error(err);
    });
});


app.get("/", (req, res) => { // when visiting the homepage, load the results and send to the frontend
    fs.readFile('./public/file.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        const newJson = data.toString();
        res.render("index", {
            results: newJson
        })
    })
})

app.listen(1029, () => {
    console.log(`Express running → PORT 1029`);
});