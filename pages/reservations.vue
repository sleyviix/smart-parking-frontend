<template>
  <div>

    <div class="absolute top-2 right-4">
      <div v-if="$auth.loggedIn" class="flex space-x-2 mt-2">
        <nuxt-link to="/">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </nuxt-link>
        <nuxt-link class="btn-main" to="/account">
          My Account
        </nuxt-link>
        <button @click="logUserOut" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
      <br>
      <br>
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">My Reservations</h1>
      <div class="bg-white rounded-lg shadow-lg p-4">
        <div v-if="reservations.length === 0" class="text-gray-800 font-medium">No reservations found.</div>
        <div v-else>

          <div v-for="(reservation, index) in reservations" :key="reservation.id" class="bg-white shadow-md rounded-md p-6 my-4 w-full">
            <div class="font-bold mb-2">{{ reservation.parking_place_name}}</div>
            <div class="font mb-2">Postcode: {{reservation.parking_place_postcode}}</div>
            <div class="font mb-2">Floor: {{reservation.spot.floor}} Bay: {{reservation.spot.number}}</div>
            <div class="text-gray-600 mb-4">From: {{ formatDate(reservation.start) }} To: {{ formatDate(reservation.end) }}</div>
            <div v-if="reservation.paid_at != null">
              <div class="text-gray-600 mb-4">You Paid £{{reservation.paid_amount}} At: {{formatDate(reservation.paid_at)}}</div>
              <div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="getDirections(reservation)">
                  Directions
                </button>
                <button @click="deleteReservation(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-8">
                  Delete
                </button>
              </div>
            </div>
            <div v-else>
              <p class="text-red-600 font-bold">Please Complete Payment</p>
              <br>
              <button type="button" @click="issueCheckoutUrl(reservation)" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Continue to payment
              </button>
            </div>
          </div>
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
  middleware: 'auth',
  data() {
    return {
      reservations: []
    }
  },
  methods: {
    async showReservations() {
      try {
        const token = this.$auth.strategy.token.get()
        const response = await fetch(`https://smart-parking-project.herokuapp.com/api/reservations`, {
          headers: {
            'Authorization': `${token}`
          }
        })
        const data = await response.json()
        this.reservations = data.data // extract reservations array from data property
      } catch (error) {
        console.error(error)
      }
    },

    async deleteReservation(index) {
      try {
        if (confirm("Are you sure you want to delete this reservation?")) {
          const token = this.$auth.strategy.token.get()
          const reservation = this.reservations[index]
          const response = await axios.delete(`https://smart-parking-project.herokuapp.com/api/reservations/${reservation.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response => {
              if (response.status === 200) {
                this.reservations.splice(index, 1)
                this.$toast.success('Reservation deleted successfully')
              } else {
                console.error(`Failed to delete reservation with ID ${reservation.id}`)
              }
            })
            .catch(error => {
              console.error(error)
            })
        }
      } catch (error) {
        console.error(error)
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    },

    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    },

    getDirections(reservation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const start = `${position.coords.latitude},${position.coords.longitude}`;
          const end = `${reservation.parking_place_lat},${reservation.parking_place_lng}`;
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}`);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    async issueCheckoutUrl(reservation) {
      const {data} = await this.$axios.get(`https://smart-parking-project.herokuapp.com/api/checkout/${reservation.id}`)
      window.location.replace(data.url);
      // console.log('checkout url', data)
    },
  },
  mounted() {
    this.showReservations()
  }
}
</script>
