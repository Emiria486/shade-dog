let playerState='run' //角色的运动状态
const dropdown=document.getElementById('animations')

dropdown.addEventListener('change',(e)=>{//控制角色的运作状态切换
    playerState=e.target.value
})
// 创建和初始化2d画布
const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d')
const CANVAS_WIDTH=canvas.width=600
const CANVAS_HEIGHT=canvas.height=600


const playerImage=new Image()
playerImage.src="../src/img/01/项目1.png"
//精灵表的宽度为6876最多有12行，所以精灵的宽度为6876/12=575
const spriteWidth=575
//精灵表的宽度为5230一共有10行，所以精灵的高度为5230/10=523
const spriteHeight=523
// 下面frameX,frameY两个变量用于控制精灵表的位置控制,X为控制哪一列的精灵图被选择，Y为控制哪一行的精灵图被控制

let gameFrame=0
// 间隔帧，数字越大角色图片的切换越大看起来越卡顿
const staggerFrames=4


const spriteAnimations=[]
// 对应的动作的图片张数是不一样的
const animationStates=[
    {
        name:"idle",
        frames:7
    },
    {
        name:"jump",
        frames:7
    },
    {
        name:"fall",
        frames:7
    },
    {
        name:"run",
        frames:9
    },
    {
        name:"dizzy",
        frames:11
    },
    {
        name:"sit",
        frames:5
    },
    {
        name:"roll",
        frames:7
    },
    {
        name:"bite",
        frames:7
    },
    {
        name:"ko",
        frames:12
    },
    {
        name:"getHit",
        frames:4
    },

]
// 创建对应动作X坐标和Y坐标的对象数组以便后面的角色移动使用
animationStates.forEach((state,index)=>{
    let frames={
        loc:[]
    }
    for(let j=0;j<state.frames;j++){
        let positionX=j*spriteWidth
        let positionY=index*spriteHeight
        frames.loc.push({x:positionX,y:positionY})
    }
    spriteAnimations[state.name]=frames
})


console.log(spriteAnimations)


function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    let position=Math.floor(gameFrame/staggerFrames)%spriteAnimations[playerState].loc.length
    let frameX=spriteWidth*position
    let frameY=spriteAnimations[playerState].loc[position].y
    ctx.drawImage(playerImage,frameX,frameY,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight)
    gameFrame++
    requestAnimationFrame(animate)
}
animate()