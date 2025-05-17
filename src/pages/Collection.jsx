//Collection Page
// Description: This page displays all the products in the collection. It includes a filter section to filter products by category and subcategory. It also includes a sort option to sort products by price. The products are displayed in a grid layout using the Productitem component.
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import Productitem from '../components/Productitem'

const Collection = () => {
  const {products} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev => prev.filter(item=> item !== e.target.value));
  }
    else{
      setCategory(prev => [...prev,e.target.value]);
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev => prev.filter(item=> item !== e.target.value));
  }
    else{
      setSubCategory(prev => [...prev,e.target.value]);
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    if(category.length > 0){
      productsCopy = productsCopy.filter(item=> category.includes(item.category));
    }
    if(subCategory.length > 0){
      productsCopy = productsCopy.filter(item=> subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);

  }

  const sortProduct = () => {
    let fpcopy = filterProducts.slice();

    switch(sortType){
      case 'Price low to high':
        setFilterProducts(fpcopy.sort((a,b)=> (a.price - b.price)));
        break;
      case 'Price high to low':
        setFilterProducts(fpcopy.sort((a,b)=> (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(()=>{
    applyFilter();
  },[category,subCategory])

  useEffect(()=>{
    sortProduct();
  },[sortType])



  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
    {/*  Filter Section */}
    <div className='min-w-60'>
      <p onClick={()=> setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTER
      <img className={`h-3 rotate-180 sm:hidden ${showFilter ? "-rotate-90" : " "}`} src={assets.back} alt="" />
      </p>

    {/*  Filter by Category */}
    <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? " " : "hidden"} sm:block`}>
      <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
      <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Chair'} onChange={toggleCategory}/> Chair
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Table'} onChange={toggleCategory}/> Table
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Bed'} onChange={toggleCategory}/> Bed
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Bed'} onChange={toggleCategory}/> Cupboard
        </p>


      </div>
    </div>
    
    {/*  Filter by SubCategory */}
    <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? " " : "hidden"} sm:block`}>
      <p className='mb-3 text-sm font-medium'>TYPE</p>
      <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Cushion'} onChange={toggleSubCategory}/> Cushion
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Timber'} onChange={toggleSubCategory}/> Timber
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Glass'} onChange={toggleSubCategory}/> Glass
        </p>
        <p className='flex gap-2'>
          <input className='w-3' type='checkbox' value={'Timber'} onChange={toggleSubCategory}/> Plastic
        </p>
      </div>
    </div>
    </div >

    {/*  Product Section */}
    <div className='flex-1'>
      <div className='flex justify-between text-base sm:text-2xl mb-4'>
        <Title text1={'All'} text2={'Products'}/>
        {/* Product Sort */}
        <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 cursor-pointer'>
          <option value="relevant">Sort by Price: Relevant</option>
          <option value="low-high">Sort by Price: Low to High</option>
          <option value="high-low">Sort by Price: High to Low</option>
        </select>
      </div>

        {/* Products section */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <Productitem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }

        </div> 
    </div>
      
    </div>
  )
}

export default Collection
