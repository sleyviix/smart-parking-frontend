<template>
  <div>

      <div class="min-h-screen relative max-6/6">
        <div class="flex">
          <div class="w-3/4">



            <GMap
              class="absolute inset-0 h-100% bg-blue-400"
              v-if="parkingPlaces.length > 0"
              ref="gMap"
              language="en"
              :cluster="{ options: { styles: clusterStyle } }"
              :center="center"
              :options="{ fullscreenControl: false, styles: mapStyle }"
              :zoom="16"
            >
              <GMapMarker
                v-for="location in parkingPlaces"
                :key="location.id"
                :position="{ lat: location.coordinates.lat, lng: location.coordinates.lng }"
                :options="{ icon: location.free_spots > 0 ? pins.spacefree : pins.spacenotfree }"
                @click="currentLocation = location"
              />
              <GMapCircle :options="circleOptions" />
            </GMap>


            <parking-place-preview :parking-place="currentLocation" @close="currentLocation=null" />
            <div>
              <RecommendedParkingSpots/>
            </div>

<!--            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 p-4">-->
<!--              <input id="search-box" type="text" placeholder="Search..." class="rounded-full border px-4 py-2 w-96">-->
<!--            </div>-->


          </div>
        </div>


        <menu>
          <div class="absolute top-4 right-4">
            <div v-if="$auth.loggedIn" class="flex space-x-2">
              <!--          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">-->
              <!--            Show Recommendations-->
              <!--          </button>-->
              <button>
                <nuxt-link class="btn-main" to="/account">My Account</nuxt-link>
              </button>
              <nuxt-link to="/reservations">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  My Reservations
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
      </div>
  </div>

</template>

<script>


import parkingPlacePreview from "@/components/parkingPlacePreview";
import RecommendedParkingSpots from "@/components/RecommendedParkingSpots";
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);



export default{



  middleware: 'auth',

  components : {

    'parkingPlacePreview': parkingPlacePreview,
    'RecommendedParkingSpots': RecommendedParkingSpots,
  },


  data() {
    return {
      searchTerm: '',
      watchId: null,
      isDataLoaded: false,
      center: {
        lat: 52.480032,
        lng: -1.897570
      },
      currentLocation: {},
      circleOptions: {},

      parkingPlaces: [],

      pins: {
        spacefree: "/parkingicongreen3.png",
        spacenotfree: "/parkingiconred3.png",
      },
      mapStyle: [],
      clusterStyle: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff"
        }
      ]
    }
  },

  async fetch() {
    try{
      const response = await fetch(`https://smart-parking-project.herokuapp.com/api/parkingPlace`)
      const json = await response.json()
      this.parkingPlaces = json.data
      this.isDataLoaded = true; // Set isDataLoaded to true
      console.log(this.parkingPlaces)
    }catch (error){
      console.error(error);
    }

  },

  mounted() {

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if (this.center.lat === 0 && this.center.lng === 0) {
            this.$toast.warning('Please allow location access to continue', {
              duration: null // Set duration to null for infinite duration
            });
          }
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            this.getGeolocationFromApi();
            this.$toast.warning('Location may not be accurate', {
              duration: null // Set duration to null for infinite duration
            });
          }
        }
      );
    } else {
      this.getGeolocationFromApi();
    }
  },

  methods: {

    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    },

    getGeolocationFromApi() {
      const googleApiUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBuIZsAHNXxQ3u69sbMFQSkDNpiYOg4tPE`;

      fetch(googleApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          considerIp: true
        })
      })
        .then(response => response.json())
        .then(data => {
          this.center = {
            lat: data.location.lat,
            lng: data.location.lng
          };
        })
        .catch(error => {
          console.error(error);
          this.$toast.warning('Error getting location, please try again later', {
            duration: null // Set duration to null for infinite duration
          });
        });
    },

  }


}
</script>
