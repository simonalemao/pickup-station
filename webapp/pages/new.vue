<template>
  <div class="container pt-8">
    <div v-if="!box">
      <p class="mb-8 text-lg font-medium text-primary">Choose Box Size</p>

      <div class="flex justify-center" style="margin-bottom: 20px">
        <div style="margin-right: 20px">
          <size
            :width="100"
            :height="100"
            size="S"
            :isAvailable="isAvailable.S"
            @click.native="requestNewBox('S')"
            style="margin-bottom: 20px"
          />
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
            style="width: 100px; height: 100px"
          />
        </div>
        <div>
          <size
            :width="100"
            :height="220"
            size="M"
            :isAvailable="isAvailable.M"
            @click.native="requestNewBox('M')"
          />
        </div>
      </div>

      <div class="flex justify-center">
        <size
          :width="220"
          :height="200"
          size="L"
          :isAvailable="isAvailable.L"
          @click.native="requestNewBox('L')"
        />
      </div>
    </div>

    <div v-if="box && !boxIsLockedDisplayTimeout">
      <p class="mb-8 text-lg font-medium text-primary">
        Box zum Verriegeln schließen
      </p>

      <div v-if="box.isOpen()">
        <div
          class="
            flex flex-col
            items-center
            justify-center
            p-10
            mb-8
            text-3xl
            bg-white
            shadow-xl
            rounded-3xl
            text-primary
          "
        >
          <img
            src="~assets/img/unlocked_blue.svg"
            alt=""
            style="width: 80px; left: 3px"
            class="relative mb-8"
          />
          <p class="leading-none">Box {{ box.getId() }}</p>
          <p>ist geöffnet</p>
        </div>
        <div class="p-6 text-sm font-bold bg-white shadow-xl rounded-3xl">
          Die Box nach Nutzung schließen und 10 Sekunden bis zur Verriegelung
          warten.
        </div>
      </div>

      <div v-if="box.isLocked()">
        <div
          class="
            flex flex-col
            items-center
            justify-center
            p-10
            mb-8
            text-3xl text-white
            shadow-xl
            rounded-3xl
            bg-primary
          "
        >
          <img
            src="~assets/img/lock_white.svg"
            alt=""
            style="width: 80px; left: 3px"
            class="relative mb-8"
          />
          <p class="leading-none">Box {{ box.getId() }}</p>
          <p>wurde geschlossen</p>
        </div>
        <div class="p-6 text-sm font-bold bg-white shadow-xl rounded-3xl">
          Die Box wurde erfolgreich verriegelt.
        </div>
      </div>
    </div>

    <div v-if="boxIsLockedDisplayTimeout && !boxType">
      <p class="mb-8 text-lg font-medium text-primary">Choose Box Type</p>
      <div
        class="
          flex
          items-center
          p-6
          mb-8
          text-lg
          font-bold
          bg-white
          shadow-xl
          rounded-3xl
          text-primary
        "
        @click="setBoxType('Private')"
      >
        <img src="~assets/img/lock.svg" alt="" class="mr-6" />
        Private
      </div>
      <div
        class="
          flex
          items-center
          p-6
          mb-8
          text-lg
          font-bold
          bg-white
          shadow-xl
          rounded-3xl
          text-primary
        "
        @click="setBoxType('Public')"
      >
        <img src="~assets/img/public_blue.svg" alt="" class="mr-6" />
        Public
      </div>
    </div>

    <div v-if="boxType">
      <p class="mb-8 text-lg font-medium text-primary">Add Box Info</p>

      <input
        id=""
        v-model="title"
        type="text"
        placeholder="Box Title"
        class="w-full px-6 py-4 mb-6 shadow-xl outline-none rounded-3xl"
      />
      <textarea
        v-model="description"
        rows="3"
        placeholder="Content Description"
        class="w-full px-6 py-4 mb-6 shadow-xl outline-none rounded-3xl"
      />
      <div
        v-if="boxType == 'Private'"
        class="
          shadow-xl
          outline-none
          rounded-3xl
          px-6
          py-4
          text-primary text-base
          mb-8
          transition-colors
        "
        style="transition-duration: 200ms"
        :class="pinFeldRot ? 'bg-red-200' : 'bg-white'"
      >
        Pin
        <div class="flex gap-3 mt-3 max-w-xs">
          <div class="flex-shrink w-16">
            <input
              ref="pin0"
              v-model="pin[0]"
              type="text"
              class="pinEingabe"
              @input="processPin(0)"
              @keyup.delete="deletePin"
            />
          </div>
          <div class="flex-shrink w-16">
            <input
              ref="pin1"
              v-model="pin[1]"
              type="text"
              class="pinEingabe"
              @input="processPin(1)"
              @keyup.delete="deletePin"
            />
          </div>
          <div class="flex-shrink w-16">
            <input
              ref="pin2"
              v-model="pin[2]"
              type="text"
              class="pinEingabe"
              @input="processPin(2)"
              @keyup.delete="deletePin"
            />
          </div>
          <div class="flex-shrink w-16">
            <input
              ref="pin3"
              v-model="pin[3]"
              type="text"
              class="pinEingabe"
              @input="processPin(3)"
              @keyup.delete="deletePin"
            />
          </div>
        </div>
      </div>
      <div class="text-right">
        <button
          ref="saveButton"
          class="px-6 py-3 text-white shadow-xl outline-none rounded-3xl"
          :class="pinIsOk ? 'bg-primary' : 'bg-gray-600'"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.dispatch("box/getAvailableSizes");
  },
  data() {
    return {
      box: null,
      boxNum: undefined,
      boxIsLockedDisplayTimeout: false,
      interval: null,
      needsDescription: false,
      needsPin: false,
      boxType: null,
      title: "",
      pin: [null, null, null, null],
      pinFeldRot: false,
      digitArray: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      type: "",
      description: "",
      // isAvailable: {
      //   S: false,
      //   M: false,
      //   L: false,
      // },
    };
  },
  computed: {
    pinIsOk() {
      return (
        this.boxType == "Public" ||
        this.pin.every((digit) => this.digitArray.includes(digit))
      );
    },
    isAvailable() {
      return this.$store.getters["box/availableSizes"];
    },
    // box() {
    //   return this.boxnum == undefined
    //     ? null
    //     : this.$store.getters["box/getById"](this.boxNum);
    // },
  },
  watch: {
    box(newBox) {
      console.log(newBox);
      if (newBox?.isLocked()) {
        setTimeout(() => {
          this.boxIsLockedDisplayTimeout = true;
        }, 300);
        clearInterval(this.interval);
      }
    },
  },
  methods: {
    async requestNewBox(size) {
      this.boxNum = await this.$store.dispatch("box/requestNewBox", size);
      console.log(this.boxNum);
      this.box = this.$store.getters["box/getById"](this.boxNum);

      this.interval = setInterval(async () => {
        await this.$store.dispatch("box/refreshBox", {
          boxId: this.boxNum,
        });
        this.box = this.$store.getters["box/getById"](this.boxNum);
      }, 1000);
    },
    setBoxType(typeToSet) {
      this.boxType = typeToSet;
    },
    // isPrivate() {
    //   this.needsDescription = true;
    //   this.needsPin = true;
    // },
    async save() {
      if (this.pinIsOk) {
        await this.$store.dispatch("box/updateBox", {
          boxId: this.box.getId(),
          title: this.title,
          description: this.description,
          pin: `${this.pin[0]}${this.pin[1]}${this.pin[2]}${this.pin[3]}`,
        });
        // this.box.setTitle(this.title).setDescription(this.description);
        // this.$store.commit("box/addBox", this.box.toJson());

        this.$router.replace("/");
      } else {
        this.pinFeldRot = true;
        let pinFeldIntervall = setInterval(() => {
          this.pinFeldRot = !this.pinFeldRot;
        }, 200);
        setTimeout(() => {
          clearInterval(pinFeldIntervall);
          this.pinFeldRot = false;
        }, 1600);
      }
    },
    processPin(pinNumber) {
      let str = this.pin[pinNumber];
      if (str != null && str.length > 0) {
        if (!this.isSingleDigit(str)) {
          this.pin[pinNumber] = str.substring(0, str.length - 1);
        }
        if (this.pin[pinNumber]?.length == 1) {
          if (pinNumber < 3) {
            this.$refs[`pin${pinNumber + 1}`].focus();
          } else {
            this.$refs.saveButton.focus();
          }
        }
      }
    },
    deletePin() {
      this.pin = [null, null, null, null];
      this.$refs[`pin0`].focus();
    },
    isSingleDigit(string) {
      return (
        string.length == 1 &&
        this.digitArray.includes(string[string.length - 1])
      );
    },
  },
  // mounted() {
  //   this.isAvailable = this.$store.getters["box/availableSizes"];
  // },
};
</script>

<style scoped>
.pinEingabe {
  @apply h-16 w-full shadow-lg bg-gray-200 rounded-full text-center text-3xl;
}
</style>
