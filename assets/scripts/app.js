const listOfPostsEle = document.querySelector(".posts");
const btnFetchPosts = listOfPostsEle.previousElementSibling;
const tempPost = document.getElementById("single-post");
const newPostEle = document.getElementById("new-post");
const form = newPostEle.querySelector("form");

const userData = localStorage.getItem("userData");

let data = [];
data = userData ? data.push(JSON.parse(userData)) : [];
// data = userData? data.push(JSON.parse(userData)) : [];

console.log("data", data);

// convert string to arr by ; in cookie document.cookie.split(';');
const dataCookie = document.cookie.split(";");
console.log(dataCookie[0].title);

const htp = async (method, url) => {
  return await method(url);
};

// indexDb
const indexDb = () => {
  const dbReg = indexedDB.open("storageDummy", 1);

  dbReg.addEventListener("success", (e) => {
    const db = e.target.result;
    db.createObjrctStore("products", { keyPath: "id" });
  });

  dbReg.addEventListener("error", (e) => {
    console.log(e.target.result);
  });
};

// create post
const createPost_2 = () => {
  const response = htp(axios.get, "https://jsonplaceholder.typicode.com/posts");

  response.then((result) => console.log(result));
};

// createPost_2();
// open session connect with jsonplaceholder!!! ajax
const httpRequest = (method, url, data = "") => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = "json";
    xhr.open(method, url);

    xhr.addEventListener("load", () => {
      resolve(xhr.response);
    });

    xhr.send(JSON.stringify(data));
  });

  return promise;
};

const createPost = async (e) => {
  e.preventDefault();
  const userId = Math.random();
  let titleElement = newPostEle.querySelector("#title");
  let bodyElement = newPostEle.querySelector("#content");

  let title = titleElement.value;
  let body = bodyElement.value;

  console.log(title, body);

  // console.log(title, body);

  const store = {
    title,
    body,
    id: Math.random().toString(),
  };

  localStorage.setItem("userData", JSON.stringify(store));

  document.cookie = `id=${JSON.stringify(store)}`;

  const resDate = await httpRequest(
    "POST",
    "https://jsonplaceholder.typicode.com/posts",
    store
  );
  titleElement.value = "";
  bodyElement.value = "";
  // const res = JSON.parse(resDate);
  console.log(resDate);
  alert("Post Created");
};

const fetchPosts = async () => {
  let listOfPosts = await httpRequest(
    "GET",
    "https://jsonplaceholder.typicode.com/posts"
  );

  const len = listOfPosts.length;

  for (post of listOfPosts) {
    const postEle = document.importNode(tempPost.content, true);

    postEle.querySelector("li").id = post.id;

    // const btnDel = postEle.querySelector('button')
    // btnDel.addEventListener('click',deletePost.bind(null, post.id));

    postEle.querySelector("h2").textContent = post.title.toUpperCase();
    postEle.querySelector("p").textContent = post.body;

    listOfPostsEle.append(postEle);
  }
};

listOfPostsEle.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const postId = e.target.closest("li").id;
    await httpRequest(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    alert("Post Deleted");
    fetchPosts();
  }
});

const deletePost = async (id) => {
  await httpRequest(
    "DELETE",
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
};

btnFetchPosts.addEventListener("click", fetchPosts);
form.addEventListener("submit", createPost);
