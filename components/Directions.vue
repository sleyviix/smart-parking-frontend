<template>
  <div v-if="parkingPlace && Object.keys(parkingPlace).length">
    <p class="text-lg" @click="getDirections">Postcode: {{parkingPlace.post}}</p>
  </div>
</template>

<script>
export default {
  props: {
    parkingPlace: {
      type: Object,
      required: false
    }
  },
  methods: {
    getDirections() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const start = `${position.coords.latitude},${position.coords.longitude}`;
          const end = `${this.parkingPlace.coordinates.lat},${this.parkingPlace.coordinates.lng}`;
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}`);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }
}
</script>

<style scoped>

</style>
