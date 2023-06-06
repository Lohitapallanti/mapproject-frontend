<template>
    <div>
        <NavBar  v-slot:subtitle>
            <h3 style="margin-top: -98px"> Error View</h3>
        </NavBar>
        <h1 style="margin-top: 250px">You don't have any assigned roles. Contact your Admin.</h1>
    </div>
</template>

<script>
import NavBar from '@/components/layouts/NavBar.vue'

export default {
  name: 'ErrorPage',
  components: {
    NavBar
  }
}
</script>

<style>

</style>
