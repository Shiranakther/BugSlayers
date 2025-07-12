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
const updateToCart=async(req,res)=>{
    try {
        const { userId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData: cartData });
        res.json({
            success: true,
            message: "Cart updated",
        });


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });

    }
}
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



export{addToCart,updateToCart,getUserCart}


