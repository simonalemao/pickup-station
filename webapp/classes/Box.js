export default class Box {
  constructor (box) {
    this.box = box
  }

  getId () {
    return this.box.id
  }

  getTitle () {
    return this.box.title
  }

  getDescription () {
    return this.box.description
  }

  setTitle (title) {
    this.box.title = title
    return this
  }

  setDescription (description) {
    this.box.description = description
    return this
  }

  getSize () {
    return this.box.size
  }

  getCreatedAt () {
    return this.box.created_at
  }

  getLastOpenedAt () {
    return this.box.last_opened_at
  }

  getState () {
    return this.box.state
  }

  isOpen () {
    return this.box.state === 1
  }

  isLocked () {
    return this.box.state === 0
  }

  toJson () {
    return this.box
  }
}
