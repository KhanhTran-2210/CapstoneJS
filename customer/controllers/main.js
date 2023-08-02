let cart = [];

getProducts();

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
            const { id, name, price, img, } = res.data;
            const cartItem = new Cart(id, name, price, img, 1);
            cart.push(cartItem);
         })
         .catch((error) => {
            console.log(error);
         });
   }

   renderCartAmount();
}
function decreaseQuantity(productId){
   let cartItem = cart.find((item) => item.id == productId)
   if(!cartItem){
      console.log("Không tìm thấy sản phẩm trong giỏ hàng");
      return
   }
   if(cartItem.quantity > 1){
      cartItem.quantity--
   }
   renderCart()
   renderCartAmount()
}
function increaseQuantity(productId){
   let cartItem = cart.find((item) => item.id == productId)
   if(!cartItem){
      console.log("Không tìm thấy sản phẩm trong giỏ hàng");
      return
   } 
      cartItem.quantity++
   renderCart()
   renderCartAmount()
}

function renderCartAmount() {
   // console.log(cart);
   let amount = cart.reduce((total, item) => {
      return total + item.quantity;
   }, 0);

   document.getElementById("cart-amount").innerHTML = amount;
}

function renderCart() {
   let html = cart.reduce((result, item) => {
      return (
         result +
         `
    <tr>
       <td>${item.id}</td>
       <td>${item.name}</td>
       <td>${item.price}</td>
       <td>
        <img src = "${item.img}" width = "100px" height="100px"></td>
       <td class="text-center px-5">
       <button class="btn btn-primary p-1 text-center" onclick="increaseQuantity(${item.id})" >+</button>
       ${item.quantity}
       <button class="btn btn-primary p-1 text-center" onclick="decreaseQuantity(${item.id})">-</button></td>
       <td>${item.price * item.quantity}$</td>
    </tr>
    
    `
      );
   }, []);

   document.getElementById("tblDanhSachSP").innerHTML = html;
   renderCartAmount();
   rendertotalPrice()
}
function rendertotalPrice(){
   let totalPrice = cart.reduce((total,item) =>{
      return total + item.price * item.quantity;
   }, 0)
   document.getElementById("totalPrice").innerHTML = "Total Bill:" + totalPrice + "$"
}
//Hàm hiển thị
function display(products) {
   let html = products.reduce((result, value) => {
      let product = new Product(
         value.id,
         value.name,
         value.price,
         value.screen,
         value.backCam,
         value.frontCam,
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
          <p><span>Back Camera:</span>${product.frontCam}</p>
          <p><span>Front Camera:</span>${product.backCam}</p>
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
