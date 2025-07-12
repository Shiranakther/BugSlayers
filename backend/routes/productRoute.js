import express from 'express';
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  addReview,
  likeReview
} from '../controllers/productController.js';

import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';


const productRouter = express.Router();

// Admin protected routes
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);
productRouter.post('/remove', adminAuth, removeProduct);

// Public
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);

// ✅ User-protected routes

productRouter.post('/reviews/like', authUser, likeReview);

productRouter.post('/reviews/add', authUser, upload.single('reviewImage'), addReview);

export default productRouter;
