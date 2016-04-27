var express = require('express'),
    router = express.Router(),
    controller = require('./controller'),
    auth = require('../user/auth').auth();

router.param('bookmark', controller.params);

router.route('/')
  .get(auth, controller.get)
  .post(auth, controller.post);

router.route('/:bookmark')
  .get(auth, controller.getOne)
  .put(auth, controller.put)
  .delete(auth, controller.delete);

module.exports = router;