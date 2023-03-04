<!--<template>-->
<!--  <div>-->
<!--    <div class="bg-white rounded-md p-1 w-2/12 absolute top-20 left-2 z-10 shadow-lg">-->
<!--      <button class="flex items-center font-bold" @click="isRecommendOpen = !isRecommendOpen">-->
<!--        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">-->
<!--          <path d="M9 5l7 7-7 7"></path>-->
<!--        </svg>-->
<!--        Recommended Parking Spots-->
<!--      </button>-->
<!--      <div class="relative mb-2" v-if="isRecommendOpen">-->
<!--        <div>-->

<!--          <button class="relative z-10 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2" @click="toggleDropdown">-->
<!--            <svg class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">-->
<!--              <path d="M9 5l7 7-7 7"></path>-->
<!--            </svg>-->
<!--            Filter By-->
<!--          </button>-->
<!--          <div v-if="isDropdownOpen" v-click-outside="onClickOutside">-->
<!--            <div class="absolute z-20 bg-white mt-2 py-2 w-40 rounded-md shadow-lg" x-show="isDropdownOpen" @click.away="isDropdownOpen = false">-->
<!--              <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortByDistance">Distance</button>-->
<!--              <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortByBoth">Price&Distance</button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <ul class="mt-2">-->
<!--          <li v-for="parkingSpot in recommendedParkingSpots" :key="parkingSpot.id">-->
<!--            <div class="mb-2 rounded-md border border-gray-300 p-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer" @click="showParkingPlacePreview(parkingSpot)">-->
<!--              <p class="text-gray-800 font-medium">{{parkingSpot.name}}</p>-->
<!--              <p class="text-sm text-gray-600">Free Spots: {{parkingSpot.free_spots}} within {{roundToTwoDecimalPlaces(parkingSpot.distance)}}Km</p>-->
<!--              <p class="text-sm text-gray-600">Price: {{parkingSpot.price}}</p>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->

<!--        </div>-->

