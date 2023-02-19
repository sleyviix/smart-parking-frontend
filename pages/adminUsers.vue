<template>
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
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Create parking place</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      postCode: '',
      lng: '',
      lat: ''
    }
  },
  methods: {
    async createParkingPlace() {
      try {
        const response = await axios.post('http://localhost:8000/api/parkingPlace/create', {
          name: this.name,
          postCode: this.postCode,
          lng: this.lng,
          lat: this.lat
        })
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
