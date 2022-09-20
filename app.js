const express = require('express');
const bodyParser = require('body-parser');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    const start = getSeconds(req.body.start);
    const end = getSeconds(req.body.end) - getSeconds(req.body.start);
    const fileName = req.body.fileName;

    getConverter(start, end, fileName).then(res.download(fileName))
})

app.listen(4000);

const getConverter = async (start, end, fileName) => {
    console.log("Starting");
    await ffmpeg({ source: 'fileURL'})
    .setStartTime(start)
    .duration(end)        
    .on('start', function (metadata) {
        console.log("Start");
        console.log(metadata);
    })
    .on('error', function (err) {
        console.log(err);
    })
    .on('end', function () {
        console.log("Done");
    })
    .saveToFile(fileName) 
}

const getSeconds = (inputhms) => {
    var hms = inputhms;   
    var a = hms.split(':'); 

    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    
    return seconds;
}