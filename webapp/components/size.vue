<template>
  <div
    class="
      flex
      items-center
      justify-center
      px-2
      py-2
      text-4xl
      shadow-xl
      rounded-3xl
    "
    :class="sizeClasses"
    :style="sizeStyles"
  >
    {{ size }}
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sizeStyles() {
      return {
        width: this.width + "px",
        height: this.height + "px",
      };
    },
    sizeClasses() {
      return {
        "text-primary": this.isAvailable,
        "bg-white": this.isAvailable,
        "text-gray-500": !this.isAvailable,
      };
    },
  },
};
</script>

<style>
</style>
