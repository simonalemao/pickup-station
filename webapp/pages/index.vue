<template>
  <div class="container pt-8">
    <p class="mb-8 text-lg font-medium text-primary">
      Box Overview
    </p>

    <box
      v-for="box in $store.getters['box/boxes']"
      :key="box.getId()"
      :box="box"
    />
  </div>
</template>

<script>
export default {
  async asyncData ({ store }) {
    await store.dispatch('box/fetchBoxes')
  }
}
</script>
