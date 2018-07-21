const router = require('express').Router()

router.get('/', (req, res) => {
  res.send([
    {
      id: '1',
      name: 'Name 1'
    },
    {
      id: '2',
      name: 'Name 2'
    }
  ])
});


module.exports = router;