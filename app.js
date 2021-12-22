const express = require('express')
const Products = require('./prods/Container.js')
const Cart = require('./prods/Container.js')
const {Router} = express
const routerProduct = Router()
const routerCart = Router()

const app = express()

const PORT = 8080

//Declaramos una variable booleana para saber si es usuarios es o no admin
const ISADMIN = true

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const products = new Products(__dirname + '/data/productos.json')
const cart = new Cart(__dirname + '/data/carrito.json')

//Router base /api/productos
//Funcionalidad a: GET /:id --> Devuelve un producto segun su ID || para users y admins
routerProduct.get("/:id", (req, res) => {
    let id = req.params.id
    return res.json(products.find(id))
})

routerProduct.get("/", (req, res) => {
    return res.json(products.list)
})

//Funcionalidad b: POST / --> Incorpora productos al listado || solo admins
routerProduct.post("/", mwAdmin, (req, res) => {
    let obj = req.body
    let post = products.insert(obj)
    products.write()
    return res.json(post)
})

//Funcionalidad c: PUT /:id --> Actualiza un producto segun su id || solo admins
routerProduct.put("/:id", mwAdmin, (req, res) => {
    let obj = req.body
    let id = req.params.id
    let put = res.json(products.update(id,obj))
    products.write()
    return put
})

//Funcionalidad d: Borra un producto segun su ID || solo admins
routerProduct.delete("/:id", mwAdmin, (req,res) => {
    let id = req.params.id
    let deleted = res.json(products.delete(id))
    products.write()
    return(deleted)
})


//Router base /api/carrito
//Funcionalidad extra: GET / --> obtiene el listado de carritos || usuarios y admins
routerCart.get("/", (req, res) => {

    return res.json(cart.list)
})

//Funcionalidad a: POST / --> Crea un carrito y devuelve su id || usuarios y admins
routerCart.post("/", (req, res) => {
    let obj = req.body
    let create = res.json(cart.cartCreate(obj))
    cart.write()
    return create
})

//Funcionalidad b: DELETE /:id --> Vacia un carrito y lo elimina || usuarios y admins
routerCart.delete("/:id", (req,res) => {
    let id = req.params.id
    let deleted = res.json(cart.delete(id))
    cart.write()
    return(deleted)
})

//Funcionalidad c: GET /:id/productos --> Permite listar todos los productos del carrito || usuarios y admins
routerCart.get("/:id/productos", (req, res) => {
    let id = req.params.id
    return res.json(cart.find(id).productos)
})

//Funcionalidad d: POST: /:id/productos --> Incorpora productos al carrito por id de carrito? || usuarios y admins
routerCart.post("/:id/productos", (req, res) => {
    let obj = req.body
    let id = req.params.id
    let post = res.json(cart.cartInsert(id,obj))
    cart.write()
    return post
})

//Funcionalidad e: DELETE: /:id/productos/:id_prod --> Elimina un producto del carrito por su id de carrito y de producto
routerCart.delete("/:id/productos/:idprod", (req,res) => {
    let idCart = req.params.id
    let idProd = req.params.idprod
    let deleted = res.json(cart.cartDelete(idCart, idProd))
    cart.write()
    return(deleted)
})




app.use('/api/productos', routerProduct)
app.use('/api/carrito', routerCart)

//Listening
app.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})

//Manejador de errores
app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Ocurrio un error: '+err)
})

app.use(function(req,res,next) {

    const error = {
        error:-2,
        descripcion:`ruta ${req.path} metodo ${req.method} no implementado.`
    }
    res.status(500).send(error)
})

//Middleware de seguridad
function mwAdmin(req,res,next){
    if(ISADMIN){
        next()
    }else{
        const error={
            error:-1,
            descripcion: `Ruta ${req.url} metodo ${req.method} no autorizado.`
        }
        res.status(500).send(error)
    }
}