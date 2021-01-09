<template>
  <div class="container pt-8">
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

    <div v-if="box.isLocked() && !boxIsLocked">
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

    <div v-if="boxIsLocked">
      <div class="flex items-center p-6 mb-8 text-lg font-bold text-white shadow-xl rounded-3xl bg-primary" @click="isFree">
        <img src="~assets/img/bird.svg" alt="" class="mr-6">
        Box {{ box.getId() }} is free
      </div>
      <div class="flex items-center p-6 text-lg font-bold bg-white shadow-xl rounded-3xl text-primary" @click="stillInUse">
        <img src="~assets/img/lock.svg" alt="" class="mr-6">
        Box {{ box.getId() }} is still in use
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ store, route }) {
    await store.dispatch('box/fetchBoxes')

    await store.dispatch('box/open', route.params.id)

    store.commit('box/updateState', {
      boxId: route.params.id,
      newState: 0
    })

    return {
      boxId: route.params.id
    }
  },
  data () {
    return {
      boxId: null,
      boxIsLocked: false,
      interval: null
    }
  },
  computed: {
    box () {
      return this.$store.getters['box/getById'](this.boxId)
    }
  },
  watch: {
    box (newBox, oldBox) {
      if (newBox.isLocked() /*&& oldBox.isOpen()*/) {
        // mit "oldBox.isOpen()": Ladeschleife
        setTimeout(() => {
          this.boxIsLocked = true
        }, 5000)
        clearInterval(this.interval)
      }
    }
  },
  mounted () {
    this.interval = setInterval(async () => {
      const box = await this.$store.dispatch('box/refreshBox', {
        boxId: this.box.getId()
      })

      this.$store.commit('box/updateBox', box.toJson())
    }, 2000)
  },
  methods: {
    stillInUse () {
      this.$router.replace('/')
    },
    async isFree () {
      await this.$store.dispatch('box/deleteBox', {
        boxId: this.box.getId()
      })
      this.$router.replace('/', () => {
        this.$store.commit('box/deleteBox', this.box.getId())
      })
    }
  }
}
</script>

<style>

</style>
