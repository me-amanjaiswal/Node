let createField = document.getElementById("createField")
function itemTemplate(x)
{
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${x.text}</span>
    <div>
      <button data-id="${x._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${x._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}
// client - side rendering

document.getElementById("itemList").insertAdjacentHTML("beforeend", `${items.map(function(x){
    return itemTemplate(x)
}).join("")}`)

document.getElementById("createForm").addEventListener("submit", function(e){
    e.preventDefault()
    axios.post("/create-item",{text : createField.value}).then(function(response){
        document.getElementById("itemList").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value=""
        createField.focus()
    }).catch(function(){
        console.log("try again later")
    })

})


document.addEventListener("click" , function(e){
    if(e.target.classList.contains("edit-me"))
    {
        let userInput = prompt("enter your text" , e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if(userInput)
        {
            axios.post("/update-item",{text : userInput , id : e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function(){
                console.log("try again later")
            })
        }
        

    }
    if(e.target.classList.contains("delete-me"))
    {
        if(confirm("are you sure?"))
        {
            axios.post("/delete-item", {id: e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.remove()
            }).catch(function(){
                console.log("try agaain later")
            })
        }
        
    }
       
})
