//Latest Collection
// Description: This component displays the latest collection of products. It uses the ShopContext to get the products and displays the first 10 products in a grid layout. Each product is displayed using the Productitem component. The component also includes a title and a description.
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import Productitem from './Productitem';

const LatestCollection = () => {

    const {products} = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect( ()=> {
            setLatestProducts(products.slice(0,10));
        },[products] )

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'LATEST'} text2={'COLLECTION'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
           These are the latest products added to our collection. Check them out and grab your favorites before they are gone!
            </p>
        </div>

        <div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
                {latestProducts.map((item,index)=> (
                    <Productitem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))               
                }
            </div>
        </div>
      
    </div>
  )
}

export default LatestCollection
