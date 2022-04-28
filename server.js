const express = require("express");
const cors = require("cors");
const dbConfig = require('./app/config/db.config');
const app = express();

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to test application." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const db = require("./app/models");
const Position = db.position;
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function initial() {
  Position.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Position({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to Positions collection");
      });
      new Position({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to Positions collection");
      });
      new Position({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to Positions collection");
      });
    }
  });
}