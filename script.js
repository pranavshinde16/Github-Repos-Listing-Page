const API_URL = "https://api.github.com/users/";

let currentPage = 1;
let perPage = 12;
let filteredRepositories = [];

function getRepositories() {
    const username = document.getElementById("username").value;
    const reposUrl = `${API_URL}${username}/repos?page=${currentPage}&per_page=${perPage}`;
    const userUrl = `${API_URL}${username}`;
    // Show loader
    document.getElementById("loader").classList.remove("d-none");

    // Fetch repositories
    fetch(reposUrl)
        .then(response => response.json())
        .then(data => {
            const searchKeyword = document.getElementById("search").value.toLowerCase();
            filteredRepositories = data.filter(repo => repo.name.toLowerCase().includes(searchKeyword));

            displayRepositories(filteredRepositories);
            displayRepositories(data);

            return fetch(userUrl);
        })
        .then(response => response.json())
        .then(user => {
            document.getElementById("loader").classList.add("d-none");

            displayProfile(user);
            
            document.getElementById("searchbar").classList.remove("d-none")

            displayPagination(user.public_repos);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            // Handle error (e.g., display an error message)
            document.getElementById("loader").classList.add("d-none");
        });
}

function searchRepos() {
    let searchText = document.getElementById('search').value;
    let searchFilter = filteredRepositories.filter(el => el.name.includes(searchText));
    displayRepositories(searchFilter);
    displayPagination(searchFilter.length);
}

function displayProfile(user) {
    const profileContainer = document.getElementById("profile-bio");
    profileContainer.innerHTML = `
    <div class="profile-section">
        <div class="profile-container d-flex justify-content-center">
            <img src="${user.avatar_url}" alt="User Image" class="profile-image img-fluid">
            <div class="profile-details">
                <div class="profile-name">${user.name}</div>
                <div class="profile-bio d-flex justify-content-center">${user.bio || "A github user"}</div>
                <div class="profile-location d-flex justify-content-center"><img class="locationIcon" src="./assets/location.svg"> Location: ${user.location || "India"}</div>
                <div class="profile-twitter d-flex justify-content-center"><a href="${user.twitter_username ? `https://twitter.com/${user.twitter_username}` : 'https://twitter.com/home'}" target="_blank">${user.twitter_username ? `Twitter: @${user.twitter_username}` : 'Twitter: Not specified'}</a></div>
                <div class="profile-twitter d-flex justify-content-center"><a href="${user.html_url ? `${user.html_url}` : 'https://github.com/'}" target="_blank">${user.html_url? `&#128279;: ${user.html_url}` : 'Github: Not specified'}</a></div>
            </div>
        </div>
    </div>
    `;
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById("repositories");
    repositoriesContainer.innerHTML = "";

    repositories.forEach(repo => {
        const repoButtons = repo.topics.map(topic => `<span class="badge badge-info p-2 mt-1">${topic}</span>`)?.join(' ');
        const repoElement = document.createElement("div");
        repoElement.className = "mb-3";
        repoElement.innerHTML = `
        <div class="container">
        <section class="mx-auto my-5">
            
          <div class="card">
            <div class="card-body">
              <h5 class=" repo-name card-title"><a>${repo.name}</a></h5>
              <div class="d-flex justify-content-between">
              <p class=" d-flex flex-row align-items-center mb-2"><img class="forkIcon" src="./assets/fork.svg"><b>forks</b> - ${repo.forks}</p>
              <p><a class="link-offset-2 link-underline link-underline-opacity-100" href="${repo.html_url}" target="__blank">Visit Repo&#8599;</a></p>
              </div>
              <p class="card-text">
                ${repo.description || "No description provided for the project"}
              </p>
              <hr class="my-4" />
              
              <ul class="list-unstyled list-inline d-flex justify-content-between mb-0">
              
              <li class="list-inline-item me-0 text-wrap">
                 ${repoButtons ? repoButtons : "No Topics"}
              </li>
              
              </ul>
            </div>
          </div>
          
        </section>
      </div>`
        repositoriesContainer.appendChild(repoElement);
    });
}

function displayPagination(totalRepositories) {
    const totalPages = Math.ceil(totalRepositories / perPage);
    const paginationContainer = document.querySelector("#pagination ul");
    paginationContainer.innerHTML = "";

    // Previous
    const prevItem = document.createElement("li");
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.innerHTML = "&laquo;";
    prevLink.href = "#repositories"
    prevLink.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            getRepositories();
        }
    });
    prevItem.appendChild(prevLink);
    paginationContainer.appendChild(prevItem);


    // Pagination
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item cursor-pointer ${currentPage === i ? 'active' : ''}`;

        const pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.href = "#repositories"
        pageLink.textContent = i;
        pageLink.addEventListener("click", () => {
            currentPage = i;
            getRepositories();
        });

        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }

    // Next 
    const nextItem = document.createElement("li");
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#repositories"
    nextLink.innerHTML = "&raquo;";
    nextLink.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            scrollToTop();
            getRepositories();
        }
    });
    nextItem.appendChild(nextLink);
    paginationContainer.appendChild(nextItem);
}
// scroll to top 
function scrollToTop() {
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}
