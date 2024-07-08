const validUsers = {
    "lider": { password: "0413", name: "Verissímo" },
    "agatha": { password: "kianbroxa", name: "Agatha Volkomenn" },
    "ivy": { password: "eveling18", name: "Ivy Taylor" },
    "joaquim": { password: "caxassa", name: "Joaquim" },
    "ash": { password: "mexico", name: "Ashita" }
};

function enviarAlerta() {
    alert('Todos os agentes foram alertados!');
}

let posts = JSON.parse(localStorage.getItem('posts')) || [];

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (validUsers[username] && validUsers[username].password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify({
            username: username,
            name: validUsers[username].name
        }));
        window.location.href = 'inicio.html';
        return false;
    } else {
        errorMessage.textContent = 'Usuário ou senha inválidos';
        return false;
    }
}

function checkLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function showLeaderPage() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.username === 'lider') {
        document.getElementById('leader-link').style.display = 'inline';
    }
}

function submitPost() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const postText = document.getElementById('postText').value;
    const postImage = document.getElementById('postImage').files[0];

    const reader = new FileReader();
    reader.onloadend = function () {
        const post = {
            author: loggedInUser.name,
            text: postText,
            image: reader.result,
            likes: 0,
            likedBy: [],
            comments: []
        };
        posts.push(post);
        savePosts();
        loadPosts();
    };

    if (postImage) {
        reader.readAsDataURL(postImage);
    } else {
        const post = {
            author: loggedInUser.name,
            text: postText,
            image: null,
            likes: 0,
            likedBy: [],
            comments: []
        };
        posts.push(post);
        savePosts();
        loadPosts();
    }

    document.getElementById('postForm').reset();
    return false;
}

function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');

        const postAuthor = document.createElement('p');
        postAuthor.classList.add('post-author');
        postAuthor.textContent = post.author;

        const postText = document.createElement('p');
        postText.textContent = post.text;

        const postImage = document.createElement('img');
        if (post.image) {
            postImage.src = post.image;
        }

        postContent.appendChild(postAuthor);
        postContent.appendChild(postText);
        if (post.image) postContent.appendChild(postImage);

        // Contêiner do botão de curtida e número de curtidas
        const likeContainer = document.createElement('div');
        likeContainer.classList.add('like-container');

        // Botão de curtida
        const likeButton = document.createElement('button');
        likeButton.textContent = '';
        likeButton.classList.add('like-button');
        likeButton.onclick = function () {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (post.likedBy.includes(loggedInUser.username)) {
                alert('Você já curtiu esta postagem.');
                return;
            }
            post.likes++;
            post.likedBy.push(loggedInUser.username);
            savePosts();
            loadPosts();
        };

        // Número de curtidas
        const likeCount = document.createElement('span');
        likeCount.classList.add('like-count');
        likeCount.textContent = `${post.likes}`;

        // Adiciona o botão e o número de curtidas ao contêiner
        likeContainer.appendChild(likeButton);
        likeContainer.appendChild(likeCount);

        postDiv.appendChild(postContent);
        postDiv.appendChild(likeContainer);

        const commentForm = document.createElement('form');
        commentForm.onsubmit = function (event) {
            event.preventDefault();
            const commentText = commentInput.value.trim();
            if (commentText) {
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                const comment = { author: loggedInUser.name, text: commentText };
                post.comments.push(comment);
                savePosts();
                loadPosts();
                commentInput.value = '';
            } else {
                alert('Por favor, insira um comentário válido.');
            }
        };

        const commentInput = document.createElement('textarea');
        commentInput.placeholder = 'Adicionar comentário';
        commentInput.classList.add('comment-input');

        const commentButton = document.createElement('button');
        commentButton.type = 'submit';
        commentButton.textContent = 'Comentar';
        commentButton.classList.add('comment-button');

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list');
        post.comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.textContent = `${comment.author}: ${comment.text}`;
            commentsList.appendChild(commentItem);
        });

        postDiv.appendChild(commentForm);
        postDiv.appendChild(commentsList);

        if (JSON.parse(localStorage.getItem('loggedInUser')).username === 'lider') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir Post';
            deleteButton.classList.add('delete');
            deleteButton.onclick = function () {
                deletePost(index);
            };
            postDiv.appendChild(deleteButton);
        }

        postsContainer.appendChild(postDiv);
    });
}

function deletePost(index) {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
        posts.splice(index, 1);
        savePosts();
        loadPosts();
    }
}

function toggleDetails(id) {
    var element = document.getElementById(id);
    
    // Oculta todos os elementos de detalhes
    var details = document.getElementsByClassName('details');
    for (var i = 0; i < details.length; i++) {
      details[i].style.display = 'none';
    }
    
    // Mostra apenas o elemento clicado
    element.style.display = 'block';
}


function toggleDetalhes(id) {
    var element = document.getElementById(id);

    // Oculta todos os elementos de detalhes
    var classes = ['entidade-sangue', 'entidade-morte', 'entidade-conhecimento', 'entidade-energia', 'entidade-fechar'];
    for (var j = 0; j < classes.length; j++) {
        var detalhes = document.getElementsByClassName(classes[j]);
        for (var i = 0; i < detalhes.length; i++) {
            detalhes[i].style.display = 'none';
        }
    }

    // Mostra apenas o elemento clicado
    element.style.display = 'block';
}


