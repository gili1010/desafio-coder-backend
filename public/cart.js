let carritos = []
let productos = []

function fetchAndRenderCarritos() {
    fetch('/api/carrito')
    .then( response => response.json())
    .then(data => {
        
        data.forEach(function(carrito){
            $("#carritos").append(
                `
                <div class="row">
                    <div class="col-7 titulo">
                        Carrito ${carrito.id}
                    </div>
                    <div class="col-4 btn-container">
                        <button onclick="deleteCart(${carrito.id})" class="btn btn-eliminar" value="crear">Eliminar Carrito</button>
                    </div>

                    <div class="container-flex">
                    <div id="productosCart${carrito.id}"> </div>
                </div>
                `
            )
            
            //buscar los productos que hay dentro del carrito
            fetch('/api/carrito/'+carrito.id+"/productos")
            .then( response => response.json())
            .then( productos => {
                
                productos.forEach(function(producto){
                    $("#productosCart"+carrito.id).append(
                        `
                            <div class="d-inline-flex p-2" >
                            <div class="card" style="width: 15rem;">
                                <img src="${producto.foto}" style="height:18rem;" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${producto.nombre}</h5>
                                    <p class="card-text">${producto.descripcion}</p>
                                    <p class="card-text">Codigo: ${producto.codigo}</p>
                                    <p class="card-text">Precio: ${producto.precio}</p>
                                    <p class="card-text">Stock: ${producto.stock}</p>
                                    <button onclick="deleteProductFromCart(${carrito.id}, ${producto.id})" class="btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                        </div>
                        `
                    )
                })
            })

        })

    })
}

function addToCart(){
    const idCart = $("#idCarrito").val()
    const idProd = $("#idProducto").val()

    fetch('/api/productos/'+idProd)
    .then( response => response.json())
    .then(data => {
        productos=data
        multiusageFetch(idCart, "POST", productos, "Objeto aniadido exitosamente al carrito.")
    })

}

function deleteProductFromCart(idCart, idProd){

    multiusageFetch(idCart, "DELETE", null, "Objeto eliminado exitosamente del carrito", idProd)
}

function deleteCart(idCart){
    multiusageFetch(idCart, "DELETE", null, "Carrito eliminado exitosamente.", null)
}

function createCart(){
    multiusageFetch(null, "POST", null, "Carrito creado exitosamente.", null)
}

function multiusageFetch(idCart, method, obj, successMessage, idProd) {
    let body = ""
    let path = ""

    if(idProd==null){
        path = '/api/carrito/'+idCart+'/productos'
    }else{
        path = '/api/carrito/'+idCart+'/productos/'+idProd
    }

    if((obj==null) && (idProd==null)) {
        path = '/api/carrito/'+idCart
    }

    if(obj==null){
        body=""
    }else{
        body=JSON.stringify(obj)
    }

    if(idCart==null) {
        path= '/api/carrito'
    }


    fetch(path, {
        method:method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then( () => {
        window.alert(successMessage)
        window.location.reload()
    })
    .catch(err => {
        console.log(err)   
    })
}

fetchAndRenderCarritos()