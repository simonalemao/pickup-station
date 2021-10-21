/* eslint-disable no-console */
import Box from '@/classes/Box'
import Vue from 'vue'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const _url = "https://pickup-station.stec.fh-wedel.de"
// const _url = ""
const _dev = true

export const state = () => ({
  boxes: [],
  availableSizes: {},
  arduinoAvailability: false
})

export const mutations = {
  addBox(state, box) {
    state.boxes.push(box)
  },
  updateBox(state, payloadBox) {
    let index = state.boxes.findIndex(box => box.boxID === parseInt(payloadBox.boxID))
    Vue.set(state.boxes, index, { ...(state.boxes[index]), ...payloadBox })
    // state.boxes[index] = payloadBox
    // state.boxes[index] = { ...(state.boxes[index]), ...payloadBox }
  },
  // updateState(state, { boxId, newState }) {
  //   const index = state.boxes.findIndex(box => box.boxID === parseInt(boxId))
  //   const box = JSON.parse(JSON.stringify(state.boxes[index]))
  //   box.state = newState
  //   Vue.set(state.boxes, index, box)
  // },
  deleteBox(state, boxId) {
    const index = state.boxes.findIndex(box => box.boxID === parseInt(boxId))
    Vue.delete(state.boxes, index)
  },
  setAvailableSizes(state, sizes) {
    state.availableSizes = sizes
  },
  setArduinoAvailability(state, availability) {
    state.arduinoAvailability = availability
  }
}

export const getters = {
  boxes: (state) => state.boxes.map((box) => new Box(box)),

  // Damit ich es beim nächsten mal noch weiß: Hier nicht getters.boxes... benutzen. das ist wahrscheinlich gecached und deswegen immer noch gleich
  // Doch nicht... :-(
  // getById: (state) => (id) => {
  //   let got = state.boxes.find(box => box.boxID == parseInt(id))
  //   return new Box(got)
  // }, // Für unlock genutzt

  getById: (state, getters) => (id) => getters.boxes.find(box => box.getId() == parseInt(id)), // Für unlock genutzt
  // getIndex: (state, getters) => id => getters.boxes.findIndex(box => box.getId() === parseInt(id)),
  // isSizeAvailable: state => size => state.availableSizes[size] === true,
  availableSizes: state => state.availableSizes, // new => mounted
  arduinoAvailability: state => state.arduinoAvailability, // box => unlock: an oder aus
}

export const actions = {
  async open({ commit }, boxId) {
    commit;
    if (!_dev) {
      await this.$axios.$get(`${_url}/backend?f=open&id=${boxId}`)
    }
  },
  async fetchBoxes({ commit, getters }) {
    if (getters.boxes.length) {
      return
    }
    var res
    if (!_dev) {
      res = await this.$axios.$get(`${_url}/backend?f=get_occupied`)
    } else {
      res = []
    }
    res.forEach(box => {
      commit('addBox', box)
    });
  },
  async refreshBox({ commit, getters }, { boxId }) {
    commit;
    getters;
    if (!_dev) {
      commit("updateBox", await this.$axios.$get(`${_url}/backend?f=get_box&id=${boxId}`));
    } else {
      commit("updateBox", {
        listID: 1,
        stationID: 1,
        boxID: 1,
        titel: 'Kein Titel vergeben',
        beschreibung: 'Keine Beschreibung vergeben',
        belegt: 0,
        groesse: 'S',
        typ: 'Public',
        erstellt: '07.10.2021 22:34',
        geoeffnet: '07.10.2021 22:34',
        offen: (Math.random() * 2.8) > 1 ? 1 : 0
      })
    }
  },
  async deleteBox({ commit }, { boxId }) {
    commit;
    if (!_dev) {
      await this.$axios.$get(`${_url}/backend?f=delete&id=${boxId}`)
    } else {
      return
    }
  },
  async getAvailableSizes({ commit }) {
    if (!_dev) {
      commit('setAvailableSizes', await this.$axios.$get(`${_url}/backend?f=get_av_sizes`))
    } else {
      commit('setAvailableSizes', {
        S: true,
        M: false,
        L: false
      })
    }
  },
  async getArduinoAvailability({ commit }) {
    if (!_dev) {
      commit('setArduinoAvailability', await this.$axios.$get(`${_url}/backend?f=get_ardu_availability`))
    } else {
      commit('setArduinoAvailability', true)
    }
  },
  async requestNewBox({ commit }, { size }) {
    var box
    if (!_dev) {
      box = await this.$axios.$get(`${_url}/backend?f=request_and_open&size=${size}`)
    } else {
      box = {
        listID: 1,
        stationID: 1,
        boxID: 1,
        titel: 'Kein Titel vergeben',
        beschreibung: 'Keine Beschreibung vergeben',
        belegt: 1,
        groesse: 'S',
        typ: 'Public',
        erstellt: "bla bla",
        geoeffnet: "bla",
        offen: 1
      }
    }
    commit('addBox', box)
    return box.boxID;
  },
  async updateBox({ commit }, payload) {
    commit;
    if (!_dev) {
      await this.$axios.$post(`${_url}/backend?f=update`, JSON.stringify(payload))
    }
  }
}
