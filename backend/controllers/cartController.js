import userModel from '../models/userModels.js';
//Add product to user cart
const addToCart=async(req,res)=>{
    try {
        const{userId,itemId,size}=req.body;

        const userData=await userModel.findById(userId)
        const cartData=await userData.cartData;

         if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
        await userModel.findByIdAndUpdate(userId, { cartData: cartData })

        res.json({
            success: true,
            message: "Product added to cart",
            
        });
        }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
        
    }
}

//Add user cart
const updateToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        const cartData = { ...userData.cartData }; // clone to avoid mutation issues

        if (quantity === 0) {
            // Remove size entry
            if (cartData[itemId] && cartData[itemId][size]) {
                delete cartData[itemId][size];

                // If no sizes left for that item, remove the item itself
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            // If item or size doesn't exist, create them
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({
            success: true,
            message: "Cart updated",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

//get user cart data
const getUserCart=async(req,res)=>{
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        
        res.json({
            success: true,
            cartData
        });
    } catch (error) {
        
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        const cartData = { ...userData.cartData }; // Avoid modifying reference

        if (cartData[itemId] && cartData[itemId][size]) {
            delete cartData[itemId][size];

            // If no sizes remain for this item, remove the item entirely
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }

            await userModel.findByIdAndUpdate(userId, { cartData });

            res.json({
                success: true,
                message: "Item removed from cart",
            });
        } else {
            res.json({
                success: false,
                message: "Item or size not found in cart",
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};


export{addToCart,updateToCart,getUserCart,removeFromCart}


