const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d')
const CANVAS_WIDTH=canvas.width=1000
const CANVAS_HEIGHT=canvas.height=500
const numberOfEnemies=10
const enemiesArray=[]
let gameFrame=0


class Enemy{
    constructor(){
        this.image=new Image()
        this.image.src='../../src/img/03/enemy2.png'
        this.speed=Math.random()*4+1
        this.spriteWidth=266
        this.spriteHeight=188
        this.width=this.spriteWidth/2.5
        this.height=this.spriteHeight/2.5
        this.x=Math.random()*(canvas.width-this.width)
        this.y=Math.random()*(canvas.height-this.height)
        this.frame=0
        this.flapSpeed=Math.floor(Math.random()*3+1)
        this.angle=0    
        this.angleSpeed=Math.random()*0.2  //控制精灵上下摆动的速度
        this.curve=Math.random()*7//控制精灵上下摆动的幅度
    }
    update() {
        this.x-=this.speed
        this.y+=this.curve*Math.sin(this.angle)
        this.angle+=this.angleSpeed
        if(this.x+this.width<0) this.x=canvas.width//实现无限循环出现
        if(gameFrame%this.flapSpeed===0){
            this.frame>4?this.frame=0:this.frame++
        }
    }
    draw(){
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight, this.x,this.y,this.width,this.height)
    }
}
for(let i=0;i<numberOfEnemies;i++){
    enemiesArray.push(new Enemy())
}
console.log(enemiesArray)
function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    enemiesArray.forEach(enemy=>{
        enemy.update()
        enemy.draw()
    })
    gameFrame++
    requestAnimationFrame(animate)
}
animate()