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
//     console.log(searchInput.value, typeFilter.value);
// })
// ^works

searchInput.addEventListener("keydown",(e)=>{
    // console.log(searchInput.value,typeFilter)
    if (typeFilter=="All categories") {
        searchButton.href = `/products?s=${searchInput.value}`
    }
})

