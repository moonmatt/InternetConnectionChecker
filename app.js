const express = require('express');
const app = express();
const ejs = require('ejs')
const fs = require('fs');
const path = require('path');
const moment = require('moment')
var cron = require('node-cron');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


const testAvailable = require('check-internet-connected');
const testSpeed = require('@opstalent/speedtest.net');

let getFilepath = (date) => {
    const path = './public/';
    return path + date + ".json";
};

let getDates = () => {
    const dir = './public/';
    const files = fs.readdirSync(dir);
    const dates = files.map((filename) => path.parse(filename).name);
    return dates;
}

let getResults = (date) => {
    const filepath = getFilepath(date);
    const data = fs.readFileSync(filepath, 'utf-8');
    return data.toString();
};

let writeDataPoint = (datapoint, key) => {
    const date = moment().format("YYYY-MM-DD");
    const filepath = getFilepath(date);
    if (!fs.existsSync(filepath)) {
        const json = {
            "Speedtests": [],
            "Availability": []
        }
        fs.writeFileSync(filepath, JSON.stringify(json), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON File Created: " + filepath)
        });
    }
    fs.readFile(filepath, 'utf-8', (err, file) => {
        if (err) {
            throw err;
        }

        const json = JSON.parse(file.toString());
        json[key].push(datapoint);

        fs.writeFile(filepath, JSON.stringify(json, null, 4), (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });
};

let writePingResult = (result) => {
    let datapoint = {
        "date": moment().format("YYYY-M-D H:mm"),
        "available": result
    };
    writeDataPoint(datapoint, "Availability");
};

// Change this to choose the frequency of speedtest https://crontab.guru/
cron.schedule('*/2 * * * *', () => {
    /* Test Connection Availability */
    const availabilityConfig = {
        timeout: 5000,
        retries: 5,
        domain: 'http://neverssl.com/'
    };
    testAvailable(availabilityConfig)
        .then((res) => { writePingResult(1); })
        .catch((ex) => { writePingResult(0); });

    /* Test Upload/Download Speed */

    const speed_test = testSpeed({
        maxTime: 5000
    });
    speed_test.on('data', data => {
        console.log("##################################")
        console.log("DOWNLOAD: " + data.speeds.download)
        console.log("UPLOAD: " + data.speeds.upload)
        console.log("##################################")

        let content = {
            "date": moment().format("YYYY-M-D H:mm"),
            "download": data.speeds.download,
            "upload": data.speeds.upload
        }
        writeDataPoint(content, "Speedtests");
    });
    speed_test.on('error', err => {
        console.error(err);
    });
});


app.get('/', function (req, res) {
    const date = moment().format("YYYY-MM-DD");
    console.log("GET: '/' => " + date);
    res.render("index", {
        results: getResults(date),
        dates: getDates()
    })
});

app.get('/:date', function (req, res) {
    const date = req.params.date;
    console.log("GET: '/" + date + "'");
    res.render("index", {
        results: getResults(date),
        dates: getDates()
    })
});

app.listen(1029, () => {
    console.log(`Express running → PORT 1029`);
});