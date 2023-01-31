<!--<template>-->

<!--  <div class="absolute top-1/3 right-1/3 left-1/3" style="background: white; border-radius:10px" v-if="parkingPlace && Object.keys(parkingPlace).length">-->



<!--  <head>-->
<!--    <meta charset="UTF-8" />-->
<!--    <title>SULEMAN WEBSITE</title>-->

<!--    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" />-->
<!--    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/datepicker.min.js"></script>-->
<!--  </head>-->


<!--  <body class="font-sans text-gray-700">-->
<!--  <div>-->
<!--    <div class="mx-auto min-w-full max-w-xl">-->
<!--      <br />-->
<!--      <div class="overflow-hidden rounded-lg bg-white shadow-2xl">-->
<!--        <div>-->
<!--          <h1 class="mb-12 text-center text-4xl font-thin"><b>{{parkingPlace.name}}</b></h1>-->
<!--        </div>-->

<!--        <div class="float-left ml-5">-->
<!--          <label for=""><b>Size</b></label>-->
<!--        </div>-->

<!--        <br /><br />-->

<!--        <div class="flex grid grid-cols-3 items-center gap-4 pr-5 pl-5">-->
<!--          <div class="mb-4">-->
<!--            <img src="https://mdbootstrap.com/img/new/standard/city/047.jpg" class="h-auto max-w-full rounded-lg" alt="" />-->
<!--            <label for="">Small</label>-->
<!--          </div>-->

<!--          <div class="mb-4">-->
<!--            <img src="https://mdbootstrap.com/img/new/standard/city/047.jpg" class="h-auto max-w-full rounded-lg" alt="" />-->
<!--            <label for="">Medium</label>-->
<!--          </div>-->
<!--          <div class="mb-4">-->
<!--            <img src="https://mdbootstrap.com/img/new/standard/city/047.jpg" class="h-auto max-w-full rounded-lg" alt="" />-->
<!--            <label for="">Large</label>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="p-8">-->
<!--          <div class="-mx-3 mb-6 flex flex-wrap">-->
<!--            <div class="mb-6 w-full px-3 md:mb-0 md:w-1/2">-->
<!--              <div class="float-left">-->
<!--                <label for=""><b>Parking spot options</b></label>-->
<!--              </div>-->
<!--              <br />-->
<!--              <div>-->
<!--                <input checked id="checked-checkbox" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600" />-->
<!--                <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Disabled</label>-->
<!--              </div>-->
<!--              <div>-->
<!--                <input checked id="checked-checkbox" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600" />-->
<!--                <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Electric</label>-->
<!--              </div>-->
<!--              <div>-->
<!--                <input checked id="checked-checkbox" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600" />-->
<!--                <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Kids Slot</label>-->
<!--              </div>-->
<!--              <div>-->
<!--                <input checked id="checked-checkbox" type="checkbox" value="" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600" />-->
<!--                <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Women</label>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="w-full px-3 md:w-1/2">-->
<!--              <label for=""><b>Start</b></label>-->
<!--              <div class="relative max-w-sm">-->
<!--                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">-->
<!--                  <svg aria-hidden="true" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>-->
<!--                </div>-->
<!--                <input datepicker type="text" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Select date" />-->
<!--              </div>-->
<!--              <br />-->
<!--              <label for=""><b>End</b></label>-->
<!--              <div class="relative max-w-sm">-->
<!--                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">-->
<!--                  <svg aria-hidden="true" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>-->
<!--                </div>-->
<!--                <input datepicker type="text" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Select date" />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="bg-white-100 flow-root border-t border-gray-300 p-8 text-sm">-->
<!--          <label class="float-left ml-2" for="">Total: Â£</label>-->
<!--          <button class="float-right ml-2 rounded bg-blue-400 px-2 py-1 text-sm font-bold text-white hover:bg-blue-600" type="submit">Checkout</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  </body>-->
<!--  </div>-->

<!--</template>-->

<!--<script>-->

<!--export default {-->

<!--  data(){-->
<!--    return{-->
<!--      attributes : [],-->
<!--      sizes: [],-->
<!--      filters: {-->
<!--        size: '',-->
<!--        start: '',-->
<!--        end: '',-->
<!--        attributes: []-->
<!--      }-->
<!--    }-->
<!--  },-->

<!--  props:{-->
<!--    parkingPlace:{-->
<!--      type: Object,-->
<!--      require: false-->
<!--    }-->

<!--  },-->

<!--  watch: {-->

<!--    parkingPlace: function (newQuestion, oldQuestion){-->
<!--      if(typeof newQuestion === 'object' && newQuestion !== null) {-->
<!--        this.fetchDetails()-->
<!--      }else{-->
<!--        this.attributes = []-->
<!--        this.sizes = []-->
<!--        this.filters = {-->
<!--          size: '',-->
<!--          start: '',-->
<!--          end: '',-->
<!--          attributes: []-->
<!--        }-->
<!--      }-->

<!--    }-->
<!--  },-->

<!--  methods:{-->
<!--    close(){-->
<!--      this.$emit('close')-->
<!--    },-->
<!--    async fetchDetails(){-->
<!--      const {data} = await this.$axios.get(`http://localhost:8000/api/parkingPlace/${this.parkingPlace.id}`)-->

<!--      this.attributes = data.data.attributes-->
<!--      this.sizes = data.data.sizes-->



<!--    },-->

<!--    filterForParkingSpots(){-->
<!--      console.log('url', this.buildUrl())-->

<!--    },-->

<!--    buildUrl() {-->
<!--      const searchParams = new URLSearchParams();-->
<!--      const params = {size: "large", attributes: ['electric', 'for_women']};-->

<!--      for (const [key, value] of Object.entries(this.filters)){-->
<!--        if(value instanceof Array){-->
<!--          value.forEach((entry) => {-->
<!--            searchParams.append(`${key}[]`, entry)-->
<!--          });-->
<!--        } else {-->
<!--          searchParams.append(key, value)-->
<!--        }-->
<!--      }-->
<!--      return searchParams.toString()-->
<!--    }-->
<!--  }-->
<!--}-->

<!--</script>-->

