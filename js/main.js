// Theme
const themeButton = document.querySelector('.btn-theme');
function changeTheme(dark) {
    document.body.classList.toggle('dark-theme', dark);
    themeButton.setAttribute('aria-pressed', dark);
    themeButton.title = dark ? 'Светлая тема' : 'Тёмная тема';
    themeButton.setAttribute('aria-label', 'Включить: ' + themeButton.title);
}
try {
    changeTheme(localStorage.getItem('volt-theme') === 'dark');
} catch { /* Тема работает и без хранилища. */ }
themeButton.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark-theme');
    changeTheme(dark);
    try { localStorage.setItem('volt-theme', dark ? 'dark' : 'light'); } catch {}
});

// Products and cart
const products = document.querySelectorAll('.product');
const cart = document.querySelector('.cart');
const cartRows = document.querySelectorAll('.cart-row');
const cartClose = document.querySelector('.cart-close');
function updateCart() {
    let count = 0;
    let sum = 0;
    products.forEach((product, index) => {
        const quantity = Number(product.dataset.quantity);
        count += quantity;
        sum += quantity * Number(product.dataset.price);
        product.querySelector('.btn-product').hidden = quantity > 0;
        product.querySelector('.quantity-control').hidden = quantity === 0;
        product.querySelector('.product-count').textContent = quantity;
        cartRows[index].hidden = quantity === 0;
        cartRows[index].querySelector('.cart-product-count').textContent = quantity;
    });
    document.querySelector('.cart-count').textContent = count;
    document.querySelector('.cart-empty').hidden = count > 0;
    document.querySelector('.cart-sum').textContent = sum.toLocaleString('ru-RU') + ' ₽';

    // Contact form
    const form = document.querySelector('.contacts-form');
    const submitButton = form.querySelector('[type="submit"]');
    const buttonContent = submitButton.innerHTML;

    form.addEventListener('submit', event => {
        event.preventDefault();
        submitButton.textContent = 'Данные проверены';
    });

    form.addEventListener('input', () => {
        submitButton.innerHTML = buttonContent;
    });
}
updateCart();
document.querySelectorAll('[data-change]').forEach(button => {
    button.addEventListener('click', () => {
        const product = products[button.dataset.index];
        const quantity = Math.max(0, Number(product.dataset.quantity) + Number(button.dataset.change));
        product.dataset.quantity = quantity;
        updateCart();
        if (button.closest('.cart') && quantity === 0) cartClose.focus();
        if (button.closest('.product') && (quantity === 0 || button.hidden)) {
            product.querySelector(quantity ? '.quantity-control [data-change="1"]' : '.btn-product').focus();
        }
    });
});
document.querySelector('.btn-cart').addEventListener('click', () => cart.showModal());
cartClose.addEventListener('click', () => cart.close());
document.querySelector('.cart-continue').addEventListener('click', () => {
    cart.close();
    document.querySelector('#products').scrollIntoView();
});

// FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const open = item.classList.toggle('open');
        question.setAttribute('aria-expanded', open);
        item.querySelector('.faq-answer').setAttribute('aria-hidden', !open);
    });
});

// Contact form: HTML проверяет поля перед submit.
const form = document.querySelector('.contacts-form');
const formStatus = document.querySelector('.form-status');
form.addEventListener('submit', event => {
    event.preventDefault();
    formStatus.hidden = false;
});
form.addEventListener('input', () => formStatus.hidden = true);
