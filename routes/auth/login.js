var express = require('express');
var router = express.Router();
const {user} = require('../../models/user');
var passwordHash = require('password-hash');

/* GET auth/login view */
router.get('/', function(req, res, next) {
  if(req.session.user_id != '' && req.session.user_id != undefined) {
    res.render('index', {
      user_id: req.session.user_id
    });
  } else {
    res.render('login');
  }
});

/* POST auth/login session@create */
router.post('/', function(req, res, next) {
  user.findAll({
    attribute: ['user_pwd'],
    where: {user_id: req.body.id}
  }).then(function(result) {
    var passwordHash = require('password-hash');
    if(passwordHash.verify(req.body.pwd, result[0].dataValues.user_pwd) === true) {
      req.session.user_id = req.body.id;
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('"+ req.body.id + "님 환영합니다!');location.replace('/');</script>");
      console.log("user login / id : " + req.session.user_id);
      return true;
    } else {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인 실패입니다.\\n비밀번호가 맞지 않습니다.');location.replace('/login');</script>");
      return false;
    }
  }).catch(function(err){
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 실패입니다.\\n다시 시도해주세요.');location.replace('/login');</script>");
    return false;
  });
});

module.exports = router;
