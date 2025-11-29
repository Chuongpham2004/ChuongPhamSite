var express = require('express');
var router = express.Router();

/* * ROUTE GET /users
 * Hiển thị form nhập liệu (sử dụng view users.ejs)
 */
router.get('/', function(req, res, next) {
    // res.render() sẽ tìm file 'users.ejs' trong thư mục 'views'
    res.render('users', {
        title: 'User Form',
        message: null // Không có thông báo ban đầu
    });
});

/* * ROUTE POST /users
 * Xử lý dữ liệu form gửi lên
 */
router.post('/', function(req, res, next) {
    // Dữ liệu từ form nằm trong req.body (nhờ middleware express.urlencoded)
    const { name, age } = req.body;

    // 1. Kiểm tra dữ liệu (Validation cơ bản)
    if (!name || !age) {
        // Trả về form cùng thông báo lỗi
        return res.render('users', {
            title: 'User Form',
            // Sử dụng cú pháp message đã định nghĩa trong users.ejs
            message: {
                type: 'error',
                text: 'Vui lòng điền đầy đủ Tên và Tuổi.'
            }
        });
    }

    // 2. Logic Xử lý (Ví dụ: Lưu vào Database)
    console.log(`[FORM SUBMITTED] Tên: ${name}, Tuổi: ${age}. Express Router đã xử lý thành công.`);

    // 3. Trả về form cùng thông báo thành công
    res.render('users', {
        title: 'User Form',
        message: {
            type: 'success',
            text: `Chào ${name}, bạn ${age} tuổi. Dữ liệu đã được xử lý thành công!`
        }
    });
});

module.exports = router;