import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js';
import fs from 'fs';

// Helper function to delete temporary files
const deleteTempFiles = (files) => {
    for (const key in files) {
        files[key].forEach(file => fs.unlinkSync(file.path));
    }
};

//add product functionality
const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subCategory, sizes, bestsellers} = req.body;
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        let images = [];
        for (const key in req.files) {
            images.push(...req.files[key]);
        }

        let imagesUrl = await Promise.all(
            images.map(item => cloudinary.uploader.upload(item.path, { resource_type: 'image' }))
        );
        
        // Clean up temp files after upload
        deleteTempFiles(req.files);

        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl.map(result => result.secure_url),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestsellers: bestsellers === 'true' ? true : false
        };

        const product = new productModel(productData);
        await product.save();

        res.json({success: true, message: 'Product added successfully'});

    } catch (error) {
        console.log(error);
        if (req.files) deleteTempFiles(req.files); // Clean up on error too
        res.status(500).json({success: false, message: error.message});
    }
};

//list product functionality
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success: true, products});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
};

//remove product functionality
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'Product removed successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
};

//single product info functionality
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({success: true, product});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
};

const addReview = async (req, res) => {
    try {
        const { productId, comment, username, imageUrl } = req.body;
        const userId = req.user.id;
        let reviewImageUrl = '';

        // Validate comment
        if (!comment?.trim()) {
            return res.status(400).json({ success: false, message: "Comment is required" });
        }

        // ✅ Upload image to Cloudinary if provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'reviews'
            });
            reviewImageUrl = result.secure_url;

            // ✅ Remove temp file from server
            fs.unlinkSync(req.file.path);
        }

        // ✅ Build new review with timestamps
        const newReview = {
            user: userId,
            username,
            imageUrl, // user profile image
            reviewImage: reviewImageUrl, // uploaded image
            comment,
            createdAt: new Date()
        };

        // ✅ Add review to product
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { $push: { reviews: newReview } },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ✅ Return the *actual* review to frontend
        res.json({
            success: true,
            message: "Review added successfully",
            review: newReview
        });

    } catch (error) {
        console.error("Add Review Error:", error);

        // Clean up temp file in error
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Failed to delete temp file:", err);
            }
        }

        res.status(500).json({ success: false, message: "Server error adding review" });
    }
};


// ✅ Like a Review (Efficiently)
const likeReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.body;

        // Use $inc to increment the like count for a specific review
        const result = await productModel.updateOne(
            { "_id": productId, "reviews._id": reviewId }, // Find the product and the specific review
            { $inc: { "reviews.$.likeCount": 1 } }      // Increment the likeCount of that review
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Product or review not found" });
        }

        res.json({ success: true, message: "Review liked successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error liking review" });
    }
};



export { addProduct, listProducts, removeProduct, singleProduct, addReview, likeReview };