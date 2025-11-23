# ZenZone - Nike-Style E-Commerce Store

A full-featured, modern e-commerce platform built with React, Node.js, Express, and MongoDB.

## Features

- Product catalog with filtering and search
- User authentication (sign up, login, profile)
- Shopping cart and checkout
- Order history and wishlist
- Admin panel for product management
- Responsive mobile and desktop design
- Stripe payment integration (ready to configure)
- JWT-based authentication

## Quick Deploy to Vercel (5 minutes)

1. Click the button below to deploy instantly:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jasongroppa9-hub/ZenZone)

2. Or manually:
   - Go to https://vercel.com
   - Connect your GitHub account
   - Import this repository
   - Vercel will auto-detect the React app and deploy

## Local Development

### Prerequisites
- Node.js 14+
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ZenZone.git
   cd ZenZone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   MONGODB_URI=mongodb://localhost:27017/zenzone
   JWT_SECRET=your_secret_key_here
   STRIPE_PUBLIC_KEY=your_stripe_key
   ```

4. Run the development server:
   ```bash
   npm start
   ```

5. The site opens at `http://localhost:3000`

## Project Structure

```
ZenZone/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Home.js
│   │   ├── Shop.js
│   │   ├── Cart.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Profile.js
│   │   └── Admin.js
│   ├── App.js
│   └── index.js
├── server/ (backend folder - optional for local)
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (admin)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order

## Deployment Platforms Supported

- **Vercel** (recommended - 1-click deploy)
- Netlify
- Heroku
- Railway

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues, open an issue on GitHub or contact support.

---

**Status**: Ready for deployment - all code will be added as separate files in this repository.
