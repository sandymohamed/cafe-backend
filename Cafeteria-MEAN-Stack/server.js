const express = require("express");
const cors = require("cors");
//const cookieSession = require("cookie-session");
const dbConfig = require("./config/db.config.js");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
})

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081"],
  })
);

const { productsRouter } = require("./routes/products");
const { categoriesRouter } = require("./routes/categories");
const { orderRouter } = require("./routes/order.routes");

app.use(express.json());

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// var corsOptions = {
//   credentials: true,
//   origin: "http://localhost:8081",
// };
// app.use(cors(corsOptions));

const db = require("./models");
const Role = db.role;

db.mongoose
   //.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(`${dbConfig.DBURL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cookieSession({
//     name: "Cafe-session",
//     keys: ["key1", "key2"],
//     secret: process.env.COOKIE_SECRET, //  secret environment variable
//     httpOnly: true,
//   })
// );
app.use(["/product", "/products"], productsRouter);
app.use(["/category", "/categories"], categoriesRouter);

app.use(["/order", "/orders"], orderRouter);

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
