// console.log("hello world!");

// grabbing search area
const searchArea = document.querySelector("#navbarScroll ul");
// console.log(searchArea)

const searchInput = searchArea.querySelector("input");
// console.log(searchInput);

const typeFilter = searchArea.querySelector("select");
// console.log(typeFilter);

const searchButton = searchArea.querySelector("a");
console.log(searchButton);

// searchButton.addEventListener("click",()=>{
//     console.log(typeFilter.value);
// })
// ^works

searchInput.addEventListener("keydown",(e)=>{
    searchButton.href
})

