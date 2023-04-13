<template>
<div>

  <menu>
    <div class="absolute top-4 right-4">
      <div v-if="$auth.loggedIn" class="flex space-x-2">
        <button>
          <nuxt-link class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" to="/dashboard">Dashboard</nuxt-link>
        </button>
        <button>
          <nuxt-link class="btn-main" to="/addParking">Add Parking Places</nuxt-link>
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
    <h1 class="text-2xl font-bold mb-4">All Parking Places</h1>
    <div class="bg-white rounded-lg shadow-lg p-4">
      <div v-if="users.length === 0" class="text-gray-800 font-medium">No users found.</div>
      <div v-else>
        <table class="table-fixed w-full">
          <thead>
          <tr>
            <th class="w-1/4 px-4 py-2">Id</th>
            <th class="w-1/4 px-4 py-2">Name</th>
            <th class="w-1/4 px-4 py-2">Postcode</th>
            <th class="w-1/4 px-4 py-2">Latitude</th>
            <th class="w-1/4 px-4 py-2">Longitude</th>
            <th class="w-3/4 px-4 py-4">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="border px-4 py-2">{{ user.id }}</td>
            <td class="border px-4 py-2">{{ user.name }}</td>
            <td class="border px-4 py-2">{{ user.postCode }}</td>
            <td class="border px-4 py-2">{{roundToTwoDecimalPlaces(user.lat)}}</td>
            <td class="border px-4 py-2">{{roundToTwoDecimalPlaces(user.lng)}}</td>
            <td class="border px-4 py-4">
              <div v-if="editingUser !== user.id">
                <button @click="openSpots(user.id)" class="bg-yellow-200 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded border border-grey">
                  Show Spots
                </button>
                <button @click="openAddSpot(user.id)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Add Spot
                </button>
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
                      <label class="block font-bold mb-2" for="postcode">
                        Postcode
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="postcode" name="postcode" v-model="editedUser.postcode">
                    </div>
                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="latitude">
                        Latitude
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="latitude" name="latitude" v-model="editedUser.latitude">
                    </div>
                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="longitude">
                        Longitude
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="longitude" name="longitude" v-model="editedUser.longitude">
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
              <div v-if="checkForSpot === user.id">
                <div>
                  <form class="mt-4" @submit.prevent="addSpot(user.id)">
                    <div>
                      <label class="block font-bold mb-2" for="size">
                        Size
                      </label>
                      <label>
                        <input type="radio" name="size" value="1" v-model="editedAddSpot.size"> Small
                      </label>
                      <label>
                        <input type="radio" name="size" value="2" v-model="editedAddSpot.size"> Medium
                      </label>
                      <label>
                        <input type="radio" name="size" value="3" v-model="editedAddSpot.size"> Large
                      </label>
                    </div>
                    <div>
                      <label class="block font-bold mb-2" for="attributes">
                        Attribute
                      </label>
                      <label>
                        <input type="radio" name="attributes" value="1" v-model="editedAddSpot.attributes"> EV Spot
                      </label>
                      <label>
                        <input type="radio" name="attributes" value="2" v-model="editedAddSpot.attributes"> Safe Spot
                      </label>
                      <label>
                        <input type="radio" name="attributes" value="3" v-model="editedAddSpot.attributes"> Disabled Spot
                      </label>
                      <label>
                        <input type="radio" name="attributes" value="4" v-model="editedAddSpot.attributes"> Parent & Child Spot
                      </label>
                    </div>
                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="floor">
                        Floor
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="number" name="floor" v-model="editedAddSpot.floor" step="1" value="0">
                    </div>

                    <div class="mt-4">
                      <label class="block font-bold mb-2" for="number">
                        Number
                      </label>
                      <input class="border rounded w-full py-2 px-3" type="number" name="number" v-model="editedAddSpot.number" step="1" value="0">
                    </div>
                    <div class="mt-4">
                      <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                      </button>
                      <button type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" @click="cancelAddSpot()">
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
      selectedSpot:null,
      editingUser: null,
      editingForSpot: null,
      checkUser: null,
      checkForSpot: null,
      checkForSpotID:null,
      editedUser: {
        name: '',
        postcode: '',
        latitude: '',
        longitude: ''
      },
      editedAddSpot: {
        size: '',
        floor: '',
        number: '',
        attributes: ''
      }
    }
  },

  async mounted() {
    this.fetchUsers();

  },



  async asyncData({$axios}) {
    const response = await $axios.$get(`https://smart-parking-project.herokuapp.com/api/dashboard/parkingplaces/all`);
    return {
      userCount: response.userCount,
      reservationCount: response.reservation,
      totalPaidAmount: response.totalPaidAmount,
    };
  },

  methods: {


    async updateUser() {
      console.log(this.editedUser.id)
      const userID = this.checkUser
      const token = this.$auth.strategy.token.get()

      axios.patch(`https://smart-parking-project.herokuapp.com/api/dashboard/parkingPlaces/update/${userID}`, {
        name: this.editedUser.name,
        postCode: this.editedUser.postcode,
        lng: this.editedUser.longitude,
        lat: this.editedUser.latitude
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          this.fetchUsers();
          this.checkUser = null
          this.submitting = false
          this.$toast.success('Parking Place updated successfully')
          // this.$nuxt.$router.go()
          this.editMode = false
          this.editedUser= {
            name: '',
            postcode: '',
            latitude: '',
            longitude: ''
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status === 404) {
            this.errors = error.response.data.errors
          }
        })
    },


    async fetchUsers() {
      try {
        const token = this.$auth.strategy.token.get();
        const response = await axios.get(`https://smart-parking-project.herokuapp.com/api/dashboard/parkingplaces/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.users = response.data;
        this.isDataLoaded = true;
        console.log(this.users);
      } catch (error) {
        console.error(error);
      }
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

    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this Parking Place?")) {
        const token = this.$auth.strategy.token.get()
        await axios.delete(`https://smart-parking-project.herokuapp.com/api/dashboard/users/delete/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          this.users = this.users.filter(user => user.id !== userId);
        }).catch(error => {
          console.log(error);
        })
          .then(response => {
            this.$toast.success('User deleted successfully')
            this.$router.push({ name: 'viewParking' });
          })
          .catch(error => {
            this.submitting = false
            if (error.response && error.response.status === 404) {
              this.errors = error.response.data.errors
            }
            console.log(error)
          })
      }
    },

    openAddSpot(userId) {
      this.editingForSpot = this.users.find(user => user.id === userId);
      this.checkForSpot = (this.users.find(user => user.id === userId).id)
      // this.selectedUser = this.users.find(user => user.id === userId);
    },

    openSpots(userId){
      this.checkForSpotID = (this.users.find(user => user.id === userId).id)
      this.$router.push({
        name: "viewSpots",
        query: { checkForSpot: this.checkForSpotID }
      });
    },

    async addSpot(userId) {
      console.log(this.checkForSpot);
      // send a POST request to add a parking spot
      const token = this.$auth.strategy.token.get()
      await axios.post(`https://smart-parking-project.herokuapp.com/api/dashboard/parkingspots/add`, {
        parking_place_id: this.checkForSpot,
        size_id: this.editedAddSpot.size,
        floor: this.editedAddSpot.floor,
        number: this.editedAddSpot.number,
        attributes: this.editedAddSpot.attributes
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          this.checkUser = null;
          this.submitting = false
          this.$toast.success('User updated successfully')
          this.editMode = false
          this.editedAddSpot = {
            size: '',
            floor: '',
            number: '',
            attribute: ''
          }
          this.$router.push({ name: 'viewParking' });
        })
        .catch(error => {
          this.submitting = false
          if (error.response && error.response.status === 404) {
            this.errors = error.response.data.errors
          }
          console.log(error)
        })
    },


    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    roundToTwoDecimalPlaces(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
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
      this.editedUser = {
        name: '',
        postcode: '',
        latitude: '',
        longitude: ''
      };
    },

    cancelAddSpot() {
      this.checkUser = null;
      this.checkForSpot = null;
      this.editedUser = {
        name: '',
        postcode: '',
        latitude: '',
        longitude: ''
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


