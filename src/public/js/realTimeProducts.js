const socket = io();

socket.on('realTimeProducts', (products) => {
  const productsDiv = document.getElementById('products');
  console.log(products)
  productsDiv.innerHTML = `
    <ul>
      ${products.map(product => `
        <li>
          <h4>${product.title}</h4>
          <p><span>Precio:</span> $${product.price}</p>
          <p><span>Descripción:</span> ${product.description}</p>
          <p><span>Stock:</span> ${product.stock}</p>
        </li>
      `).join('')}
    </ul>
  `;
});