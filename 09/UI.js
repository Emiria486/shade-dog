export class UI{
    constructor(game){
        this.game=game
        this.fontSize=28
        this.fontFamily='Creepster'
        this.liveImage=document.getElementById('lives')
    }
    draw(context){
        context.save()
        context.font=this.fontSize+'px '+this.fontFamily
        context.textAlign='left'
        context.fillStyle=this.game.fontColor
        // 分数绘制
        context.fillText('Score: '+this.game.score,20,50)
        // 时间绘制
        context.font=this.fontSize*0.8+'px '+this.fontFamily
        context.fillText('Time: '+(this.game.time*0.001).toFixed(1),20,80)
        // 生命值绘制
       for(let i=0;i<this.game.lives;i++){
        context.drawImage(this.liveImage,25*i+20,95,25,25)
       }
        // 游戏结束看板
        if(this.game.gameOver){
            context.textAlign='center'
            context.font=this.fontSize*2+'px '+this.fontFamily
            if(this.game.score>this.game.winningScore){
                context.fillText('you win this game,your score is :'+this.game.score,this.game.width*0.5,this.game.height*0.5)
            }
            else{
                context.fillText('not bad,your score is :'+this.game.score,this.game.width*0.5,this.game.height*0.5)
            }
            
        }
        context.restore()
    }
}