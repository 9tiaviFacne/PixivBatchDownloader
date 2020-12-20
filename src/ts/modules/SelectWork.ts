import { DOM } from './DOM'
import { Colors } from './Colors'
import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './States'
import { IDData } from './Store.d'
import { timeStamp } from 'console'

class SelectWork {
  constructor() {
    this.el = this.createQueryEl()
    this.addBtn()
    this.bindEvents()
  }

  private el: HTMLElement
  private elId = 'selectWorkEl'
  private left = 0
  private top = 0
  private half = 10
  private show = false

  private btn: HTMLButtonElement = document.createElement('button')

  private selectedWorkFlagClass = 'selectedWorkFlag'

  private artworkReg = /artworks\/(\d{2,15})/
  private novelReg = /novel\/show\.php\?id=\/(\d{2,15})/

  private idList: IDData[] = []

  private bindClickEvent!: (ev: MouseEvent) => void | undefined
  private bindMoveEvent!: (ev: MouseEvent) => void | undefined

  private createQueryEl() {
    const el = document.createElement('div')
    el.id = this.elId
    document.body.appendChild(el)
    return el
  }

  private updateEl() {
    this.el.style.left = this.left - this.half + 'px'
    this.el.style.top = this.top - this.half + 'px'
    this.el.style.display = this.show ? 'block' : 'none'
  }

  private addBtn() {
    this.btn = DOM.addBtn('crawlBtns', Colors.green, lang.transl('_手动选择作品'), [
      ['title', lang.transl('_手动选择作品的说明')],
    ])
    this.btn.addEventListener('click', (ev) => {
      if (!this.show) {
        this.startSelect(ev)
        this.btn.textContent = lang.transl('_抓取选择的作品')
        this.btn.style.backgroundColor = Colors.blue
      } else {
        this.downloadSelect()
      }
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.stopSelect()
    })
  }

  private startSelect(ev: MouseEvent) {
    this.idList = []

    this.show = true
    this.left = ev.x
    this.top = ev.y
    this.updateEl()
    this.bindClickEvent = this.clickEvent.bind(this)
    this.bindMoveEvent = this.moveEvent.bind(this)
    window.addEventListener('click', this.bindClickEvent, true)
    window.addEventListener('mousemove', this.bindMoveEvent, true)

    EVT.fire(EVT.list.closeCenterPanel)
  }

  private stopSelect() {
    this.show = false
    this.updateEl()
    this.bindClickEvent && window.removeEventListener('click', this.bindClickEvent, true)
    this.bindMoveEvent && window.removeEventListener('mousemove', this.bindMoveEvent, true)
  }

  private downloadSelect() {
    if (states.busy) {
      EVT.sendMsg({
        msg: lang.transl('_当前任务尚未完成'),
        type: 'error',
      })
      return
    }

    this.stopSelect()
    EVT.fire(EVT.list.downloadIdList, this.idList)

    this.removeAllSelectedFlag()

    window.setTimeout(() => {
      this.btn.textContent = lang.transl('_手动选择作品')
      this.btn.style.backgroundColor = Colors.green
    }, 500)
  }

  private clickEvent(ev: MouseEvent) {
    // ev.stopPropagation()
    const workId = this.findWork((ev as any).path || ev.composedPath())

    if (workId) {
      ev.preventDefault()

      const index = this.idList.findIndex(item => item.id === workId.id)
      console.log(index)

      // 这个 id 不存在于 idList 里
      if (index === -1) {
        this.idList.push(workId)

        this.addSelectedFlag(ev.target as HTMLElement, workId.id)
      } else {
        // id 已存在，则删除
        this.idList.splice(index, 1)

        this.removeSelectedFlag(workId.id)
      }

      this.btn.textContent = lang.transl('_抓取选择的作品') + ` ${this.idList.length}`
    }
  }

  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateEl()
  }

  private findWork(arr: HTMLElement[]): IDData | undefined {
    for (const el of arr) {
      // 查找所有 a 标签
      if (el.nodeName === 'A') {
        const href = (el as HTMLAnchorElement).href
        // 测试图片作品链接
        const test = this.artworkReg.exec(href)
        if (test && test[1]) {
          return {
            type: 'unknown',
            id: test[1]
          }
        }

        // 测试小说作品链接
        const test2 = this.novelReg.exec(href)
        if (test2 && test2[1]) {
          return {
            type: 'novels',
            id: test2[1]
          }
        }
      }
    }
  }

  private addSelectedFlag(el: HTMLElement, id: string) {
    const span = document.createElement('span')
    // span.textContent = '✅'
    span.textContent = '😊'
    span.classList.add(this.selectedWorkFlagClass)
    span.dataset.id = id
    el.insertAdjacentElement('beforebegin', span)
  }

  private removeSelectedFlag(id: string) {
    const el = document.querySelector(`.${this.selectedWorkFlagClass}[data-id='${id}']`)
    el && el.remove()
  }

  private removeAllSelectedFlag() {
    for (const item of this.idList) {
      this.removeSelectedFlag(item.id)
    }
  }

}

export { SelectWork }