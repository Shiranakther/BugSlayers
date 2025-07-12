// About page component
// This component is the About page of the website. It contains information about the company, its mission, and its values. The layout is responsive, adjusting for smaller screens.

import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"

          src={assets.About}

          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to New Sisira Furniture Shop, your trusted destination for high-quality,
            stylish, and durable furniture in Kamburupitiya. Since our founding, we have been
            committed to helping families and businesses furnish their spaces with comfort,
            elegance, and functionality. Whether you're looking for contemporary designs or
            timeless classics, our wide range of furniture is crafted to meet the needs of every
            lifestyle and budget.
          </p>
          <p>
            At New Sisira Furniture Shop, customer satisfaction is at the heart of everything we do.
            We take pride in sourcing the finest materials and maintaining exceptional craftsmanship
            in every piece we offer. Our experienced team is always ready to assist you in choosing
            the right furniture for your home or office, ensuring that you receive both value and
            style. Thank you for making us a part of your living spaces—we look forward to serving
            you for years to come.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            At New Sisira Furniture Shop, our mission is to enrich lives by providing high-quality,
            affordable furniture that blends comfort, functionality, and style. We are dedicated to
            delivering exceptional customer service, fostering long-term relationships, and
            continuously innovating to meet the evolving needs of our community.
          </p>
        </div>
      </div>

      <div className="text-4xl py-4"></div>

      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality</b>
          <p className='text-gray-600'>We strive to create innovative solutions that enhance the user experience.</p>  
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience</b>
          <p className='text-gray-600'>At New Sisira Furniture Shop, we prioritize your convenience every step of the way. From a seamless shopping experience on our user-friendly website to flexible delivery options and personalized customer support, we ensure that furnishing your space is as easy and hassle-free as possible. Whether you're shopping from home or visiting our store in Kamburupitiya, we are committed to saving you time, reducing effort, and delivering satisfaction right to your doorstep.</p>
        </div>
        <div className ='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>Our dedicated team is always ready to assist you with any questions or concerns, ensuring a smooth and enjoyable shopping experience.</p>
 
        </div>
      </div>
    </div>
  )
}


export default About;


