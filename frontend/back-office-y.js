const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const enterNewEntry = document.getElementById('entry-btn')
const productsDisplayD =  document.getElementById('products-display-div');
const stockStat=  document.getElementById('stock-stat');
const pcategory = document.getElementById('category');
const price =  document.getElementById('price');
const expiryDate =  document.getElementById('expiry');
const dosageForm = document.getElementById('dosage-form');
const route = document.getElementById('route');
const dialogMsg = document.getElementById("dialog-msg");
const locationBtn = document.getElementById('submit-location');
const accBtn =  document.getElementById('accounts');
const closeDeleteDialog = document.getElementById('confirm-close-dialog');
const userHeading = document.getElementById('user-heading');
const newpricePromotion = document.getElementById('new_price_input');
const cancelUpdate = document.getElementById('cancel-update');
const notificationsDisplay =  document.getElementById('notifications-display');
const changePassword =  document.getElementById('change-password');
const oldPassword =  document.getElementById('current-password');
const newPassword =  document.getElementById('new-password');
const confirmPassword =  document.getElementById('confirm-password');
const loadingScreen = document.getElementById('loading-screen');
const completeScreen = document.getElementById('completeScreenContainer');


cancelUpdate.style.display = 'none'
let userProducts;
let product_id;
var userDetailArray =[];
var update = false;
let productToPromote;
let todele = []

const setInputsBlack =()=>{
    genericName.value= '';
    tradeName.value= '';
    drugStrength.value= ''
    pcategory.value= ''
    stockStat.value= ''
    route.value=''
    dosageForm.value= ''
    expiryDate.value=''
    price.value= ''
    cancelUpdate.style.display='none'
    enterNewEntry.textContent = 'Enter Product'
}

const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton =  document.getElementById('confirm-delete-btn')
console.log(route.value)

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const userDetailLS = JSON.parse(localStorage.getItem("user-details")) || [];
const productToDelete = JSON.parse(localStorage.getItem("product-delete")) || [];
const productPromote = JSON.parse(localStorage.getItem("product-promote")) || [];
const personLocation = JSON.parse(localStorage.getItem("person-location")) || [];

//post location
const postLocation =async()=>{
    //loadingScreen.style.display = 'grid'
    const postit = await fetch(`${window.location.origin}/update-location`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: personData[0].user_id,
            locationOfUser: [personLocation[0].lat, personLocation[0].long]
            
        })
    })
    const response =  await postit.json()
    console.log(response);
    if(response.data = 'updated'){
        alert('updated')
    }else{
        alert('not succefull')
    }
    //loadingScreen.style.display = 'none'
}
//
//postLocation()
function showPosition(position) {
    const longt = position.coords.longitude;
    const lati = position.coords.latitude;
    const loc = {
        lat: lati,
        long:longt
    }
    personLocation.unshift(loc);
    localStorage.setItem('person-location', JSON.stringify(personLocation));
    postLocation()
    //window.open(nowurl)

    
}
locationBtn.addEventListener('click', ()=>{
    
    if(navigator.geolocation){
        completeScreen.style.display = 'grid';
        const pos = navigator.geolocation.getCurrentPosition(showPosition);
        setTimeout(() => {
            completeScreen.style.display = 'none';      
        }, 2000);
       
    }else{
        console.log('please allow location')
    }
})
//get user details
const getUserDetails= async()=>{
    loadingScreen.style.display = 'grid'
    const dofetch = await fetch(`${window.location.origin}/get_user/${personData[0].user_id}`);
    const data = await dofetch.json();
    console.log(data)
    if(data.location.length == 0){
    notificationsDisplay.innerHTML +=`
        <li>visit the profile icon to submit your google map coordinates (location)</li>
    `  
    }
    userDetailArray= data
    
    if (userDetailLS.length>=1){
        userDetailLS.pop()
        userDetailLS.unshift(data);
    }else{
        userDetailLS.unshift(data);
    }
    
    localStorage.setItem('user-details', JSON.stringify(userDetailLS));
    userHeading.innerHTML=`<p>${userDetailLS[0].name}</p>`
    loadingScreen.style.display = 'none'
    
}
getUserDetails();


