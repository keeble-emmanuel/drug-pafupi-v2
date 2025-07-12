const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b');
const citySelected = document.getElementById('cities');
let resultsFiltered;

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/all-users`)
    const results = await fetched.json();
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    var resultsFiltered = results.filter((el)=>{
        var city = !el.city ?'other': !citiesz.includes(el.city.trim().toLowerCase())?'other': el.city ;
        return city.toLowerCase().trim() == citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    console.log(resultsFiltered, citySelected.value)
    resultsFiltered.forEach((el)=>{
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="istockphoto-1419246808-612x612.jpg"/>
                <div class="search-thumbnail-details">
                    <p>${el.name}
                    <a 
                    href='https://www.google.com/maps/search/?api=1&query=${el.location[0]},${el.location[1]}'
                    ><img src="location2.svg"/></a></p>
                    
                </div>
                <div class='text-center'>${el.city}</div>
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
