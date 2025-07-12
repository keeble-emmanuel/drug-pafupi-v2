const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b');
const citySelected = document.getElementById('cities');
let resultsFiltered;

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/all-products`)
    const results = await fetched.json();
    console.log(results);
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    var resultsFiltered = results.filter((el)=>{
        var city = !el.user_id.city ?'other': !citiesz.includes(el.user_id.city.toLowerCase().trim())? 'other':el.user_id.city;
        return city.toLowerCase().trim() == citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    console.log(resultsFiltered)
    resultsFiltered.forEach((el)=>{
        var img = el.dosageForm == 'tablet' || el.dosageForm == 'capsules' ?'download.png':
            el.dosageForm == 'solution' || el.dosageForm == 'powder-for-reconstitution'?'istockphoto-1304499871-612x612.jpg':
            el.dosageForm == 'syrup'?'syrup.avif':
            el.dosageForm =='ointment'? 'gettyimages-182665593-612x612.jpg':'eye.jpg'
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="${img}"/>
                <div class="search-thumbnail-details">
                    <div class="product-details">
                        <p class="text-center">${el.tradeName} ${el.drugStrength}</p>
                    </div>
                    
                    <div class="product-details">
                        <p>MWK ${el.price?el.price:'N/A'} </p>
                    </div>
                    
                    <div class="product-details">
                    <p>${el.user_id.name}<a 
                    href='https://www.google.com/maps/search/?api=1&query=${el.user_id.location[0]},${el.user_id.location[1]}'
                    ><img src="location2.svg" class="icon"/></a>
                    </p>
                    </div>
                </div>
                
            </div>
            
    `
    })
    productsThumbnailDivB.appendChild(productsThumbnailDiv)
    
}
fetchData();

citySelected.addEventListener('change', ()=>{
    //alert('eee')
    fetchData()
})
