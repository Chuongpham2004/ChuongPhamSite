// File: routes/index.js
var express = require('express');
var router = express.Router();

const UNSPLASH_ACCESS_KEY = 'm6Gv8T4tMheNrEx0ZMlSyvBEAfzXu7Bw0WAFpCudbwA';

/* GET home page. (Giữ nguyên) */
router.get('/', function(req, res, next) {
    var name = "Chuong Pham"
    res.render('index', { title: 'Express', name: name });
});

/* 🚀 ROUTE TÌM KIẾM 
 * Xử lý cả hiển thị form (lần đầu) và hiển thị kết quả (sau khi tìm kiếm) 
 */
router.get('/search', async function(req, res, next) {
    const query = req.query.query;

    // Mặc định, không có ảnh và lỗi
    let images = undefined;
    let total_results = 0;
    let error = undefined;

    if (query) {
        // Nếu có từ khóa tìm kiếm (người dùng đã submit form)
        try {
            // Tạo URL API tìm kiếm (per_page=16 để có nhiều ảnh hơn)
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=16`;

            // Gửi yêu cầu đến Unsplash API
            const response = await fetch(url);

            if (!response.ok) {
                // Xử lý lỗi HTTP (ví dụ: 401 Unauthorized nếu key sai, 403 Rate Limit)
                throw new Error(`Unsplash API responded with status: ${response.status} ${response.statusText}`);
            }

            // Bóc tách JSON
            const data = await response.json();
            images = data.results;
            total_results = data.total;

        } catch (err) {
            console.error('Lỗi tìm kiếm ảnh:', err);
            error = `Không thể tìm kiếm ảnh lúc này. Lỗi: ${err.message}`;
        }
    }

    // Render view, truyền tất cả dữ liệu cần thiết
    res.render('search_form', {
        title: query ? `Kết Quả: ${query}` : 'Tìm Kiếm Ảnh Unsplash',
        query: query || '',
        images: images,
        total_results: total_results,
        error: error
    });
});

module.exports = router;