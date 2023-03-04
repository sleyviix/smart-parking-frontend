<template>
  <div>

    <menu>
      <div class="absolute top-2 right-4">
        <div v-if="$auth.loggedIn" class="flex space-x-2 mt-2">
          <nuxt-link to="/">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </button>
          </nuxt-link>
          <nuxt-link to="/reservations">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              My Reservations
            </button>
          </nuxt-link>
          <button @click="logUserOut" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    </menu>

    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">My Account</h1>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h2 class="text-lg font-bold mb-2">Your Total Reservations</h2>
          <div class="text-gray-800 font-medium">{{ reservationCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h2 class="text-lg font-bold mb-2">Total You Have Spent With Us</h2>
          <div class="text-gray-800 font-medium">£{{ totalPaidAmount }}</div>
        </div>
      </div>
    </div>

    <br>
    <br>
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">My Information</h1>
      <div class="bg-white rounded-lg shadow-lg p-4">
        <table class="table-fixed w-full">
          <thead>
          <tr>
            <th class="w-1/4 px-4 py-2">Name</th>
            <th class="w-1/4 px-4 py-2">Email</th>
            <th class="w-1/4 px-4 py-2">Joined Date</th>
            <th class="w-1/6 px-4 py-2">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="border px-4 py-2">{{ user.name }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ formatDate(user.created_at) }}</td>
            <td class="border px-4 py-2">
              <div v-if="editingUser !== user.id">
                <button @click="editUser(user.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded center-block">
                  Edit
                </button>
              </div>
              <div v-if="checkUser === user.id">
                <div>
                  <form class="mt-4" @submit.prevent="updateUser(user.id)">
                    <div>
                      <label class="block font-bold mb-2" for="name">
                        Name
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="text" name="name" v-model="editedUser.name">
                    </div>
                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="email">
                        Email
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="email" name="email" v-model="editedUser.email">
                    </div>
                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="password">
                        Password
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="password" name="password" v-model="editedUser.password">
                    </div>
                    <div class="mt-4">
                      <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                      </button>
                      <button type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" @click="cancelEditUser()">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

export default {


  data() {
    return {
      totalPaidAmount: null,
      reservationCount: null,
      users: [],
      selectedUser: null,
      editingUser: null,
      checkUser: null,
      editUserData: {
        name: '',
        email: '',
        password: ''
      },
      editedUser: {
        name: '',
        email: '',
        password: ''
      }
    }
  },

  async mounted() {
    this.fetchUsers();


  },



  methods: {

    async updateUser() {
      console.log(this.editedUser.id);
      const userID = this.checkUser;
      const token = this.$auth.strategy.token.get();
      // send a PATCH request to update the user's data
      await axios.patch(`https://smart-parking-project.herokuapp.com/api/user`, {
        name: this.editedUser.name,
        email: this.editedUser.email,
        password: this.editedUser.password,
        password_confirmation: this.editedUser.password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          this.editUserData = {
            name: '',
            email: '',
            password: ''
          };
          this.checkUser = null;
          this.submitting = false
          this.$toast.success('User updated successfully')
          this.$router.push('/userAccount')
          this.editMode = false
        })
        .catch(error => {
          this.submitting = false
          if (error.response && error.response.status === 404) {
            this.errors = error.response.data.errors
          }
          console.log(error)
        })
    },

    async fetchUsers() {
      const token = this.$auth.strategy.token.get()
      axios.get(`https://smart-parking-project.herokuapp.com/api/Users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        this.users = response.data;
        this.getDashboardReservation();
        this.getDashboardTotal();
      }).catch(error => {
        console.log(error);
      });
    },
    editUser() {
      this.checkUser = this.users.data.id;
      this.editingUser = this.users.data;
      this.selectedUser = this.users.data;
      this.editUserData = {
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        password: ''
      };
    },

    async getDashboardReservation() {
      const userID = this.users.data.id
      const token = this.$auth.strategy.token.get()
      const response = await axios.get(`https://smart-parking-project.herokuapp.com/api/users/${userID}/reservations/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      this.reservationCount = response.data;
    },

    async getDashboardTotal() {
      const userID = this.users.data.id
      const token = this.$auth.strategy.token.get()
      const response = await axios.get(`https://smart-parking-project.herokuapp.com/api/users/${userID}/paid_amount`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      this.totalPaidAmount = response.data;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },


    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    },

    cancelEditUser() {
      this.checkUser = null;
      this.editingUser = null;
      this.editUserData = {
        name: '',
        email: '',
        password: ''
      };
      this.editedUser = {
        name: '',
        email: '',
        password: ''
      };
    },
  }
};
</script>

<style>
.container {
  max-width: 1200px;
}

h1 {
  color: #333;
}

.bg-white {
  background-color: #fff;
}

.text-gray-800 {
  color: #333;
}
</style>
