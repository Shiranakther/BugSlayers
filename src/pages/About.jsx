import React from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'About'} text2={'Us'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.About} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>We are committed to delivering high-quality furniture that combines style, comfort, and durability.</p>
          <p>Our legacy is built on craftsmanship, customer satisfaction, and innovation.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>To provide our customers with exceptional furniture that enhances their living spaces.</p>
        </div>
        </div>
        </div>
  )
}
        
       
export default About;
