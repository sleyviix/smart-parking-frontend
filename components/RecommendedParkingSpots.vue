<!--<template>-->
<!--  <div>-->
<!--    <div class="bg-white rounded-md p-4 w-80 absolute top-20 left-2 z-10">-->
<!--      <h2 class="text-lg rounded-md font-bold mb-2">Recommended Parking Spots</h2>-->
<!--      <ul>-->
<!--        <li v-for="parkingSpot in recommendedParkingSpots" :key="parkingSpot.id">-->
<!--          <div class="mb-1 rounded-md border border-gray-300 p-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer" @click="showParkingPlacePreview(parkingSpot)">-->
<!--            {{parkingSpot.name}} Free Spots: {{parkingSpot.free_spots}} within {{roundToTwoDecimalPlaces(parkingSpot.distance)}}Km and {{parkingSpot.price}}-->
<!--          </div>-->
<!--        </li>-->
<!--      </ul>-->
<!--    </div>-->
<!--    <parking-place-preview v-if="currentLocation" :parking-place="currentLocation" @close="currentLocation=null" />-->
<!--  </div>-->
<!--</template>-->

<template>
  <div>
    <div class="bg-white rounded-md p-4 w-80 absolute top-20 left-2 z-10">
      <h2 class="text-lg rounded-md font-bold mb-2">Recommended Parking Spots</h2>
      <div class="flex justify-between mb-2">
        <button class="rounded-md bg-blue-500 text-white px-2 py-1 mr-2" @click="sortByDistance">Distance</button>
<!--        <button class="rounded-md bg-blue-500 text-white px-2 py-1 mr-2" @click="sortByPrice">Price</button>-->
        <button class="rounded-md bg-blue-500 text-white px-2 py-1" @click="sortByBoth">Price&Distance</button>
      </div>
      <ul>
        <li v-for="parkingSpot in recommendedParkingSpots" :key="parkingSpot.id">
          <div class="mb-1 rounded-md border border-gray-300 p-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer" @click="showParkingPlacePreview(parkingSpot)">
            {{parkingSpot.name}} Free Spots: {{parkingSpot.free_spots}} within {{roundToTwoDecimalPlaces(parkingSpot.distance)}}Km and {{parkingSpot.price}}
          </div>
        </li>
      </ul>
    </div>
    <parking-place-preview-recommend v-if="currentLocation" :parking-place="currentLocation" @close="currentLocation=null" />
  </div>
</template>


<script>

import axios from "axios";
import parkingPlacePreview from "@/components/parkingPlacePreview";

export default {
  components: {
    'parkingPlacePreviewRecommend': parkingPlacePreview,
  },
  data() {
    return {
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
    async fetchData() {
      try {
        this.fetchParkingPrices(1);
        const response = await fetch(`${process.env.APICALL}/api/parkingPlace`);
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
        const response = await axios.get(`${process.env.APICALL}/api/parking-places/${Id}/prices/sum`, {

        });
        return response.data
      } catch (error) {
        console.error(error);
      }
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
