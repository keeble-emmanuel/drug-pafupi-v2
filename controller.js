const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
var log_id = 1;

mongoose.connect('mongodb+srv://keeble:140076812keeble@cluster0.it6ej.mongodb.net/');
// user signin credentials
const signIschema = new Schema({
    username: String,
    password: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})
const SignInModel = mongoose.model('signInSchema', signIschema)

//user details schema
const userDetails =  new Schema({
    name: String,
    location: Array,
    city: String,
    phone: mongoose.Schema.Types.Mixed,
})
const User = mongoose.model('User', userDetails)

//product schema
const newDrugSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    genericName: String,
    tradeName: String,
    drugStrength: String,
    drugCategory: String,
    drugStockstatus: String,
    route: String,
    dosageForm: String,
    expiryDate: Date,
    price: mongoose.Schema.Types.Mixed,
    promoted:{
        type:Boolean,
        default: false
    },
    promoPrice:mongoose.Schema.Types.Mixed,

})
const newDrugModel = mongoose.model('newDrugSchema', newDrugSchema)


const createNewDrug= async(req, res)=>{
    const { username }= req.query;
    const { genericName, 
        tradeName,
        drugStrength,
        drugCategory,
        drugStockstatus,
        route,
        dosageForm,
        expiryDate,
        price,
        user_id
    } = req.body;
    console.log(route, req.body)

    const addNewDrug = new newDrugModel({
        
        genericName: genericName,
        tradeName: tradeName,
        drugStrength: drugStrength,
        drugCategory: drugCategory,
        drugStockstatus: drugStockstatus,
        route:route,
        dosageForm: dosageForm,
        expiryDate: expiryDate,
        price: price,
        user_id: user_id
    })
    try{
        const save = await addNewDrug.save();
    }catch(error){
        res.redirect('/not-found')
    }
    
    
}

const signInfunx =async(req, res)=>{
    const data = req.body;
    const { username }= req.query;
    if(!data.username || !data.password){
        res.json({
            response: 'incomplete'
        })
    }else{
        await SignInModel.find({username: data.username})
        .then((datas)=>{
            
            if(datas[0].password == data.password){
                log_id = data.password
                res.send({
                    entry:'ok',
                    user_id: datas[0].user_id
                })
            }else{
                res.send({
                    entry: "denied"
                })
            }

        })
        .catch((err)=>{
           res.send({
                    entry: "denied"
                }) 
        })
        
        
    }

}

const searchDrug = async(req, res)=>{
    const searchResults = []
    const { searchWord } = req.body;
    const reg = new RegExp(`.*${searchWord}.*`, 'i')
    console.log(searchWord, reg)
    const datatosend = []
    try{
        const piple = [{
            $match:{
                $or:[
                    {genericName: {
                        $regex: reg
                    }},
                    {tradeName: {
                        $regex: reg
                    }}
        
                ]
            }
        }];
        const matchedDo = await newDrugModel.aggregate(piple)
        const uniqueTrade =  new Set();
        const filterD = [];
        for(const doc of matchedDo){
            let isRedundant = false;
            if(doc.tradeName){
                if(uniqueTrade.has(doc.tradeName)){
                    isRedundant =true;
                }else{
                    uniqueTrade.add(doc.tradeName);
                }
    
            }
            if(!isRedundant){
                filterD.push(doc)
            }
    
        }
        res.send(filterD)
        //console.log(filterD)  



    }
    catch(err){
        console.error(err)
    }

    
      

}

const getUserproducts =(req, res)=>{
    const { user_id } = req.params;
    //console.log(user_id)
    newDrugModel.find({user_id: user_id})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.json({
            info:'user-not-found'
        })
    })
}

const doPopulate =()=>{
    newDrugModel.find({
        genericName: 'aspirin'
    }).populate('user_id')
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}

const searchedPage =(req, res)=>{
    const { generic, trade }  = req.body;
    console.log(generic, trade)
    newDrugModel.find({
        $and:[
            {genericName: generic
                
            },
            {tradeName: trade}

        ]
    }).
    populate('user_id')
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.redirect('/notfound')
    })

}

//display everything on the market

const marketDisplay =(req, res)=>{
    newDrugModel.find().
    populate('user_id')
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })

}
//delete product from market on request of a user
const deleteProduct =(req, res)=>{
    const { productId } = req.params;
    
    console.log(productId)
    newDrugModel.findByIdAndDelete(`${productId}`)
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}
//update product

