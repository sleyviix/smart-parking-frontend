<template>
  <div>

    <div class="absolute top-2 right-4">
      <div v-if="$auth.loggedIn" class="flex space-x-2 mt-2">
        <nuxt-link to="/">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </nuxt-link>
        <nuxt-link class="btn-main" to="/account">
          My Account
        </nuxt-link>
        <button @click="logUserOut" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>


    <div class="container mx-auto py-10">
      <h3 class="text-3xl font-medium text-gray-700 absolute top-2 left-4">My Reservations</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="(reservation, index) in reservations" :key="reservation.id" class="bg-white shadow-md rounded-md p-4">
          <div class="font-bold mb-2">{{ reservation.parking_spot_id }}</div>
          <div class="text-gray-600 mb-4">{{ formatDate(reservation.start) }} - {{ formatDate(reservation.end) }}</div>
          <button @click="deleteReservation(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      reservations: []
    }
  },
  methods: {
    async showReservations() {
      try {
        const token = this.$auth.strategy.token.get()
        const response = await fetch('http://localhost:8000/api/reservations', {
          headers: {
            'Authorization': `${token}`
          }
        })
        const data = await response.json()
        this.reservations = data.data // extract reservations array from data property
      } catch (error) {
        console.error(error)
      }
    },
    async deleteReservation(index) {
      try {
        const token = this.$auth.strategy.token.get()
        const reservation = this.reservations[index]
        const response = await fetch(`http://localhost:8000/api/reservations/${reservation.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`
          }
        })
        if (response.ok) {
          this.reservations.splice(index, 1)
        } else {
          console.error(`Failed to delete reservation with ID ${reservation.id}`)
        }
      } catch (error) {
        console.error(error)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    },

    async logUserOut() {
      localStorage.clear()
      sessionStorage.clear()
      localStorage.removeItem("auth._token.jwt")
      await this.$auth.logout();
      await this.$router.push("/login");
    }
  },
  mounted() {
    this.showReservations()
  }
}
</script>
