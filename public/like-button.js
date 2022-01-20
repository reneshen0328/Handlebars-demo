const likeButton = document.getElementById("like-button");
const likeCounter = document.getElementById("show-likes");

likeButton.addEventListener("click", async () => {
  let currentLikes = parseInt(likeCounter.innerHTML);
  currentLikes++;
  likeCounter.innerHTML = currentLikes;
  let res = await fetch(`/shows/${showID}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes }),
  });
});
