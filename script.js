window.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.showcase__shelf--item');
    const cart = document.querySelector('.cart__space');
    const button = document.querySelector('button');

    function buttonStatus() {
        const productsInside = cart.childNodes;
        if (productsInside.length >= 3) {
            button.style.opacity = '1';
            button.style.bottom = '20px';
            button.style.pointerEvents = 'auto';
        }
    }

    function getCartSpace(cart) {
        const cartSpaceDefault = {
            startX: 0,
            endX: 0,
            startY: 0,
            endY: 0,
        }
        const cartParams = cart.getBoundingClientRect();
        cartSpaceDefault.startX = cartParams.x;
        cartSpaceDefault.endX = cartSpaceDefault.startX + cartParams.width;
        cartSpaceDefault.startY = cartParams.y;
        cartSpaceDefault.endY = cartSpaceDefault.startY + cartParams.height;
        return cartSpaceDefault;
    }

    const cartSpace = getCartSpace(cart);

    function inCart(event) {
        let result = false;
        const fitByX = event.x >= cartSpace.startX && event.x <= cartSpace.endX;
        const fitByY = event.y >= cartSpace.startY && event.y <= cartSpace.endY;
        if (fitByX && fitByY) {
            result = true;
        }
        return result;
    }

    if (products.length) {
        products.forEach(product => {
            product.ondragstart = () => {
                return false
            };

            product.addEventListener('mousedown', holdEvent);
            product.addEventListener('pointerdown', holdEvent);


            function holdEvent(event)  {
                const defaultPosition = {
                    block: document.getElementById(product.parentNode.id),
                    x: product.getBoundingClientRect().x + 'px',
                    y: product.getBoundingClientRect().y + 'px',
                }

                function moveTo(pageY, pageX) {
                    product.style.top = pageY - alignY + 'px';
                    product.style.left = pageX - alignX + 'px';
                }

                function moveAction(event) {
                    moveTo(event.pageY, event.pageX)
                }

                let alignX = event.clientX - product.getBoundingClientRect().left;
                let alignY = event.clientY - product.getBoundingClientRect().top;

                moveTo(event.pageY, event.pageX);

                document.body.appendChild(product);
                product.style.position = 'absolute';
                product.style.zIndex = '10';

                document.addEventListener('mousemove', moveAction);
                document.addEventListener('pointermove', moveAction);

                // drop

                function upEvent(event) {
                    if (inCart(event)) {
                        cart.insertAdjacentElement('beforeend', product);
                        // сделал расположение элементов в корзине по оси Х рандомом чтобы если продолжить складывать верстка не ломалась
                        // для обычного расположения в ряд использовал product.style.position = 'unset';
                        product.style.left = Math.random() * ((cart.getBoundingClientRect().width - 40) - 40) + 40 + 'px';
                        product.style.top = 'unset';
                        product.removeEventListener('mousedown', holdEvent);
                        product.removeEventListener('pointerdown', holdEvent);
                        product.style.cursor = 'default';
                        buttonStatus();
                    } else {
                        product.style.transition = 'all 0.5s ease';
                        product.style.left = defaultPosition.x;
                        product.style.top = defaultPosition.y;
                        setTimeout(() => {
                            product.style.position = 'unset';
                            product.style.transition = 'unset';
                            if (document.body.childElementCount > 2) {
                                document.body.removeChild(product);
                                if (defaultPosition.block) {
                                    defaultPosition.block.appendChild(product);
                                }
                            }
                        }, 500)
                    }
                    document.removeEventListener('mousemove', moveAction);
                    document.removeEventListener('pointermove', moveAction);
                }

                product.addEventListener('mouseup', upEvent);
                product.addEventListener('pointerup', upEvent);
            }
        })
    }
});
