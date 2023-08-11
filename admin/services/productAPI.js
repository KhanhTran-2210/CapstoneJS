function apiGetProducts(searchValue) {
   return axios({
      url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products`,
      method: "GET",
      params: {
         name: searchValue || undefined,
      },
   });
}
function apiGetProductById(productId) {
   return axios({
      url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productId}`,
      method: "GET",
   });
}
//product = {name: "...", price: 1000, image:"...", type: "..."}
function apiCreateProduct(product) {
   return axios({
      url: "https://64a6ad13096b3f0fcc8042c4.mockapi.io/products",
      method: "POST",
      data: product,
   });
}

function apiUpdateProduct(productId, newProduct) {
   return axios({
      url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productId}`,
      method: "PUT",
      data: newProduct,
   });
}
function apiDeleteProduct(productId) {
   return axios({
      url: `https://64a6ad13096b3f0fcc8042c4.mockapi.io/products/${productId}`,
      method: "DELETE",
   });
}
