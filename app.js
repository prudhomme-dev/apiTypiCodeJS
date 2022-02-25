let commentpost = {
    template: `
    <section>
        <h3>Commentaire de l'article {{titlepost}}</h3>
        <div class='flex'>
            <div v-for="comment of userComment">
                <h5>{{comment.name}} (<a :href="comment.email|mailto">{{comment.email}}</a>)</h5>
                <p>{{comment.body}}</p>
            </div>
        </div>
    </section>
    
    `,
    data: function () {
        return {
            userComment: [],
        }
    },
    filters: {
        mailto: function (value) {
            return "mailto:" + value
        }
    },
    props: ['titlepost', 'idpost'],
    created: function () {
        this.commentsLists();
    },
    updated: function () {
        this.commentsLists();
    },
    methods: {
        commentsLists: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/comments?postId=' + this.idpost);
                let comments = await response.json();
                this.userComment = comments;
            } catch (e) {
                console.error('ERREUR', e);
            }
        }
    }

}

let post = {
    template: `
    <section>
        <h3>Articles de {{username}}</h3>
        <ul>
            <li v-for="post of userPost" >
                <button v-on:click="displayComments(post.id, post.title)" class="deleteTask">{{post.title}}</button>
            </li>
        </ul>
        <commentpost v-if="displayComment" :idpost="choiceIdPost" :titlepost="choiceTitlePost"></commentpost>
    </section>
    `,
    data: function () {
        return {
            userPost: [],
            choiceIdPost: 0,
            choiceTitlePost: '',
            displayComment: false
        }
    },
    props: ['iduser', 'username'],
    created: function () {
        this.postsList();
    },
    updated: function () {
        this.postsList();
    },
    components: {
        commentpost

    },
    methods: {
        postsList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + this.iduser);
                let posts = await response.json();
                this.userPost = posts;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        displayComments: function (idPost, titlePost) {
            this.choiceIdPost = idPost;
            this.choiceTitlePost = titlePost;
            this.displayComment = true;
        }

    }

}

let photo = {
    template: `
    <section>
        <h3>Photos de l'album {{titlealbum}}</h3>
        <div class='flex'>
            <div v-for="photo of userPhoto">
                <h5>{{photo.title}}</h5>
                <a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl" :alt="photo.title"></a>
            </div>
        </div>
    </section>
    `,
    data: function () {
        return {
            userPhoto: [],
        }
    },
    props: ['titlealbum', 'idalbum'],
    created: function () {
        this.photosLists();
    },
    updated: function () {
        this.photosLists();
    },
    methods: {
        photosLists: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=' + this.idalbum);
                let photos = await response.json();
                this.userPhoto = photos;
            } catch (e) {
                console.error('ERREUR', e);
            }
        }
    }
}

let useralbum = {
    template: `
    <section>
        <h3>Albums photos de {{username}}</h3>
        <ul>
            <li v-for="album of userAlbum" >
            {{album.title}}
            - <button v-on:click="displayPhotos(album.id, album.title)" class="deleteTask">Afficher Photos</button>
            </li>
        </ul>
        <photo v-if="displayPhoto" :idalbum="choiceAlbum" :titlealbum="choicetitleAlbum"></photo>
    </section>
    `,
    data: function () {
        return {
            userAlbum: [],
            choiceAlbum: 0,
            choicetitleAlbum: '',
            displayPhoto: false
        }
    },
    props: ['iduser', 'username'],
    created: function () {
        this.albumsList();
    },
    updated: function () {
        this.albumsList();
    },
    components: {
        photo
    },
    methods: {
        albumsList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/albums?userId=' + this.iduser);
                let albums = await response.json();
                this.userAlbum = albums;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        displayPhotos: function (idAlbum, titleAlbum) {
            this.displayPhoto = true;
            this.choiceAlbum = idAlbum;
            this.choicetitleAlbum = titleAlbum;
        }
    }
}

