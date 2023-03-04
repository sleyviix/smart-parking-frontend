<template>
  <div class="absolute rounded-md lg:top-1/4 left-1/2 transform -translate-x-1/2  p-4 w-full h-full lg:h-auto max-w-7xl bg-white py-8" style="max-height: 90vh; overflow-y: scroll;"
    v-if="parkingPlace && Object.keys(parkingPlace).length">
    <div class="flex pb-6 pt-10 lg:pt-0 items-center">
      <div class="w-5/6 text-4xl tracking-tight font-thin text-black-700">{{ parkingPlace.name }}</div>
      <div class="w-1/6 text-right cursor-pointer hover:text-blue-600 text-4xl text-gray-500" @click="close()">x</div>
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="getDirections">
      Directions
    </button>

    <div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
        <div>
          <label for="start" class="block text-sm font-medium text-gray-700">Start</label>
          <div class="mt-1">
            <date-picker id="start" v-model="filters.start" :show-second="false" :minute-step="15" type="datetime"
                       class="w-full"></date-picker>

          </div>
        </div>

        <div>
          <label for="end" class="block text-sm font-medium text-gray-700">End</label>
          <div class="mt-1">
            <date-picker id="end" v-model="filters.end" :show-second="false" :minute-step="15" type="datetime"
                       class="w-full"></date-picker>
          </div>
        </div>

        <div>
          <p>Parking Space Options</p>
          <div class="relative flex items-start mt-2" v-for="(price, attribute) in attributes" :key="attribute">
            <div class="flex items-center h-5">
              <input :id="attribute" :name="attribute" :value="attribute" type="checkbox"
                     class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                     v-model="filters.attributes">
            </div>

            <div class="ml-3 text-sm flex justify-between flex-grow">
              <label :for="attribute" class="font-medium text-gray-700">{{fetchAttribute(attribute)}}</label>
              <p class="text-gray-500">£{{price}} an hour</p>
            </div>
          </div>
          </div>
          </div>
        </div>
    <div>
      <p>Select Size</p>

      <div class="flex justify-between">
        <div v-for="(size, index) in sizes" v-if="index < 3" :key="index" class="p-6 bg-white-300 cursor-pointer">
          <input type="checkbox" id="react-option" value="" class="hidden peer" required="">
          <label for="react-option" :class="{'bg-gray-300' : filters.size == size.name}" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block" @click="filters.size = size.name" >
              <p class="text-lg font-bold">{{ size.name }}</p>
              <div class="w-full text-lg font-semibold">Base Rate £{{size.price}}</div>
              <img id="cars" :src="fetchImage(size.name)">
            </div>
          </label>
        </div>
      </div>
    </div>

      <template v-if="filters.start && filters.end && filters.size.length">
        <div class="mt-8 grid">
          <div v-if="spots.length" class="grid grid-cols-2 text-xl font-bold text-green-600">
            <div class="flex items-center">Available Spots: {{ spots.length }}</div>
            <template v-if="selectedSpot">
              <div class="mr-4 grid grid-cols-2 text-gray-500">
                <span v-html="changeSelection ? 'close' : 'Change spot'" v-if="spots.length > 0 && spots.length > 1" class="cursor-pointer font-bold text-gray-500" @click="changeSelection = !changeSelection"></span>
              </div>
              <div>
                <span class="text bold text-black">Your allocated spot is: </span>
                Floor: <span class="text-lg font-medium text-gray-900">{{ selectedSpot.floor }}</span> Number: <span class="text-lg font-medium text-gray-900">{{ selectedSpot.number }}</span>
<!--                <span class="mr-2" v-for="attribute in selectedSpot.attributes">{{attribute}}</span>-->
              </div>
            </template>
          </div>
          <div class="text-center" v-else>
            <span class="text-xl text-red-500">No available spots for those filters</span>

          </div>
          <template v-if="changeSelection">
            <div class="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
              <div v-for="parkingSpot in sortAvailableSpots" class="cursor-pointer rounded-lg p-3 text-gray-500 shadow-md" @click="selectSpot(parkingSpot)" v-if="selectedSpot.id !== parkingSpot.id">
                <div class="grid grid-cols-2">
                  <div>
                    <p>Floor: <span class="text-lg text-gray-600">{{ parkingSpot.floor }}</span></p>
                    <p>Spot No. : <span class="text-lg text-gray-600">{{ parkingSpot.number }}</span></p>
                  </div>
                  <template v-if="parkingSpot.attributes.length">
                    <p class="flex flex-col space-y-2">
                      <span class="inline-block items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-800" v-for="attribute in parkingSpot.attributes">{{fetchAttribute(attribute)}}</span>
                    </p>
                  </template>
                  <template v-else>
                    <span class="inline text-xl-center bg-gray-100 px-0.5 py-0.5 text-sm text-gray-800">Cheaper</span>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>

      <div class="mt-6 grid grid-cols-2" v-if="selectedSpot">
        <div class="text-center">
          <p v-if="price" class="text-4xl tracking-tight font-extrabold text-gray-700">{{ (price).toLocaleString("en-US", {style:"currency", currency:"GBP"}) }}</p>
        </div>
        <div class="text-center">
          <button type="button"
                  @click="issueCheckoutUrl()"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
            Continue to payment
          </button>
        </div>
      </div>
    </div>


</template>

<script>

