<template>
  <div class="flex items-center justify-center h-screen bg-gray-200">
    <form class="bg-white p-8 rounded shadow-md" @submit.prevent="resetPassword">
      <h2 class="text-2xl font-bold mb-6">Reset Password</h2>
      <div class="mb-6">
        <label for="email" class="block text-gray-700 font-bold mb-2">Email Address:</label>
        <input type="email" name="email" v-model="email" required class="w-full p-2 border border-gray-400 rounded">
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Reset Password</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    }
  },
  methods: {
    async resetPassword() {
      // Send a request to the Laravel API to initiate the password reset process
      const response = await this.$axios.post(`https://smart-parking-frontend-git-master-sleyviix.vercel.app/api/password/email`, { email: this.email })

      // Display a success message to the user
      alert('Password reset email sent')
    }
  }
}
</script>
