<!--<template>-->
<!--  <div class="min-h-screen bg-white flex">-->
<!--    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">-->
<!--      <div class="mx-auto w-full max-w-sm lg:w-96">-->
<!--        <div>-->
<!--          <img class="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">-->
<!--          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">-->
<!--            Sign in to your account-->
<!--          </h2>-->

<!--          <p class="pt-2">Or <nuxt-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Create an account</nuxt-link></p>-->
<!--        </div>-->

<!--        <div class="mt-8">-->
<!--          <div class="mt-6">-->
<!--            <form method="POST" class="space-y-6" @submit.prevent="loginPayload">-->
<!--              <div>-->
<!--                <label for="email" class="block text-sm font-medium text-gray-700">-->
<!--                  Email address-->
<!--                </label>-->
<!--                <div class="mt-1">-->
<!--                  <input v-model="email" id="email" name="email" type="email" autocomplete="email" required-->
<!--                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="space-y-1">-->
<!--                <label for="password" class="block text-sm font-medium text-gray-700">-->
<!--                  Password-->
<!--                </label>-->
<!--                <div class="mt-1">-->
<!--                  <input v-model="password" id="password" name="password" type="password"-->
<!--                         autocomplete="current-password" required-->
<!--                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="flex items-center justify-between">-->
<!--                <div class="text-sm">-->
<!--                  <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">-->
<!--                    Forgot your password?-->
<!--                  </a>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div>-->
<!--                <button type="submit"-->
<!--                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">-->
<!--                  Sign in-->
<!--                </button>-->
<!--              </div>-->
<!--            </form>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="hidden lg:block relative w-0 flex-1">-->
<!--      <img class="absolute inset-0 h-full w-full object-cover"-->
<!--           src="/20945486.jpg"-->
<!--           alt="">-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<template>
  <section class="h-screen">
    <div class="h-full px-6 text-gray-800">
      <div class="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between xl:justify-center">
        <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
          <img src="/20945486.jpg" class="w-full" alt="Sample image" />
        </div>
        <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:ml-20 xl:w-5/12">
          <form method="POST" @submit.prevent="loginPayload">
            <h1 class="font-medium leading-tight text-7xl mt-0 mb-2 text-blue-600 text-center" >Smart-parking</h1>
            <p class="mx-4 mb-0 text-center font-semibold">Sign In Below</p>
            <div class="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300"></div>

            <!-- Email input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input v-model="email" id="email" name="email" type="email" autocomplete="email" required
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <!-- Password input -->
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

            <div class="text-center lg:text-left">
              <button onclick="setTimeout('history.go(0);',1000);" type="submit" class="inline-block rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">Login</button>

              <nuxt-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Create an account</nuxt-link>

            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>


export default {
  middleware: 'guest',
  data() {
    return {
      'email': '',
      'password': ''
    }
  },
  methods: {
    async userLogin(payload) {
      try {
        await this.$auth.loginWith('jwt', {
          data: {
            email: payload.email,
            password: payload.password
          }
        })
      } catch (err){
        console.log(err)
      }
    },

    loginPayload() {
      this.userLogin({
        'email': this.email,
        'password': this.password,
      })
    }
  }
}
</script>
