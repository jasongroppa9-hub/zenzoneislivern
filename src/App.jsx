import React, { useState, useEffect } from 'react';
import './App.css';

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Hoodie', price: 79.99, image: 'https://via.placeholder.com/300x300?text=Hoodie', category: 'hoodies' },
    { id: 2, name: 'Classic T-Shirt', price: 29.99, image: 'https://via.placeholder.com/300x300?text=Tshirt', category: 'shirts' },
    { id: 3, name: 'Jogger Pants', price: 69.99, image: 'https://via.placeholder.com/300x300?text=Joggers', category: 'pants' },
    { id: 4, name: 'Running Shoes', price: 129.99, image: 'https://via.placeholder.com/300x300?text=Shoes', category: 'shoes' },
  ]);

  // Add to Cart
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    alert(`${product.name} added to cart!`);
  };

  // Remove from Cart
  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Calculate Total
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  // Render Pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setCurrentPage} />;
      case 'shop':
        return <ShopPage products={products} addToCart={addToCart} />;
      case 'cart':
        return <CartPage cartItems={cartItems} removeFromCart={removeFromCart} total={cartTotal} />;
      case 'login':
        return <LoginPage setUser={setUser} setPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage user={user} setPage={setCurrentPage} />;
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Navbar cartCount={cartItems.length} currentPage={currentPage} setPage={setCurrentPage} user={user} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

// Navbar Component
function Navbar({ cartCount, currentPage, setPage, user }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo" onClick={() => setPage('home')}>ZenZone</h1>
        <ul className="nav-links">
          <li><a onClick={() => setPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</a></li>
          <li><a onClick={() => setPage('shop')} className={currentPage === 'shop' ? 'active' : ''}>Shop</a></li>
          <li><a onClick={() => setPage('cart')} className={currentPage === 'cart' ? 'active' : ''}>Cart ({cartCount})</a></li>
          {user ? (
            <li><a onClick={() => setPage('profile')} className={currentPage === 'profile' ? 'active' : ''}>Profile</a></li>
          ) : (
            <li><a onClick={() => setPage('login')} className={currentPage === 'login' ? 'active' : ''}>Login</a></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

// Home Page
function HomePage({ setPage }) {
  return (
    <div className="home-page">
      <div className="hero">
        <h2>Welcome to ZenZone</h2>
        <p>Premium Clothing for Your Lifestyle</p>
        <button onClick={() => setPage('shop')} className="cta-button">Shop Now</button>
      </div>
      <div className="features">
        <div className="feature-card"><h3>Free Shipping</h3><p>On orders over $50</p></div>
        <div className="feature-card"><h3>Premium Quality</h3><p>100% authentic products</p></div>
        <div className="feature-card"><h3>Easy Returns</h3><p>30-day return policy</p></div>
      </div>
    </div>
  );
}

// Shop Page
function ShopPage({ products, addToCart }) {
  return (
    <div className="shop-page">
      <h2>Our Collection</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)} className="add-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cart Page
function CartPage({ cartItems, removeFromCart, total }) {
  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
                <button onClick={() => removeFromCart(index)} className="remove-btn">Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${total}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Login Page
function LoginPage({ setUser, setPage }) {
  const handleLogin = () => {
    setUser({ name: 'Customer', email: 'user@example.com' });
    setPage('home');
    alert('Logged in successfully!');
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

// Profile Page
function ProfilePage({ user, setPage }) {
  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => { window.location.reload(); }} className="logout-btn">Logout</button>
        </div>
      ) : (
        <p>Please login to view your profile</p>
      )}
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 ZenZone. All rights reserved.</p>
      <p>Premium Clothing Store | Contact: support@zenzone.com</p>
    </footer>
  );
}

export default App;
