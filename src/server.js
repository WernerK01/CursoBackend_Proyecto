import express from 'express';
import handlebars from 'express-handlebars';
import { Product } from './core/Products.js';
import { Server } from 'socket.io';

import cartRoute from './routes/cart/cart.js';
import cartAddRoute from './routes/cart/add.js';
import cartGetByIDRoute from './routes/cart/get.js';
import cartRemoveRoute from './routes/cart/remove.js';

import productsRoute from './routes/products/products.js';
import productAddRoute from './routes/products/add.js';
import productGetByIDRoute from './routes/products/get.js';
import productsRemoveRoute from './routes/products/remove.js';
import realTimeProductRoute from './routes/products/realTimeProducts.js';

const port = 3000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./src/public'));

server.set('view engine', 'handlebars');
server.set('views', './src/views');

server.engine('handlebars', handlebars.engine());


const serverHTTP = server.listen(port, async () => {
  await Product.getProducts();
  console.log(`[READY] Server is running on http://localhost:${port}`);
});

server.get('/', (req, res) => {
  res.render('layouts/main', { title: '¡Hello new costumer!', message: 'Please for use our services in the link type \'/cart\' or \'/products\'.\n\n¡Thanks you' });
});

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= PRODUCT PART -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const socket = new Server(serverHTTP);
setInterval(async () => {
  const products = await Product.getProducts();
  socket.emit('realTimeProducts', products);
  let temp = Math.floor(Math.random() * 100);
  socket.emit('temp', temp);
}, 1000);


server.use('/products', productsRoute);
server.use('/products/add', productAddRoute);
server.use('/products/get', productGetByIDRoute);
server.use('/products/remove', productsRemoveRoute);
server.use('/realTimeProducts', realTimeProductRoute);

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= CART PART -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
server.use('/cart', cartRoute);
server.use('/cart/add', cartAddRoute);
server.use('/cart/get', cartGetByIDRoute);
server.use('/cart/remove', cartRemoveRoute);