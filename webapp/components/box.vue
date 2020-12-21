<template>
  <div class="wrapper pb-16">
    <div class="box bg-white rounded-3xl shadow-xl p-8">
      <div class="text-primary flex text-xs mb-6" style="margin-top: -67px;">
        <div class="flex flex-1 flex-col items-center justify-center px-2 py-2 rounded-3xl shadow-xl mr-4 bg-white" style="height: 75px;">
          <span class="text-4xl leading-none">
            {{ box.getId() }}
          </span>
          Box
        </div>
        <div class="flex flex-1 flex-col items-center justify-center px-2 py-2 rounded-3xl shadow-xl mr-4 bg-white" style="height: 75px;">
          <img src="~assets/img/lock.svg" alt="" class="mb-1">

          Private
        </div>
        <div class="flex flex-1 flex-col items-center justify-center px-2 py-2 rounded-3xl shadow-xl bg-primary text-white" style="height: 75px;" @click="unlock">
          <img src="~assets/img/unlocked.svg" alt="" class="relative mb-1" style="left: 2px;">

          Unlock
        </div>
      </div>

      <p class="font-bold text-lg mb-8">
        {{ box.getTitle() }}
      </p>

      <div v-if="box.getDescription()" style="background-color: #F4F4F4;" class="rounded-3xl p-4 mb-8 text-xs">
        {{ box.getDescription() }}
      </div>

      <table class="text-xs">
        <tbody>
          <tr>
            <td class="pr-6">
              In use since:
            </td>
            <td>
              {{ box.getCreatedAt() }}
            </td>
          </tr>
          <tr>
            <td class="pr-6">
              Last opened:
            </td>
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
import Box from '@/classes/Box'
export default {
  props: {
    box: {
      type: Box,
      required: true
    }
  },
  methods: {
    unlock () {
      this.$router.push('unlock/' + this.box.getId())
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    padding-top: 35px;
  }
</style>
