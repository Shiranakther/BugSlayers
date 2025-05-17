import React,{useContext, useEffect,useState} from 'react'
import{ShopContext} from '../context/ShopContext'

const RelatedProducts = ({category, subCategory}) => {
    const { products } = useContext(ShopContext);
    const[related,setRelated] = useState([]);
   useEffect(() => {
    if (products.length > 0) {
        let productsCopy = products.slice();
        productsCopy = productsCopy.filter((item) => category === item.category);
        productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
        setRelated(productsCopy.slice(0, 5)); // ✅ set the filtered list
        
    }
}, [products, category, subCategory]); // ✅ include dependencies

    return (
  <div>
    <h3>Related Products</h3>
    {related.map((item) => (
      <div key={item._id}>
        <p>{item.name}</p>
      </div>
    ))}
  </div>
);
}

export default RelatedProducts

