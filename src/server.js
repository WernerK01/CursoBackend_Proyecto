const express = require('express'),
  User = require('./core/User'),
  Product = require('./core/Products');

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

