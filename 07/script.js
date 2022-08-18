window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d')
    canvas.width = 1400
    canvas.height = 720
    let enemies = []
    let score=0
    let gameOver=false
    const fullScreenButton=this.document.getElementById('fullScreenButton')
    class InputHandler { //游戏控制类
        constructor() {
            this.keys = []
            this.touchY=''
            this.touchThreshold=100 //滑动阈值,超过30触发滑动
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight') &&
                    this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }else if(e.key==='Enter'&&gameOver) restartGame()
            })
            window.addEventListener('keyup', e => {
                if (
                    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight'
                ) {
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
            })
            window.addEventListener('touchstart',e=>{
                this.touchY=e.changedTouches[0].pageY
            })
            window.addEventListener('touchmove',e=>{
                const swipeDistance=e.changedTouches[0].pageY-this.touchY
                if(swipeDistance<-this.touchThreshold && this.keys.indexOf('swipe up')===-1) this.keys.push('swipe up')
                else if(swipeDistance>this.touchThreshold && this.keys.indexOf('swipe down')===-1) 
                {
                    this.keys.push('swipe down')
                    if(gameOver) restartGame()
                }
            }) 
            window.addEventListener('touchend',e=>{
                console.log(this.keys)
                this.keys.splice(this.keys.indexOf('swipe up'),1)
                this.keys.splice(this.keys.indexOf('swipe down'),1)
            }) 
        }
    }
    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 200
            this.height = 200
            this.x = 0
            this.y = this.gameHeight - this.height
            this.image = document.getElementById('player')
            this.frameX = 0
            this.maxFrame = 8
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.frameY = 0
            this.speedX = 0
            this.speedY = 0
            this.weight = 1 //使物体回落的重力
        }
        restart(){
            this.x=0
            this.y=this.gameHeight-this.height
            this.maxFrame=8
            this.frameY=0
        }
        draw(context) {
            context.linerWidth=5
            context.strokeStyle='white'
           context.beginPath()
           context.arc(this.x+this.width/2,this.y+this.width/2+20,this.width/3,0,Math.PI*2)
           context.stroke()

            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input,deltaTime,enemies) {
            enemies.forEach(enemy=>{
                const dx=(enemy.x+enemy.width/2-20)-(this.x+this.width/2)
                const dy=(enemy.y+enemy.height/2)-(this.y+this.height/2+20)
                const distance=Math.sqrt(dx*dx+dy*dy)
                if(distance<enemy.width/3+this.width/3){
                    gameOver=true
                }
            })
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
            }else{
                this.frameTimer+=deltaTime
            }
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speedX = 5
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speedX = -5
            } else if ((input.keys.indexOf('ArrowUp') > -1 ||input.keys.indexOf('swipe up')>-1) && this.onGround()) {
                this.speedY -= 32
            } else {
                this.speedX = 0
            }
            this.x += this.speedX
            if (this.x < 0) this.x = 0
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            this.y += this.speedY
            if (!this.onGround()) {
                this.speedY += this.weight //不在地面就向下方的Y下降
                this.maxFrame=6
                this.frameY = 1
            } else {
                this.speedY = 0 //在地面就不对Y轴高度改变
                this.maxFrame=8
                this.frameY = 0
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        onGround() { //判断player是否在地面上
            return this.y >= this.gameHeight - this.height
        }
    }
    class BackGround {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('background')
            this.x = 0
            this.y = 0
            this.width = 2400
            this.height = 720
            this.speed = 7
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed
            if (this.x < 0 - this.width) this.x = 0
        }
        restart(){
            this.x=0
        }
    }
    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 160
            this.height = 119
            this.image = document.getElementById('enemy')
            this.x = this.gameWidth
            this.y = this.gameHeight - this.height
            this.frameX = 0
            this.maxFrame = 5
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.speed = 8
            this.markForDeletion=false
        }
        draw(context) {
            context.linerWidth=5
             context.strokeStyle='white'
            context.beginPath()
            context.arc(this.x+this.width/2,this.y+this.width/2-20,this.width/3,0,Math.PI*2)
            context.stroke()

            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            this.x -= this.speed
            if(this.x<0-this.width){
                this.markForDeletion=true
                score++
            } 
        }
    }

    function handledEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomMyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height))
            randomMyInterval = Math.random() * 1000 + 500
            enemyTimer = 0
        } else {
            enemyTimer += deltaTime
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx)
            enemy.update(deltaTime)
        })
        enemies=enemies.filter(enemy=>!enemy.markForDeletion)
    }

    function displayStatusText(context) {
        context.textAlign='left'
        context.font='40px Helvetica'
        context.fillStyle='black'
        context.fillText('Score:'+score,20,50)
        context.fillStyle='white'
        context.fillText('Score:'+score,20,52)
        if(gameOver){
            context.textAlign='center'
            context.fillStyle='black'
            context.fillText('Game Over,press Enter or swipe down  to restart',canvas.width/2,200)
            context.fillStyle='white'
            context.fillText('Game Over,press Enter or swipe down to restart',canvas.width/2+2,202)
        }
    }
    function restartGame(){
        player.restart()
        background.restart()
        enemies=[]
        score=0
        gameOver=false
        animate(0)
    }
       //禁止页面滑动

       function stopScroll() {
        var html = document.getElementsByTagName('html')[0];
        var body = document.getElementsByTagName('body')[0];
        var o = {};
        o.can = function () {
            html.style.overflow = "visible";
            html.style.height = "auto";
            body.style.overflow = "visible";
            body.style.height = "auto";
        },
            o.stop = function () {
                html.style.overflow = "hidden";
                html.style.height = "100%";
                body.style.overflow = "hidden";
                body.style.height = "100%";
            }
        return o
    }
    const scroll = stopScroll()
    scroll.stop()  //禁止页面滚动   

    function toggleFullScreen(){
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err=>{
                alert(`错误，不能切换为全屏模式：${err.message}`)
            })
        }else{
            document.exitFullscreen()
        }
    }
    fullScreenButton.addEventListener('click',toggleFullScreen)
    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new BackGround(canvas.width, canvas.height)
    let lastTime = 0
    let enemyTimer = 0
    let enemyInterval = 1000
    let randomMyInterval = Math.random() * 1000 + 500

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        background.draw(ctx)
        background.update()
        player.draw(ctx)
        player.update(input,deltaTime,enemies)
        handledEnemies(deltaTime)
        displayStatusText(ctx)
        if(!gameOver) requestAnimationFrame(animate)
    }
    animate(0)
})