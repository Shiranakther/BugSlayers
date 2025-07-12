import express from 'express';
import authUser from '../middleware/auth.js';
import { placeOrder, verifyOrder, userOrders } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authUser, userOrders);

export default orderRouter;
