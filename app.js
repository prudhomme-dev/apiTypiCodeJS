let commentpost = {
    template: `
    <section id="comments">
        <h3>Commentaire de l'article {{titlepost}}</h3>
        <div class='flex'>
            <div class="comment" v-for="comment of usercomment">
                <h5>{{comment.name}} (<a :href="comment.email|mailto">{{comment.email}}</a>)</h5>
                <p>{{comment.body}}</p>
            </div>
        </div>
    </section>
    `,
    filters: {
        mailto: function (value) {
            return "mailto:" + value
        }
    },
    props: ['titlepost', 'idpost', 'usercomment'],

}

let post = {
    template: `
    <section>
        <h3>Articles de {{username}}</h3>
        <ul>
            <li v-for="post of userpost" >
                <button v-on:click="displayComments(post.id, post.title)" class="link">{{post.title}}</button>
            </li>
        </ul>
        <commentpost v-if="this.$root.displayComment" :idpost="choiceIdPost" :titlepost="choiceTitlePost" :usercomment="userComment"></commentpost>
    </section>
    `,
    data: function () {
        return {
            userComment: [],
            choiceIdPost: 0,
            choiceTitlePost: '',
        }
    },
    props: ['iduser', 'username', 'userpost'],
    components: {
        commentpost
    },
    methods: {
        commentsLists: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/comments?postId=' + this.choiceIdPost);
                let comments = await response.json();
                this.userComment = comments;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        displayComments: function (idPost, titlePost) {
            this.choiceIdPost = idPost;
            this.choiceTitlePost = titlePost;
            this.commentsLists();
            this.$root.displayComment = true;
            this.displayComment = true;
        }
    }
}

let photo = {
    template: `
    <section id="photos">
        <h3>Photos de l'album {{titlealbum}}</h3>
        <div class='flex'>
            <div class="photo" v-for="photo of userphoto">
                <h5>{{photo.title}}</h5>
                <a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl" :alt="photo.title"></a>
            </div>
        </div>
    </section>
    `,
    props: ['titlealbum', 'idalbum', 'userphoto']
}

let useralbum = {
    template: `
    <section>
        <h3>Albums photos de {{username}}</h3>
        <ul>
            <li v-for="album of useralbum" >
            {{album.title}}
            - <button v-on:click="displayPhotos(album.id, album.title)" class="link">Afficher Photos</button>
            </li>
        </ul>
        <photo v-if="this.$root.displayPhoto" :idalbum="choiceAlbum" :titlealbum="choicetitleAlbum" :userphoto="userPhoto"></photo>
    </section>
    `,
    data: function () {
        return {
            choiceAlbum: 0,
            choicetitleAlbum: '',
            userPhoto: []
        }
    },
    props: ['iduser', 'username', 'useralbum'],
    components: {
        photo
    },
    methods: {
        photosLists: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=' + this.choiceAlbum);
                let photos = await response.json();
                this.userPhoto = photos;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        displayPhotos: function (idAlbum, titleAlbum) {
            this.displayPhoto = true;
            this.choiceAlbum = idAlbum;
            this.choicetitleAlbum = titleAlbum;
            this.$root.displayPhoto = true;
            this.photosLists();
        }
    }
}

let usertask = {
    template: `
    <section id="userTask">
        <h3>Tâche à réaliser pour l'utilisateur {{username}}</h3>
        <button v-if="!hiddenCompleted" v-on:click="hiddenTaskCompleted()">Cacher les tâches déjà réalisées</button>
        <button v-else v-on:click="hiddenTaskCompleted()">Afficher les tâches déjà réalisées</button>
        <ul>
            <li v-for="(task, index) of usertask" >
            <span v-if="task.completed" class="task completedTask">{{task.title}}</span>
            <span v-else class="task uncompletedTask">{{task.title}}</span>
            - <button v-on:click="deleteTask($event)" class="link" :data-index="task.id">Supprimer</button>
            </li>

        </ul>
    </section>
    `,
    data: function () {
        return {
            hiddenCompleted: false
        }
    },
    props: ['iduser', 'username', 'usertask'],
    methods: {
        hiddenTaskCompleted: function () {
            let taskCompleted = document.querySelectorAll(".completedTask")
            for (task of taskCompleted) {
                task.parentElement.classList.toggle("hiddenTask")
            }
            this.hiddenCompleted = !this.hiddenCompleted
        },
        deleteTask: function (e) {
            this.usertask.splice(this.usertask.findIndex(result => result.id == e.target.dataset.index), 1)
        }
    }
}

