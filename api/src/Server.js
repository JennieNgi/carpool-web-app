let express = require("express");
let cors = require('cors');
let path = require('path');
let MongoClient = require("mongodb").MongoClient;
let sanitizer = require('express-sanitizer');
let ObjectId = require('mongodb').ObjectId;

// MongoDB constants
const URL = "mongodb://mongo:27017/";
const DB_NAME = "dbRides";

// construct application object via express
let app = express();
// add cors as middleware to handle CORs errors while developing
app.use(cors());

// middleware to read incoming JSON with request
app.use(express.json());
// middleware to sanitize all incoming JSON data
app.use(sanitizer());


// get absolute path to /build folder (production build of react web app)
const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build");
// adding middleware to define static files location
app.use("/", express.static(CLIENT_BUILD_PATH));

app.get("/get", async (request, response) => {    
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);
        let rideArray = await db.collection("rides").find().sort({_id:-1}).toArray();
        
        let json = { "rides": rideArray};

        response.status(200);

        // serializes sampleJSON to string format
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.post("/postRide", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.origin = request.sanitize(request.body.origin);
        request.body.destination = request.sanitize(request.body.destination);
        request.body.originDisplay = request.sanitize(request.body.originDisplay);
        request.body.destinationDisplay = request.sanitize(request.body.destinationDisplay);
        request.body.departureDate = request.sanitize(request.body.departureDate);
        request.body.returnDate = request.sanitize(request.body.returnDate);
        request.body.departureTime = request.sanitize(request.body.departureTime);
        request.body.returnTime = request.sanitize(request.body.returnTime);
        request.body.emptySeats = request.sanitize(request.body.emptySeats);
        request.body.price = request.sanitize(request.body.price);
        request.body.tripDescription = request.sanitize(request.body.tripDescription);
        request.body.contact = request.sanitize(request.body.contact);
        request.body.postDate = request.sanitize(request.body.postDate);
        request.body.originVicinity = request.sanitize(request.body.originVicinity);
        request.body.destinationVicinity = request.sanitize(request.body.destinationVicinity);

        try {
            // insert new document into DB
            let result = await mongoClient.db(DB_NAME).collection("rides").insertOne(request.body);

            response.status(200);
            response.send(result);
        } catch (error) {
            response.status(500);
            response.send({error: error.message});
            throw error;
        } finally {
            mongoClient.close();
        }
          
        
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.put("/commentRide", async (request, response) => {    
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect();

        // sanitize and convert the id to an ObjectId object
        // becuz ID in mongo is not a string or number, it's an ObjectId object
        let id = new ObjectId(request.sanitize((request.body.rideID)));

        // sanitize all incoming JSON DATA
        request.body.author = request.sanitize(request.body.author);
        request.body.comment = request.sanitize(request.body.comment);
        request.body.commentDate = request.sanitize(request.body.commentDate);


        // updating new technology in collection in DB
        let ridesCollection = mongoClient.db(DB_NAME).collection("rides");
        
        let result = await ridesCollection.updateOne(

            {"_id":id},
            {
                //$push - $each - $position: 0 can help to push the object to the front
                $push : 
                {
                    comments : 
                    {
                        $each: [ {
                            author: request.body.author,
                            comment:  request.body.comment,
                            commentDate:  request.body.commentDate,
                        } ],
                        $position: 0
                    }
                }
            }
        );

        // catching error of incorrect id or id of photo that doesn't exist
        if (result.matchedCount <=  0){
            response.status(404);
            response.send({error: "No photo found with the ID"});
            mongoClient.close();
            return;
        }

        // status code
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        console.log(`>>> ERROR : ${error.message}`);
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.get("/findRide", async (request, response) => {    
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);

        request.body.origin = request.sanitize(request.body.origin);
        request.body.destination = request.sanitize(request.body.destination);


        let findRideArray = await db.collection("rides").find({"origin":request.body.origin, "destination":request.body.destination}).toArray();
        
        let json = { "rides": findRideArray};

        response.status(200);

        // serializes sampleJSON to string format
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.use("/*", express.static(CLIENT_BUILD_PATH));

// startup the Express server - listening on port 80
app.listen(80, () => console.log("Listening on port 80"));