window.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.showcase__shelf--item');
    const cart = document.querySelector('.cart__space');

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

            product.onmousedown = (event) => {
                console.log(product.parentNode)
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
                document.body.appendChild(product);
                product.style.position = 'absolute';
                product.style.zIndex = '10';

                document.addEventListener('mousemove', moveAction);

                // drop
                product.onmouseup = (event) => {
                    if (inCart(event)) {
                        cart.insertAdjacentElement('beforeend', product);
                        product.style.position = 'unset';
                        product.style.left = 'unset';
                        product.style.top = 'unset';
                    } else {
                        product.style.transition = 'all 0.5s ease';
                        product.style.left = defaultPosition.x;
                        product.style.top = defaultPosition.y;
                        setTimeout(() => {
                            product.style.position = 'unset';
                            product.style.transition = 'unset';
                            document.body.removeChild(product);
                            defaultPosition.block.appendChild(product);
                        }, 500)
                    }
                    document.removeEventListener('mousemove', moveAction);
                }
            }
        })
    }
});
