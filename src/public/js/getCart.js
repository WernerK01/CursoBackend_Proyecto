document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cid = document.getElementById('cid').value;
        const cartDiv = document.getElementById('info');

        const message = document.getElementById('message');

        try {
            const res = await fetch(`/api/cart/${cid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error(err.error || res.statusText);
            }
            const data = await res.json();
            const products = data.payload[0].products;
            cartDiv.innerHTML = '';
            if (products.length === 0) {
                cartDiv.innerHTML = '<p>El carrito está vacío.</p>';
                return;
            }
            console.log(data.payload[0].products);
            let totalPay = 0;
            products.forEach(item => {
                totalPay += item.quantity * item.product.price;
                cartDiv.innerHTML += `<ul>
                    <li><strong>Product:</strong> ${item.product.title} - <strong>Total price:</strong> $${item.quantity * item.product.price}</li>
                    <li><strong>Quantity:</strong> ${item.quantity}</li>
                </ul>`;
            });
            cartDiv.innerHTML += `<h3>Total to pay: $${totalPay}</h3>`;
        } catch (err) {
            message.textContent = `Error: ${err.message}`;
            message.className = 'error';
        }
    });
});