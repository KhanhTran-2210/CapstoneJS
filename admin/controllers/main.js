getProducts();

function getProducts(param = null) {
   apiGetProducts(param)
      .then((response) => {
         //gọi hàm display để hiển thị ra giao diện
         display(response.data);
      })
      .catch((error) => {
         console.log(error);
      });
}

function createProduct() {
   let product = validate();
   if (!product) return;

   //Gọi API thêm sản phẩm
   apiCreateProduct(product)
      .then((reponse) => {
         console.log(reponse.data);
         //sau khi thêm thành công, dữ liệu chỉ mới được cập nhật ở phía sever. Ta cần gọi lại hàm apiCreateProduct để lấy được danh sách những sản phẩm mới nhất (bao gồm sản phẩm mình mới thêm)
         return apiGetProducts();
      })
      .then((reponse) => {
         //reponse là kết quả promise của hàm apiCreateProduct
         // console.log(reponse)
         display(reponse.data);

         //Ẩn modal
         $("#myModal").modal("hide");
      })
      .catch((error) => {
         console.log(error);
      });
}

function removeProduct(productId) {
   apiDeleteProduct(productId)
      .then(() => {
         //Xóa thành công
         return apiGetProducts();
      })
      .then((reponse) => {
         display(reponse.data);
      })
      .catch((error) => {
         console.log(error);
      });
}

function selectProduct(productId) {
   //Hiển thị modal
   $("#myModal").modal("show");
   //
   getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
   getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-success" onclick ="updateProduct('${productId}')">Cập nhật</button>
        `;

   apiGetProductById(productId)
      .then((response) => {
         //Lấy thông tin sản phẩm thành công =>
         let product = response.data;

         getElement("#TenSP").value = product.name;
         getElement("#GiaSP").value = product.price;
         getElement("#HinhSP").value = product.img;
         getElement("#ScreenSP").value = product.screen
         getElement("#BackCameraSP").value = product.backCamera
         getElement("#FrontCameraSP").value = product.frontCamera
         getElement("#DescSP").value = product.desc
         getElement("#loaiSP").value = product.type;

      })
      .catch((error) => {
         console.log(error);
      });
}

function updateProduct(productId) {
   const newProduct = validate();

   if (!newProduct) return;

   apiUpdateProduct(productId, { ...newProduct, img: newProduct.image })
      .then(() => {
         //Cập nhật thành công
         return apiGetProducts();
      })
      .then((response) => {
         display(response.data);
         $("#myModal").modal("hide");
      })
      .catch((error) => {
         console.log(error);
      });
}

// Hàm hiển thị ra giao diện
function display(products) {
   let html = products.reduce((result, value, index) => {
      let product = new Product(
         value.id,
         value.name,
         value.price,
         value.img,
         value.screen,
         value.backCamera,
         value.frontCamera,
         value.desc,
         value.type
      );
      return (
         result +
         `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <img src="${product.image}" width = "100px" height="100px"/> 
            </td>
            <td>${product.desc}</td>
            <td>
                <button class = "btn btn-primary" onclick="selectProduct('${
                   product.id
                }')">Xem</button>
                <button class = "btn btn-danger" onclick="removeProduct('${
                   product.id
                }')">Xóa</button>
            </td>
        </tr>
        `
      );
   }, "");
   document.getElementById("tblDanhSachSP").innerHTML = html;
}

// Reset form
function resetForm() {
   getElement("#TenSP").value = "";
   getElement("#GiaSP").value = "";
   getElement("#HinhSP").value = "";
   getElement("ScreenSP").value = "";
   getElement("BackCameraSP").value = "";
   getElement("FrontCameraSP").value = "";
   getElement("DescSP").value = "";
   getElement("#loaiSP").value = "";

   errorMsg("#errorTenSP", "");
   errorMsg("#errorGiaSP", "");
   errorMsg("#errorHinhSP", "");
   errorMsg("#errorHinhSP", "");
   errorMsg("#errorScreenSP", "");
   errorMsg("#errorBackCameraSP", "");
   errorMsg("#errorFrontCameraSP", "");
   errorMsg("#errorloaiSP", "");
}

// Validate
function checkRequired(value) {
   return Boolean(value.trim());
}

function validate() {
   let isValid = true;

   const product = {
      name: getElement("#TenSP").value,
      price: getElement("#GiaSP").value,
      image: getElement("#HinhSP").value,
      screen: getElement("#ScreenSP").value,
      backCamera: getElement("#BackCameraSP").value,
      frontCamera: getElement("#FrontCameraSP").value,
      desc: getElement("#DescSP").value,
      type: getElement("#loaiSP").value,
   };

   for (const key in product) {
      if (!checkRequired(product[key])) {
         isValid = false;
         errorMsg(`#error${PRODUCT_ID[key]}`, errorMessages[key]);
      } else {
         errorMsg(`#error${PRODUCT_ID[key]}`, "");
      }
   }
   if (!isValid) {
      return;
   }
   return { ...product, price: product.price * 1 };
}

// Toggle modal
getElement("#btnThemSP").onclick = () => {
   getElement(".modal-title").innerHTML = "Thêm sản phẩm";
   getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-success" onclick ="createProduct()">Thêm</button>
        `;
};

// clicked outside modal
getElement("#myModal").onclick = (event) => {
   let isClickOutSide = event.target.getAttribute("modal-scope");

   if (isClickOutSide) {
      setTimeout(() => {
         resetForm();
      }, 100);
      $("#myModal").modal("hide");
   }
};

// Listen event search
getElement("#txtSearch").onkeypress = (event) => {
   if (event.key !== "Enter") {
      return;
   }
   getProducts(event.target.value);
};

getElement("#basic-addon2").onclick = () => {
   let searchTerm = getElement("#txtSearch").value;
   getProducts(searchTerm);
};

// Utils
function getElement(selector) {
   return document.querySelector(selector);
}

function errorMsg(id, msg) {
   getElement(id).innerHTML = msg;
}

const PRODUCT_ID = {
   name: "TenSP",
   price: "GiaSP",
   image: "HinhSP",
   screen: "ScreenSP",
   backCamera: "BackCameraSP",
   frontCamera: "FrontCameraSP",
   desc: "DescSP",
   type: "loaiSP",
};
const errorMessages = {
   name: "Tên sản phẩm không được để trống!",
   price: "Giá sản phẩm không được để trống!",
   image: "Hình ảnh không được để trống!",
   screen: "Màn hình không được để trống!",
   backCamera: "Camera sau không được để trống!",
   frontCamera: "Camera trước không được để trống!",
   desc: "Mô tả không được để trống!",
   type: "Vui long chọn loại sản phẩm",
};