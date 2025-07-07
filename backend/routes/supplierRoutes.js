const express = require("express");
const router = express.Router();

const {
  getSuppliers,
  getSupplierById,
  getSupplierCount,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

router.get("/", getSuppliers);
router.get("/count", getSupplierCount);
router.get("/:id", getSupplierById);
router.post("/add", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;