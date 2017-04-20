const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models  = require('../../models');

/* GET auth/modify view */
router.get('/', (req, res)=>{

  // 세션 체크
  if(!req.session.user_id) {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login ');</script>");
    return false;
  }

  models.user.findOne({
    attributes: ['id','name', 'tel', 'phone', 'email',
    [models.sequelize.fn('DATE_FORMAT', models.sequelize.col('birth'), '%Y-%m-%d'), 'birth']
  ],
    where: {
      id: req.session.user_id
    }
  }).then((row)=>{
    console.log(row);
    res.render('modify', {
      data:row
    });

  }).catch((e)=>{
    console.log(e);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('데이터베이스 오류 발생!); location.replace('/login ');</script>");
    return false;
  });

});

/* POST auth/modify create */
router.post('/', (req, res, next)=>{
  var hashedPassword = crypto.createHash('sha256').update(req.body.pwd).digest('hex');
  models.user.findAndCount({
    where: {
            id: req.session.user_id,
            pass: hashedPassword
          }
  }).then((row)=> {
    if(row.count>0) {
      console.log(req.body);
      models.user.update(
        {
          name : req.body.name,
          gender : req.body.gender,
          email : req.body.email,
          birth : req.body.birth,
          tel : req.body.tel,
          phone : req.body.phone
        },
        { where: {id:req.session.user_id} }
      ).then(()=>{
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<script>alert('회원정보수정 완료입니다.');location.replace('/');</script>");
        return false;
      }).catch((e)=>{
        console.log(e);
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<script>alert('회원정보수정 실패입니다.\\n다시 시도해주세요.');history.back(-1);</script>");
        return false;
      })
    } else {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('회원정보수정 실패입니다.\\n비밀번호가 맞지 않습니다.');history.back(-1);</script>");
      return false;
    }
  }).catch((e)=>{
    console.log(e);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원정보수정 실패입니다.\\n다시 시도해주세요.');history.back(-1);</script>");
    return false;
  });
});

module.exports = router;
