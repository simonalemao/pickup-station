/* eslint-disable no-console */
import Box from '@/classes/Box'
import Vue from 'vue'

export const state = () => ({
  boxes: [],
  availableSizes: {}
})

export const mutations = {
  addBox (state, box) {
    state.boxes.push(box)
  },
  updateBox (state, payloadBox) {
    const index = state.boxes.findIndex(box => box.id === parseInt(payloadBox.id))
    Vue.set(state.boxes, index, payloadBox)
  },
  updateState (state, { boxId, newState }) {
    const index = state.boxes.findIndex(box => box.id === parseInt(boxId))
    const box = JSON.parse(JSON.stringify(state.boxes[index]))
    box.state = newState
    Vue.set(state.boxes, index, box)
  },
  deleteBox (state, boxId) {
    const index = state.boxes.findIndex(box => box.id === parseInt(boxId))
    Vue.delete(state.boxes, index)
  },
  setAvailableSizes (state, sizes) {
    state.availableSizes = sizes
  }
}

export const getters = {
  boxes: state => state.boxes.map(box => new Box(box)),
  getById: (state, getters) => id => getters.boxes.find(box => box.getId() === parseInt(id)),
  getIndex: (state, getters) => id => getters.boxes.findIndex(box => box.getId() === parseInt(id)),
  isSizeAvailable: state => size => state.availableSizes[size] === true
}

export const actions = {
  async open ({ commit }, boxId) {
    await this.$axios.$get(`https://pickup-station.stec.fh-wedel.de/backend?f=open&id=${boxId}`)
  },
  async fetchBoxes ({ commit, getters }) {
    if (getters.boxes.length) {
      return
    }
    var res = await this.$axios.$get('/backend?f=get_belegte')

    res.forEach(box => {
      commit('addBox', box)
    });
  },
  async refreshBox ({ commit, getters }, { boxId }) {
    await this.$axios.$get(`https://pickup-station.stec.fh-wedel.de/backend?f=is_closed&id=${boxId}`)
    
    return new Box({
      id: boxId,
      title: 'Testtitel',
      description: 'Beschreibung',
      size: 'L',
      created_at: '14.12.20',
      last_opened_at: '15.12.20',
      state: 1
    })
  },
  async deleteBox ({ commit }, { boxId }) {
    await this.$axios.$get(`https://pickup-station.stec.fh-wedel.de/backend?f=delete&id=${boxId}`)
  },
  async getAvailableSizes ({ commit }) {
    await this.$axios.$get('https://pickup-station.stec.fh-wedel.de/backend?f=get_av_sizes')

    commit('setAvailableSizes', {
      L: true,
      M: true,
      S: true
    })
  },
  async requestNewBox ({ commit }, { size }) {
    var box = this.$axios.$get(`https://pickup-station.stec.fh-wedel.de/backend?f=request_and_open&size=${size}`)

    // console.log(box);

    return new Box({
      id: 5,
      title: 'Testtitel',
      description: 'Beschreibung',
      size: 'L',
      created_at: '14.12.20',
      last_opened_at: '15.12.20',
      state: 0
    })
  },
  async updateBox ({ commit }, payload) {
    console.log(commit);
    console.log(payload);
    await this.$axios.$post(`https://pickup-station.stec.fh-wedel.de/backend?f=update`, payload)
  }
}
