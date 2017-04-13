var express = require('express');
var router = express.Router();

/* GET modify listing. */
router.get('/', function(req, res, next) {
  // 세션 체크
  if(req.session.user_id == '' || req.session.user_id == undefined) {
    console.error('<session data is null>');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login ');</script>");
    return false;
  }

  var mysql = require('mysql');
  var dbconfig = require('./config/database.js');
  var connection = mysql.createConnection(dbconfig);

  var userInfoSql = "SELECT user_no, user_id, user_lastdate, user_name, user_gender, user_birthdate, date_format(user_birthdate, '%Y') as yy, date_format(user_birthdate, '%m') as mm, date_format(user_birthdate, '%d') as dd, user_email, user_mobile FROM yello_user u JOIN yello_userinfo ui USING(user_no) WHERE u.user_id = ?";
  connection.query(userInfoSql, req.session.user_id, function (error, rows) {
    if(error) {
      console.error('<get user info sql error>');
      console.error(userInfoSql);
      console.error(error);
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('회원정보 수정 실패입니다. \\n다시 로그인해주세요.');location.replace('/logout');</script>");
      return false;
    }

    res.render('modify', rows[0]);
  });


});

/* POST modify updating*/
router.post('/', function(req, res, next) {
    // 세션 체크
    if(req.session.user_id == '' || req.session.user_id == undefined) {
      console.error('<session data is null>');
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login ');</script>");
      return false;
    }

    // 넘어온 값 체크

    // 업데이트 쿼리
});

module.exports = router;
