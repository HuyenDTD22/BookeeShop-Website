const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// Thêm dòng này để parse JSON body
app.use(express.json());

//cors
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];
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

// Đảm bảo header Access-Control-Allow-Credentials được gửi
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//parse application/json
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Sử dụng cookie-parser
app.use(cookieParser());

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Router
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
