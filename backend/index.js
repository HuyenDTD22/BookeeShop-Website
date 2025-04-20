const express = require("express");
const path = require("path");
// const session = require('express-session');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const flash = require('express-flash');
// const moment = require('moment');
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

// app.set("views", `${__dirname}/views`);
// app.set("view engine", "pug");

// //Flash - Thư viện để hiện thị thông báo
// app.use(session({
//     secret: 'dshfgdgfdffdf', // Chuỗi bí mật để mã hóa session
//     resave: false,           // Không lưu session nếu không thay đổi
//     saveUninitialized: true, // Lưu session ngay cả khi chưa khởi tạo
//     cookie: { maxAge: 60000 } // Thời gian hết hạn session (60 giây)
// }));
// app.use(flash()); //Sử dụng express-flash

//End Flash

// //TinyMCE
// app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//End TinyMCE

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// app.locals.moment = moment; //Khai báo biến toàn cục moment

// app.use(express.static(`${__dirname}/public`));

//Router
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
