<template>
  <section class="h-screen">
    <div class="h-full px-6 text-gray-800">
      <div class="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between xl:justify-center">
        <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
          <img src="/20945486.jpg" class="w-full" alt="Sample image" />
        </div>
        <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:ml-20 xl:w-5/12">
          <form method="POST" @submit.prevent="loginPayload">
            <h1 class="font-medium leading-tight text-7xl mt-0 mb-2 text-blue-600 text-center">Smart-parking</h1>
            <p class="mx-4 mb-0 text-center font-semibold">Sign In Below</p>
            <div class="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300"></div>

            <!-- Display error message if login fails -->
            <div v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</div>

            <!-- Email input -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input v-model="email" id="email" name="email" type="email" autocomplete="email" required
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input v-model="password" id="password" name="password" type="password"
                       autocomplete="current-password" required
                       class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <!-- Submit button and link to registration page -->
            <div class="text-center lg:text-left">
              <button type="submit" class="inline-block rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">Login</button>

              <nuxt-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 ml-4">Create an account</nuxt-link>
              <nuxt-link to="/resetpassword" class="font-medium text-indigo-600 hover:text-indigo-500 ml-4">Reset Password</nuxt-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import Cookies from 'js-cookie';

export default {
  middleware: 'guest',
  data() {
    return {
      'email': '',
      'password': '',
      error: null,
    }
  },
  methods: {
    // async userLogin(payload) {
    //   try {
    //     const response = await this.$auth.loginWith('jwt', {
    //       data: {
    //         email: payload.email,
    //         password: payload.password
    //       }
    //     });
    //
    //     if (response.data.is_admin === 1) {
    //       await this.$router.push('/dashboard')
    //     } else {
    //       await this.$router.push('/')
    //     }
    //
    //
    //     setTimeout('history.go(0);',1000);
    //   } catch (error){
    //     if (error.response && error.response.status === 401) {
    //       this.error = 'Invalid email or password';
    //     } else {
    //       console.error(error);
    //     }
    //   }
    // },

    // async userLogin(payload) {
    //   try {
    //     const response = await this.$auth.loginWith('jwt', {
    //       data: {
    //         email: payload.email,
    //         password: payload.password
    //       }
    //     });
    //
    //     // Store user data in the authenticated user's state
    //     const userData = {
    //       token: response.data.access_token,
    //       isAdmin: response.data.is_admin
    //     };
    //     console.log('Is admin:', userData.isAdmin);
    //     this.$auth.setUser(userData);
    //
    //     // Redirect the user based on their role
    //     if (userData.isAdmin) {
    //       await this.$router.push('/dashboard');
    //     } else {
    //       await this.$router.push('/');
    //     }
    //
    //     // setTimeout('history.go(0);', 1000);
    //   } catch (error) {
    //     if (error.response && error.response.status === 401) {
    //       this.error = 'Invalid email or password';
    //     } else {
    //       console.error(error);
    //     }
    //   }
    // },

    async userLogin(payload) {
      try {
        const response = await this.$auth.loginWith('jwt', {
          data: {
            email: payload.email,
            password: payload.password
          }
        });

        // Store user data in a cookie
        const userData = {
          token: response.data.access_token,
          isAdmin: response.data.is_admin
        };
        console.log('Is admin:', userData.isAdmin);
        Cookies.set('userData', JSON.stringify(userData));

        // Redirect the user based on their role
        if (userData.isAdmin) {
          await this.$router.push('/dashboard');
        } else {
          await this.$router.push('/');
        }

        // setTimeout('history.go(0);', 1000);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.error = 'Invalid email or password';
        } else {
          console.error(error);
        }
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

<style>
.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
