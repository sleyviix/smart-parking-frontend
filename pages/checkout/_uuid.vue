<template>

  <div>


    <div v-if="reservation">
      <div v-if="reservation.paid_at">

        <div class="bg-gray-100 h-screen">
          <div class="bg-white p-6  md:mx-auto">
            <svg viewBox="0 0 24 24" class="text-green-600 w-16 h-16 mx-auto my-6">
              <path fill="currentColor"
                    d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
              </path>
            </svg>
            <div class="text-center">
              <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
              <p>{{this.uuid}}</p>
              <p class="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
              <p> Have a great day!  </p>
              <div class="py-10 text-center">
                <a href="localhost:3000" class="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                  GO BACK
                </a>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div v-else>

        <div class="bg-gray-100 h-screen">
          <div class="bg-white p-6  md:mx-auto">
            <svg viewBox="0 0 24 24" class="text-red-600 w-16 h-16 mx-auto my-6">
              <path fill="currentColor"
                    d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.">
              </path>
            </svg>
            <div class="text-center">
              <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Unsucessful</h3>
              <p class="text-gray-600 my-2"></p>
              <p>Please Try Again Later</p>
              <div class="py-10 text-center">
                <a href="#" class="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                  GO BACK
                </a>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      reservation: null
    }
  },
  async asyncData({params}) {
    const uuid = params.uuid
    return {uuid}
  },
  async mounted() {
    await this.checkReservationStatus()
  },
  methods: {
    async checkReservationStatus() {
      const {data} = await this.$axios.get(`http://localhost:8000/api/reservations/${this.uuid}`)

      this.reservation = data.data
    }
  }
}
</script>
