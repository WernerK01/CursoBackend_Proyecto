document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('productId').value;

        if (!id) {
            message.textContent = 'Missing arguments or are invalid (id).';
            message.className = 'error';
            return;
        }

        await fetch(`/api/products/${id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
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