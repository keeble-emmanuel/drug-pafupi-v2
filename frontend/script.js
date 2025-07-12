const searchBtn = document.getElementById('search-btn');
const displaySearchResults = document.getElementById('search-results')
const searchKey = document.getElementById('search-input');

const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];
let resut

const fetchResults = async()=>{
    try{
        const start = await fetch(`${window.location.origin}`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchWord: searchKey.value
            })
        }
    
       )
       const info = await start.json()
       //console.log(data)
       console.log(info[0])
       resut = info;
       console.log(info)
       info2 = info.sort((a, b)=>
        a.tradeName - b.tradeName
       )
       
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
        const sortedProducts = sortByKey(info, 'tradeName');
       
       
       displaySearchResults.textContent = ''
       sortedProducts.forEach(el => {
        
        displaySearchResults.innerHTML +=
        `<li>
            <div class="search-results-div" id='${el.tradeName}+${el.genericName}+${el.drugStrength}'>
                ${el.tradeName} <b>( ${el.genericName} )</b> 
            </div>
             </li>`

             Array.from(document.getElementsByClassName('search-results-div')).forEach((par)=>{
                par.addEventListener('click', ()=>{
                    const elementId = par.id
                    const nameArray =  elementId.split("+");
                    console.log(nameArray[0], nameArray[1])
                    window.location.href = 'search-results.html'

                    filterObj={
                        genericName: nameArray[1],
                        tradeName: nameArray[0],
                        drugStrength: nameArray[2]
                    }
                    if(searchFiters){
                        searchFiters.pop()
                        searchFiters.unshift(filterObj)
                    }else{
                        searchFiters.unshift(filterObj)
                    }
                    
                    localStorage.setItem('searchfilter', JSON.stringify(searchFiters))
                })
            })
        
       });
    }catch(err){
        console.error(err)
    }
    
}

searchKey.addEventListener('keyup', ()=>{
    displaySearchResults.style.backdropFilter ='blur(50px) brightness(30%)';
    displaySearchResults.style.overflow = 'scroll'
    fetchResults()
    
    
})
searchBtn.addEventListener('click', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
   
    
    
})

