<template>
  <div class="min-h-screen bg-white flex">
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form method="POST" class="space-y-6" @submit.prevent="registerPayload">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div class="mt-1">
                  <input v-model="name" id="name" name="name" type="text" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input v-model="email" id="email" name="email" type="email" autocomplete="email" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input v-model="password" id="password" name="password" type="password"
                         autocomplete="current-password" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                  Password confirmation
                </label>
                <div class="mt-1">
                  <input v-model="password_confirmation" id="password_confirmation" name="password_confirmation" type="password"
                         autocomplete="current-password" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm">
                  <nuxt-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                    Already have an account ?
                  </nuxt-link>
                </div>
              </div>

              <div>
                <button onclick="" type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover"
           src="/20945486.jpg"
           alt="">
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'guest',

  data() {
    return {
      'name': '',
      'email': '',
      'password': '',
      'password_confirmation': '',
    }
  },
  methods: {

    loginPayload() {
      this.userLogin({
        'email': this.email,
        'password': this.password,
      })
    },

    async userLogin(payload) {
      try {
        await this.$auth.loginWith('jwt', {
          data: {
            email: payload.email,
            password: payload.password
          }
        })
        setTimeout('history.go(0);',3000);
      } catch (err){
        console.log(err)
      }
    },

    async register(payload) {
      await this.$axios.post(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/auth/register`, payload)
    },

    async registerPayload(payload) {
      try {
        await this.register({

          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation

        })


        await this.userLogin({
          'email': this.email,
          'password': this.password,
        })

      } catch (err){
        console.log(err)
      }
    },
  }
}
</script>



