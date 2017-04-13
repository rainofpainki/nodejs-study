var express = require('express');
var router = express.Router();

/* GET login */
router.get('/', function(req, res, next) {
  res.render('login', {
    title: '로그인'
  });
});

/* POST login */
router.post('/', function(req, res, next) {
  console.log(req.body);

  if(req.body.id == '' || req.body.id == null) {
    console.error('<id is null>');
    //res.send();

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인에 실패하였습니다.\\n아이디를 입력해주세요.');history.back();</script>");
    return false;
  }


  if(req.body.pwd == '' || req.body.pwd == null) {
    console.error('<pwd is null>');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인에 실패하였습니다.\\n비밀번호를 입력해주세요.');history.back();</script>");
    return false;
  }
  // user data object
  var user = {
      user_id: req.body.id,
      user_pwd: req.body.pwd
  };

  var mysql = require('mysql');
  var dbconfig = require('./config/database.js');
  var connection = mysql.createConnection(dbconfig);
  connection.connect(function(error) {
      if (error) {
          console.error('<mysql connection error>');
          console.error(error);
          //throw error;
          res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
          res.end("<script>alert('로그인에 실패하였습니다.\\n관리자에게 문의하세요.');history.back();</script>");
          return false;
      }
  });

  connection.query('use yello');

  var getPasswordSql = "SELECT user_pwd FROM yello_user WHERE user_id = ?";
  connection.query(getPasswordSql, user.user_id, function(error, rows) {
    // 오류 검사
    if(error) {
      console.error('<get password sql error>');
      console.error(error);
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인에 실패하였습니다. \\n암호를 정확히 입력해주세요.');history.back();</script>");
      return false;
    }

    console.log(rows[0]);
    // id 있는지 검사
    if(rows[0] == undefined || rows[0].user_pwd == null)  {
      console.error('<user pwd is null>');
      console.error(error);
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인에 실패하였습니다. \\n존재하지 않는 아이디입니다.');history.back();</script>");
      return false;
    }

    var passwordHash = require('password-hash');
    // 암호 체크
    if(passwordHash.verify(user.user_pwd, rows[0].user_pwd) === true) {
      req.session.user_id = user.user_id;
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('"+ req.session.user_id +"님 환영합니다!');location.replace('/');</script>");
      return true;
    } else {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인에 실패하였습니다. \\n비밀번호가 맞지 않습니다.');history.back();</script>");
      return false;
    }

  });
});

module.exports = router;
