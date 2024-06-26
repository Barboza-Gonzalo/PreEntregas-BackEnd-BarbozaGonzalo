const express = require("express")
const router = express.Router()
const cartsModel = require("../DAO/models/carts.model.js")
const productsModel = require("../DAO/models/products.model.js")

router.post('/', async (req,res)=>{
    try{        
        const newCart = new cartsModel({
            products: [] 
        });    
        const savedCart = await newCart.save();
        res.send({ result: "success", payload: savedCart });

    }catch(error){
        res.send("Error al crear nuevo carrito de compras")
    }
})



router.get('/:cid', async (req,res)=>{
    try{
        let {cid} = req.params
        const cart = await cartsModel.findById(cid).populate('products.productId')
        console.log(cart)
        res.render("carts", {cart} )
     

    }catch(error){
        res.send("ID carrito inexistente")

    }
})
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {cid , pid} = req.params
        const cart = await cartsModel.findById({ _id:cid})
        const product = await productsModel.findById({_id: pid}) ;
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ productId: pid, quantity: 1 });
        }
        await cart.save();

        res.send({ result: "success", message: "Producto agregado al carrito correctamente", payload: cart });
    } catch (error) {
        res.send("ERROR ,no se agrega producto")
    }
})


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const {cid , pid} = req.params
        const cart = await cartsModel.findById({ _id:cid})
        if (!cart) {
            return res.status(404).json({ result: "error", message: "Carrito no existe" });;
        }
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));
        if (productIndex === -1) {
            return res.status(404).json({ result: "error", message: "Producto no se encuentra en el carrito" });
        }        
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.send({ result: "success", message: "Producto eliminado del carrito correctamente", payload: cart });
    } catch (error) {
        ;
        res.status(500).json({ result: "error", message: "Server error" });
    }
});



router.put('/:cid', (req, res) => {
    // deberá actualizar el carrito con un arreglo de productos con el formato especificado anteriormente.
})



router.put('/:cid/products/:pid', async (req, res) => {
    try{
        const {cid , pid} = req.params
        const { quantity } = req.body;
        const cart = await cartsModel.findById({ _id:cid})
        const productIndex = cart.products.findIndex(item => item.productId.equals(pid));

        cart.products[productIndex].quantity = quantity
        await cart.save();

        res.send({ result: "success", payload: cart });
    } catch (error) {
        res.status(404).send("ERROR ,no se suma producto")
    }
    
})



router.delete('/:cid', async (req, res) => {
    const {cid } = req.params
    const cart = await cartsModel.findById({ _id:cid})
    if (!cart) {
        return res.json({ result: "error", message: "carrito no existente" });
    }
    cart.products = [];
    await cart.save();

    res.status(200).send({ result: "success", payload: cart })
    
})








module.exports = router