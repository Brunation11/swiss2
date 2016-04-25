var config = require('/server/config/config'),
    app = require('./server/server'),
    logger = require('./server/util/logger');

app.listen(config.port, function() {
  logger.log("Listening on http:localhost:" + config.port);
});
