import {
    Player
} from './player.js'
import {
    InputHandler
} from './input.js'
import {
    BackGround
} from './backGround.js'
import {
    FlyingEnemy,
    ClimbingEnemy,
    GroundEnemy
} from './enemies.js'
import {
    UI
} from './UI.js'
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 900
    canvas.height = 500

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 80
            this.speed = 0
            this.maxSpeed = 3
            this.background = new BackGround(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.ui = new UI(this)
            this.enemies = []
            this.particles=[]
            this.collisions=[]
            this.floatingMessages=[]
            this.maxParticles=50
            this.enemyInterval = 1000 //新敌人加入画面的速度，可以调节敌人出现的速度
            this.enemyTimer = 0
            this.debug = false
            this.score = 0
            this.fontColor = 'black'
            this.time=0
            this.maxTime=60000
            this.gameOver=false
            this.lives=5
            this.winningScore=40
            this.player.currentState = this.player.states[0]
            this.player.currentState.enter()
        }
        update(deltaTime) {
            this.time+=deltaTime
            if(this.time>this.maxTime) this.gameOver=true
            this.background.update()
            this.player.update(this.input.keys, deltaTime)
            // 敌人的更新控制
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
                
            })
            // 处理消除敌人消息
            this.floatingMessages.forEach(message=>{
                message.update()
            })
            // 处理粒子效果
            this.particles.forEach((particle,index)=>{
                particle.update()
                
            })
           if(this.particles.length>this.maxParticles){
            this.particles.length=this.maxParticles
           }

            //    处理碰撞动画效果
           this.collisions.forEach((collision,index)=>{
            collision.update(deltaTime);
           })

           this.enemies=this.enemies.filter(enemy=>!enemy.markedForDeletion)
           this.particles=this.particles.filter(particle=>!particle.markedForDeletion)
           this.collisions=this.collisions.filter(collision=>!collision.markedForDeletion)
           this.floatingMessages=this.floatingMessages.filter(message=>!message.markedForDeletion)
           console.log(this.enemies,this.particles,this.collisions,this.floatingMessages)

        }
        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.particles.forEach(particle=>{
                particle.draw(context)
            })
            this.collisions.forEach(collision=>{
                collision.draw(context)
            })
            this.floatingMessages.forEach(message=>{
                message.draw(context)
            })
            this.ui.draw(context)
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this))
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))
            this.enemies.push(new FlyingEnemy(this))
            
        }
    }
    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        if(!game.gameOver)requestAnimationFrame(animate)
    }
    animate(0)
})