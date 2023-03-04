<template>

  <div>

    <menu>
      <div class="absolute top-4 right-4">
        <div v-if="$auth.loggedIn" class="flex space-x-2">
          <button>
            <nuxt-link class="btn-main" to="/viewParking">View Parking Places</nuxt-link>
          </button>
          <nuxt-link to="/viewAllReservations">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Reservations
            </button>
          </nuxt-link>
          <button @click="logUserOut" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
        <div v-else>
          <div class="flex space-x-2">
            <nuxt-link class="btn-main" to="/login">Login</nuxt-link>
            <nuxt-link class="btn-main" to="/register">Register</nuxt-link>
          </div>
        </div>
      </div>
    </menu>

    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h2 class="text-lg font-bold mb-2">Users</h2>
          <div class="text-gray-800 font-medium">{{ userCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h2 class="text-lg font-bold mb-2">Reservations</h2>
          <div class="text-gray-800 font-medium">{{ reservationCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h2 class="text-lg font-bold mb-2">Total Revenue</h2>
          <div class="text-gray-800 font-medium">£{{ totalPaidAmount }}</div>
        </div>
      </div>
    </div>

    <br>
    <br>
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">All Users</h1>
      <div class="bg-white rounded-lg shadow-lg p-4">
        <div v-if="users.length === 0" class="text-gray-800 font-medium">No users found.</div>
        <div v-else>
          <table class="table-fixed w-full">
            <thead>
            <tr>
              <th class="w-1/4 px-4 py-2">Name</th>
              <th class="w-1/4 px-4 py-2">Email</th>
              <th class="w-1/4 px-4 py-2">Joined Date</th>
              <th class="w-1/4 px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="border px-4 py-2">{{ user.name }}</td>
              <td class="border px-4 py-2">{{ user.email }}</td>
              <td class="border px-4 py-2">{{ formatDate(user.created_at) }}</td>
              <td class="border px-4 py-2">
                <div v-if="editingUser !== user.id">
                  <button @click="editUser(user.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                  <button @click="deleteUser(user.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
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

  </div>

</template>

<script>

import axios from 'axios';
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);
export default {
  middleware: 'admin',

  data() {
    return {
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

  async asyncData({$axios}) {
    const response = await $axios.$get(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard`);
    return {
      userCount: response.userCount,
      reservationCount: response.reservation,
      totalPaidAmount: response.totalPaidAmount,
    };
  },

  methods: {


    async updateUser() {
      console.log(this.editedUser.id);
      const userID = this.checkUser;
      const token = this.$auth.strategy.token.get();
      // send a PATCH request to update the user's data
      await axios.patch(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/users/${userID}`, {
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
          this.$router.push('/dashboard')
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


    fetchUsers() {
      const token = this.$auth.strategy.token.get()
      axios.get(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        this.users = response.data.users;
      }).catch(error => {
        console.log(error);
      });
    },
    editUser(userId) {
      this.checkUser = (this.users.find(user => user.id === userId).id)
      this.editingUser = this.users.find(user => user.id === userId);
      console.log((this.users.find(user => user.id).id))
      this.selectedUser = this.users.find(user => user.id === userId);
      this.editUserData = {
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        password: ''
      };
    },

    deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        const token = this.$auth.strategy.token.get()
        axios.delete(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/users/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            this.users = this.users.filter(user => user.id !== userId);
            this.$toast.success('User deleted successfully')
          })
          .catch(error => {
            console.log(error);
          })
      }
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
