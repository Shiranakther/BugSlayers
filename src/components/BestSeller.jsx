//Best Seller component
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import Productitem from './Productitem'

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item)=> (item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    }, [products])

   
  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8 '>
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Discover our best-selling products that have captured the hearts of our customers. These items are loved for their quality, style, and performance. Don't miss out on the chance to own these favorites!</p>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        </p>       
      </div>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
                {bestSeller.map((item,index)=> (
                    <Productitem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))               
                }
            </div>
      
    </div>
  )
}

export default BestSeller
