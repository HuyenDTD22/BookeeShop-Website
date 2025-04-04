const express = require('express');
// const path = require('path');
// const session = require('express-session'); 
// const methodOverride = require('method-override');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const flash = require('express-flash');
// const moment = require('moment');
require("dotenv").config();

const database = require("./config/database");
// const systemConfig = require("./config/system");

const routeApiVer1 = require("./api/v1/routes/index.route");

database.connect();

const app = express();
const port = process.env.PORT; 

// app.use(methodOverride('_method'));

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// //Sử dụng cookie-parser
// app.use(cookieParser()); 

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

// //App locals variables - biến toàn cục, sử dụng ở đâu cũng được
// app.locals.prefixAdmin = systemConfig.prefixAdmin; // biến prefixAdmin sẽ tồn tại ở trong tất cả các file pug, sử dụng ở đâu cũng được 
// app.locals.moment = moment; //Khai báo biến toàn cục moment

// app.use(express.static(`${__dirname}/public`));

//Router Version 1
routeApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})