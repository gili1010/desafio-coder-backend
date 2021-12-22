const fs = require('fs')

//Error
const error = {'error':'producto no encontrado'}

class Contenedor {
    constructor(nombreArchivo) {
        this.id = 0
        this.list = []
        this.filename = nombreArchivo
        this.init()
    }

    init(){
        const data = fs.readFileSync(this.filename)
        const listaFromFile = JSON.parse(data)

        for (const obj of listaFromFile) {
            this.insert(obj)
        }

        //Buscamos el id mas alto para inicializar el this.id
        const listId = this.list.map(obj => {
            return obj.id
        })
        const maxId = Math.max(...listId)
        this.id=maxId
    }

    insert(obj) {
        obj.id = ++this.id
        obj.timestamp = Date.now()
        this.list.push(obj)

        return obj
        
    }

    find(id){
        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return error
        }else{
            return object
        }
    }

    update(id, obj){
        const index = this.list.findIndex((objT) => objT.id == id)

        if(index==-1){
            return error
        }else{
            obj.id = this.list[index].id
            this.list[index] = obj
    
            return obj
        }

    }

    delete(id){

        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return error
        }else{
            this.list = this.list.filter((obj) => obj.id != id)

            return this.list
        }

    }

    async write(){
        try{
            await fs.promises.writeFile(this.filename,JSON.stringify(this.list))

        } catch (err) {
            console.log('no se pudo escribir el archivo ' + err)
        }
    }

    //For Cart Purposes
    cartCreate(obj){
        //Buscamos el maximo index de carrito 
        const idCarts = this.list.map(obj => {
            return obj.id
        })
        const maxIdCarts = Math.max(...idCarts)
        obj.id = maxIdCarts + 1
        obj.timestamp = Date.now()
        obj.productos= []

        //Pusheamos el cart
        this.list.push(obj)
        return obj.id
    }

    cartInsert(cartId,obj) {
        //Buscamos el index del id del cart
        const index = this.list.findIndex((objT) => objT.id == cartId)

        if(this.list[index].productos.length == 0) {
            obj.id = 1
        } else {
            //Buscamos el maximo id de productos dentro del cart
            const idProductsInCart = this.list[index].productos.map(obj => {
                return obj.id
            })
            const maxIdProducts = Math.max(...idProductsInCart)
            obj.id = maxIdProducts + 1
        }
        
        obj.timestamp = Date.now()

        //Pusheamos el producto 
        this.list[index].productos.push(obj)

        return obj
    }

    cartDelete(cartId,prodId) {
        const cartSearch = this.list.findIndex((obj) => obj.id == cartId)

        if(cartSearch<0){
            return error
        }

        const prodSearch = this.list[cartSearch].productos.findIndex((obj) => obj.id == prodId)

        if(prodSearch<0) {
            return error
        }

        this.list[cartSearch].productos.splice(prodSearch, 1)

        return prodId
        
    }
}

module.exports = Contenedor