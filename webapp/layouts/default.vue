<template>
  <div>
    <header class="container z-10 flex justify-between py-2 bg-white shadow-lg">
      <NuxtLink to="/">
        <p class="text-xl">Pickup Station</p>
      </NuxtLink>
      <img
        v-if="!menu"
        src="~assets/img/burger.svg"
        alt=""
        @click="menu = !menu"
      />
      <img
        v-if="menu"
        src="~assets/img/close.svg"
        alt=""
        @click="menu = !menu"
      />
    </header>

    <Nuxt />

    <div
      v-if="menu"
      class="fixed top-0 left-0 w-full h-screen bg-white"
      style="
        height: calc(100vh - 70px);
        margin-top: 70px;
        background-color: #f6f7f9;
      "
    >
      <div class="container pt-2">
        <p class="mb-8 text-lg font-medium text-primary">Navigation</p>
        <div
          class="
            flex
            items-center
            p-6
            mb-8
            text-lg
            bg-white
            shadow-xl
            rounded-3xl
            text-primary
          "
          @click="go('/')"
        >
          <img src="~assets/img/boxes.svg" alt="" class="mr-6" />
          Box Overview
        </div>
        <div
          class="
            flex
            items-center
            p-6
            mb-8
            text-lg
            bg-white
            shadow-xl
            rounded-3xl
            text-primary
          "
          @click="go('/new')"
        >
          <img src="~assets/img/add.svg" alt="" class="mr-6" />
          Add Box
        </div>
        <div
          class="
            flex
            items-center
            p-6
            mb-8
            text-lg text-gray-500
            shadow-xl
            rounded-3xl
          "
        >
          <img src="~assets/img/shared.svg" alt="" class="mr-6" width="24" />
          Teams
        </div>
        <div
          class="
            flex
            items-center
            p-6
            mb-8
            text-lg text-gray-500
            shadow-xl
            rounded-3xl
          "
        >
          <img src="~assets/img/settings.svg" alt="" class="mr-6" />
          Settings
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    go(where) {
      if (this.$route.path === where) {
        this.menu = false;
        return;
      }

      this.$router.push(where, () => {
        this.menu = false;
      });
    },
  },
};
</script>
