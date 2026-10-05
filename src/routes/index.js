const { Router } = require("express");

const router = Router();
router.use(require("./catalog"));
router.use(require("./titles"));

module.exports = router;