<!--    </div>-->
<!--    <parking-place-preview-recommend v-if="currentLocation" :parking-place="currentLocation" @close="currentLocation=null" />-->
<!--  </div>-->
<!--</template>-->
<template>
  <div class="mt-40 ml-2">
    <div class="relative">
      <button class="relative z-10 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="toggleRecommend">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5l7 7-7 7"></path>
        </svg>
        <span>Recommended Parking Spots</span>
      </button>
      <div class="absolute z-20 mt-2 py-2 rounded-md w-80" v-if="isRecommendOpen" v-click-outside="onClickOutside">
        <div class="relative">
          <button class="relative z-10 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="toggleDropdown">
            <span>Filter By</span>
            <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <div class="absolute z-20 bg-white mt-2 py-2 rounded-md shadow-lg w-40" v-if="isDropdownOpen" v-click-outside="onClickOutside" @click.away="isDropdownOpen = false">
            <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortByDistance">Distance</button>
            <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" @click="sortByBoth">Price&Distance</button>
          </div>
        </div>
        <ul class="mt-2">
          <li v-for="parkingSpot in recommendedParkingSpots" :key="parkingSpot.id">
            <div class="mb-2 rounded-md border border-gray-300 p-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer bg-white" @click="showParkingPlacePreview(parkingSpot)">
              <p class="text-gray-800 font-medium">{{parkingSpot.name}}</p>
              <p class="text-sm text-gray-600">Free Spots: {{parkingSpot.free_spots}} within {{roundToTwoDecimalPlaces(parkingSpot.distance)}}Km</p>
              <p class="text-sm text-gray-600">Price: {{parkingSpot.price}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <parking-place-preview-recommend v-if="currentLocation" :parking-place="currentLocation" @close="currentLocation=null" />
  </div>
</template>
<script>

import axios from "axios";
import parkingPlacePreview from "@/components/parkingPlacePreview";
import vClickOutside from 'v-click-outside'
export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    'parkingPlacePreviewRecommend': parkingPlacePreview,
  },
  data() {
    return {
      isRecommendOpen: false,
      isDropdownOpen: false,
      currentLocation: {},
      userLocation: null,
      recommendedParkingSpots: [],
      parkingPlaces: [], // Define parkingPlaces data property
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.fetchData(); // Fetch data after getting user's location
        },
        error => {
          console.log(error);
        }
      );
    }

  },
  methods: {

    onClickOutside (event) {
      console.log('Clicked outside. Event: ', event)
      this.isDropdownOpen = false
    },

    onClickRecommend (event) {
      this.isRecommendOpen = false
    },

    async fetchData() {
      try {
        this.fetchParkingPrices(1);
        const response = await fetch(`https://smart-parking-project.herokuapp.com/api/parkingPlace`);
        const json = await response.json();
        this.parkingPlaces = json.data;
        // console.log(this.parkingPlaces);
        if (this.userLocation && this.parkingPlaces.length) {
          this.recommendedParkingSpots = await this.getRecommendedParkingSpots();
        }
      } catch (error) {
        console.error(error);
      }
    },

    async fetchParkingPrices($id) {
      try {
        const Id = $id;
        const response = await axios.get(`https://smart-parking-project.herokuapp.com/api/parking-places/${Id}/prices/sum`, {

        });
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },

    toggleRecommend(){
      this.isRecommendOpen = !this.isRecommendOpen
    },


    // getRecommendedParkingSpotsByDistance() {
    //   const parkingSpots = this.parkingPlaces;
    //   // console.log("unsorted: " + JSON.stringify(parkingSpots));
    //
    //   // filter out parking spots where free_spots is 0 or less
    //   const filteredParkingSpots = parkingSpots.filter(parkingSpot => parkingSpot.free_spots > 0);
    //
    //   const sortedParkingSpots = filteredParkingSpots.sort((a, b) => {
    //     const aDistance = this.getDistanceFromLatLonInKm(
    //       this.userLocation.lat,
    //       this.userLocation.lng,
    //       a.coordinates.lat,
    //       a.coordinates.lng
    //     );
    //     const bDistance = this.getDistanceFromLatLonInKm(
    //       this.userLocation.lat,
    //       this.userLocation.lng,
    //       b.coordinates.lat,
    //       b.coordinates.lng
    //     );
    //     // check if the distance is defined before calling toFixed()
    //     if (typeof aDistance === "number" && typeof bDistance === "number") {
    //       return aDistance - bDistance;
    //     } else {
    //       // return Infinity or -Infinity to ensure that the undefined distance goes to the end of the sorted array
    //       return aDistance ? -Infinity : Infinity;
    //     }
    //   });
    //
    //   const recommendedSpots = sortedParkingSpots
    //     .slice(0, 3)
    //     .map(parkingSpot => ({...parkingSpot, distance: parkingSpot.distance}));
    //
    //   return recommendedSpots;
    // },


    // async getRecommendedParkingSpotsByPrice() {
    //   const parkingSpots = this.parkingPlaces;
    //
    //   // filter out parking spots where free_spots is 0 or less
    //   const filteredParkingSpots = parkingSpots.filter(parkingSpot => parkingSpot.free_spots > 0);
    //
    //   // sort the parking spots by price
    //   const sortedParkingSpots = filteredParkingSpots.sort((a, b) => {
    //     const aPrice = this.fetchParkingPrices(a.id);
    //     const bPrice = this.fetchParkingPrices(b.id);
    //     return aPrice - bPrice;
    //   });
    //
    //   // fetch distances for each parking spot and store them in a map
    //   const distancesMap = new Map();
    //   for (const parkingSpot of sortedParkingSpots.slice(0, 10)) {
    //     const distance = this.getDistanceFromLatLonInKm(
    //       this.userLocation.lat,
    //       this.userLocation.lng,
    //       parkingSpot.coordinates.lat,
    //       parkingSpot.coordinates.lng
    //     );
    //     distancesMap.set(parkingSpot.id, distance);
    //   }
    //
    //   // create a new array of parking spots with distance and price properties
    //   const parkingSpotsWithDistanceAndPrice = sortedParkingSpots
    //     .slice(0, 5)
    //     .map(parkingSpot => ({
    //       ...parkingSpot,
    //       distance: distancesMap.get(parkingSpot.id),
    //       price: this.fetchParkingPrices(parkingSpot.id)
    //     }));
    //
    //   // sort the parking spots by price, then distance
    //   const recommendedSpots = parkingSpotsWithDistanceAndPrice.sort((a, b) => {
    //     if (a.price === b.price) {
    //       return a.distance - b.distance;
    //     } else {
    //       return a.price - b.price;
    //     }
    //   });
    //
    //   return recommendedSpots.slice(0, 3);
    // },
    async getRecommendedParkingSpotsByDistance() {
      const parkingSpots = this.parkingPlaces;

      // filter out parking spots where free_spots is 0 or less
      const filteredParkingSpots = parkingSpots.filter(parkingSpot => parkingSpot.free_spots > 0);

      const sortedParkingSpots = filteredParkingSpots.sort((a, b) => {
        const aDistance = this.getDistanceFromLatLonInKm(
          this.userLocation.lat,
          this.userLocation.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const bDistance = this.getDistanceFromLatLonInKm(
          this.userLocation.lat,
          this.userLocation.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        // check if the distance is defined before calling toFixed()
        if (typeof aDistance === "number" && typeof bDistance === "number") {
          return aDistance - bDistance;
        } else {
          // return Infinity or -Infinity to ensure that the undefined distance goes to the end of the sorted array
          return aDistance ? -Infinity : Infinity;
        }
      });

      // fetch prices for each parking spot and store them in a map
      const pricesMap = new Map();
      for (const parkingSpot of sortedParkingSpots.slice(0,10)) {
        const price = await this.fetchParkingPrices(parkingSpot.id);
        pricesMap.set(parkingSpot.id, price);
      }

      // create a new array of parking spots with distance and price properties
      const parkingSpotsWithDistanceAndPrice = sortedParkingSpots
        .slice(0, 5)
        .map(parkingSpot => ({
          ...parkingSpot,
          distance: this.getDistanceFromLatLonInKm(
            this.userLocation.lat,
            this.userLocation.lng,
            parkingSpot.coordinates.lat,
            parkingSpot.coordinates.lng
          ),
          price: pricesMap.get(parkingSpot.id)
        }));

      // sort the parking spots by distance
      const recommendedSpots = parkingSpotsWithDistanceAndPrice.sort((a, b) => {
        return a.distance - b.distance;
      });

      // const recommendedSpots = parkingSpotsWithDistanceAndPrice
      //   .sort((a, b) => {
      //     if (a.price === b.price) {
      //       return a.distance - b.distance;
      //     } else {
      //       return a.price - b.price;
      //     }
      //   });
      console.log("parkingSpotsWithDistanceAndPrice" + JSON.stringify(parkingSpotsWithDistanceAndPrice))

      return recommendedSpots.slice(0,3)
    },


    async getRecommendedParkingSpots() {
      const parkingSpots = this.parkingPlaces;

      // filter out parking spots where free_spots is 0 or less
      const filteredParkingSpots = parkingSpots.filter(parkingSpot => parkingSpot.free_spots > 0);

      const sortedParkingSpots = filteredParkingSpots.sort((a, b) => {
        const aDistance = this.getDistanceFromLatLonInKm(
          this.userLocation.lat,
          this.userLocation.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const bDistance = this.getDistanceFromLatLonInKm(
          this.userLocation.lat,
          this.userLocation.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        // check if the distance is defined before calling toFixed()
        if (typeof aDistance === "number" && typeof bDistance === "number") {
          return aDistance - bDistance;
        } else {
          // return Infinity or -Infinity to ensure that the undefined distance goes to the end of the sorted array
          return aDistance ? -Infinity : Infinity;
        }
      });

      // fetch prices for each parking spot and store them in a map
      const pricesMap = new Map();
      for (const parkingSpot of sortedParkingSpots.slice(0,10)) {
        const price = await this.fetchParkingPrices(parkingSpot.id);
        pricesMap.set(parkingSpot.id, price);
      }

      // create a new array of parking spots with distance and price properties
      const parkingSpotsWithDistanceAndPrice = sortedParkingSpots
        .slice(0, 5)
        .map(parkingSpot => ({
          ...parkingSpot,
          distance: this.getDistanceFromLatLonInKm(
            this.userLocation.lat,
            this.userLocation.lng,
            parkingSpot.coordinates.lat,
            parkingSpot.coordinates.lng
          ),
          price: pricesMap.get(parkingSpot.id)
        }));

      // sort the parking spots by distance
      // const recommendedSpots = parkingSpotsWithDistanceAndPrice.sort((a, b) => {
      //   return a.distance - b.distance;
      // });

      const recommendedSpots = parkingSpotsWithDistanceAndPrice
        .sort((a, b) => {
          if (a.price === b.price) {
            return a.distance - b.distance;
          } else {
            return a.price - b.price;
          }
        });
      console.log("parkingSpotsWithDistanceAndPrice" + JSON.stringify(parkingSpotsWithDistanceAndPrice))

      return recommendedSpots.slice(0,3)
    },






    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      const deg2rad = deg => deg * (Math.PI / 180);
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1); // deg2rad below
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      return d;
    },


    async sortRecommendations(sortBy) {
      if (sortBy === 'distance' && !this.recommendedParkingSpotsByDistanceLoaded) {
        this.recommendedParkingSpotsByDistanceLoaded = true;
        this.recommendedParkingSpotsByPriceLoaded = false;
        this.recommendedParkingSpotsByBothLoaded = false;
        this.recommendedParkingSpots = await this.getRecommendedParkingSpotsByDistance();
      } else if (sortBy === 'price' && !this.recommendedParkingSpotsByPriceLoaded) {
        this.recommendedParkingSpotsByDistanceLoaded = false;
        this.recommendedParkingSpotsByPriceLoaded = true;
        this.recommendedParkingSpotsByBothLoaded = false;
        this.recommendedParkingSpots = await this.getRecommendedParkingSpotsByPrice();
      } else if (sortBy === 'both' && !this.recommendedParkingSpotsByBothLoaded) {
        this.recommendedParkingSpotsByDistanceLoaded = false;
        this.recommendedParkingSpotsByPriceLoaded = false;
        this.recommendedParkingSpotsByBothLoaded = true;
        this.recommendedParkingSpots = await this.getRecommendedParkingSpots();
      }
    },

    async sortByDistance() {
      if (!this.recommendedParkingSpotsByDistanceLoaded) {
        this.recommendedParkingSpots = await this.getRecommendedParkingSpotsByDistance();
        this.recommendedParkingSpotsByDistanceLoaded = true;
      }
    },
    async sortByPrice() {
      if (!this.recommendedParkingSpotsByPriceLoaded) {
        this.recommendedParkingSpots = await this.getRecommendedParkingSpotsByPrice();
        this.recommendedParkingSpotsByPriceLoaded = true;
      }
    },
    async sortByBoth() {
      if (!this.recommendedParkingSpotsByBothLoaded) {
        this.recommendedParkingSpots = await this.getRecommendedParkingSpots();
        this.recommendedParkingSpotsByBothLoaded = true;
      }
    },




    showParkingPlacePreview(parkingSpot) {
      this.currentLocation = parkingSpot;
      this.isRecommendOpen = false;
    },

    close(){
      this.$emit('close');
    },

    roundToTwoDecimalPlaces(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },

  }
};
</script>
