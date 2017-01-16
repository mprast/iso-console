var express = require('express');
var router = express.Router();
var path = require('path');
var message = require('mod_init/split-brain');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(message);
  res.sendFile(path.join(__dirname + '/../views/index.html'));
});

module.exports = router;
