import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import RestaurantTableBooking from "./services/restaurant.js";

const app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://labtyadr:P4QwEz9XgTXGqz3KaIM_BuyfNeU6yxk8@tai.db.elephantsql.com/labtyadr?ssl=true';
const postgresP = pgp();
const db = postgresP(connectionString);
const database = RestaurantTableBooking(db);

app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get("/", async (req, res) => {

    res.render('index', { tables : await database.getTables()})
});

app.get("/book", async (req, res) => {
    let username = req.body.username;
    let occupants = req.body.booking_size;
    let number = req.body.phone_number;
    let tableName = req.body.tableId;

    console.log('username :', username);
    console.log('occupants :', occupants);
    console.log('phone Number :', number);
    console.log('table name :', tableName);

    let bookingDetails = {
        table_name: tableName,
        seats: occupants,
        username: username,
        contact_number: number
    }

    await database.bookTable(bookingDetails)
    res.redirect('/')
});

app.get("/cancel", async (req, res) => {

    res.redirect('/bookings')
});

app.get("/bookings", async (req, res) => {
    res.render('bookings', { tables : await database.getBookedTables()})
});



var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});