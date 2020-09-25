const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv  = require('dotenv');
const morgan = require('morgan');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');


//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

// coonect database
connectDB();

const app = express();

// in order to accept data from the form we are using this middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
})) // we are using the method overide in the edit stories page

// logging
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

const { stripTags } = require('./helpers/hbs');

// Handlebars
// we also set the extension name to '.hbs' instead of the dafault
// set the view engine here as well
app.engine('.hbs', exphbs({ helpers: {
  stripTags
}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Express session
app.use(session({
    secret: 'keyboard cat',
    resave: false, // we dont want to save a session if nothing is modified
    saveUninitialized: false, // do not create a session until sonething is stored
    store: new MongoStore({mongooseConnection: mongoose.connection}) // store the session in the database
  }))

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// static folders
app.use(express.static(path.join(__dirname, 'public')));

// setting routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/diary', require('./routes/diary'));

// we are taking our port we set in the config if it's not there we are running on port 3000
const PORT = process.env.PORT || 3000


app.listen(PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`));