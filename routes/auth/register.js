var express = require('express');
var router = express.Router();
const {user} = require('../../models/user');
var passwordHash = require('password-hash');

/* GET auth/register view */
router.get('/', function(req, res, next) {
    res.render('register');
});

/* POST auth/register create */
router.post('/', function(req, res, next) {

  var hashedPassword = passwordHash.generate(req.body.pswd1, {
      algorithm: 'sha256'
  });

  user.create(
    {
      user_id: req.body.id,
      user_pwd: hashedPassword,
      user_name: req.body.name,
      user_gender: req.body.gender,
      user_birthdate: req.body.yy + '-' + req.body.mm + '-' + req.body.dd,
      user_email: req.body.email,
      user_mobile: req.body.mobile
    }
  ).then(function(result) {
    console.log(result);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원가입이 완료되었습니다.\\n로그인 후 이용해주세요.');location.replace('/login');</script>");
    return true;
  }).catch(function (err) {
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원가입 실패입니다.\\n관리자에게 문의해주세요.');location.replace('/register');</script>");
    return false;
  });
});

module.exports = router;
