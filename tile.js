
var color = ['red','green','teal','yellow','deepskyblue','tomato','pink']



class Tile extends Phaser.Sprite{
    static SIZE = 100
    static TYPENUM = 15
    constructor(game, x, y,key, layer, type){
        // var gray = game.add.filter('Gray');
        super(game,x,y,key)

        this.addChild(game.make.sprite(5, 5, `type${type}`))


        this.data.layer = layer
        this.data.type = type
        this.data.rect = new Phaser.Rectangle(x,y,Tile.SIZE,Tile.SIZE)

        this.data.upsNum = 0
        this.data.downs = []

        // this.filters = [gray]

        // let text = new Phaser.Text(game,Tile.SIZE/2,Tile.SIZE/2, type.toString())
        // this.addChild(text)
        // text.anchor.set(0.5)
    }

    static randomType(){
        return Math.floor(Math.random()*Tile.TYPENUM)
    }

    addUpTile(){
        if (this.data.upsNum===0) {
            this.children[0].tint = 0xeee
        }
        this.data.upsNum += 1
    }

    removeUpTile(){
        this.data.upsNum -= 1
        if (this.data.upsNum===0) {
            this.children[0].tint = 0xffffff    
        }
    }

    mask(rhs){
        if (this.data.layer===rhs.data.layer+1){
            return Phaser.Rectangle.intersects(this.data.rect, rhs.data.rect)
        }
        return false
    }

    movable(){
        if (this.data.upsNum>0){
            return false
        }
        while(this.data.downs.length){
            let downTile = this.data.downs.pop()
            downTile.removeUpTile()
        }
        return true
    }


    destroy(){
        tween = game.add.tween(this).to( { alpha: 0.1 }, 200, 'Linear', true)
        tween.onComplete.add(()=>{
            super.destroy()
        })
    }
}