let usertask = {
    template: `
    <section>
        <h3>Tâche à réaliser pour l'utilisateur {{username}}</h3>
        <button v-if="!hiddenCompleted" v-on:click="hiddenTaskCompleted()">Cacher les tâches déjà réalisées</button>
        <button v-else v-on:click="hiddenTaskCompleted()">Afficher les tâches déjà réalisées</button>
        <ul>
            <li v-for="(task, index) of userTask" >
            <span v-if="task.completed" class="task completedTask">{{task.title}}</span>
            <span v-else class="task uncompletedTask">{{task.title}}</span>
            - <button v-on:click="deleteTask($event)" class="deleteTask" :data-index="index">Supprimer</button>
            </li>

        </ul>
    </section>
    `,
    data: function () {
        return {
            userTask: [],
            hiddenCompleted: false
        }
    },
    props: ['iduser', 'username'],
    created: function () {
        this.tasksList();
    },
    updated: function () {
        this.tasksList();
    },
    methods: {
        tasksList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + this.iduser);
                let tasks = await response.json();
                this.userTask = tasks;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        hiddenTaskCompleted: function () {
            let taskCompleted = document.querySelectorAll(".completedTask")
            for (task of taskCompleted) {
                task.parentElement.classList.toggle("hiddenTask")
            }
            this.hiddenCompleted = !this.hiddenCompleted
        },
        deleteTask: function (e) {
            this.userTask.splice(e.target.dataset.index, 1)
        }
    }
}

let userdata = {
    template: `<section>
        <h3>{{datauser.name}} ({{datauser.username}})</h3>
        <p>id : {{datauser.id}}</p>
        <ul>
            <li>email : {{datauser.email}}</li>
            <li>tel : {{datauser.phone}}</li>
            <li>web : <a :href="datauser.website|webSite" target="_blank">{{datauser.website}}</a></li>
        </ul>
        <p>Adresse : 
        <span v-for="addressData in datauser.address">{{addressData}} - </span>
        </p>
        
        <p>Entreprise : {{datauser.company.name}}</p>
        <p>
            <button v-on:click="activeDisplayTask()">Voir les tâches</button>
            <button v-on:click="activeDisplayAlbum()">Voir les albums</button>
            <button v-on:click="activeDisplayPost()">Voir les articles</button>
        </p>

        <usertask v-if="displayTask" :iduser="idUser" :username="datauser.name"></usertask>
        <useralbum v-if="displayAlbum" :iduser="idUser" :username="datauser.name"></useralbum>
        <post v-if="displayPost" :iduser="idUser" :username="datauser.name"></post>

    </section>

    `,
    created: function () {
        this.idUser = this.datauser.id;
    },
    updated: function () {
        let idUserOld = this.idUser
        this.idUser = this.datauser.id;
        if (idUserOld != this.idUser) {
            this.displayAlbum = false;
            this.displayTask = false;
            this.displayPost = false;
        }

    },
    components: {
        usertask,
        useralbum,
        post
    },
    data: function () {
        return {
            idUser: 0,
            displayTask: false,
            displayAlbum: false,
            displayPost: false
        }
    },
    props: ['datauser'],
    filters: {
        webSite: function (value) {
            return "https://" + value
        }
    },
    methods: {
        activeDisplayTask: function () {
            this.displayTask = !this.displayTask;
            this.displayAlbum = false;
            this.displayPost = false;
        },
        activeDisplayAlbum: function () {
            this.displayAlbum = !this.displayAlbum;
            this.displayPost = false;
            this.displayTask = false;
        },
        activeDisplayPost: function () {
            this.displayAlbum = false;
            this.displayPost = !this.displayPost;
            this.displayTask = false;
        }
    }
}

let app = new Vue({
    el: '#app',
    data: {
        users: [],
        idUser: 0,
        dataUser: []
    },
    computed: {
        nbUser: function () {
            return this.users.length;
        }
    },
    created: function () {
        this.loadUsers();
    },
    components: {
        userdata
    },
    methods: {
        // loadUsers: function () {
        //     fetch('https://jsonplaceholder.typicode.com/users')
        //         .then(response => response.json())
        //         .then(users => {
        //             console.log(users)
        //             this.users = users
        //         })
        // }

        loadUsers: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/users');
                let users = await response.json();
                this.users = users;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        choiceUser: function (e) {
            if (e.target.value > 0) this.idUser = parseInt(e.target.value)
            this.users.forEach(user => {
                if (user.id == e.target.value) {
                    this.dataUser = user;
                }
            });
        }



    }


})