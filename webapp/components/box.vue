<template>
  <div class="pb-16" style="padding-top: 35px">
    <div class="box bg-white rounded-3xl shadow-xl p-8">
      <div
        class="text-primary text-xs mb-6 flex justify-center gap-5"
        style="margin-top: -70px"
      >
        <div
          class="
            flex-1 flex flex-col
            justify-center
            items-center
            px-2
            py-2
            rounded-3xl
            shadow-xl
            bg-white
          "
          style="height: 75px"
        >
          <span class="text-4xl leading-none">
            {{ box.getId() }}
          </span>
          Box
        </div>
        <div
          class="
            flex-1 flex flex-col
            justify-center
            items-center
            px-2
            py-2
            rounded-3xl
            shadow-xl
            bg-white
          "
          style="height: 75px"
        >
          <img
            :src="require(`~/assets/img/${iconOfType}.svg`)"
            alt=""
            class="mb-1"
          />

          {{ type }}
        </div>
        <div
          class="
            flex-1 flex flex-col
            justify-center
            items-center
            px-2
            py-2
            rounded-3xl
            shadow-xl
            text-white
          "
          :class="[arduAva ? 'bg-primary' : 'bg-gray-600']"
          style="height: 75px"
          @click="unlock"
        >
          <img
            src="~assets/img/unlocked.svg"
            alt=""
            class="relative mb-1"
            style="left: 2px"
          />

          Unlock
        </div>
      </div>

      <p class="font-bold text-lg mb-8">
        {{ box.getTitle() }}
      </p>

      <div
        v-if="box.getDescription()"
        style="background-color: #f4f4f4"
        class="rounded-3xl p-4 mb-8 text-xs"
      >
        {{ box.getDescription() }}
      </div>

      <table class="text-xs">
        <tbody>
          <tr>
            <td class="pr-6">In use since:</td>
            <td>
              {{ box.getCreatedAt() }}
            </td>
          </tr>
          <tr>
            <td class="pr-6">Last opened:</td>
            <td>
              {{ box.getLastOpenedAt() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Box from "@/classes/Box";
export default {
  props: {
    box: {
      type: Box,
      required: true,
    },
  },
  data() {
    return {
      arduAva: false,
    };
  },
  methods: {
    unlock() {
      if (this.arduAva) {
        this.$router.push("unlock/" + this.box.getId());
      }
    },
  },
  computed: {
    type() {
      return this.box.getType();
    },
    iconOfType() {
      switch (this.box.getType()) {
        case "Public":
          return "public_blue";
        case "Private":
          return "lock";
        default:
          return "lock";
      }
    },
  },
  mounted() {
    this.arduAva = this.$store.getters["box/arduinoAvailability"];
  },
};
</script>

<style lang="scss" scoped>
// .wrapper {
//   padding-top: 35px;
// }
</style>
