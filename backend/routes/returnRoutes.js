const express = require("express");
const router = express.Router();
const {
  createReturn,
  updateReturn,
  getReturns,
  deleteReturn,
} = require("../controllers/returnController");

router.post("/", createReturn);
router.put("/:id", updateReturn);
router.get("/", getReturns);
router.delete("/:id", deleteReturn);

module.exports = router;
