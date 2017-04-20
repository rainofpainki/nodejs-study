const express = require('express');
const router = express.Router();

/* GET auth/logout session@destory */
router.get('/', (req, res)=>{
  req.session.destroy(function() {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그아웃 되었습니다.'); location.replace('/');</script>");
  });
});


module.exports = router;
