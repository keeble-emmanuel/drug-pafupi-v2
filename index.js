const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const controller = require('./controller')
const PORT = 3000

app.use(bodyParser.json())
app.use(express.static('frontend'))

//search input controller
app.post('/', controller.searchDrug)

//first page display
app.get('/',)
app.get('/new_product', (req, res)=>{
    res.sendFile(__dirname + "/frontend/back-office.html")
})
//master-account
app.get('/keeble', (req, res)=>{
    res.sendFile(__dirname + "/frontend/master_account.html")
})
//404 page
app.get('/not-found', (req, res)=>{
    res.sendFile(__dirname + "/frontend/404page.html")
})
//delete product
app.get('/deleteProduct/:productId', controller.deleteProduct)
//promote product
app.post('/promote-product', controller.promoteProduct)
//depromote product
app.post('/depromote-product', controller.depromoteProduct)
//get all-users
app.get('/all-users', controller.getAllUsers)
//get specific user
app.get('/get_user/:user_id', controller.getUserDetails)
//create new user
app.post('/new-user', controller.creatNewUser)
//update location
app.post('/update-location', controller.updateLocation)
//change password
app.post('/update-location', controller.updateLocation)
//delete user
app.get('/keeble/delete-user/:idtodelete', controller.deleteUser)
//create product
app.post('/new-product', controller.createNewDrug)
//update product
app.post('/update-product', controller.updateProduct)
//searched page
app.post('/searched-page', controller.searchedPage)
//display all products
app.get('/all-products', controller.marketDisplay)
//sign-in
app.post('/sign-in', controller.signInfunx)
//
app.get('/getproducts/:user_id',  controller.getUserproducts )
//change password
app.post('/change-password', controller.changePassword)

app.listen(PORT, ()=>{
    console.log('app listening')
})
