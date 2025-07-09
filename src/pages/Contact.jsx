import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>

        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-10 mb-28 px-4'>
        {/* Contact Image */}
        <img src={assets.Contact} alt="Contact Us" className='w-full md:max-w-[480px] rounded-lg shadow-md' />

        {/* Contact Details */}
        <div className='flex flex-col gap-6 max-w-md'>
          <div>
            <p className='font-semibold text-xl text-gray-700'>📍 Our Store</p>
            <p className='text-gray-600'>
              340/1/B<br />
              Kamburupitiya<br />
              Matara
            </p>
          </div>

          <div>
            <p className='font-semibold text-xl text-gray-700'>📞 Contact</p>
            <p className='text-gray-600'>
              Tel: 071 737 4320<br />
              Email: <a href="mailto:newsisira@gmail.com" className='text-blue-600 underline'>newsisira@gmail.com</a>
            </p>
          </div>

          <div>
            <p className='font-semibold text-xl text-gray-700'>💼 Careers at New Sisira Furniture</p>
            <p className='text-gray-600'>Learn more about our teams and job openings.</p>
            <button className='mt-2 border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-all duration-300 rounded-md'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <NewsLetter />

    </div>
  )
}

export default Contact
