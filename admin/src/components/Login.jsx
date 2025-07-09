import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify';


const Login = ({ setToken }) => {

    const[email,setEmail]=useState('')
    const[password,setpassword]= useState('')

    const onSubmitHandler=async(e)=>{
        try{
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if(response.data.success){
                setToken(response.data.token); // Assuming the token is returned in the response


            }
            else{
                toast.error(response.data.message)
            }
        }catch(error){
            console.error(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message);


            
        }
    }


  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                <input onChange={(e)=>setEmail(e.target.value)} autoComplete='off' value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@gmail.com' required/>

            </div>
            <div>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input onChange={(e)=>setpassword(e.target.value)} autoComplete='off' value={password} className='rounded-md w-full px-3 py-2 border border-gray-300' type="password" placeholder='Enter your Password' required/>

            </div>
            <button className='mt-2 w-full py-2 px-4 rounded-3d text-white bg-black' type="Submit">Login</button>
        </form>

        </div>

    </div>
  )
}

export default Login
