<template>
  <div>
    <b-navbar id="navbar" toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">
        You are currently viewing the Vue_JWT_App
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-text>{{user}} | </b-nav-text>
        <b-nav-item @click="logUserOut" active>Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">
                Name : {{ name }} {{ email }}
              </li>
              <li class="list-group-item">Email : {{ user }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
export default {
  middleware: ['auth'],

  data(){
    return{
      user:{},
      name:'',
      email: '',
    }
  },

  methods:{
    getUserDetails() {
      // get token from localstorage
      let token = localStorage.getItem("auth._token.jwt");
      VueJwtDecode.decode = function (token) {
        return undefined;
      }
      try {
        //decode token here and attach to the user object
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
      } catch (error) {
        // return error in production env
        console.log(error, 'error from decoding token')
      }
    },


    async getDetails() {
        const {data} = await this.$axios.post(`http://localhost:8000/api/auth/Users`, {
          'name': data.data.name,
          'email': data.data.email,
        })
      return name;

    },

    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    }
  },
  created() {
    this.getUserDetails();
  }
}

</script>
