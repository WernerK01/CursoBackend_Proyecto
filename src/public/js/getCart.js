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
            products.forEach(item => {
                cartDiv.innerHTML = `<ul>
                    <li>Item: ${item.product.title} - $${item.product.price}</li>
                    <li>Quantity ${item.quantity}</li>
                </ul>`;
            });
        } catch (err) {
            message.textContent = `Error: ${err.message}`;
            message.className = 'error';
        }
    });
});