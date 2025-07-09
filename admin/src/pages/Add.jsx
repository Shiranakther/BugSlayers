import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {
  //const [category, setCategory] = useState('Bed');

  const getSizeOptions = () => {
    switch (category) {
      case 'Bed':
        return ['King', 'Queen', 'Normal'];
      case 'Table':
        return ['4', '6', '8'];
      case 'Chair':
        return ['Small', 'Medium', 'Big'];
      default:
        return [];
    }
  };
  const [images, setImages] = useState([null, null, null, null]);
  
 

  const [name,setName] = useState('');
  const[description,setDescription] = useState('');
  const [price,setPrice] = useState('');
  const [category,setCategory] = useState('Bed');
  const [subCategory,setSubCategory] = useState('Timber');
  const [bestseller, setBestseller]=useState(false);
  const [sizes,setSizes]=useState([]);

  const onSubmitHandler =  async(e)=> {
    e.preventDefault();

    try{
      const formData=new FormData()

      formData.append("name",name);
      formData.append("description",description);
      formData.append("price",price);
      formData.append("category",category);
      formData.append("subCategory",subCategory);
      formData.append("bestseller",bestseller);
      formData.append("sizes",JSON.stringify(sizes));

      images [0] && formData.append("image1",images[0]);
      images [1] && formData.append("image2",images[1]);
      images [2] && formData.append("image3",images[2]);
      images [3] && formData.append("image4",images[3]);

      const response =await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})
      
      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImages([null, null, null, null]);

        setPrice('')

      }else{
        toast.error(response.data.message)
      }




    }
    catch(error){
      console.error(error);
      toast.error(error.message)
      
    }


  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map((index) => (
  <label key={index} htmlFor={`image${index}`}>
    <img
      className='w-20 h-20 object-cover border'
      src={
        images[index]
          ? URL.createObjectURL(images[index])
          : assets.upload_area
      }
      alt=''
    />
    <input
      type='file'
      id={`image${index}`}
      hidden
      onChange={(e) => {
        const newImages = [...images];
        newImages[index] = e.target.files[0];
        setImages(newImages);
      }}
    />
  </label>
))}

        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write Content Here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            className='w-full px-3 py-2'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>Select</option>
            <option value='Bed'>Bed</option>
            <option value='Table'>Table</option>
            <option value='Chair'>Chair</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value='Timber'>Timber</option>
            <option value='Glass'>Glass</option>
            <option value='Plastic'>Plastic</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type='number' placeholder='25' />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-2 flex-wrap'>
          {getSizeOptions().map((size) => (
            <div key={size} onClick={() =>
          setSizes((prev) =>
            prev.includes(size)
              ? prev.filter((s) => s !== size) // remove if already selected
              : [...prev, size]               // add if not selected
          )
        } className={`border px-3 py-1 rounded-md cursor-pointer transition duration-200 ${
  sizes.includes(size)
    ? 'bg-black text-white'
    : 'bg-gray-100 text-black'
}`}>
              {size}
            </div>
          ))}
          {getSizeOptions().length === 0 && <p className='text-sm text-gray-500'>Select a category first</p>}
        </div>
      </div>
      <div className='flex gap-2 mt-2'>
        <input onChange ={()=>setBestseller(prev=>!prev)}checked={bestseller} type="checkbox" id="bestseller"/>
        <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type ="Submit" className='w-28 py-3 mt-4 bg-black text-white'>Add</button>
    </form>
  );
};

export default Add;