//post new drug
const postNewEntry =async()=>{
    
    const post = await fetch(`${window.location.origin}/new-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value.trim().toLowerCase(),
            tradeName: tradeName.value.trim().toUpperCase(),
            drugStrength: drugStrength.value.trim(),
            drugCategory: pcategory.value.trim(),
            drugStockstatus: stockStat.value.trim(), 
            route:route.value.trim(),
            dosageForm: dosageForm.value.trim(),
            expiryDate:expiryDate.value,
            price: price.value.trim(),
            user_id: personData[0].user_id
        })
    })
    const response =  await post.json()
    console.log(response)
    setInputsBlack()
    
}
//post password change
const postPasswordChange =async()=>{
    loadingScreen.style.display  = 'grid'
    const post = await fetch(`${window.location.origin}/change-password`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newPassword: newPassword.value.trim(),
            oldPassword: oldPassword.value.trim(),
            user_id: personData[0].user_id
        })
    })
    const response =  await post.json()
    console.log(response)
    alert(`${response.data}`)
    loadingScreen.style.display = 'none'
}

//update post request
const postUpdateEntry =async(parameter)=>{
    
    const post = await fetch(`${window.location.origin}/update-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value.trim().toLowerCase(),
            tradeName: tradeName.value.trim().toUpperCase(),
            drugStrength: drugStrength.value.trim(),
            drugCategory: pcategory.value.trim(),
            drugStockstatus: stockStat.value.trim(), 
            route:route.value.trim(),
            dosageForm: dosageForm.value.trim(),
            expiryDate:expiryDate.value.trim(),
            price: price.value.trim(),
            user_id: personData[0].user_id,
            product_id: product_id


        })
    })
    const response =  await post.json()
    console.log(response)
    setInputsBlack();
    
}


//
const postPromoteProduct =async()=>{
    const post = await fetch(`${window.location.origin}/promote-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            promoPrice:newpricePromotion.value.trim(),
            productId: productPromote[0]
        })
    })
    const response =  await post.json()
    console.log(response)
}
//
const postDepromoteProduct =async()=>{
    const post = await fetch(`${window.location.origin}/depromote-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            
            productId: productPromote[0]
        })
    })
    const response =  await post.json()
    console.log(response)
}
//

const getUserProducts = async()=>{
    loadingScreen.style.display = 'grid'
    const user_id= personData[0].user_id
    const getproducts = await fetch(`${window.location.origin}/getproducts/${user_id}`)
    const data = await getproducts.json()
    userProducts = data;
    const productsDisplay = document.createElement('ol');
    productsDisplay.id = "products-thumbnail-i";
    productsDisplayD.textContent = '';
    console.log(data, 'o')
    const sortByKey = (arr, key) => {
        return [...arr].sort((a, b) => {
            const valA = a[key].toLowerCase(); 
            const valB = b[key].toLowerCase(); 
            if (valA < valB) {
            return -1;
            }
            if (valA > valB) {
            return 1;
            }
            return 0; 
        });
        };
    const sortedProducts = sortByKey(data, 'tradeName');
    sortedProducts.forEach((el)=>{
        
        productsDisplay.innerHTML +=`
            <li>
                <p>${el.tradeName} ${el.dosageForm} ${el.drugStrength} @<b>MWK ${el.price?el.price: 'N/A'} </b></p> 
                <button id='${el.tradeName}' class="delete-edit" onclick="deleteDialog('${el._id}')"><img src="delete.svg"/></button>
                <button id='' class="delete-edit" onclick="editFunction('${el._id}')"><img src="edit.svg"/></button>
                <button id='${el.price}' class="delete-edit" onclick="promoteFunction('${el._id}')"><img src="${!el.promoted? 'gift.svg': 'gift3.svg'}"/></button>
            </li>
        `
    })
    productsDisplayD.appendChild(productsDisplay);
    loadingScreen.style.display = 'none'
}
getUserProducts()

//delete product function
const deleteDialog=(par)=>{
    const idto = event.target.id
    if(productToDelete.length != 0){
        productToDelete.pop();
        productToDelete.unshift(par)
    }else{
        productToDelete.unshift(par)
    }
    
    localStorage.setItem('product-delete', JSON.stringify(productToDelete))
    var todp =userProducts.filter((el)=>{
        return el._id == par
    })
    dialogMsg.textContent = `delete ${todp[0].tradeName} ${todp[0].drugStrength} `
    confirmDeleteDialog.showModal()
}
//deleteDialog();
const deleteProduct = async(par)=>{
    const del = await fetch(`${window.location.origin}/deleteProduct/${par}`)
    const response = await del.json()
    getUserProducts()   
}

