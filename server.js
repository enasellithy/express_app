const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/router');
const app = express();

app.use(bodyParser.json());
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
const dbURL= 'mongodb://localhost:27017/hello';

mongoose.connect(dbURL)
    .then((result) => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err);
    });


app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM HOMEPAGE');
})

app.listen(3000, () => {
    console.log('Server running on port : 3000');
})