
import React, { useState, useEffect } from 'react'
import { backendUrl,currency } from '../App'
import axios from 'axios';
import { toast } from 'react-toastify';


const List = ({token}) => {
  const [list,setList]=useState([]);

  const fetchList=async() => {
    try{
      const response=await axios.get(backendUrl+ '/api/product/list')
      if(response.data.success){
        setList(response.data.products);
      }
      else{
       toast.error(response.data.message)
      }

    } catch(error){
      console.log(error)
      toast.error(error.message)

    }

  };

  const removeProduct=async (id) => {
    try {
    const response=await axios.post(backendUrl+'/api/product/remove',{id},{headers:{token}})

    if(response.data.success){
      toast.success(response.data.message)
      await fetchList();
    }else{
      toast.error(response.data.message)
    }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <p className='mb-2 text-2xl font-semibold'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/*List table title*/}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium'>
          <b className='text-left' >Image</b>
          <b className='text-left' >Name</b>
          <b className='text-left' >Category</b>
          <b className='text-left' >Price</b>
          <b className='text-left'  text='center'>Action</b>
        </div>
        {/* Product List */}

        {list.map((item,index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border text-sm' key={index}>
            <img className='W-16 h-16 object-cover rounded' src={item.image[0]} alt={item.name || 'Product Image'} />
            <p className='truncate'>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p onClick={()=>removeProduct(item._id)}className='text-right  md:text-center cursor-pointer text-lg'>X</p>
      </div>
      
        ))}
      </div>
    </>
  );
};


export default List
