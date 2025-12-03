// File: routes/index.js
var express = require('express');
var router = express.Router();
var multer = require('multer');

const UNSPLASH_ACCESS_KEY = 'm6Gv8T4tMheNrEx0ZMlSyvBEAfzXu7Bw0WAFpCudbwA';
const UPLOAD_DIR = './public/uploads/';

// --- 1. Cấu hình Multer ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        // Đặt tên file là thời gian hiện tại + tên gốc để tránh trùng lặp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// --- 2. Tạo Quy tắc Kiểm tra File (Chỉ PNG, <= 1MB) ---
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1 // 1MB
    },
    fileFilter: function (req, file, cb) {
        // Kiểm tra định dạng file (chỉ chấp nhận png)
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            // cb(null, false) sẽ từ chối file, sau đó ta dùng req.fileValidationError để bắt lỗi
            req.fileValidationError = 'Chỉ cho phép định dạng PNG!';
            cb(null, false);
        }
    }
// ➡️ Sử dụng .array('uploaded_images', 10) để cho phép multi-file (tối đa 10 file)
}).array('uploaded_images', 10);


// --- Các Route hiện có ---
router.get('/', function(req, res, next) {
    var name = "Chuong Pham"
    res.render('index', { title: 'Express', name: name });
});


router.get('/search', async function(req, res, next) {
    const query = req.query.query;

    let images = undefined;
    let total_results = 0;
    let error = undefined;

    if (query) {
        try {
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=16`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Unsplash API responded with status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            images = data.results;
            total_results = data.total;

        } catch (err) {
            console.error('Lỗi tìm kiếm ảnh:', err);
            error = `Không thể tìm kiếm ảnh lúc này. Lỗi: ${err.message}`;
        }
    }

    res.render('search_form', {
        title: query ? `Kết Quả: ${query}` : 'Tìm Kiếm Ảnh Unsplash',
        query: query || '',
        images: images,
        total_results: total_results,
        error: error
    });
});

// --- 3. ROUTE POST: Xử lý Upload ---
router.post('/upload', function(req, res) {

    // Khởi chạy middleware upload
    upload(req, res, function (err) {
        let uploadError = null;

        // ➡️ Xử lý lỗi từ Multer (Kích thước, Loại file, Lỗi khác)

        // 1. Lỗi Validation do fileFilter (Chỉ PNG)
        if (req.fileValidationError) {
            uploadError = req.fileValidationError;
        }
        // 2. Lỗi Kích thước file (> 1MB)
        else if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            uploadError = 'Kích thước file quá lớn. Chỉ cho phép file < 1MB.';
        }
        // 3. Lỗi Multer hoặc lỗi hệ thống khác
        else if (err) {
            uploadError = 'Lỗi upload không xác định: ' + err.message;
        }
        // 4. Kiểm tra đã chọn file chưa
        else if (!req.files || req.files.length === 0) {
            uploadError = 'Vui lòng chọn ít nhất một file ảnh để upload.';
        }

        // Nếu có lỗi, render lại trang upload/form với thông báo lỗi
        if (uploadError) {
            // Truyền lỗi và mảng file rỗng
            return res.render('upload_form', {
                title: 'Upload Ảnh',
                uploadedFiles: [], // Không có file nào thành công
                uploadError: uploadError
            });
        }

        // ➡️ 4. Upload thành công

        // Tạo danh sách các đường dẫn file đã upload để hiển thị
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            path: '/uploads/' + file.filename // Đường dẫn public
        }));

        // Render lại form với danh sách ảnh đã upload thành công
        res.render('upload_form', {
            title: 'Upload Ảnh Thành Công',
            uploadedFiles: uploadedFiles, // Truyền danh sách file
            uploadError: null // Không có lỗi
        });
    });
});

router.get('/upload-form', function(req, res) {
    res.render('upload_form', {
        title: 'Upload Ảnh',
        uploadedFiles: [], // Khởi tạo mảng rỗng
        uploadError: null    // Không có lỗi khi truy cập lần đầu
    });
});


module.exports = router;