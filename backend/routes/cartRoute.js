import express from 'express';
import { addToCart, updateToCart, getUserCart,removeFromCart } from '../controllers/cartController.js'; 
import  authUser  from '../middleware/auth.js';

const cartRouter=express.Router()
cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateToCart)
cartRouter.post('/remove', removeFromCart);


export default cartRouter;