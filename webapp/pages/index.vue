<template>
  <div class="container pt-8">
    <p class="mb-8 text-lg font-medium text-primary">Box Overview</p>

    <box v-for="box in boxes" :key="box.getId()" :box="box" />
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.dispatch("box/fetchBoxes");

    await store.dispatch("box/getArduinoAvailability");
  },
  computed: {
    boxes() {
      return this.$store.getters["box/boxes"];
    },
  },
};
</script>
