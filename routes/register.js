var express = require('express');

var router = express.Router();

/**
 * rollback function
 * @param  object res
 * @param  object connection database handle obj
 * @param  string error      error word
 * @param  string msg        message
 */
var rollback = function(res, connection, error, msg, script="<script>alert('회원가입에 실패하였습니다. \\n관리자에게 문의하세요.');history.back();</script>") {
    console.log(msg);
    console.log('TRANSACTION ROLLBACK');
    connection.rollback(function(rollbackError) {
        if(rollbackError) {
          console.log('<ROLLBACK ERROR>');
          console.error(rollbackError);
        }
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end(script);
        return false;
    });
    return true;
};



/* GET register view */
router.get('/', function(req, res, next) {
    res.render('register', {
        title: '회원가입'
    });
});

/* POST register insert */
router.post('/', function(req, res, next) {
    console.log(req.body);
    var mysql = require('mysql');
    var dbconfig = require('./config/database.js');
    var connection = mysql.createConnection(dbconfig);
    connection.connect(function(error) {
        if (error) {
            console.error('<mysql connection error>');
            console.error(error);
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.end("<script>alert('회원가입에 실패하였습니다.\\n관리자에게 문의하세요.');history.back();</script>");
            return false;
        }
    });
    connection.query('use yello');

    // begin transaction
    connection.beginTransaction(function(error) {
        if (error) {
            console.log('<BEGIN TRANSACTION ERROR>');
            console.error(error);
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.end("<script>alert('회원가입에 실패하였습니다.\\n관리자에게 문의하세요.');history.back();</script>");
            return false;
        }

        // password-hash
        var passwordHash = require('password-hash');
        var hashedPassword = passwordHash.generate(req.body.pswd1, {
            algorithm: 'sha256'
        });


        // user data object
        var user = {
            user_id: req.body.id,
            user_pwd: hashedPassword
        };

        // id 중복검사
        var userExistSql = 'SELECT count(1) as cnt FROM `yello_user` WHERE user_id = ?';
        connection.query(userExistSql, user.user_id, function(error, rows) {
            if (error) {
                return rollback(res, connection, error, '<USER EXISTS SQL ERROR>');
            }
            console.log(rows);
            console.log(rows[0].cnt);

            if (rows[0].cnt > 0 ) {
                return rollback(res, connection, error, '<USER ID EXISTS>', "<script>alert('이미 존재하는 ID입니다. 다른 ID를 사용해주세요.');history.back();</script>");
            } else {
              // user insert sql
              var userInsertSql = 'INSERT INTO `yello_user` SET ?';
              connection.query(userInsertSql, user, function(error, result) {
                  if (error) {
                      return rollback(res, connection, error, '<USER SQL ERROR>');
                  }
                  console.log('USER INSERT SUCCESS');

                  // userInfo data object
                  var userInfo = {
                      user_no: result.insertId,
                      user_name: req.body.name,
                      user_gender: req.body.gender,
                      user_birthdate: req.body.yy + '-' + req.body.mm + '-' + req.body.dd,
                      user_email: req.body.email,
                      user_mobile: req.body.mobile
                  };

                  // user info insert sql
                  var userInfoSql = "INSERT INTO `yello_userinfo` SET ?";
                  connection.query(userInfoSql, userInfo, function(error) {
                      if (error) {
                          return rollback(res, connection, error, '<USER INFO SQL ERROR>');
                      }
                      console.log('USER INFO INSERT SUCCESS');
                      // commit
                      connection.commit(function(error) {
                          if (error) {
                              return rollback(res, connection, error, '<USER COMMIT SQL ERROR>');
                          }
                          console.log('TRANSACTION COMMIT');
                          connection.end();
                          res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                          res.end("<script>alert('회원가입 완료!');location.replace('/');</script>");
                      }); // commit
                  });

              }); // insert sql
            }



        });



    });
});

module.exports = router;
