const socket = io();

socket.on('realTimeProducts', (products) => {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = `
    <ul>
      ${products.map(p => `<li><strong>${p.name}</strong> - <strong>Stock:</strong> ${p.stock} - <strong>Price:</strong> $${p.price}</li>`).join('')}
    </ul>
  `;
});

socket.on('temp', (temp) => {
    const tempDiv = document.getElementById('temp');
    tempDiv.innerHTML = `Server Temperature: ${temp}°C`;
});