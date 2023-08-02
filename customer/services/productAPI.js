function apiGetProducts(){
    return axios({
        url: "https://64a6ad13096b3f0fcc8042c4.mockapi.io/products",
        method: "GET",
    })
}
function apiGetProductById(productID){
    return axios({
        url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productID}`,
        method: "GET",
    })
}
function apiCreateProduct(product){
    return axios({
        url: "https://64a6ad13096b3f0fcc8042c4.mockapi.io/products",
        method: "POST", 
        data: product,
    })
}
function apiUpdateProduct(productID, newProduct){
    return axios({
        url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productID}`,
        method: "PUT",
        data: newProduct,
    })
}
function apiDeleteProduct(productID){
    return axios({
        url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productID}`,
        method: "DELETE",
    })
}