const carouselInner = $('.carousel-inner');
const carouselIndicators = $('.carousel-indicators');
const imageContainer = $('.row');
const shoppingCart = $('.shop-cart tbody');
const newItemPrice = $('#newItemPPU');
const newItemProduct = $('#newItemProduct');
const newItemQty = $('#newItemQty');
const vatField = $('#newItemVAT');
const vatPercentage = 0.07;

let subtotal = 0;
let shippingAndHandling = 0; 
let vat = 0;
let totalDue = 0;

const accessoryLists = [
    {
        title: 'Transparent Phone Case With Flower Patterns',
        price: 129,
        img: 'images/tech_acc1.jpg'
    },
    {
        title: 'Phone Stand with Adjustable Angles',
        price: 99,
        img: 'images/tech_acc2.jpg'
    },
    {
        title: 'Screen Protector for Laptop',
        price: 154,
        img: 'images/tech_acc3.jpg'
    },
    {
        title: 'Smart Watch',
        price: 5999,
        img: 'images/tech_acc4.webp'
    },
    {
        title: 'Gaming Earphone with Microphone',
        price: 249,
        img: 'images/tech_acc5.webp'
    },
    {
        title: 'Bluetooth Stylus Pen For Tablets',
        price: 1899,
        img: 'images/tech_acc6.webp'
    }
];

const shoppingCartList = [];

$(document).ready(function () {
    renderAccessories();
    renderProducts();
    renderShoppingCart();
    populateProductDropdown();
});

function renderAccessories() {
    accessoryLists.forEach((accessory, index) => {
        carouselIndicators.append(`
            <li data-target="#carouselExampleIndicators" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>
        `);

        const isActive = index === 0 ? 'active' : '';
        const carouselItem = `
        <div class="carousel-item ${isActive}">
            <img class="d-block w-100" src="${accessory.img}" alt="${accessory.title}">
        </div>
    `;
        carouselInner.append(carouselItem);
    });
}

function renderProducts() {
    const itemsPerRow = 3; // 3 columns on large screens

    for (let i = 0; i < accessoryLists.length; i += itemsPerRow) {
        let rowHTML = '<div class="row mb-4">';

        for (let j = 0; j < itemsPerRow && (i + j) < accessoryLists.length; j++) {
            const item = accessoryLists[i + j];
            const itemIndex = i + j;

            rowHTML += `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <img src="${item.img}" 
                         class="img-fluid shadow rounded" 
                         alt="${item.title}" />
                    <div class="container d-flex flex-row justify-content-center align-items-center">
                        <div class="container d-flex flex-column mt-2">
                            <h5 class="mt-2">${item.title}</h5>
                            <p class="text-muted">${item.price}</p>
                        </div>
                        <div class="flex-grow-1"></div>
                        <button type="button" class="btn btn-dark add-btn" onClick="addToCart(${itemIndex})">Add to Cart</button>
                    </div>
                </div>
            `;
        }

        rowHTML += '</div>';
        imageContainer.append(rowHTML);
    }
}

function populateProductDropdown() {
    var $select = $('#newItemProduct');
    accessoryLists.forEach(function (product, idx) {
        $select.append(`<option value="${idx}" data-price="${product.price}">${product.title}</option>`);
    });
}

function renderShoppingCart() {
    shoppingCart.empty();
    // <td><input type="number" min="0" id="newItemQty"></td>
    shoppingCartList.forEach((item, i) => {
        shoppingCart.append(
            // `
            //     <tr>
            //         <th scope="row"><input type="number" min="0" id="newItemQty" value="${item.quantity}"></th>
            //         <td>${item.title}</td>
            //         <td>${item.price}</td>
            //         <td>${item.price * item.quantity}</td>
            //     </tr>
            // `
            `
                <tr>
                    <th scope="row">${item.quantity}</th>
                    
                    <td><button onclick="deleteItem(${i})" class="delete-btn">remove</button>${item.title}</td>
                    <td>${item.price}</td>
                    <td>${item.price * item.quantity}</td>
                </tr>
            `
        )
    });

    renderItemTotals();
};

function renderItemTotals() {
    calculateTotals();
    shoppingCart.append(`
        <tr>
            <td colspan="2"></td>
            <th scope="row">Subtotal</th>
            <td>${subtotal}</td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <th scope="row">VAT (7%)</th>
            <td id="vat-ttl">${vat}</td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <th scope="row">Shipping and Handling</th>
            <td id="ship-ttl">${shippingAndHandling}</td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <th scope="row">Total Due</th>
            <td id="total-ttl">${totalDue}</td>
        </tr>
    `);
};


function calculateTotals() {
    subtotal = 0;
    shippingAndHandling = 0; 
    shoppingCartList.forEach(item => {
        subtotal += item.price * item.quantity;
        shippingAndHandling += 25; 
    });

    vat = (subtotal * vatPercentage).toFixed(2);
    totalDue = (subtotal + parseFloat(vat) + shippingAndHandling).toFixed(2);

    console.log(`Subtotal: ${subtotal}, VAT: ${vat}, Shipping: ${shippingAndHandling}, Total Due: ${totalDue}`);
}

function addItem() {
    let idx = newItemProduct.val();
    let q = newItemQty.val();

    if (idx === "" || !q) return;
    const product = accessoryLists[idx];


    shoppingCartList.push({
        title: product.title,
        quantity: Number.parseFloat(q),
        price: product.price
    });

    $('#exampleModal').modal('hide');
    // renderTable();
    renderShoppingCart();
    // Reset modal fields
    newItemProduct.val("");
    newItemPrice.val("");
    newItemQty.val("");
}

// function addToCart(itemIndex) {
//     window.alert('Item added to cart!~');
//     const item = accessoryLists[itemIndex];

//     if (shoppingCartList.includes(item)) {
//         // If the item already exists in the cart, increase its quantity
//         const existingItem = shoppingCartList.find(cartItem => cartItem.title === item.title);
//         existingItem.quantity += 1;
//     } else {
//         shoppingCartList.push({
//             title: item.title,
//             price: item.price,
//             quantity: 1,
//         });
//     }

//     renderShoppingCart();
// };

function updateVATField() {
    var idx = $('#newItemProduct').val();
    var qty = parseFloat($('#newItemQty').val());
    if (idx !== "" && !isNaN(qty) && qty > 0) {
        var price = productList[idx].unitPrice;
        var vat = (price * qty * 0.07).toFixed(2);
        $('#newItemVAT').val(vat);
    } else {
        $('#newItemVAT').val("0.00");
    }
}

function onProductChange() {
    var idx = $('#newItemProduct').val();
    if (idx !== "") {
        const price = accessoryLists[idx].price;
        newItemPrice.val(price);
    } else {
        newItemPrice.val("");
    }
    newItemQty.val("1");
}

function deleteItem(index) {
    shoppingCartList.splice(index, 1);
    renderShoppingCart();
}

function checkout() {
    if (shoppingCartList.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(`Checkout successful! Total Due: ${totalDue}`);
    shoppingCartList.empty() 
    renderShoppingCart();
}
