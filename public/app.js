// console.log("hello world!");

// grabbing search area
const searchArea = document.querySelector("#navbarScroll ul");
// console.log(searchArea)

const searchInput = searchArea.querySelector("input");
// console.log(searchInput);

const typeFilter = searchArea.querySelector("select");
// console.log(typeFilter);

const searchButton = searchArea.querySelector("a");
// console.log(searchButton);

// searchButton.addEventListener("click",()=>{
//     // console.log(searchInput.value, typeFilter.value);
//     // console.log(searchButton.href)
// })
// ^works

searchButton.addEventListener("mouseover",()=>{
    if (typeFilter.value=="All categories") {
        searchButton.href = `/products?s=${searchInput.value}`
    } else {
        searchButton.href=`/products?type=${typeFilter.value}&s=${searchInput.value}`;
    }
})

searchInput.addEventListener("keydown",(e)=>{
    // console.log(searchInput.value,typeFilter)
    if (typeFilter.value=="All categories") {
        searchButton.href = `/products?s=${searchInput.value}`
    } else {
        searchButton.href=`/products?type=${typeFilter.value}&s=${searchInput.value}`;
    }

    if (e.key === "Enter"){
        if (typeFilter.value=="All categories") {
            location.replace(`/products?s=${searchInput.value}`)
        } else {
            location.replace(`/products?type=${typeFilter.value}&s=${searchInput.value}`);
        }
    }
})

