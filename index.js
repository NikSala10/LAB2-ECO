// Post request to create a new post

const createBtn = document.getElementById("create").addEventListener("click", fetchCreateNewPost);
const titleInput = document.getElementById("title");
const urlImagInput = document.getElementById("url-image");
const descriptionInput = document.getElementById("description");

const allPostContainer = document.querySelector(".list-post");
allPostContainer.style.display = "none";

const fetchUrl = 'http://localhost:3004/posts'
async function fetchCreateNewPost() {
  try {

    if (!urlImagInput.value || !titleInput.value || !descriptionInput.value) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const postRequest = { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' ,
      },
      body: JSON.stringify({
        imageUrl: urlImagInput.value,
        title: titleInput.value,
        body: descriptionInput.value,
      }),
    }
    const response = await fetch(fetchUrl, postRequest);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    alert('Post creado con éxito');

  } catch (error) {
    console.error('Error al crear el post:', error.message);
    alert(error.message)
  }
}

// Get request to get all posts
const getPostsBtn = document.getElementById("list-post").addEventListener("click", fetchGetAllPosts);

async function fetchGetAllPosts() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:3004/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  const data = await response.json();
  renderAllPostsData(data);
  
  const resultsPFetch = document.getElementById("results");
  resultsPFetch.innerHTML= ""

  const allPostContainer = document.querySelector(".list-post");
  allPostContainer.style.display = "block";

  const container = document.querySelector(".create-post");
  container.style.display = "none";
    
  } catch (error) {
    renderErrorState();
  }
}


const renderAllPostsData = (data) => {
  const containerPosts = document.getElementById("render-posts");
  containerPosts.innerHTML = "";

  data.forEach((post) => {
      const cardPost = document.createElement("div");
      cardPost.className = "card-post";
      cardPost.innerHTML = `
      <div class="image">
        <img src="${post?.imageUrl}" alt="${post?.title}">
      </div>
      <div class="content">
        <h3>${post?.title}</h3>
        <p>${post?.body}</p>
      </div>
      <button class="delete" id="${post.id}">Delete</button>
      `;
      containerPosts.appendChild(cardPost);
  });
}

const goToCreatePostBtn = document.getElementById("go-create-post").addEventListener("click", () => {
  const container = document.querySelector(".create-post");
  container.style.display = "block";

  const allPostContainer = document.querySelector(".list-post");
  allPostContainer.style.display = "none";
});



// Delete request to delete a post

document.getElementById("render-posts").addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete")) {
    const postId = event.target.id;
    if (postId) {
      await fetchDeletePost(postId);
      alert('Post eliminado con éxito');
      fetchGetAllPosts();
    } else {
      console.error("ID del post no encontrado");
    }
  }
});

async function fetchDeletePost(postId) {
  const fetchDeleteUrl = `http://localhost:3004/posts/${postId}`
  try {
    const deletePostRequest = { 
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json' ,
      },
    }
    const response = await fetch(fetchDeleteUrl, deletePostRequest);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

  } catch (error) {
    console.error('Error al eliminar el post:', error.message);
    alert(error.message)
  }
}


// LOADING STATE AND ERROR STATE
function renderLoadingState() {
  const resultsP = document.getElementById("results");
  resultsP.innerHTML= ""
  resultsP.innerHTML = "Loading...";
}
function renderErrorState() {
  const resultsP = document.getElementById("results");
  resultsP.innerHTML= ""
  resultsP.innerHTML = "Failed to load data";
}