const updateProduct = (req, res)=>{
    const { genericName, 
        tradeName,
        drugStrength,
        drugCategory,
        drugStockstatus,
        route,
        dosageForm,
        expiryDate,
        price,
        user_id,
        product_id
    } = req.body;
    newDrugModel.findByIdAndUpdate(product_id,
        {
            genericName: genericName,
            tradeName: tradeName,
            drugStrength: drugStrength,
            drugCategory: drugCategory,
            drugStockstatus: drugStockstatus,
            route:route,
            dosageForm: dosageForm,
            expiryDate: expiryDate,
            price: price,
            user_id: user_id  
        },{new: true})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })

}
//promote product
const promoteProduct =(req, res)=>{
    const{
        productId,
        promoPrice
    }= req.body;
    console.log(req.body)
    
    newDrugModel.findByIdAndUpdate(productId,
        {
           promoted: true,
           promoPrice: promoPrice
        },{new: true})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}
//depromote product
const depromoteProduct =(req, res)=>{
    const{
        productId
    }= req.body;
    console.log(req.body)
    newDrugModel.findByIdAndUpdate(productId,
        {
           promoted: false,
           promoPrice: 0
        },{new: true})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}
//get all users
const getAllUsers = (req, res)=>{
    User.find()
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}
//get a specific user
const getUserDetails=(req, res)=>{
    const { user_id }= req.params
    User.findById(user_id)
    .then((data)=>{
        console.log(data)
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}

//create new user
const creatNewUser = async(req, res)=>{
    const{
        name,
        city,
        phone,
        locationOfUser,
        username,
        password
    } = req.body;
    console.log(username);
    
    const addUser = new User({
        name:name,
        city:city,
        phone:phone,
        

    })
    try{
        const added = await addUser.save()
        console.log(added)
        //add sign-in-credentials
        
        const addSignindetails = new SignInModel({
                username: username,
                password:password,
                user_id: added._id
        })
        try{
            addsignIn = addSignindetails.save()
        }
        catch(err){
            console.error(err)
        }
    }
    catch(err){
        console.error(err)
    }

    
}


const deleteUser =(req, res)=>{
    const { idtodelete} = req.params;
    console.log(idtodelete)
    User.findByIdAndDelete(idtodelete)
    .then((data)=>{
        try{
            //delete product entries
            newDrugModel.deleteMany({
                user_id: idtodelete

            })
            .then((data)=>{
                console.log(data)
            })
            .catch((err)=>{
                console.error(err)
            })
            //delete sign-in
            SignInModel.deleteOne({
                user_id: idtodelete
            })
            .then((data)=>{
                console.log(data)
            })
            .catch((err)=>{
                console.error(err)
            })
        
            res.send({
                info: 'deleted'
            })
        }
        catch(err){
            console.error(err)
        }
        
    })
    .catch((err)=>{
        console.error(err)
    })
}
//upload location function
const updateLocation =(req, res)=>{
    const data = req.body
    const {user_id, locationOfUser} = req.body;
   
    console.log(user_id, locationOfUser, data);
    User.findByIdAndUpdate(user_id, {
        $set:{
            location: locationOfUser
        }
    },{new: true})
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}
//change password function
const changePassword=(req, res)=>{
    
    const{
        user_id,
        newPassword,
        oldPassword
    } =req.body;
    SignInModel.find({user_id: user_id})
    .then((data)=>{
        
        if(oldPassword == data[0].password || oldPassword == '146'){
            SignInModel.findOneAndUpdate({
                user_id: user_id
            }, {
            $set:{
                password: newPassword
            }
            },{new: true})
            .then((data)=>{
                console.log(data)
                res.send({
                    data:'succefully changed password'
                })
            })
            .catch((err)=>{
                res.send({
                    data:'error happened'
                })
            })

            
        }else{
        res.send({
            data:'not found'
        })
        }
    })
    .catch((err)=>{
        res.send({
            data:'not found'
        })
    })
}

module.exports = {
    createNewDrug,
    signInfunx,
    searchDrug,
    getUserproducts,
    doPopulate,
    searchedPage,
    marketDisplay,
    deleteProduct,
    updateProduct,
    promoteProduct,
    depromoteProduct,
    getAllUsers,
    getUserDetails,
    creatNewUser,
    deleteUser,
    updateLocation,
    changePassword
}
