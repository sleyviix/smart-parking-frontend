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
      <h1 class="text-2xl font-bold mb-4">All User Reservations</h1>
      <div class="bg-white rounded-lg shadow-lg p-4">
        <div v-if="reservations.length === 0" class="text-gray-800 font-medium">No users found.</div>
        <div v-else>
          <table class="table-fixed w-full">
            <thead>
            <tr>
              <th class="w-1/4 px-4 py-2">Reservation Id</th>
              <th class="w-1/4 px-4 py-2">UUID</th>
              <th class="w-1/4 px-4 py-2">Start - End</th>
              <th class="w-1/4 px-4 py-2">Paid_at</th>
              <th class="w-1/4 px-4 py-2">Paid_amount</th>
              <th class="w-1/4 px-4 py-4">Location</th>
              <th class="w-1/4 px-4 py-4">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td class="border px-4 py-2">{{ reservation.id }}</td>
              <td class="border px-4 py-2">{{ reservation.uuid }}</td>
              <td class="border px-4 py-2">{{ formatDate(reservation.start) }} - {{ formatDate(reservation.end) }}</td>
              <td class="border px-4 py-2">{{formatDate(reservation.paid_at)}}</td>
              <td class="border px-4 py-2">{{formatDate(reservation.paid_amount)}}</td>
              <td class="border px-4 py-2">Name: {{reservation.spot.parking_place.name}} Postcode: {{reservation.spot.parking_place.postCode}}</td>
              <td class="border px-4 py-4">
                <div v-if="editingUser !== reservation.id">
                  <button @click="deleteReservation(reservation.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
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
      reservations: [],
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
    const response = await $axios.$get(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/parkingplaces/all`);
    return {
      userCount: response.userCount,
      reservationCount: response.reservation,
      totalPaidAmount: response.totalPaidAmount,
    };
  },

  methods: {


    async updateUser() {
      console.log(this.editedUser.id)
      const userID = this.checkUser;
      // get the token from the authentication service
      const token = this.$auth.strategy.token.get()
      // send a PATCH request to update the user's data with the Authorization header
      await axios.patch(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/parkingPlaces/update/${userID}`, {
        name: this.editedUser.name,
        postCode: this.editedUser.postcode,
        lng: this.editedUser.longitude,
        lat: this.editedUser.latitude
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
          this.editedUser= {
            name: '',
            postcode: '',
            latitude: '',
            longitude: ''
          }
          this.$router.push('/viewAllReservations')
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
      try{
        const token = this.$auth.strategy.token.get()
        const response = await axios.get(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/reservations/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        this.reservations = response.data.data
        this.isDataLoaded = true; // Set isDataLoaded to true
        console.log(this.reservations)
      } catch (error){
        console.error(error);
      }
    },


    editUser(userId) {
      this.checkUser = (this.reservations.find(user => user.id === userId).id)
      this.editingUser = this.reservations.find(user => user.id === userId);
      console.log((this.reservations.find(user => user.id).id))
      this.selectedUser = this.reservations.find(user => user.id === userId);
      this.editUserData = {
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        password: ''
      };
    },

    deleteReservation(reservationId) {
      if (confirm("Are you sure you want to delete this reservation?")) {
        const token = this.$auth.strategy.token.get()
        axios.delete(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/reservation/delete/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          this.reservations = this.reservations.filter(user => user.id !== reservationId);
        }).catch(error => {
          console.log(error);
        })
          .then(response => {
            this.$toast.success('Reservation deleted successfully')
            this.$router.push('/viewAllReservations')
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
      this.editingForSpot = this.reservations.find(user => user.id === userId);
      this.checkForSpot = (this.reservations.find(user => user.id === userId).id)
      // this.selectedUser = this.users.find(user => user.id === userId);
    },

    openSpots(userId){
      this.checkForSpotID = (this.reservations.find(user => user.id === userId).id)
      this.$router.push({
        name: "viewSpots",
        query: { checkForSpot: this.checkForSpotID }
      });
    },

    async addSpot(userId) {
      const token = this.$auth.strategy.token.get();
      console.log(this.checkForSpot);
      // send a PATCH request to update the user's data
      await axios.post(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/parkingspots/add`, {
        parking_place_id: this.checkForSpot,
        size_id: this.editedAddSpot.size,
        floor: this.editedAddSpot.floor,
        number: this.editedAddSpot.number,
        attributes: this.editedAddSpot.attributes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          this.checkUser = null;
          this.submitting = false
          this.$toast.success('Spot Added successfully')
          this.editMode = false
          this.editedAddSpot = {
            size: '',
            floor: '',
            number: '',
            attribute: ''
          }
          this.$router.push('/viewAllReservations')
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
      if (!date) {
      return "Unpaid";
      } else {
      return new Date(date).toLocaleDateString();
      }
    },


    // formatDate(date) {
    //   return new Date(date).toLocaleDateString()
    // },


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


