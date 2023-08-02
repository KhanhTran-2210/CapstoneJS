getProducts()

function getProducts(){
    apiGetProducts()
    .then((response) => {
        //gọi hàm display để hiển thị ra giao diện 
        display(response.data)
    })
    .catch((error) => {
        console.log(error);
    })
}
function createProduct(){
// DOM và khởi tạo object product
    let product = {
        name: getElement("#TenSP").value,
        price: +getElement("#GiaSP").value,
        image: getElement("#HinhSP").value,
        type: getElement("#loaiSP").value
    }
    //Gọi API thêm sản phẩm
    apiCreateProduct(product)
    .then((reponse) => {
        console.log(reponse.data);
        //sau khi thêm thành công, dữ liệu chỉ mới được cập nhật ở phía sever. Ta cần gọi lại hàm apiCreateProduct để lấy được danh sách những sản phẩm mới nhất (bao gồm sản phẩm mình mới thêm)
        return apiGetProducts()
    })
    .then((reponse) => {
        //reponse là kết quả promise của hàm apiCreateProduct
        // console.log(reponse)
        display(reponse.data)


        //Ẩn modal
        $('#myModal').modal('hide')
    })
    .catch((error) => {
        console.log(error);
    })
}
function removeProduct(productId){
    apiDeleteProduct(productId).then(() => {
        //Xóa thành công 
        return apiGetProducts()
    })
    .then((reponse) =>{
        display(reponse.data)
    })
    .catch((error) =>{
        console.log(error);
    })

}
function selectProduct(productId){
    //Hiển thị modal
    $('#myModal').modal('show')
    //
    getElement(".modal-title").innerHTML = "Cập nhật sản phẩm"
    getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-success" onclick ="updateProduct('${productId}')">Cập nhật</button>
    `
    apiGetProductById(productId)
    .then((response) => {
        //Lấy thông tin sản phẩm thành công => 
        let product = response.data
        getElement("#TenSP").value = product.name,
        getElement("#GiaSP").value = product.price
        getElement("#HinhSP").value = product.image
        getElement("#loaiSP").value = product.type
    })
    .catch((error) => {
        console.log(error);
    })

}
function updateProduct(productId){
    let newProduct = {
        name: getElement("#TenSP").value,
        price: +getElement("#GiaSP").value,
        image: getElement("#HinhSP").value,
        type: getElement("#loaiSP").value
    }
    apiUpdateProduct(productId, newProduct)
    .then(() => {
        //Cập nhật thành công
        return apiGetProducts()
    })
    .then((response) =>{
        display(response.data)
        $('#myModal').modal('hide')
    })
    .catch((error) => {
        console.log(error);
    })
}
// Hàm hiển thị ra giao diện
function display(products){
    let html = products.reduce((result, value, index) => {
       let product = new Product(value.id, value.name, value.price, value.image, value.type)
        return (result + `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <img src ="${product.image}" width = "100px" height="100px"/> 
            </td>
            <td>${product.type}</td>
            <td>
                <button class = "btn btn-primary" onclick = "selectProduct('${product.id}')">Xem</button>
                <button class = "btn btn-danger" onclick = "removeProduct('${product.id}')">Xóa</button>
            </td>
        </tr>
        `)
    }, "")
    document.getElementById("tblDanhSachSP").innerHTML = html
}

// Modal Heading
//DOM
getElement("#btnThemSP").onclick = () => {
    getElement(".modal-title").innerHTML = "Thêm sản phẩm"
    getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-success" onclick ="createProduct()">Thêm</button>
    `
}
getElement('#txtSearch').onkeypress = (event) =>{
    if(event.key !== "Enter"){
        return
    }
    apiGetProducts(event.target.value)
    .then(response =>{
        display(response.data)
    })
    .catch((error) =>{
        console.log(error);
    })
}

// Utils
function getElement(selector){
    return document.querySelector(selector)
}
