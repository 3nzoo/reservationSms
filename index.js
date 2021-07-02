const express = require("express");
const app = express()
const mysql = require('mysql')
const cors = require('cors')

const port = process.env.PORT || 4002;

const db = mysql.createPool({
    connectionLimit: 10,
    host: require('./config/keys').host,
    user: require('./config/keys').user,
    password: require('./config/keys').pass,
    database: require('./config/keys').database
});

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/api/contact', (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const message = req.body.message;
    const dateAdded = new Date();

    const sqlInsert = "INSERT INTO contact (name, phone, email,pax, time, request, schedule, addedat) VALUES (?,?,?,?,?)";
    db.query(sqlInsert, [name, phone, email, message, dateAdded], (err, result) => {
        
        const accountSid = require('./config/keys').sID;
        const authToken = require('./config/keys').aToken;
        const fromNumber = require('./config/keys').from;
        const reciever = require('./config/keys').reciever
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                body: `customer: ${name} \nContact #: ${phone} \nEmail: ${email} \nMessage: ${message} \nDate Inquired: ${dateAdded}`,
                from: `+${fromNumber}`,
                to: `+${reciever}`
            })
            .then(message => console.log('Sms Sent', message));
    });

});


app.post('/api/reservation', (req, res) => {

    const customer = req.body.name;
    const schedule = req.body.sched;
    const pax = req.body.pax;
    const contact = req.body.phone;
    const time = req.body.time;
    const customerRequest = req.body.customerRequest;
    const dateAdded = new Date();

    const sqlInsert = "INSERT INTO reservation (name, phone, Date,pax, time, request, schedule, addedat) VALUES (?,?,?,?,?,?,?)";
    db.query(sqlInsert, [customer, contact, schedule, pax, time, customerRequest, dateAdded], (err, result) => {

        const accountSid = require('./config/keys').sID;
        const authToken = require('./config/keys').aToken;
        const fromNumber = require('./config/keys').from;
        const reciever = require('./config/keys').reciever
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                body: `Customer Name: ${customer} \nContact #: ${contact} \nDate: ${schedule} \nPax: ${pax} \nTime: ${time} \nRequest: ${customerRequest} \nDate Inquired: ${dateAdded}`,
                from: `+${fromNumber}`,
                to: `+${reciever}`
            })
            .then(message => console.log('Reservation Sms Sent', message));
    });

});

app.get('/api', async (req, res) => {
    res.send('connected')
})

app.listen(port, () => {
    console.log(`server at port ${port}`);
});

