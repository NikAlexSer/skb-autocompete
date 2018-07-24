let express = require('express'),
    router = express.Router(),
    fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Автокомплит Контур' });
});

router.get('/getCityData', function (req, res, next) {
  let data = fs.readFileSync('./data/kladr.json');

  res.send(data)
});

router.post('/addCity', function (req, res, next) {
  let data = JSON.parse(fs.readFileSync('./data/kladr.json'));

  data.push({
    Id: +req.body.Id,
    City: req.body.City
  });
  fs.writeFileSync('./data/kladr.json', JSON.stringify(data))
});

module.exports = router;
