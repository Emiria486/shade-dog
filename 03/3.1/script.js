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
        this.image.src='../../src/img/03/enemy1.png'
        // this.speed=Math.random()*4-2
        this.spriteWidth=293
        this.spriteHeight=155
        this.width=this.spriteWidth/2.5
        this.height=this.spriteHeight/2.5
        this.x=Math.random()*(canvas.width-this.width)//后面的括号的计算是为了防止精灵跳出画布
        this.y=Math.random()*(canvas.height-this.height)
        this.frame=0
        this.flapSpeed=Math.floor(Math.random()*3+1)
    }
    update() {
        this.x+=Math.random()*3-1.5
        this.y+=Math.random()*3-1.5
        //实现敌人动作图片的切换和每个敌人随机的震动翅膀
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