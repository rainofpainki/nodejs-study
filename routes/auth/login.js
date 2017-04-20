const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models  = require('../../models');

/* GET auth/login view */
router.get('/', (req, res)=>{
  if(req.session.user_id) {
    res.render('index', {
      user_id: req.session.user_id
    });
  } else {
    res.render('login');
  }
});

/* POST auth/login session@create */
router.post('/', (req, res)=>{
  var hashedPassword = crypto.createHash('sha256').update(req.body.pwd).digest('hex');

  models.user.findAndCount({
    where: {
      id: req.body.id,
      pass : hashedPassword
    }
  }).then((row)=>{
    if(row.count>0) {
      var ip =req.connection.remoteAddress;
      var prefix = ip.substring(ip.indexOf(":"), ip.lastIndexOf(":")+1 );
      ip = ip.replace(prefix, '');
      models.user.update(
                          {ip: ip},
                          {where:
                            {id:req.body.id}
                          }
                        );

      req.session.user_id = req.body.id;
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('"+ req.body.id + "님 환영합니다!');location.replace('/');</script>");
      console.log("user login / id : " + req.session.user_id);
      return true;
    } else {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('로그인 실패입니다.\\n아이디나 비밀번호가 맞지 않습니다.');location.replace('/login');</script>");
      return false;
    }
  }).catch((e)=>{
    console.log(e);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 실패입니다.\\n다시 시도해주세요.');location.replace('/login');</script>");
    return false;
  });
});

module.exports = router;
