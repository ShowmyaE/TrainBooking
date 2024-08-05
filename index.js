const express=require('express')
const app=express()
const sqlite3=require('sqlite3')
const {open}=require('sqlite')
const path=require('path')
const cors = require("cors");
const jwt = require('jsonwebtoken');



app.use(cors());
app.use(express.json())

const dbPath=path.join(__dirname,'demodb.db')
let db=null

const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(5000,()=>{
          console.log('Server Running at http://localhost:5000')
           
        })

    }catch(error){
        console.log(`DB Error : ${error.message}`)
        process.exit(1)
  }
}
initializeDbAndServer()

const authentication = (request, response, next) => {
    let jwtToken
    console.log("AUTH", request.headers['authorization'])
    const authHeader = request.headers['authorization']
    if (authHeader) {
      jwtToken = authHeader.split(' ')[1]
    }
    console.log("JWT", jwtToken)

    if (jwtToken) {
      jwt.verify(jwtToken, 'SECRET_KEY', (error, payload) => {
        if (error) {
          response.status(401)
          response.send('Invalid JWT Token')
        } else {
          request.email = payload.email
          request.username = payload.username
          next()
        }
      })
    } else {
      response.status(401)
      response.send('Invalid JWT Token')
    }
  }

app.post("/signUp",async(req,res)=>{

   
    const {username,email, password} = req.body
    console.log('DB value',email,password,username)
   
     const insertquery=`INSERT INTO signUp(Username, Email, Password)
    VALUES ('${username}', '${email}','${password}')`;
    const insertData=await db.run(insertquery)
if(insertData) {
    res.send({data:"successfully inserted"})
}
else{
    res.status(400)
    res.send({data:"Failed to inserted"})
}
})

app.post("/loginIn",async(req,res)=>{


    const {username, password} = req.body
    console.log('DB value',username,password)
    try {
        const getUserQuery = `SELECT * FROM signUp WHERE Username='${username}' AND Password='${password}';`
        const userDbDetails = await db.get(getUserQuery)
        // const userDbDetails = await User.findOne({ email });
        console.log(userDbDetails)
        if (userDbDetails) {
            const payload = {email:userDbDetails.email,userName:userDbDetails.username}
            const jwtToken = jwt.sign(payload, 'SECRET_KEY')
            res.send({jwtToken})
          } else {
            res.status(400)
            res.send('Invalid password')
          }
    }
    catch(error) {
        console.log("Error details", error)
    }
})



app.post('/addtrain',authentication,async(req,res)=>{
    const {train_name,source,destination,seat_capacity,arrival_time_at_source,arrival_time_at_destination} = req.body
    //    const createTable=`CREATE TABLE AddTrain(
    //         train_name varchar(255),
    //         source varchar(255),
    //         destination varchar(255),
    //         seat_capacity varchar(255),
    //         arrival_time_at_source varchar(255),
    //         arrival_time_at_destination varchar(255)
    //     );`
    //     const createData=await db.run(createTable);
    //     console.log(createData)
        const insertquery=`INSERT INTO AddTrain(train_name,source,destination,seat_capacity,arrival_time_at_source,arrival_time_at_destination)
        VALUES ('${train_name}','${source}','${destination}','${seat_capacity}','${arrival_time_at_source}','${arrival_time_at_destination}')`;
        const insertData=await db.run(insertquery)
        const getUserQuery=`select * from AddTrain`;
    
        const userDbDetails=await db.all(getUserQuery);
        console.log('DB value',userDbDetails);
        res.send(userDbDetails)
    
    })
    // http://localhost:3000/Email?email=showmya3@gmail.com
    app.get('/getseat', authentication, async(req,res)=>{
        console.log("req.query", req.query)
        const { source, destination} = req.query
        //    const createTable=`CREATE TABLE getSeat(
        //         train_name varchar(255),
        //         source varchar(255),
        //         destination varchar(255),
        //         seat_capacity varchar(255),
        //         arrival_time_at_source varchar(255),
        //         arrival_time_at_destination varchar(255)
        //     );`
            // const createData=await db.run(createTable);
            // console.log(createData)

            // const insertquery=`INSERT INTO AddTrain(train_name,source,destination,seat_capacity,arrival_time_at_source,arrival_time_at_destination)
            // VALUES ('Express Train','Station A', 'Station B',"100","14:00:00", "20:30:00")`;
            // const insertData=await db.run(insertquery)
            // const getUserQuery=`select * from AddTrain`;
            const getUserQuery = `SELECT * FROM AddTrain WHERE source='${source}' AND destination='${destination}';`
            const userDbDetails=await db.all(getUserQuery);
            console.log('DB value',userDbDetails);
            res.send(userDbDetails)
        
        })
        