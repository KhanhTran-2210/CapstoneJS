let cart = [];

getProducts();


const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function getProducts() {
  apiGetProducts()
    .then((response) => {
      data = response.data;
      display(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Hàm lọc type
function filterProduct() {
  const selectType = document.getElementById("chooseType").value;
  let filterProduct = [];

  if (selectType === "") {
    filterProduct = data;
  } else {
    filterProduct = data.filter((product) => product.type === selectType);
  }
  display(filterProduct);
}

//Hàm thêm vào giỏ hàng
async function addToCart(productId) {
  const existingProduct = cart.findIndex((item) => item.id == productId);

  if (existingProduct !== -1) {
    cart[existingProduct].quantity++;
  } else {
    await apiGetProductById(productId)
      .then((res) => {
        const { id, name, price, img } = res.data;
        const cartItem = new Cart(id, name, price, img, 1);
        cart.push(cartItem);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  saveCartToLocalStorage();
  renderCartAmount();
}
function decreaseQuantity(productId) {
  let cartItemIndex = cart.findIndex((item) => item.id == productId);
  if (cartItemIndex === -1) {
    console.log("Không tìm thấy sản phẩm trong giỏ hàng");
    return;
  }
  if (cart[cartItemIndex].quantity > 1) {
    cart[cartItemIndex].quantity--;
  } else {
    cart.splice(cartItemIndex, 1)
  }
  saveCartToLocalStorage();
  renderCart();
  renderCartAmount();
}
function increaseQuantity(productId) {
  let cartItem = cart.find((item) => item.id == productId);
  if (!cartItem) {
    console.log("Không tìm thấy sản phẩm trong giỏ hàng");
    return;
  }
  cartItem.quantity++;
  saveCartToLocalStorage();
  renderCart();
  renderCartAmount();
}

function renderCartAmount() {
  // console.log(cart);
  let amount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  saveCartToLocalStorage();
  document.getElementById("cart-amount").innerHTML = amount;
}
function removeProduct(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    renderCart();
  }
}
function renderCart() {
  let html = cart.reduce((result, item) => {
    return (
      result +
      `
    <tr class="text-center align-items-center">
       
       <td>${item.name}</td>
       <td>${item.price}</td>
       <td>
        <img src = "${item.img}" width = "100px" height="100px"></td>
       <td class="text-center d-flex">
       <button class="btn btn-outline-secondary mx-2 text-center p-2" onclick="increaseQuantity(${
         item.id
       })" >+</button>
       <p class="fs-6">${item.quantity}</p>
       <button class="btn btn-outline-secondary mx-2 p-2 text-center" onclick="decreaseQuantity(${
         item.id
       })">-</button></td>
       <td>${item.price * item.quantity}$</td>
       <td><button class="btn btn-danger" onclick="removeProduct('${
         item.id
       }')">Xóa</button></td>
    </tr>
    `
    );
  }, []);

  document.getElementById("tblDanhSachSP").innerHTML = html;
  saveCartToLocalStorage();
  renderCartAmount();
  rendertotalPrice();
}
function rendertotalPrice() {
  let totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  document.getElementById("totalPrice").innerHTML =
    "Total Bill:" + totalPrice + "$";
}
function clearCart() {
  if (cart.length === 0) {
    document.getElementById("modalNoti").innerHTML = "Giỏ hàng chưa có sản phẩm"
    return;
  }
  cart = [];

  document.getElementById("modalNoti").innerHTML = "Thanh toán thành công"
  
  renderCart();
  renderCartAmount();
  
}

//Hàm hiển thị
function display(products) {
  let html = products.reduce((result, value) => {
    let product = new Product(
      value.id,
      value.name,
      value.price,
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    return (
      result +
      `
    <div class="product_card_item">
      <div class="header_card">
        <img src="${product.img}"  width = "100px" height="100px" />
      </div>
      <div class="body_card">
        <h2>${product.name}</h2>
        <p>${product.price}</p>
      </div>
      <div class="footer_card">
        <p>${product.type}</p>
        <p>${product.desc}</p>
      </div>
      <div class="card_overlay">
        <div class="header_overlay">
          <h1>Specifications</h1>
        </div>
        <div class="body_overlay">
          <p><span>Screen:</span>${product.screen}</p>
          <p><span>Back Camera:</span>${product.frontCamera}</p>
          <p><span>Front Camera:</span>${product.backCamera}</p>
        </div>
        <div class="footer_overlay">
          <button class="btn btn-success mt-5" onclick=addToCart(${product.id})>Add to Card</button>
        </div>
      </div>
    </div>
       `
    );
  }, "");
  document.getElementById("card").innerHTML = html;
}
