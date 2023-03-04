<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">My Account</h3>

    <div>
      <nuxt-link to="/reservations" class="absolute top-0 right-10 mt-4">
        <div class="-mx-6 flex flex-wrap">
          <button class="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">My Reservations</button>
        </div>
      </nuxt-link>
    </div>

    <div class="mt-8"></div>

    <div class="mt-8 flex flex-col">
      <div class="-my-2 overflow-x-auto py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden border-b border-gray-200 align-middle shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
            <tr>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Name</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Title</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Status</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Role</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3"></th>
            </tr>
            </thead>

            <tbody class="bg-white">
            <tr>
              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0"></div>

                  <div class="ml-4">
                    <div class="text-sm font-medium leading-5 text-gray-900"></div>
                    <div class="text-sm leading-5 text-gray-500"></div>
                  </div>
                </div>
              </td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4">
                <div class="text-sm leading-5 text-gray-900"></div>
                <div class="text-sm leading-5 text-gray-500"></div>
              </td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4">
                <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"></span>
              </td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4 text-sm leading-5 text-gray-500"></td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4 text-right text-sm font-medium leading-5">
                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                <a v-if="this.editMode" href="#" class="text-indigo-600 hover:text-indigo-900">Close</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700 absolute top-2 left-4">My Account</h3>
    <div class="absolute top-2 left-4">
    </div>
    <div class="absolute top-2 right-4">
      <div v-if="$auth.loggedIn" class="flex space-x-2 mt-2">
        <nuxt-link to="/">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </nuxt-link>
        <nuxt-link to="/reservations">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            My Reservations
          </button>
        </nuxt-link>
        <button @click="logUserOut" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>



    <div class="mt-8"></div>

    <div class="mt-8 flex flex-col">
      <div class="-my-2 overflow-x-auto py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden border-b border-gray-200 align-middle shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
            <tr>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Name</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500">Email</th>
              <th class="border-b border-gray-200 bg-gray-50 px-6 py-3"></th>
            </tr>
            </thead>

            <tbody class="bg-white">
            <tr>
              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4">
                <div class="text-sm font-medium leading-5 text-gray-900">{{ this.users.name }}</div>
              </td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4">
                <div class="text-sm leading-5 text-gray-900">{{ this.users.email }}</div>
              </td>

              <td class="whitespace-nowrap border-b border-gray-200 px-6 py-4 text-right text-sm font-medium leading-5">
                <a href="#" class="text-indigo-600 hover:text-indigo-900" @click.prevent="editMode = true">Edit</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="editMode" class="mt-8">
      <form class="space-y-6" @submit.prevent="updateUser">

        <div>
          <label for="name" class="block text-sm font-medium leading-5 text-gray-700">Name</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <input id="name" v-model="form.name" class="form-input block w-full sm:text-sm sm:leading-5" />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-5 text-gray-700">Email address</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <input id="email" type="email" v-model="form.email" class="form-input block w-full sm:text-sm sm:leading-5" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-5 text-gray-700">Password</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <input id="password" v-model="form.password" name="password" type="password" :class="{'border-red-500': errors.password}" @input="clearErrors('password')" @keydown.enter="updateUser" class="form-input block w-full sm:text-sm sm:leading-5" />
            <span v-if="errors.password" class="error-message">{{ errors.password[0] }}</span>
          </div>
        </div>
        <div class="mt-6">
          <label for="password_confirmation" class="block text-sm font-medium leading-5 text-gray-700">Confirm Password</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <input id="password_confirmation" v-model="form.password_confirmation" name="password_confirmation" type="password" :class="{'border-red-500': errors.password_confirmation}" @input="clearErrors('password_confirmation')" @keydown.enter="updateUser" class="form-input block w-full sm:text-sm sm:leading-5" />
            <span v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation[0] }}</span>
          </div>
        </div>

        <div class="mt-6">
          <span class="block w-full rounded-md shadow-sm">
            <button type="button" @click="updateUser" :disabled="submitting" class="focus:shadow-outline-blue flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-500 focus:border-blue-700 focus:outline-none active:bg-blue-700">Update</button>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);
export default {
  data() {
    return {
      users: {
        name: '',
        email: ''
      },
      editMode: false,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      errors: {},
      submitting: false,
    };
  },
  methods: {
    async showReservations() {
      try {
        const token = this.$auth.strategy.token.get()
        const response = await fetch('http://localhost:8000/api/Users', {
          headers: {
            'Authorization': `${token}`
          }
        })
        const data = await response.json()
        this.users = data.data // extract reservations array from data property
      } catch (error) {
        console.error(error)
      }
    },

    async editUser(user) {
      this.editMode = true
      this.form.name = this.users.name // use the user argument instead of the undefined variable this.user
      this.form.email = this.users.email // use the user argument instead of the undefined variable this.user
    },

    async updateUser() {
      this.submitting = true
      const token = this.$auth.strategy.token.get()
      this.$axios.$patch(`${process.env.APICALL}/api/user`, this.form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          this.submitting = false
          this.$toast.success('User updated successfully')
          this.editMode = false
        })
        .catch(error => {
          this.submitting = false
          if (error.response && error.response.status === 422) {
            this.errors = error.response.data.errors
          }
          console.log(error)
        })
      setTimeout('history.go(0);',1000);
    },
    clearErrors(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
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
