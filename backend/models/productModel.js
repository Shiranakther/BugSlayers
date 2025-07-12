import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model (assuming you have one)
        required: true
    },
    username: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String, // URL for the user's profile image
        required: false // Optional, as a user might not have an image
    },
    reviewImage: {
        type: String, // URL for the uploaded review image
        required: false
    },
    comment: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0 // Starts with zero likes
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestsellers: { type: Boolean },
    date: { type: Date, default: Date.now }, // Changed to Date type for better sorting/filtering
    reviews: [reviewSchema] // Embed the reviews schema here
});

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;