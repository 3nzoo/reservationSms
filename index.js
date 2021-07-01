const express = require("express");
const app = express()
const mysql = require('mysql')
const cors = require('cors')

const port = process.env.PORT || 4002;
const hostname = require('./config/keys').host;
const username = require('./config/keys').user;
const dbpassword = require('./config/keys').pass;
const dbname = require('./config/keys').database


const db = mysql.createPool({
    connectionLimit:10,
    host    :hostname,
    user    :username,
    password:dbpassword,
    database:dbname
});

console.log('database', db);

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// db.connect((err)=>{
//     if(err){throw err} 
//     console.log('db is connected');
// });

app.post('/api/reservation',(req,res)=>{

    const customer = req.body.name;
    const schedule = req.body.body;
    // const pax = req.body.pax;
    // const contact = req.body.contact
    // const resDate = Date.now
    // const cusRequest = req.body.customRequest

    //***mysql query */
    // const sqlInsert = "INSERT INTO message (customer, schedule, pax, contact, resDate) VALUES (?,?,?,?)";
    // db.query(sqlInsert, [customer, schedule, pax,resDate], (err,result)=>{
    //     console.log(result);
    // })


    const sqlInsert = "INSERT INTO message (name, body) VALUES (?,?)";
    db.query(sqlInsert, [customer, schedule], (err,result)=>{
    });


// const accountSid = require('./config/keys').sID;
// const authToken = require('./config/keys').aToken;
// const fromNumber = require('./config/keys').from;
// const reciever =require('./config/keys').reciever
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'customer: ${customer} \nSchedule: ${schedule} \nPax: ${pax} \nContact: ${contact} \nRequest: ${request}',
//      from: `+${fromNumber}`,
//      to: `+${reciever}` 
//    })
//   .then(message => console.log(message.sid));

});

app.get('/api', async (req,res)=>{
    res.send('connected')
})

// create new data in table using get
app.get('/newmessage', async (req,res)=>{
    const message = {name:'heroku', body:'from heroku: for five at 3pm'};

    //INSERT INTO {Table Name} SET ?
    const sql = 'INSERT INTO message SET ?'
    const query = await db.query(sql, message, (err, result)=>{
        if(err){
            throw err;
        } 
        console.log('res', result);
        res.send('new message created....')
    })
})


app.listen(port,()=>{
    console.log(`server at port ${port}`);
});

