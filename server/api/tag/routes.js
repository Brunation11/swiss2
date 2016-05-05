var express = require('express'),
    router = express.Router(),
    controller = require('./controller'),
    auth = require('../user/auth').auth();

router.param('folder', controller.params);

router.route('/')
  .get(auth, controller.get)
  .post(auth, controller.post);

router.route('/:folder')
  .get(auth, controller.getOne)
  .put(auth, controller.put)
  .delete(auth, controller.delete);

router.use('/:folder/bookmarks', require('../bookmark/routes'));

module.exports = router;