let userdata = {
    template: `<section id="userData">
        <h3>{{datauser.name}} ({{datauser.username}})</h3>
        <p class="title">Id : {{datauser.id}}</p>
        <ul>
            <li><span class="title">E-Mail</span> : <a :href="datauser.email|mailto">{{datauser.email}}</a></li>
            <li><span class="title">Téléphone</span> : <a :href="datauser.phone|phoneLink">{{datauser.phone}}</a></li>
            <li><span class="title">Site Web</span> : <a :href="datauser.website|webSite" target="_blank">{{datauser.website}}</a></li>
        </ul>
        <p><span class="title">Adresse</span> : 
        {{datauser.address.street}} - {{datauser.address.suite}} - {{datauser.address.zipcode}} {{datauser.address.city}}
        </p>
        
        <p><span class="title">Entreprise </span>: {{datauser.company.name}}</p>
        <p class="actionUser">
            <button v-on:click="activeDisplayTask()">Voir les tâches</button>
            <button v-on:click="activeDisplayAlbum()">Voir les albums</button>
            <button v-on:click="activeDisplayPost()">Voir les articles</button>
        </p>

        <usertask v-if="displayTask" :iduser="iduser" :username="datauser.name" :usertask="usertask"></usertask>
        <useralbum v-if="displayAlbum" :iduser="iduser" :username="datauser.name" :useralbum="useralbum"></useralbum>
        <post v-if="displayPost" :iduser="iduser" :username="datauser.name" :userpost="userpost"></post>

    </section>

    `,
    components: {
        usertask,
        useralbum,
        post
    },
    data: function () {
        return {
            displayTask: false,
            displayAlbum: false,
            displayPost: false,
        }
    },
    props: ['datauser', 'iduser', 'usertask', 'userpost', 'useralbum'],
    filters: {
        webSite: function (value) {
            return "https://" + value
        },
        phoneLink: function (value) {
            return "tel://" + value
        },
        mailto: function (value) {
            return "mailto:" + value
        }
    },
    methods: {
        activeDisplayTask: function () {
            this.displayTask = true;
            this.displayAlbum = false;
            this.displayPost = false;
        },
        activeDisplayAlbum: function () {
            this.displayAlbum = true;
            this.displayPost = false;
            this.displayTask = false;
        },
        activeDisplayPost: function () {
            this.displayAlbum = false;
            this.displayPost = true;
            this.displayTask = false;
        },
    }
}

let app = new Vue({
    el: '#app',
    data: {
        users: [],
        idUser: 0,
        dataUser: [],
        displayPhoto: false,
        displayComment: false,
        userTask: [],
        userAlbum: [],
        userPost: []

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
        loadUsers: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/users');
                let users = await response.json();
                this.users = users;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        postsList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + this.idUser);
                let posts = await response.json();
                this.userPost = posts;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        tasksList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=' + this.idUser);
                let tasks = await response.json();
                this.userTask = tasks;
            } catch (e) {
                console.error('ERREUR', e);
            }
        },
        albumsList: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/albums?userId=' + this.idUser);
                let albums = await response.json();
                this.userAlbum = albums;
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
            })
            this.tasksList();
            this.postsList();
            this.albumsList();
            this.displayPhoto = false;
            this.displayComment = false;
        }
    }
})