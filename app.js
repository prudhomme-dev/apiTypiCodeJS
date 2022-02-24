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
    </section>

    `,
    props: ['datauser'],
    filters: {
        webSite: function (value) {
            return "https://" + value
        }

    },
    methods: {
        loadUser: async function () {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/users?id=' + this.iduser);
                let user = await response.json();
                this.datauser = user;
            } catch (e) {
                console.error('ERREUR', e);
            }
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