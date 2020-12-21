<template>
  <div class="flex items-center justify-center px-2 py-2 text-4xl shadow-xl rounded-3xl" :class="sizeClasses" :style="sizeStyles">
    {{ size }}
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'S'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      isAvaible: true
    }
  },
  computed: {
    sizeStyles () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    },
    sizeClasses () {
      return {
        'text-primary': this.isAvaible,
        'bg-white': this.isAvaible,
        'text-gray-500': !this.isAvaible
      }
    }
  },
  mounted () {
    this.isAvaible = this.$store.getters['box/isSizeAvailable'](this.size)
  }
}
</script>

<style>

</style>
