const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d')
canvas.width = 500
canvas.height = 700
const explosions = []
let canvasPosition=canvas.getBoundingClientRect()
class Explosion {
    constructor(x, y) {
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.width = this.spriteWidth*0.7
        this.height = this.spriteHeight*0.7
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = "../src/img/04/项目 4：精灵表中的碰撞动画.png"
        this.frame = 0
        this.timer=0
        this.angel=Math.random()*6.2
        this.sound=new Audio()
        this.sound.src='../sound/cloud/Ice attack 2.wav'
    }
    update() {
        if(this.frame===0) this.sound.play()
        this.timer++
        if(this.timer%10===0){
            this.frame++
        }
    }
    draw() {
        ctx.save()
        ctx.translate(this.x,this.y)
        ctx.rotate(this.angel)  //保证爆炸云的效果是随机的
        ctx.drawImage(
            this.image, 
            this.spriteWidth * this.frame, 
            0, 
            this.spriteWidth, 
            this.spriteHeight,
            0-this.width/2, //调整动画出现位置和鼠标点击位置不一致的现象
            0-this.height/2, //调整动画出现位置和鼠标点击位置不一致的现象
            this.width, 
            this.height)
        ctx.restore()
    }
}

window.addEventListener('click', function (e) {
    createAnimation(e)
})

function createAnimation(e){
    let positionX=e.x-canvasPosition.left
    let  positionY=e.y-canvasPosition.top
    explosions.push(new Explosion(positionX,positionY))
}
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for(let i=0;i<explosions.length;i++){
        explosions[i].update()
        explosions[i].draw()
        if(explosions[i].frame>5){  //这个for循环是为了从数组中删除不用的爆炸类的
            explosions.splice(i,1)
            i--
        }
    }
    requestAnimationFrame(animate)
}
animate()