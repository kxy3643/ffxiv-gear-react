require('dotenv').config();
const express = require('express');
const compression = require('compression');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
const api = require('./src/api');

app.disable('x-powered-by');
app.use(compression());
app.use(express.static(path.join(__dirname, 'client/build')));


app.get('/getTopDPS', (req, res) => {
    return api.getRanking().then((data) => {
        if(data === null){
            return res.status(504).json({message: 'FFlogs API Error'});
        }
        return res.status(200).json(data);
    }).catch(() => {
        return res.status(504).json({message: 'FFlogs API Error'});
    });
});




app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => {
  //console.log(`app listening on port ${port}`);
});