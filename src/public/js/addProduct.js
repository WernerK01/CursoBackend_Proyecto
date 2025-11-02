document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async (e) => {
        const CART_ID = localStorage.getItem('cartId') || null;
        if (!e.target.matches('.btnAddToCart')) return;

        const btn = e.target;
        const productId = btn.dataset.id;
        console.log(productId, btn);
        const quantity = 1;

        if (!productId) return alert('Producto inválido');

        const cartId = CART_ID || prompt('Ingrese el id de carrito');

        try {
            const res = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
                return alert(`Error: ${err.error || res.statusText}`);
            }

            const data = await res.json();
            alert('Producto agregado al carrito');
            if (!localStorage.getItem('cartId') && data.cartId) localStorage.setItem('cartId', data.cartId);
        } catch (error) {
            console.error(error);
            alert('No se pudo agregar el producto');
        }
    });

    const form = document.getElementById('Addform');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const stock = document.getElementById('stock').value;
        const price = document.getElementById('price').value;

        const message = document.getElementById('message');

        if (!title || !description || !stock || !price || !parseInt(stock) || !parseFloat(price)) {
            message.textContent = 'Missing arguments or are invalid (title, description, stock and price).';
            message.className = 'error';
            return;
        }

        const data = {
            title: title,
            description: description,
            stock: parseInt(stock),
            price: parseFloat(price)
        };

        await fetch('/api/products', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }).then(() => {
            message.textContent = 'Product created';
            message.className = 'success';
        }).catch(err => {
            message.textContent = `Error: ${err.message}`
            message.className = 'error';
            console.log(err);
        })
    });
});