document.addEventListener('DOMContentLoaded', function () {
    
    const search = document.querySelector('.search'),
        cardBtn = document.getElementById('cart'),
        wishlistBtn = document.getElementById('wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category'),
        cardCounter = cardBtn.querySelector('.counter'),
        wishlistCounter = wishlistBtn.querySelector('.counter'),
        cartWrapper = document.querySelector('.cart-wrapper');

        let wishlist = [];

        let goodsBasket = [];



        const loading = () => {
            goodsWrapper.innerHTML = `
            <div id="spinner"><div class="spinner-loading"><div><div><div></div>
            </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
            `;
        };
        
// Товари для рендера в сердечках

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
            card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
            card.innerHTML = `<div class="card">
                                <div class="card-img-wrapper">
                                    <img class="card-img-top" src="${img}" alt="">
                                    <button class="card-add-wishlist ${wishlist.includes(id)  ? 'active': ''}"
                                    data-goods-id="${id}"></button>
                                </div>
                                <div class="card-body justify-content-between">
                                    <a href="#" class="card-title">${title}</a>
                                    <div class="card-price">${price} ₽</div>
                                    <div>
                                        <button class="card-add-cart"
                                            data-goods-id="${id}">Добавить в корзину</button>
                                    </div>
                                </div>
                            </div>`;

           return card;                     
    }

        // Виводимо товари на екран

    const renderCard = (goods) => {
        goodsWrapper.textContent = ' ';
        
        
       
            if (goods.length) {
                goods.forEach(item => {

                   // Деструктуризовані змінні
                    const {id, title, price, imgMin} = item;
                    goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));

                });

            }else{
                goodsWrapper.textContent = 'Sorry, goods not found! ';
            }
         

      
    }

        // goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
        // goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));


            // Товари для рендера в корзині

        const createCartGoodsBasket = (id, title, price, img) => {
            const card = document.createElement('div');
                card.className = 'goods';
                card.innerHTML = `<div class="card">
                    <div class="goods-img-wrapper">
                            <img class="goods-img" src="${img}" alt="">

                        </div>
                        <div class="goods-description">
                            <h2 class="goods-title">${title}</h2>
                            <p class="goods-price">${price}₽</p>

                        </div>
                        <div class="goods-price-count">
                            <div class="goods-trigger">
                                <button class="goods-add-wishlist" data-goods-id="${id} ${wishlist.includes(id)  ? 'active': ''}"></button>
                                <button class="goods-delete" data-goods-id="${id}></button>
                            </div>
                            <div class="goods-count">1</div>
                    </div>
                </div>`;
    
               return card;                     
        }
    
            // Виводимо товари на екран
    
        const renderBasket = (goods) => {
            cartWrapper.textContent = ' ';
            
            
           
                if (goods.length) {
                    goods.forEach(item => {
    
                       // Деструктуризовані змінні
                        const {id, title, price, imgMin} = item;
                        cartWrapper.appendChild(createCartGoodsBasket(id, title, price, imgMin));
    
                    });
    
                }else{
                    cartWrapper.textContent = 'Sorry, goods not found! ';
                }
             
    
          
        }









        // Закриваємо корзину

        const closeCart = (event) => {
            const target = event.target;

            if (target === cart || target.classList.contains('cart-close')) {
                cart.style.display = '';
            }   

                
            if (event.keyCode === 27) {
                cart.style.display = '';
                document.removeEventListener('keyup', closeCart);
            }

        };




            // Відкриваємо корзину

        const openCart = (event) => {
            event.preventDefault();
            cart.style.display = 'flex';

            document.addEventListener('keyup', closeCart);
        };

            // Отримуємо список товарів з json
        const getGoods = (handler, filter) => {   
            loading();
            fetch('db/db.json')
                .then((response) => {
                    return response.json();
                })
                .then(filter)
                .then((handler))
                
             };
             
             // Рандомно сортуємо товари

        const randomSort = (item) => {
      
            return item.sort(() => Math.random() - 0.5);
        }


            // Вибираємо  товари по категорії

        const choiceCategory = (event) => {
            event.preventDefault();
            const target = event.target;

            if (target.classList.contains('category-item')) {
                const category = target.dataset.category;
                getGoods(renderCard, (goods) => {
                    const newGoods = goods.filter(item => {
                        return item.category.includes(category);
                        
                    });
                    return newGoods
                })
                
            }
        }

                // Виконуємо пошук товарів

        const searchGoods = event => {
            event.preventDefault();

            const input = event.target.elements.searchGoods,
                inputValue = input.value.trim();



                    if( inputValue !== ''){
                        const searchString = new RegExp(inputValue, 'i' );
                        getGoods(renderCard, (goods) => {

                        return  goods.filter(item => {
                            return searchString.test(item.title);
                        });
                    });
                }else{
                    search.classList.add('error');
                    setTimeout(() => {
                        search.classList.remove('error');
                    }, 2000 )
                }

                
                input.value = '';
            };



            function getCookie(name) {
                let matches = document.cookie.match(new RegExp(
                  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
              }


            const cookieQuery = get => {
                if (get) {
                    getCookie('goodsBasket')
                } else {
                    document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3;`
                }
            }

            const checkCount = () => {
                    wishlistCounter.textContent = wishlist.length;
                    cardCounter.textContent = Object.keys(goodsBasket).length;
               
                    
            }

                // Робота із localStorage

            const storageQuery = (get) => {

                if (get) {
                    if (localStorage.getItem('wishlist'))
                        wishlist = JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));
                } else {
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                }
                
            }


                  // Добавляем и убираем лайки на товарах

            const toggleWishlist = (id, elem) => {
                if (wishlist.includes(id)) {
                    wishlist.splice(wishlist.indexOf(id), 1);
                    elem.classList.remove('active')
                } else {
                    wishlist.push(id);
                    elem.classList.add('active')
                }

                checkCount();
                storageQuery();
                // renderCard();

            }


                const addBasket = (id) => {
                    if (goodsBasket[id]){
                        goodsBasket[id] += 1
                    } else {
                        goodsBasket[id] = 1
                    }
                    checkCount();
                    cookieQuery();
                };


                //   Ловить івенти і передає у функції які нам потрібно

                const handlerGoods = event => {
                const target = event.target;

                if (target.classList.contains('card-add-wishlist')) {
                    toggleWishlist(target.dataset.goodsId, target);
                };

                if (target.classList.contains('card-add-cart'))
                    addBasket(target.dataset.goodsId);
            }


        const showWishlist = () => {
            getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)))
        };

        cardBtn.addEventListener('click', openCart);
        cart.addEventListener('click', closeCart);
        category.addEventListener('click', choiceCategory);
        search.addEventListener('submit', searchGoods);
        goodsWrapper.addEventListener('click', handlerGoods);
        wishlistCounter.addEventListener('click', showWishlist);
        cardCounter.addEventListener('click', addBasket);

            //  Передаємо всі товари у функцію RenderCard та randomSort(за допомогою неї ми фільтруємо)

            getGoods(renderCard, randomSort);

}) 
