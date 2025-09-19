const express = require('express'),
  User = require('./core/User'),
  Product = require('./core/Products'),
  Cart = require('./core/cart');

const port = 3000;

const server = express();

server.listen(port, async () => {
  await User.getUsers();
  await Product.getProducts();
  console.log(`Server is running on http://localhost:${port}`);
});

server.get('/', (req, res) => {
    res.send(`¡Hello new costumer!\nPlease for use our services in the link type '/users' or '/products'.\n¡Thanks you!`);
});


/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= PRODUCT PART -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
server.get('/products', async (req, res) => {
  const products = await Product.getProducts();
  res.send(products);
});

server.get('/products/add', async (req, res) => {
  const product = {
    title: req.query.name,
    stock: req.query.stock,
    price: req.query.price,
  }

  if(!product.title || !product.stock) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
  }

  Product.addProduct(product);
  res.send(`[SUCCESS]: Product added.`)
});

server.get('/products/remove', async (req, res) => {
  const id = req.query.id;

  if(!id) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
  }

  Product.remProduct(id);
  res.send(`[SUCCESS]: Product deleted.`)
});

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= USER PART -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
server.get('/users', async (req, res) => {
    const users = await User.getUsers();
    res.send(users);
});

server.get('/users/add', async (req, res) => {
    const user = {
      name: req.query.name,
      lastName: req.query.lastName,
      mail: req.query.mail,
      password: req.query.password
    }

    if(!user.name || !user.lastName || !user.mail || !user.password) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
    }
    User.addUser(user);
    res.send(`[SUCCESS] User created.`)
});

server.get('/users/remove', async (req, res) => {
    const id = req.query.id

    if(!id) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
    }

    User.remUser(id);
    res.send(`[SUCCESS] User deleted.`)
});

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= CART PART -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

server.get('/cart', async (req, res) => {
    const carts = await Cart.getCarts();

    const userID = req.query.userID;
    if(userID && parseInt(userID)) {
        const userCart = carts.filter(c => c.userID == userID);
        res.send(userCart);
        return;
    }
    
    res.send(carts);
});

server.get('/cart/add', async (req, res) => {
    const userID = req.query.userID;
    const productID = req.query.productID;
    const quantity = req.query.quantity || 1;

    if(!userID || !productID || !parseInt(userID) || !parseInt(productID)) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
    }

    const user = await User.getUserById(parseInt(userID));
    const product = await Product.getProductById(parseInt(productID));

    if(!user) {
      console.log(`[ERROR]: User not found`)
      res.send(`[ERROR]: User not found`)
      return;
    }

    if(!product) {
      console.log(`[ERROR]: Product not found`)
      res.send(`[ERROR]: Product not found`)
      return;
    }

    if(product.stock < quantity) {
      console.log(`[ERROR]: Not enough stock available`)
      res.send(`[ERROR]: Not enough stock available`)
      return;
    }

    product.stock = product.stock - quantity;
    await Product.updateProduct(product.id, { stock: product.stock });
    
    await Cart.addCartItem(user.id, product.id, quantity);
    res.send(`[SUCCESS] Item added to your cart.`)
});

server.get('/cart/remove', async (req, res) => {
    const userID = req.query.userID;
    const productID = req.query.productID;

    if(!userID || !productID || !parseInt(userID) || !parseInt(productID)) {
      console.log(`[ERROR]: Missing Arguments`)
      res.send(`[ERROR]: Missing Arguments`)
      return;
    }

    await Cart.remCartItem(productID, userID);

    res.send(`[SUCCESS] Item removed from your cart.`)
});
