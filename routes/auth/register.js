const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models  = require('../../models');

/* GET auth/register view */
router.get('/', (req, res)=>{
  if(req.session.user_id) {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('이미 로그인되어 있습니다.');location.replace('/');</script>");
    return false;
  } else {
    res.render('register');
  }
});

/* POST auth/register create */
router.post('/', (req, res)=>{
  if(req.body.pswd1 !== req.body.pswd2){

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('비밀번호 확인란을 다시 압력해주세요.'); history.back(-1);</script>");
    return false;
  }

  var hashedPassword = crypto.createHash('sha256').update(req.body.pswd1).digest('hex');

  var ip =req.connection.remoteAddress;
  var prefix = ip.substring(ip.indexOf(":"), ip.lastIndexOf(":")+1 );
  ip = ip.replace(prefix, '');
  models.user.create(
    {
      id: req.body.id,
      pass: hashedPassword,
      name: req.body.name,
      birth: req.body.birth,
      email: req.body.email,
      tel: req.body.tel,
      phone: req.body.phone,
      ip: ip
    }
  ).then( ()=>{
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원가입이 완료되었습니다.');location.replace('/login');</script>");
    return true;
  }).catch( (e)=>{
    console.log(e);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원가입 실패입니다.');location.replace('/register');</script>");
    return false;
  });

});

module.exports = router;
