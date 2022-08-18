document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d')
    canvas.width = 500
    canvas.height = 800
    class Game {
        constructor(ctx,width,height) {
            this.ctx=ctx
            this.width=width
            this.height=height
            this.enemies = []
            this.enemyInterval=1000//新敌人加入画面的速度，可以调节敌人出现的速度
            this.enemyTimer=0
            this.enemyType=['worm','ghost','spider']
        }
        update(deltaTime) {
            this.enemies=this.enemies.filter(object=>!object.markForDeletion)
            if(this.enemyTimer>this.enemyInterval){
                this.#addNewEnemy()
                this.enemyTimer=0
            }else{
                this.enemyTimer+=deltaTime
            }
            this.enemies.forEach(object=>{object.update(deltaTime)})
        }
        draw() {
            this.enemies.forEach(object=>{object.draw(this.ctx)})
        }
        #addNewEnemy() {
            console.log(this.enemies)
            const randomEnemy=this.enemyType[Math.floor(Math.random()*this.enemyType.length)]
           if(randomEnemy==='worm')  this.enemies.push(new Worm(this))
           else if(randomEnemy==='ghost') this.enemies.push(new Ghost(this))
           else if(randomEnemy==='spider') this.enemies.push(new Spider(this))
            /* this.enemies.sort(function(a,b){//根据Y轴高度排序，高在前低在后
                return a.y-b.y
            }) */
        }
    }
    class Enemy {
        constructor(game) {
            this.game=game
            this.markForDeletion=false
            this.frameX=0
            this.maxFrame=5
            this.frameInterval=100 //帧间间隔
            this.frameTimer=0
        }
        update(deltaTime) {
            this.x-=this.speed*deltaTime
            if(this.x<0-this.width) this.markForDeletion=true
            if(this.frameTimer>this.frameInterval){
                if(this.frameX<this.maxFrame) this.frameX++
                else this.frameX=0
                this.frameTimer=0
            }else{
                this.frameTimer+=deltaTime
            }
        }
        draw(ctx) {

            ctx.drawImage(this.image,this.frameX*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
        }
    }
    class Worm extends Enemy{
        constructor(game){
            super(game)
            this.spriteWidth=229
            this.spriteHeight=171
            this.width=this.spriteWidth/2
            this.height=this.spriteHeight/2
            this.x=this.game.width
            this.y=this.game.height-this.height //让虫子只在地上
            this.image=worm
            // console.log(this.image) 获得img节点
            this.speed=Math.random()*0.1+0.1
        }
    }
    class Ghost extends Enemy{
        constructor(game){
            super(game)
            this.spriteWidth=261
            this.spriteHeight=209
            this.width=this.spriteWidth/2
            this.height=this.spriteHeight/2
            this.x=this.game.width
            this.y=Math.random()*this.game.height*0.8
            this.image=ghost
            // console.log(this.image) 获得img节点
            this.speed=Math.random()*0.2+0.1
            this.angle=0
            this.curve=Math.random()*3
        }
        update(deltaTime){
            super.update(deltaTime)
            this.y+=Math.sin(this.angle)*this.curve
            this.angle+=0.04
        }
        draw(){ //实现幽灵半透明
            ctx.save()  //保存所有画布的快照
            ctx.globalAlpha=0.5 //假如这里只是写了这一句就全部变成变成半透明的
            super.draw(ctx)
            ctx.restore()  //自动恢复画布属性，在幽灵画完后就恢复全局属性,不影响蠕虫
        }
    }
    class Spider extends Enemy{
        constructor(game){
            super(game)
            this.spriteWidth=310
            this.spriteHeight=175
            this.width=this.spriteWidth/2
            this.height=this.spriteHeight/2
            this.x=Math.random()*this.game.width
            this.y=0-this.height //让虫子只在地上
            this.image=spider
            this.speed=0
            this.speedY=Math.random()*0.1+0.1
            this.maxLength=Math.random()*this.game.height
        }
        update(deltaTime){
            super.update(deltaTime)
            if(this.y<0-this.height*2) this.markForDeletion=true
            this.y+=this.speedY*deltaTime
            if(this.y>this.maxLength) this.speedY*=-1
        }
        draw(ctx){
            ctx.beginPath()
            ctx.moveTo(this.x+this.width/2,0)
            ctx.lineTo(this.x+this.width/2,this.y+10)
            ctx.stroke()
            super.draw(ctx)
        }
    }
const game=new Game(ctx,canvas.width,canvas.height)
let lastTime=1
    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const deltaTime=timeStamp-lastTime
        lastTime=timeStamp
        game.update(deltaTime)  //deltaTime可以保证不同电脑可以以相同的速度推进
        game.draw()
        requestAnimationFrame(animate)
    }
    animate(0)
})