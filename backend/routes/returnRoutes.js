const express = require("express");
const router = express.Router();
const {
  createReturn,
  updateReturn,
  getAllReturns,
  deleteReturn,
} = require("../controllers/returnController");

router.get("/", getAllReturns);
router.post("/", createReturn);
router.put("/:id", updateReturn);
router.delete("/:id", deleteReturn);

module.exports = router;