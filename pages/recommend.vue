<template>
  <div>
    <h2>Recommended Parking Spots</h2>
    <ul>
      <li v-for="parkingSpot in recommendedParkingSpots" :key="parkingSpot.id">
        <div>{{parkingSpot.name }}</div>
<!--        <div>Distance: {{ parkingSpot.distance.toFixed(3) }} km</div>-->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        const response = await fetch('http://localhost:8000/api/parkingPlace');
        const json = await response.json();
        this.parkingPlaces = json.data;
        // console.log(this.parkingPlaces);
        if (this.userLocation && this.parkingPlaces.length) {
          this.recommendedParkingSpots = this.getRecommendedParkingSpots();
        }
      } catch (error) {
        console.error(error);
      }
    },

    getRecommendedParkingSpots() {
      const parkingSpots = this.parkingPlaces;
      console.log("unsorted: " + JSON.stringify(parkingSpots));
      const sortedParkingSpots = parkingSpots.sort((a, b) => {
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


        // console.log("Distances" + (aDistance - bDistance))
        // return (aDistance - bDistance)

        // check if the distance is defined before calling toFixed()
        if (typeof aDistance === "number" && typeof bDistance === "number") {
          return aDistance - bDistance;
          console.log("Here")
        } else {
          // return Infinity or -Infinity to ensure that the undefined distance goes to the end of the sorted array
          return aDistance ? -Infinity : Infinity;
          console.log("No, Here")
        }
      });
      console.log("SortedParkingSpots: " + JSON.stringify(sortedParkingSpots));

      // filter out parking spots where distance is undefined
      // const recommendedSpots = sortedParkingSpots.filter(parkingSpot => typeof parkingSpot.distance === "number")
      //   .slice(0, 3)
      //   .map(parkingSpot => ({...parkingSpot, distance: parkingSpot.distance.toFixed(10)}));
      // console.log("RecommendedSpots: " + JSON.stringify(recommendedSpots));
      // return recommendedSpots;
      return sortedParkingSpots.slice(0,3)
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
    }
  }
};
</script>
