const express = require('express');
const router = express.Router();
const models = require('../../models');

/* GET auth/confirm/{code} confirm */
router.post('/idCheck', (req, res)=>{
  if(!req.body.id) {
    res.send(410).end();
  }
  models.user.findOne({where: {id: req.body.id}})
  .then((data)=> {
    if(data)
      res.status(400).end();
    else
      res.status(200).end();
  });
});

module.exports = router;
