let usertask = {
    template: `
    <section>
        <h3>Tâche à réaliser pour l'utilisateur {{username}}</h3>
        <button v-on:click="hiddenTaskCompleted()">Cacher les tâches déjà réalisées</button>
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
            userTask: []
        }
    },
    props: ['iduser', 'username'],
    created: function () {
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
            <button>Voir les albums</button>
            <button>Voir les articles</button>
        </p>

        <usertask v-if="displayTask" :iduser="idUser" :username="datauser.name"></usertask>

    </section>

    `,
    created: function () {
        this.idUser = this.datauser.id;
    },
    updated: function () {
        this.idUser = this.datauser.id;
    },
    components: {
        usertask

    },
    data: function () {
        return {
            idUser: 0,
            displayTask: false
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