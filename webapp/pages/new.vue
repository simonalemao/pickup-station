<template>
  <div class="container pt-8">
    <div v-if="!box">
      <p class="mb-8 text-lg font-medium text-primary">
        Choose Box Size
      </p>

      <div class="flex justify-center" style="margin-bottom: 20px;">
        <div style="margin-right: 20px;">
          <size :width="100" :height="100" size="S" style="margin-bottom: 20px;" @click.native="requestNewBox('S')" />
          <div class="flex items-center justify-center px-2 py-2 text-4xl shadow-xl rounded-3xl" style="width: 100px; height: 100px;" />
        </div>
        <div>
          <size :width="100" :height="220" size="M" @click.native="requestNewBox('S')" />
        </div>
      </div>

      <div class="flex justify-center">
        <size :width="220" :height="200" size="L" @click.native="requestNewBox('S')" />
      </div>
    </div>

    <div v-if="box && !boxIsLocked">
      <p class="mb-8 text-lg font-medium text-primary">
        Close Box to Lock
      </p>

      <div v-if="box.isOpen()">
        <div class="flex flex-col items-center justify-center p-10 mb-8 text-3xl bg-white shadow-xl rounded-3xl text-primary">
          <img src="~assets/img/unlocked_blue.svg" alt="" style="width: 80px; left: 3px;" class="relative mb-8">
          <p class="leading-none">
            Box {{ box.getId() }}
          </p>
          <p>is open</p>
        </div>
        <div class="p-6 text-sm font-bold bg-white shadow-xl rounded-3xl">
          Die Box nach Nutzung schließen und 10 Sekunden bis zur Verriegelung warten.
        </div>
      </div>

      <div v-if="box.isLocked()">
        <div class="flex flex-col items-center justify-center p-10 mb-8 text-3xl text-white shadow-xl rounded-3xl bg-primary">
          <img src="~assets/img/lock_white.svg" alt="" style="width: 80px; left: 3px;" class="relative mb-8">
          <p class="leading-none">
            Box {{ box.getId() }}
          </p>
          <p>is locked</p>
        </div>
        <div class="p-6 text-sm font-bold bg-white shadow-xl rounded-3xl">
          Die Box wurde erfolgreich verriegelt.
        </div>
      </div>
    </div>

    <div v-if="boxIsLocked && !needsDescription">
      <p class="mb-8 text-lg font-medium text-primary">
        Choose Box Type
      </p>
      <div class="flex items-center p-6 mb-8 text-lg font-bold bg-white shadow-xl rounded-3xl text-primary" @click="isPrivate">
        <img src="~assets/img/lock.svg" alt="" class="mr-6">
        Private
      </div>
      <div class="flex items-center p-6 mb-8 text-lg font-bold text-gray-500 shadow-xl rounded-3xl">
        <img src="~assets/img/shared.svg" alt="" class="mr-6">
        Shared
      </div>
      <div class="flex items-center p-6 text-lg font-bold text-gray-500 shadow-xl rounded-3xl">
        <img src="~assets/img/public.svg" alt="" class="mr-6">
        Public
      </div>
    </div>

    <div v-if="needsDescription">
      <p class="mb-8 text-lg font-medium text-primary">
        Add Box Info
      </p>

      <input id="" v-model="title" type="text" placeholder="Box Title" class="w-full px-6 py-4 mb-6 shadow-xl outline-none rounded-3xl">
      <textarea v-model="description" rows="10" placeholder="Content Description" class="w-full px-6 py-4 mb-6 shadow-xl outline-none rounded-3xl" />

      <div class="text-right">
        <button class="px-6 py-3 text-white shadow-xl outline-none bg-primary rounded-3xl" @click="save">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ store }) {
    await store.dispatch('box/getAvailableSizes')
  },
  data () {
    return {
      box: null,
      boxIsLocked: false,
      interval: null,
      needsDescription: false,
      title: '',
      description: ''
    }
  },
  watch: {
    box (newBox, oldBox) {
      if (!oldBox) {
        return
      }

      if (newBox.isLocked() && oldBox.isOpen()) {
        setTimeout(() => {
          this.boxIsLocked = true
        }, 5000)
        clearInterval(this.interval)
      }
    }
  },
  methods: {
    async requestNewBox (size) {
      this.box = await this.$store.dispatch('box/requestNewBox', {
        size
      })

      this.interval = setInterval(async () => {
        const box = await this.$store.dispatch('box/refreshBox', {
          boxId: this.box.getId()
        })
        this.box = box
      }, 2000)
    },
    isPrivate () {
      this.needsDescription = true
    },
    async save () {
      await this.$store.dispatch('box/updateBox', {
        title: this.title,
        description: this.description
      })
      this.box
        .setTitle(this.title)
        .setDescription(this.description)

      this.$store.commit('box/addBox', this.box.toJson())

      this.$router.replace('/')
    }
  }
}
</script>

<style>

</style>
