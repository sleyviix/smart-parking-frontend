<template>
  <div class="min-h-screen relative max-6/6" >
    <GMap class="absolute inset-0 h-100% bg-blue-400"
          v-if="parkingPlaces.length > 0"
          ref="gMap"
          language="en"
          :cluster="{options: {styles: clusterStyle}}"
          :center="{lat:parkingPlaces[0].coordinates.lat, lng: parkingPlaces[0].coordinates.lng}"
          :options="{fullscreenControl: false, styles: mapStyle}"
          :zoom="5">

      <GMapMarker
        v-for="location in parkingPlaces"
        :key="location.id"
        :position="{lat: location.coordinates.lat, lng: location.coordinates.lng}"
        :options="{icon: location.free_spots > 0 ? pins.spacefree : pins.spacenotfree}"
        @click="currentLocation = location"
      >
        <!--        <GMapInfoWindow :options="{maxWidth: 200}">-->
        <!--          <code>-->
        <!--            lat: {{ location.coordinates.lat }},-->
        <!--            lng: {{ location.coordinates.lng }}-->
        <!--          </code>-->
        <!--        </GMapInfoWindow>-->
      </GMapMarker>
      <GMapCircle :options="circleOptions"/>
    </GMap>

<!--    <div>-->
<!--      <div id="map"></div>-->
<!--      <div id="omnibox">-->
<!--        <div id="searchbox" role="search" class="searchbox suggestions-shown">-->
<!--          <form id="searchbox_form" name="searchNearBy" onsubmit="">-->
<!--            <input autofocus="autofocus" aria-label="搜尋附近地點" id="keyword" name="keyword" placeholder="搜尋附近地點">-->
<!--          </form>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <parking-place-preview :parking-place="currentLocation" @close="currentLocation=null">

    </parking-place-preview>



    <menu>
        <div class="absolute top-4 right-4">
          <div v-if="this.$auth.loggedIn">
            <button><nuxt-link class="btn-main" to="/account">My Account</nuxt-link></button>
          </div>
          <div class="flex space-x-2" v-else>
            <nuxt-link class="btn-main" to="/login">Login</nuxt-link>
            <nuxt-link class="btn-main" to="/register">Register</nuxt-link>
          </div>
        </div>
    </menu>


  </div>
</template>

<script>


import parkingPlacePreview from "@/components/parkingPlacePreview";



export default{
  middleware: 'auth',

  components : {

    'parkingPlacePreview': parkingPlacePreview,


  },


  data() {
    return {
      currentLocation: {},
      circleOptions: {},

      parkingPlaces: [],
      // parkingPlaces: [
      //   {
      //     "id": 1,
      //     "name": "Chandler Larson",
      //     "post": "37757",
      //     "coordinates": {
      //       "lng": -51.84,
      //       "lat": -60.02
      //     },
      //     "total_spots": 0,
      //     "free_spots": 0
      //   },
      //
      //   {
      //     "id": 1,
      //     "name": "Chandler Larson",
      //     "post": "37757",
      //     "coordinates": {
      //       "lng": -11.84,
      //       "lat": -50.02
      //     },
      //     "total_spots": 0,
      //     "free_spots": 0
      //   }
      // ],

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
    const response = await fetch('http://localhost:8000/api/parkingPlace')
    const json = await response.json()
    this.parkingPlaces = json.data
    console.log(this.parkingPlaces)

  },


}
</script>
