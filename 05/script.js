const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d')
canvas.width=window.innerWidth
canvas.height=window.innerHeight

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width=window.innerWidth
collisionCanvas.height=window.innerHeight

let timeToNextRaven=0   //变量，距离下一只乌鸦生成的时间
let ravenInterval=500   //生成乌鸦的时间间隔
let lastTime=0 //前一个时间戳时间
let ravens=[]   
let gameOver=false  //是否游戏结束标准
ctx.font='50px Impact'
let score=0
class Raven{
    constructor(){
        this.spritWidth=271
        this.spritHeight=194
        this.sizeModifier=Math.random()*0.6+0.4
        this.width=this.sizeModifier*this.spritWidth
        this.height=this.sizeModifier*this.spritHeight
        this.x=canvas.width//保证乌鸦的路径是窗口的全部
        this.y=Math.random()*(canvas.height-this.height) //防止乌鸦出现在窗口的下面或只出现一部分
        this.directionX=Math.random()*5+3 //水平速度
        this.directionY=Math.random()*5-2.5;//垂直速度 
        this.markForDeletion=false
        this.image=new Image()
        this.image.src='../src/img/05/项目 5：傻瓜射击游戏.png'
        this.frame=0
        this.maxFrame=4
        this.timeSinceFlap=0
        this.flapInterval=Math.random()*50+50  //数值越大扇动翅膀的速度越慢
        this.randomColor=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
        this.color=`rgb(${this.randomColor[0]},${this.randomColor[1]},${this.randomColor[2]})`  //用于碰撞检验
        this.hasTrail=Math.random()>0.5
    }
    update(deltatime){
        if(this.y<0||this.y>canvas.height-this.height){ //防止乌鸦跳出画布高度
            this.directionY=this.directionY*-1
        }
        this.x-=this.directionX
        this.y+=this.directionY
        if(this.x<0-this.width) this.markForDeletion=true   //假如乌鸦达到屏幕外就可以删除
        this.timeSinceFlap+=deltatime
        if(this.timeSinceFlap>this.flapInterval){
            if(this.frame>this.maxFrame) this.frame=0
            else this.frame++
            this.timeSinceFlap=0
            if(this.hasTrail){
                for(let i=0;i<5;i++){//限制粒子效果只出现5个
                    particles.push(new Particle(this.x,this.y,this.width,this.color))
                }
            }
        }
        if(this.x<0-this.width) gameOver=true   //乌鸦碰到边界就判断游戏结束
    }
    draw(){
        collisionCtx.fillStyle=this.color
        collisionCtx.fillRect(this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.spritWidth*this.frame,0,this.spritWidth,this.spritHeight,this.x,this.y,this.width,this.height)
    }
}
let explosions=[]
class Explosion{
    constructor(x,y,size){
        this.image=new Image()
        this.image.src='../src/img/05/项目 5：尘云.png'
        this.spritWidth=200
        this.spritHeight=179
        this.size=size
        this.x=x
        this.y=y
        this.frame=0
        this.sound=new Audio()
        this.sound.src='../sound/cloud/Ice attack 2.wav'
        this.timeSinceLastFrame=0
        this.frameInterVal=200
        this.markForDeletion=false
    }
    update(deltatime){
        if(this.frame===0) this.sound.play()
        this.timeSinceLastFrame+=deltatime
        if(this.timeSinceLastFrame>this.frameInterVal){
            this.frame++
            this.timeSinceLastFrame=0
            if(this.frame>5) this.markForDeletion=true
        }
    }
    draw(){
        ctx.drawImage(this.image,this.frame*this.spritWidth,0,this.spritWidth,this.spritHeight,this.x,this.y,this.size,this.size)
    }
}
// 乌鸦身体后的粒子效果
let particles=[]
class Particle{
    constructor(x,y,size,color){
        this.size=size
        this.x=x+this.size/2
        this.y=y+this.size/3
        this.radius=Math.random()*this.size/10
        this.maxRadius=Math.random()*20+35
        this.markForDeletion=false
        this.speedX=Math.random()*1+0.5
        this.color=color
    }
    update(){
        this.x+this.speedX
        this.radius+=0.5
        if(this.radius>this.maxRadius) this.markForDeletion=true
    }
    draw(){
        ctx.save()
        ctx.globalAlpha=1-this.radius/this.maxRadius
        ctx.beginPath()
        ctx.fillStyle=this.color
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
        ctx.fill()
        ctx.restore()
    }
}
function drawScore(){//绘制左上的游戏分数面版
    ctx.fillStyle='black'
    ctx.fillText('Score:'+score,50,75)  //阴影效果
    ctx.fillStyle='white'
    ctx.fillText('Score:'+score,50,80)
}
window.addEventListener('pointerdown',function(e){
    const detectPixelColor=collisionCtx.getImageData(e.x,e.y,1,1)   //获取鼠标点击的那块区域的相关属性
    const pc=detectPixelColor.data  //鼠标点击的那块区域的rgb值如rgb(0,0,0,0.1)
    ravens.forEach(object=>{    //对每个乌鸦进行碰撞检测
        if(object.randomColor[0]===pc[0] && object.randomColor[1]===pc[1] && object.randomColor[2]===pc[2]){    //假如鼠标点击区域每部分的颜色都和乌鸦的颜色一种
            object.markForDeletion=true //将乌鸦的状态改为可以删除
            score++ //加分
            explosions.push(new Explosion(object.x,object.y,object.width))  //生成爆炸类
        }
    })
})
function drawGameOver(){    //绘制游戏结束面板
    ctx.textAlign='center'
    ctx.fillStyle='black'
    ctx.fillText('Game Over your score is :'+score,canvas.width/2,canvas.height/2)
    ctx.fillStyle='white'
    ctx.fillText('Game Over your score is :'+score,canvas.width/2,canvas.height/2+5)
}
function animate(timestamp){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    collisionCtx.clearRect(0,0,canvas.width,canvas.height)
    let deltatime=timestamp-lastTime
    lastTime=timestamp
   timeToNextRaven+=deltatime
   if(timeToNextRaven>ravenInterval){
    ravens.push(new Raven())
    timeToNextRaven=0   //生成乌鸦后重新计时
    ravens.sort(function(a,b){  //大乌鸦在前面，小乌鸦在后面
        return a.width-b.width
    })
   }
   drawScore(); 
   [...particles,...ravens,...explosions].forEach(object=>{object.update(deltatime)});
   [...particles,...ravens,...explosions].forEach(object=>{object.draw()})
   ravens=ravens.filter(object=>!object.markForDeletion)
   explosions=explosions.filter(object=>!object.markForDeletion)
   particles=particles.filter(object=>!object.markForDeletion)
   if(!gameOver){
    requestAnimationFrame(animate)
   }else{
    drawGameOver()
   }
}
animate(0)