import DatePicker from 'vue2-datepicker';



export default {
  components: {DatePicker},
  data(){
    return{
      selectedSpot: null,
      price: 0,
      changeSelection: false,
      reservationId: null,
      attributes : [],
      sizes: [],
      filters: {
        start: '',
        end: '',
        size: '',
        attributes: []
      },
      spots: [],
    }
  },

  props:{
    parkingPlace:{
      type: Object,
      require: false
    }

  },

  watch: {

    parkingPlace: function (newQuestion, oldQuestion){
      if(typeof newQuestion === 'object' && newQuestion !== null) {
        this.fetchDetails()
      }else{
        // this.selectedSpot = null,
        // this.price = 0,
        this.attributes = []
        this.sizes = []
        this.filters = {
          start: '',
          end: '',
          size: '',
          attributes: []
        }
      }

    },
    // parkingPlace: function (newQuestion, oldQuestion) {
    //   if (typeof newQuestion === 'object' && newQuestion !== null) {
    //     this.fetchDetails();
    //   } else {
    //     // this.selectedSpot = null;
    //     this.price = 0;
    //     this.attributes = [];
    //     this.sizes = [];
    //     this.filters = {
    //       start: '',
    //       end: '',
    //       size: '',
    //       attributes: []
    //     };
    //   }
    // },

    async selectedSpot(newQuestion, oldQuestion) {
      if (newQuestion && Object.keys(newQuestion).length) {
        // create reservation
        const {data} = await this.$axios.post(`https://smart-parking-project.herokuapp.com/api/reservations`, {
          'start': this.filters.start.toISOString(),
          'end': this.filters.end.toISOString(),
          'parking_spot_id': newQuestion.id,
        })
        this.reservationId = data.data.id
        await this.getReservationPrice(data.data.id)
      }
    },

    filters: {
      handler(val){
        if (!this.canBuildURLYet){
          return
        }
          this.filterForParkingSpots()

      },
      deep:true
    },
  },

  computed: {

    showNumberOfSpots() {
      return this.filters.start && this.filters.end && this.filters.size.length;
    },

    canBuildURLYet() {
      return this.showNumberOfSpots
    },

    sortAvailableSpots() {
      return this.spots.sort((a, b) => {
        const floorA = parseFloat(a.floor);
        const floorB = parseFloat(b.floor);
        return floorA - floorB || parseFloat(a.number) - parseFloat(b.number);
      });
    }
  },

  methods:{
    close(){
      this.$emit('close');
      this.price = 0;

    },

    async fetchDetails(){
      const {data} = await this.$axios.get(`https://smart-parking-project.herokuapp.com/api/parkingPlace/${this.parkingPlace.id}`)
      this.attributes = data.data.attributes
      this.sizes = data.data.sizes
    },

    async filterForParkingSpots(){
      this.selectSpot(null)
      const {data} = await this.$axios.get(`https://smart-parking-project.herokuapp.com/api/parkingPlace/${this.parkingPlace.id}/spots?${this.buildMyUrl()}`)
      this.spots = data.data
      if (this.spots.length) {
        this.selectedSpot = this.spots[Math.floor(Math.random() * this.spots.length)]
      }
    },

    async getReservationPrice(reservationId) {
      const {data} = await this.$axios.post(`https://smart-parking-project.herokuapp.com/api/calculate-payment`, {
        reservation_id : reservationId
      })
      this.price = data
    },
    selectSpot(spot) {
      this.selectedSpot = spot
      this.price = 0
      this.changeSelection = false
    },
    // selectRandomSpot() {
    //   this.selectedSpot = this.spots[Math.floor(Math.random() * this.spots.length)];
    // },
    async issueCheckoutUrl() {
      const {data} = await this.$axios.get(`https://smart-parking-project.herokuapp.com/api/checkout/${this.reservationId}`)
      window.location.replace(data.url);
      // console.log('checkout url', data)
    },

    buildMyUrl() {
      const searchParams = new URLSearchParams();
      Object.entries(this.cleanPassingObject(this.filters)).forEach(([key, value]) => {
        switch (key) {
          case 'attributes':
            value.forEach(entry => searchParams.append(`${key}[]`, entry));
            break;
          case 'start':
          case 'end':
            searchParams.append(key, value.toISOString());
            break;
          case 'size':
            searchParams.append(key, value);
            break;
        }
      });
      return searchParams.toString();
    },

    fetchImage(image){

      var path= "";

      if(image == 'small'){
        path = "small.png"
      }
      else if (image == 'medium'){
        path = "medium.png"
      }
      else{
        path = "large.png"
      }

      return path;
    },

    cleanPassingObject(obj){
      //removes empty attributes
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v && (v.length || typeof v === 'object'))
      );
    },

    fetchAttribute(val){

      var attribute = "";

      if(val == 'electric'){
        attribute = "EV Charging Spot"
      }
      else if (val == 'for_women'){
        attribute = "Safe Spot"
      }
      else if (val == 'handicapped'){
        attribute = "Disabled Spot"
      }
      else if (val == 'with_kids'){
        attribute = "Parent & Child Spot"
      }
      return attribute;
    },

    // buildGoogleMapsLink(latitude, longitude) {
    //   const baseUrl = "https://www.google.com/maps/dir/?api=1";
    //   return `${baseUrl}&destination=${latitude},${longitude}`;
    // },

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
