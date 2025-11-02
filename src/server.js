import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { connection } from './mongo/connection.js';
import { ProductManager } from './core/ProductsManager.js';
import { router as cartRoute } from './routes/cartRoute.js';
import { router as productRoute } from './routes/productRoute.js';
import { router as viewsRoute } from './routes/viewsRoute.js';

const port = 3000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./src/public'));

server.set('view engine', 'handlebars');
server.set('views', './src/views');
server.engine('handlebars', handlebars.engine());

const serverHTTP = server.listen(port, async () => {
  await connection();
  console.log(`[READY] Server is running on http://localhost:${port}`);
});

server.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Welcome to the E-Commerce API');
});

const socket = new Server(serverHTTP);
setInterval(async () => {
  const products = await ProductManager.getProducts();
  socket.emit('realTimeProducts', products);
}, 1000);

server.use('/views', viewsRoute)
server.use('/api/products', productRoute);
server.use('/api/cart', cartRoute);