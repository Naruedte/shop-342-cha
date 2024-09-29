import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Navbar = ({ itemCount, toggleCart }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleProfile = () => setProfileOpen((prev) => !prev);

  const closeDropdowns = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdowns);
    return () => {
      document.removeEventListener('mousedown', closeDropdowns);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="flex-1">
        <a>Elecha Shop</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" onClick={toggleCart}>
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item">{itemCount}</span>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end" ref={profileRef}>
          <div onClick={toggleProfile}>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Card = ({ image, title, description, price, onAddToCart }) => (
  <div className="card bg-base-100 w-80 shadow-xl m-4">
    <figure>
      <img src={image} alt={title} />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <p className="text-lg font-bold">${price}</p> {/* Display price */}
      <div className="card-actions justify-end">
        <button className="btn btn-primary" onClick={onAddToCart}>Buy Now</button>
      </div>
    </div>
  </div>
);

const ShoppingCart = ({ cartItems, total, toggleCart, removeFromCart, updateQuantity, applyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode === 'DISCOUNT10') {
      setDiscount(0.1);
    } else {
      alert('สั้งสินค้าเรียบร้อย');
    }
  };

  const shippingCost = 30;
  const finalTotal = total + shippingCost - (total * discount);

  return (
    <div className="cart">
      <h2>กระเป๋า</h2>
      {cartItems.length === 0 ? (
        <p>รายการของคุณ</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.title} - ${item.price * item.quantity}
              <div>
                <button onClick={() => updateQuantity(item, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item)}>ลบ</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3>ราคา ${total.toFixed(2)}</h3>
      <h3>ค่าส่ง${shippingCost}</h3>
      <h3>ส่วนลด ${total * discount}</h3>
      <h3>รวมเงิน${finalTotal.toFixed(2)}</h3>
      <input
        type="text"
        placeholder="Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button onClick={handleApplyCoupon}>ทำการสั่งซื้อ</button>
      <button className="btn btn-secondary" onClick={toggleCart}>ยกเลิก</button>
    </div>
  );
};

const App = () => {
  const [itemCount, setItemCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.title === product.title);
    if (existingItem) {
      updateQuantity(existingItem, existingItem.quantity + 1);
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
      setTotal((prev) => prev + product.price); // Use product's price
      setItemCount((prev) => prev + 1);
    }
  };

  const removeFromCart = (product) => {
    setCartItems((prev) => prev.filter(item => item.title !== product.title));
    setTotal((prev) => prev - (product.price * product.quantity)); // Adjust total
    setItemCount((prev) => prev - product.quantity);
  };

  const updateQuantity = (product, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    setCartItems((prev) => {
      return prev.map(item =>
        item.title === product.title ? { ...item, quantity: newQuantity } : item
      );
    });
    const quantityChange = newQuantity - product.quantity;
    setTotal((prev) => prev + (product.price * quantityChange)); // Adjust total
  };
 
  const products = [
    
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5674cc5741584fee9b766a2dcad4b0ff_9366/F50_Leagess_Firm-Multi-Ground_IH8056_01_standard_hover.jpg',
      title: 'F50 Leagess',
      description: 'รองเท้าฟุตบอล F50 Leagess Firm/Multi-Ground',
      price: 38.88 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7a0e6217e0946e68f0d3799af72341e_9366/Messi_F50_League_Firm-Multi-Ground_IG9274_HM4.jpg',
      title: 'รองเท้าฟุตบอล Messi F50 League',
      description: 'รองเท้าฟุตบอล Messi F50 League Firm/Multi-Ground',
      price: 180.00 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a740bd4b958b4693b7207db4376fa340_9366/Copa_Gloro_2_Firm_Ground_IG8740_01_standard_hover.jpg',
      title: 'รองเท้าฟุตบอล Copa Gloro 2',
      description: 'รองเท้าฟุตบอล Copa Gloro 2 Firm Ground',
      price: 1490.00 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aa290aec09244285a4ba8b194f6da910_9366/Predator_Elite_Firm_Ground_IH0420_01_standard_hover.jpg',
      title: 'รองเท้าฟุตบอล Predator Elite Firm Ground',
      description: 'รองเท้าฟุตบอล Predator Elite Firm Ground สำหรับเด็ก',
      price: 5500.55 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f47aca1ada1c4a8fb646f6c7157db3fe_9366/Copa_Gloro_2_Firm_Ground_IG8743_01_standard_hover.jpg',
      title: 'รองเท้าฟุตบอล Copa Gloro 2',
      description: 'รองเท้าฟุตบอล Copa Gloro 2 Firm Ground',
      price: 1880 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/w_500,h_500,f_auto,q_auto,fl_lossy,c_fill,g_auto/8215330581844f6d8bf6afc8010f8e43_9366/Fortore_23_IK5738_21_model.jpg',
      title: 'เสื้อฟุตบอล Fortore 23',
      description: 'เสื้อฟุตบอลที่ได้แรงบันดาลใจจากยุค 90 เหมาะสำหรับทีมสมัครเล่นและตัดเย็บจากวัสดุรีไซเคิล',
      price: 1050// Add price
    },
    {
      image: 'https://assets.adidas.com/images/w_500,h_500,f_auto,q_auto,fl_lossy,c_fill,g_auto/3dab7c02a35b4dc7aebbaf410128888d_9366/Tiro_League_HS9768_01_standard.jpg',
      title: 'กระเป๋ายิมแซค Tiro League',
      description: 'กระเป๋ายิมแซคใช้งานง่ายที่มีส่วนประกอบของวัสดุรีไซเคิล',
      price: 700 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7252684fd8e04c36b606a910e4d290e9_9366/Predator_Club_Flexible_Ground_IF6341_01_00_standard_hover.jpg',
      title: 'รองเท้าฟุตบอล Predator Club Flexible Ground',
      price: 2000 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/w_500,h_500,f_auto,q_auto,fl_lossy,c_fill,g_auto/9d0460a4547f42428af1aeb700c33535_9366/Tiro_23_Competition_HK7644_01_laydown.jpg',
      title: 'รองเท้าฟุตบอล Copa Gloro 2',
      description: 'รองเท้าฟุตบอล Copa Gloro 2 Firm Ground',
      price: 1600 // Add price
    },
    {
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9fe9f584536540c5b2e6159a87cc85a7_9366/F50_League_Firm-Multi-Ground_IE0602_01_00_standard_hover.jpg',
      title: 'รองเท้าฟุตบอล F50 League Firm/Multi-Ground',
      price: 3500 // Add price
    },
  ];

  
  return (
    <div className="light-theme">
      <Navbar itemCount={itemCount} toggleCart={toggleCart} />
      {cartOpen && (
        <ShoppingCart
          cartItems={cartItems}
          total={total}
          toggleCart={toggleCart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      )}
      <div className="flex flex-wrap justify-center mt-4">
        {products.map((product, index) => (
          <Card
            key={index}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price} // Pass price to Card
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};


export default App;
