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
      <h1 class="text-2xl font-bold mb-4">View Parking Spots</h1>
      <div class="bg-white rounded-lg shadow-lg p-4">
<!--        <div v-if="users.length === 0" class="text-gray-800 font-medium">No users found.</div>-->
<!--        <div v-else>-->
          <table class="table-fixed w-full">

            <br>
            <br>
            <template>
              <div class="mt-6">
                <div v-for="floor in floors" class="mb-6">
                  <h2 class="text-xl font-bold mb-2">Floor {{ floor }}</h2>
                  <div class="grid grid-cols-2 gap-6 lg:grid-cols-3">
                    <div v-for="parkingSpot in getSpotsByFloor(floor)" class="relative cursor-pointer rounded-lg p-3 text-gray-500 shadow-md h-40">
                      <div class="grid grid-cols-2">
                        <div>
                          <p>Spot ID.: <span class="text-lg text-gray-600">{{ parkingSpot.id }}</span></p>
                          <p>Spot No.: <span class="text-lg text-gray-600">{{ parkingSpot.number }}</span></p>
                          <p>Size: <span class="text-lg text-gray-600">{{ parkingSpot.size_id }}</span></p>
                        </div>
                        <template v-if="parkingSpot.attributes.length">
                          <p class="flex flex-col space-y-2">
                            <span class="inline-block items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-800" v-for="(attribute, index) in parkingSpot.attributes" :key="attribute.id" v-if="index < 4">{{ fetchAttribute(attribute) }}</span>
                          </p>
                        </template>
                        <template v-else>
                          <span class="inline text-xl-center bg-gray-100 px-0.5 py-0.5 text-sm text-gray-800" style="word-wrap: break-word;">Cheaper</span>
                        </template>
                      </div>
                      <button class="absolute bottom-0 left-0 m-3 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" @click="deleteParkingSpot(parkingSpot.id)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>


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
  middleware: 'admin',

  computed: {
    uniqueAttributes() {
      return this.parkingSpot.attributes.filter((attribute, index, self) =>
        index === self.findIndex((a) => a.id === attribute.id)
      );
    },
  },

  data() {
    return {
      spots: [],
      floors: [],
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
    await this.fetchSpots();

  },

  methods: {

    async fetchSpots() {
      try {
        const id = this.$route.query.checkForSpot;
        const token = this.$auth.strategy.token.get();
        const response = await axios.get(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/parkingPlaces/parkingSpots/show/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.spots = response.data;
        this.floors = [...new Set(this.spots.map(spot => spot.floor))]; // get unique floors from spots
        this.isDataLoaded = true; // Set isDataLoaded to true
        console.log(this.spots);
      } catch (error) {
        console.error(error);
        this.$toast.error('Error fetching parking spots');
      }
    },


    getSpotsByFloor(floor) {
      return this.spots.filter(spot => spot.floor === floor);
    },

    async deleteParkingSpot(id) {
      if (confirm("Are you sure you want to delete this Spot?")) {
        const token = this.$auth.strategy.token.get();
        await axios.delete(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/dashboard/parkingPlaces/parkingSpots/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            this.spots = this.spots.filter(user => user.id !== id);
          })
          .then(response => {
            this.$toast.success('Spot deleted successfully')
            this.$router.push('/viewSpots')
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


    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    },

    fetchAttribute(val){

      var attribute = "";

      if(val == 'electric'){
        attribute = "EV Charging Spot"
      }
      else if (val == 'for_women'){
        attribute = "Safe Spot"
      }
      else if (val == 'handicapped'){
        attribute = "Disabled Spot"
      }
      else if (val == 'with_kids'){
        attribute = "Parent & Child Spot"
      }
      return attribute;
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



<style scoped>

</style>
