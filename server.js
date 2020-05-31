const express = require("express");
const morgan = require("morgan");

const app = express();

const blogfulRouter = require('./blogfulRouter');

//log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.use('/blogful', blogfulRouter);


app.listen(process.env.PORT || 8080, ()=> {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});