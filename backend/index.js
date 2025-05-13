const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const database = require("../backend/config/database");
const systemConfig = require("../backend/config/system");

const routeAdmin = require("../backend/routes/admin/index.route");
const route = require("../backend/routes/client/index.route");

database.connect();

const app = express();
// const port = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3001",
        "http://localhost:3000",
        "https://bookee-shop-website.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
route(app);

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });
