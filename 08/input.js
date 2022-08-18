export default class InputHandler {
    constructor() {
        this.lastKey = ''
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'Press left'
                    break
                case 'ArrowRight':
                    this.lastKey = 'Press right'
                    break
                case 'ArrowDown':
                    this.lastKey = 'Press down'
                    break
                case 'ArrowUp':
                    this.lastKey = 'Press up'
                    break
            }
        })
        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'release left'
                    break
                case 'ArrowRight':
                    this.lastKey = 'release right'
                    break
                case 'ArrowDown':
                    this.lastKey = 'release down'
                    break
                case 'ArrowUp':
                    this.lastKey = 'release up'
                    break
            }
        })
    }
}