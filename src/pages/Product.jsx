//Product page component
// This component is the Product page of the website. It displays product details, images, and allows users to select a size and add the product to their cart. The layout is responsive, adjusting for smaller screens.
import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts';


const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product data */}
      <div className='flex gap-12 sm:gap-12 flex-col md:flex-row'>
        {/* Product Images  */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full '>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' />
          </div>
        </div>
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-centergap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>
          <h1 className='font-medium text-2xl mt-5'>{currency}{productData.price}</h1>
          <p className='text-gray-500 mt-5 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {
                productData.sizes.map((item, index) => (
                  <button onClick={() => setSize(item)} key={index} className={`border py-1 px-2 bg-gray-100 ${item === size ? 'border-2 border-pink-500 bg-gray-200' : ''}`}>{item}</button>
                ))}
            </div>
          </div>
          <button onClick={()=> addToCart(productData._id,size)} className='bg-black text-white py-2 px-4 hover:bg-pink-600 transition-all ease-in duration-200'>Add to Cart</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days!</p>
          </div>
        </div>
      </div>
      {/* Product Description & Review Section */}
      <div className='mt-20'>
        <div className ='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
      </div>
      <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
        <p className='text-sm text-gray-500'>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual storefront, allowing customers to browse and purchase items from the comfort of their own homes.</p>
        <p>E-commerce websites typically display products or services in a catalog format, allowing users to filter and search for specific items.</p>
      </div>
    </div>
    {/*Display Related Products */}
    <RelatedProducts category={productData.category} subCategory={productData.subcategory} />
    </div>
  ) :
    <div className='opacity-0'>

    </div>
}

export default Product;
