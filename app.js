var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 1. IMPORT express-ejs-layouts
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 2. SỬ DỤNG express-ejs-layouts VÀ CẤU HÌNH FILE LAYOUT
app.use(expressLayouts);
// Thiết lập file layout mặc định là 'views/layout.ejs' (không cần .ejs)
app.set('layout', 'layout');
// Tùy chọn: Tắt layout cho các file view không cần (ví dụ: error.ejs)
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);


app.use(logger('dev'));
app.use(express.json());
// Middleware bắt buộc để đọc dữ liệu form POST (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // Bạn nên đảm bảo file error.ejs không sử dụng layout
    // Dùng { layout: false } cho các trang đặc biệt như 404/500
    res.render('error', { layout: false });
});

module.exports = app;