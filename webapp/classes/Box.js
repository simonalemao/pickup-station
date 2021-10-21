export default class Box {
  constructor(box) {
    this.box = box
  }

  getId() {
    return this.box.boxID
  }

  getTitle() {
    return this.box.titel
  }

  getDescription() {
    return this.box.beschreibung
  }

  setTitle(title) {
    this.box.titel = title
    return this
  }

  setDescription(description) {
    this.box.beschreibung = description
    return this
  }

  getSize() {
    return this.box.groesse
  }

  getCreatedAt() {
    return this.box.erstellt
  }

  getLastOpenedAt() {
    return this.box.geoeffnet
  }

  getState() {
    return this.box.offen
  }

  getType() {
    return this.box.typ
  }

  isOpen() {
    return this.box.offen == 1
  }

  isLocked() {
    return this.box.offen == 0
  }

  toJson() {
    return this.box
  }
}
