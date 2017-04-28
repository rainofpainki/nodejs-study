const express = require('express');
const router = express.Router();
const models  = require('../models');
const moment = require('moment');

// 출석 조회
router.get('/:date?', (req, res)=>{
  //세션 체크
  if(!req.session.user_id) {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login');</script>");
    return false;
  }
  var today  = moment().format("YYYY-MM-DD");
  var date = (req.query.date || today) ;

  models.user.findAll({
    attributes : ['name', 'id'],
    include: [
      {
        model: models.attendance,
        where: {date: date},
        attributes : [
          [
            models.sequelize.fn('date_format', models.sequelize.col('submit_date'), '%H시 %i분 %s초'),
            'submit_date'
          ],
          'memo',
          'file_name'
        ]
      }
    ]
  }).then((row)=> {
    // row.forEach((el, index)=>{
    //   console.log(el.attendances);
    // });
    res.render('attendance', {
      date : date,
      data : row,
      hasInput : (today===date),
    });
  }).catch((err)=>{
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('오류가 발생했습니다. 관리자에게 문의해주세요.'); location.replace('/');</script>");
    return false;
  });

});


// 출석 등록
router.post('/', (req, res)=>{
  // 세션 체크
  if(!req.session.user_id) {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('로그인 후 이용해주세요.'); location.replace('/login');</script>");
    return false;
  }

  models.user.find({
    attributes : ['idx'],
    where : {id : req.session.user_id}
  }).then((row)=>{
    var today = moment().format("YYYY-MM-DD");
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    
    models.attendance.upsert({
      idx: row.idx,
      date: today,
      memo: req.body.memo,
      submit_date: now
    }).then((result)=>{
      console.log(result);
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>location.replace('/attendance?date="+ today +"');</script>");
      return true;
    }).catch((err)=>{
      console.log(err);
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end("<script>alert('등록하지 못했습니다. 다시 시도해주세요.'); location.replace('/attendance');</script>");
      return false;
    });

  }).catch((err)=>{
    console.log(err);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<script>alert('회원을 찾지 못했습니다.'); location.replace('/login');</script>");
    return false;
  });





});


// 출석 수정
router.put('/:date?', (req, res)=>{

});


// 출석 삭제
router.delete('/:date?', (req,res)=> {

});

module.exports = router;
