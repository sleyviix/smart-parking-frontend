<template>
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
        <RecommendedParkingSpots/>

      </div>
    </div>

<!--    <div v-if="isDataLoaded">-->
<!--      <RecommendedParkingSpots/>-->
<!--    </div>-->

    <menu>
      <div class="absolute top-4 right-4">
        <div v-if="$auth.loggedIn" class="flex space-x-2">
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
</template>

<script>


import parkingPlacePreview from "@/components/parkingPlacePreview";
import RecommendedParkingSpots from "@/components/RecommendedParkingSpots";




export default{
  middleware: 'auth',

  components : {

    'parkingPlacePreview': parkingPlacePreview,
    'RecommendedParkingSpots': RecommendedParkingSpots,
  },


  data() {
    return {
      isDataLoaded: false,
      center: {
        lat: 0,
        lng: 0
      },
      currentLocation: {},
      circleOptions: {},

      parkingPlaces: [],

      pins: {
        spacefree: "/parkingicongreen3.png",
        spacenotfree: "/parkingiconred3.png",
        // spacefree: "/ParkingGreen.png",
        // spacenotfree: "/ParkingRed.png",
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
      const response = await fetch(`${process.env.APICALL}/api/parkingPlace`)
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
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  },

  methods: {
    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    }
  }


}
</script>