//promoteFunction
const promoteFunction =(par)=>{
    var idOf = event.target.id
    if(productPromote.length >= 1){
        productPromote.pop()
        productPromote.unshift(par)
    }else{
       productPromote.unshift(par) 
    }
    localStorage.setItem('productPromote', JSON.stringify(productPromote));
    var todele = userProducts.filter((el)=>{
        return el._id == par;
    })
    console.log(todele)
    if(!todele[0].promoted){
        document.getElementById('promote-h3').textContent='Promote ' + todele[0].tradeName;
        document.getElementById('promotep').textContent= "old price MWK : "+todele[0].price;
        newpricePromotion.style.display ='inline'
        document.getElementById('promote-product').textContent= "promote"

    }else{
        document.getElementById('promote-h3').textContent='dePromote ' + todele[0].tradeName;
        document.getElementById('promotep').textContent= ""
        document.getElementById('promote-product').textContent= "depromote"
        document.getElementById('promoper').textContent = ''
        newpricePromotion.style.display ='none'
       
    }
    
    productPromote.unshift(par)
    
    productToPromote = par;
    document.getElementById('promote-div').style.display='block';
}


// edit entry function
const editFunction=(par)=>{
    
    cancelUpdate.style.display = 'inline'
    window.location.href = "#back-office"
    userProducts=userProducts.filter((el)=>{
        return el._id.toLowerCase() == par
    })
    product_id = userProducts[0]._id
    genericName.value= userProducts[0].genericName;
    tradeName.value= userProducts[0].tradeName;
    drugStrength.value= userProducts[0].drugStrength
    pcategory.value= userProducts[0].drugCategory
    stockStat.value= userProducts[0].drugStockstatus
    route.value=userProducts[0].route
    dosageForm.value= userProducts[0].dosageForm ? userProducts[0].dosageForm : 'tablet';
    //date formats
    const datefromserver = userProducts[0].expiryDate;
    const formatdaate = String(datefromserver).substring(0, 10);
    expiryDate.value= formatdaate;
    //
    price.value= userProducts[0].price?userProducts[0].price: 100
    enterNewEntry.textContent = 'update'
    update = true;
    
    

}
if(!update){
    enterNewEntry.textContent = 'Enter Product';
    cancelUpdate.style.display = 'none'
}
//
enterNewEntry.addEventListener('click', ()=>{
    if(!update){
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
        postNewEntry()
        getUserProducts()
        setInputsBlack()
        }else{
            alert('not complete')
        }
        
    }else{
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
        postUpdateEntry();
        getUserProducts()
        setInputsBlack()
        }else{
            alert('not complete')
        }
        update = false;
        
    }
    getUserProducts()
    update = false
    //window.location.reload()
    
    
})

confirmDeleteButton.addEventListener("click", ()=>{
    deleteProduct(productToDelete[0]);
    
})
//cancel update
cancelUpdate.addEventListener('click', ()=>{
    update = false;
    setInputsBlack()
   

})

//keyup in promotion
newpricePromotion.addEventListener('keyup', ()=>{
     var todele = userProducts.filter((el)=>{
        return el._id == productPromote[0];
    })
    var percnt = parseFloat(newpricePromotion.value)/parseFloat(todele[0].price)*100
    document.getElementById('promoper').textContent= percnt == NaN? '0': parseInt(percnt) + '%'

})

accBtn.addEventListener('click', ()=>{
    document.getElementById('man-acc-div').style.display='block'
    document.getElementById('man-acc-div').style.top='15vh'
    document.getElementById('accounts').style.display='none'
})

document.getElementById('close-man-acc').addEventListener('click', ()=>{
    document.getElementById('man-acc-div').style.top='-15vh';
    document.getElementById('man-acc-div').style.display='none';
    document.getElementById('accounts').style.display='block'
})

document.getElementById('cancel-promotion').addEventListener('click', ()=>{
   document.getElementById('promote-div').style.display='none';
})

confirmDeleteDialog.addEventListener('click', ()=>{
    confirmDeleteDialog.close()
    getUserProducts()
})
//promote button in dialog
document.getElementById('promote-product').addEventListener('click', ()=>{
    producttobepromotedornot = userProducts.filter((el)=>{
        return el._id == productPromote[0]
    })
    console.log(producttobepromotedornot, "eee")
    if(producttobepromotedornot[0].promoted == true){
        postDepromoteProduct()  
    }
    else{
        postPromoteProduct()
        //alert('pro')
    }
    document.getElementById('promote-div').style.display='none';
    getUserProducts()
})

//change password
changePassword.addEventListener('click', ()=>{
    if(newPassword.value != confirmPassword.value){
        alert('your passwords dont much')
    }else{
        postPasswordChange()
    }
})


notificationsDisplay.innerHTML +=`
        <li>Visit the promotion page regulary to check products that other pharmacies have promoted</li>
    ` 
