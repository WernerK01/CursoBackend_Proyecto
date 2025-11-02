## Buenas tardes! En este proyecto se podrá visualizar:

1. El populate hecho para las carts con los productos.
2. La paginación para los productos
3. La persistencia de los datos hechos en mongoDB.
4. Las views disponibles:
   - `/views/products` => muestra la paginación de los productos, junto a un botón para añadirlo al carrito.
   - `/views/cart` => muestra una UI para ver los items de un carrito en especifico (necesita el ID)
   - `/views/realTimeProducts` => socket para ver todos los productos en tiempo real.
5. **CARTS:** Se hicieron todos los routes pedidos:
   - **GET:** `/api/cart` => obtiene todos los carritos
   - **GET:** `/api/cart/:id` => obtiene el carrito con el id X
   - **POST:** `/api/cart` => crea un carrito nuevo
   - **POST:** `/api/cart/:id/products/:pid` => agrega un producto al carrito
   - **PUT:** `/api/cart/:id` => actualiza todo los productos del carrito con unos nuevos
   - **DELETE:** `/api/cart/:id` => eliminta todo el carrito
   - **DELETE:** `/api/cart/:id/products/:pid` => elimina un producto del carrito
6. **PRODUCTS:** Se hicieron todos los routes pedidos:
   - **GET:** `/api/products` => obtiene todos los productos
   - **GET:** `/api/products/:id` => obtiene el producto con el id X
   - **POST:** `/api/products` => añade un producto
   - **PUT:** `/api/products/:id` => actualiza un producto
   - **DELETE:** `/api/products/:id` => elimina un producto con el id X
