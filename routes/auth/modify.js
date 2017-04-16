var express = require('express');
var router = express.Router();
const { user, sequelize } = require('../../models/user');

var passwordHash = require('password-hash');
/* GET auth/modify view */
router.get('/', function(req, res, next) {
  // 세션 체크
  if(req.session.user_id == '' || req.session.user_id == undefined) {
    console.error('<session data is null>');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login ');</script>");
    return false;
  }
  user.findAll({
    attributes: [ 'user_no', 'user_id', 'user_name', 'user_gender',  'user_email', 'user_mobile',
    [sequelize.fn('DATE_FORMAT', sequelize.col('user_birthdate'), '%Y'), 'yy'],
    [sequelize.fn('DATE_FORMAT', sequelize.col('user_birthdate'), '%m'), 'mm'],
    [sequelize.fn('DATE_FORMAT', sequelize.col('user_birthdate'), '%d'), 'dd'] ],
    where: {
      user_id:req.session.user_id
    }
  }).then(function(result) {
    console.log(result);
    res.render('modify', result[0].dataValues);

  }).catch(function(err){
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('데이터베이스 오류 발생!); location.replace('/login ');</script>");
    return false;
  });

});

/* POST auth/modify create */
router.post('/', function(req, res, next) {
  user.findAll({
    attribute: ['user_pwd'],
    where: {user_id: req.session.user_id}
  }).then(function(result) {
    var passwordHash = require('password-hash');
    if(passwordHash.verify(req.body.pwd, result[0].dataValues.user_pwd) === true) {

      user.update(
        {
          user_name : req.body.name,
          user_gender : req.body.gender,
          user_email : req.body.email,
          user_birthdate : req.body.yy +'-'+req.body.mm+'-'+req.body.dd,
          user_mobile : req.body.mobile
        },
        { where: {user_id:req.session.user_id} }
      ).then(function() {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<script>alert('회원정보수정 완료입니다.');location.replace('/');</script>");
        return false;
      }).catch(function(err) {
        console.log(err);
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<script>alert('회원정보수정 실패입니다.\\n다시 시도해주세요.');history.back(-1);</script>");
        return false;
      })

    } else {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('회원정보수정 실패입니다.\\n비밀번호가 맞지 않습니다.');history.back(-1);</script>");
      return false;
    }
  }).catch(function(err){
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원정보수정 실패입니다.\\n다시 시도해주세요.');history.back(-1);</script>");
    return false;
  });



});

module.exports = router;
