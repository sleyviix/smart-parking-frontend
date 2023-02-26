<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Parking Spots Near You</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">An error occurred: {{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(spot, index) in parkingSpots" :key="index" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-bold">{{ spot.name }}</h2>
          <p class="text-gray-600">{{ spot.address }}</p>
          <p class="mt-4"><strong>Price:</strong> {{ spot.price }}</p>
          <p><strong>Available Spots:</strong> {{ spot.available_spots }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      error: null,
      parkingSpots: []
    }
  },
  async created() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const options = {
        method: 'GET',
        url: 'https://live-parking.p.rapidapi.com/parking',
        params: {lng: longitude, lat: latitude, size: '5', distance: '5'},
        headers: {
          'X-RapidAPI-Key': '9db6512b60msh691bccda0f2660cp102c3bjsn9d7afffd93cc',
          'X-RapidAPI-Host': 'live-parking.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
      this.parkingSpots = response.data;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
</script>
