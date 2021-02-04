const express           =       require("express");
const bodyParser        =       require("body-parser");
const mongoose          =       require("mongoose");
const authRoutes        =       require("./app/routes/auth");
const problem           =       require("./app/routes/problem");
const tagRoute          =       require("./app/routes/tag");
const notRequired       =       require('dotenv').config();
const cors              =       require("cors");
const compression       =       require("compression");
const path              =       require('path');

const { MONGO_DB_URI } = require('./app/config')

const port = process.env.PORT || 8000;            
const app = express();

app.set('view engine', 'ejs');

app.use((req, res, next) =>
{
    // '*' means we are allowing every host or client
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // This header is used to tell which kind of request can be sent i.e post,get and options. Browser will automatically send the 'OPTIONS'
    // method before sending the post requst so we have allow this method also.
    res.setHeader("Access-Control-Allow-Methods", 'POST,GET,OPTIONS');

    // This header tells which type of heade(s) you want to send
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // We don't allow "OPTIONS" method to reah our graphql api as it will handle it correctly
    if(req.method === "OPTIONS")
    return res.sendStatus(200);

    next();
})

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(authRoutes);
app.use(problem);
app.use(tagRoute);

if(process.env.NODE_ENV === "production") 
{
    app.use(express.static(path.join(__dirname, "client/build")));
  
    app.get("*", function (req, res) 
    {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true })
.then(() =>
{   
    app.listen(port, ()=>
    {
        console.log("Server is running on port : ",port);
    });
})
.catch(error =>
{
    console.log("Error in connecting MongoDB Atlas ",error);
})