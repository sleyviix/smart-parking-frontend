<template>

  <div>

    <menu>
      <div class="absolute top-4 right-4">
        <div v-if="$auth.loggedIn" class="flex space-x-2">
          <button>
            <nuxt-link class="btn-main" to="/dashboard">Dashboard</nuxt-link>
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

    <br>
    <br>
    <br>


    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-xl font-bold mb-6">Create a new parking place</h1>
      <form @submit.prevent="createParkingPlace" class="space-y-4">
        <div class="flex flex-col">
          <label for="name" class="font-bold mb-1">Name:</label>
          <input type="text" id="name" v-model="name" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex flex-col">
          <label for="postCode" class="font-bold mb-1">Post code:</label>
          <input type="text" id="postCode" v-model="postCode" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex flex-col">
          <label for="lng" class="font-bold mb-1">Longitude:</label>
          <input type="text" id="lng" v-model="lng" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex flex-col">
          <label for="lat" class="font-bold mb-1">Latitude:</label>
          <input type="text" id="lat" v-model="lat" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Base rate for size_id 1 -->
        <div class="flex flex-col">
          <label for="baseRateSize1" class="font-bold mb-1">Base Hourly Rate for small spots:</label>
          <input type="number" id="baseRateSize1" v-model="baseRateSize1" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Base rate for size_id 2 -->
        <div class="flex flex-col">
          <label for="baseRateSize2" class="font-bold mb-1">Base Hourly Rate for medium spots:</label>
          <input type="number" id="baseRateSize2" v-model="baseRateSize2" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Base rate for size_id 3 -->
        <div class="flex flex-col">
          <label for="baseRateSize3" class="font-bold mb-1">Base Hourly Rate for large spots:</label>
          <input type="number" id="baseRateSize3" v-model="baseRateSize3" required class="border border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>


        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Create parking place</button>
      </form>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  middleware: 'admin',
  data() {
    return {
      name: '',
      postCode: '',
      lng: '',
      lat: '',
      baseRateSize1: '',
      baseRateSize2: '',
      baseRateSize3: '',
    }
  },
  methods: {
    async createParkingPlace() {
      const token = this.$auth.strategy.token.get();
      const response = await axios.post(`https://smart-parking-project.herokuapp.com/api/parkingPlace/create`, {
        name: this.name,
        postCode: this.postCode,
        lng: this.lng,
        lat: this.lat,
        size_id_1_baseRate: this.baseRateSize1,
        size_id_2_baseRate: this.baseRateSize2,
        size_id_3_baseRate: this.baseRateSize3,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        this.$toast.success('Added Successfully')

        this.name = '',
          this.postCode = '',
          this.lng = '',
          this.lat =  '',
          this.baseRateSize1 = '',
          this.baseRateSize2 = '',
          this.baseRateSize3 = ''
        // setInterval(() => {
        //   history.go(0);
        // }, 1000);
        this.$router.push('/addParking')
      })
        .catch(error => {
          this.submitting = false
          if (error.response && error.response.status === 404) {
            this.errors = error.response.data.errors
          }
          console.log(error)
        })
    },

    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    },

  },


}
</script>



