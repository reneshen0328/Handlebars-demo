const deleteButton = document.getElementById("delete-button");
const showID = window.location.pathname.split("/shows/")[1];
// console.log(showID)
deleteButton.addEventListener("click",async()=>{
    const res = await fetch(`/shows/${showID}`,{
        method: "delete"
    })
    // console.log(res)
    window.location.assign("/shows")
})