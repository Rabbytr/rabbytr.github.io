

class TileStack{
    static CONTAINERSIZE = 7
    constructor(x,y,tileSize){
        this.x = x
        this.y = y
        this.tileSize = tileSize  
        this.currentNum = 0
        this.container = new Array(TileStack.CONTAINERSIZE).fill(null)
        this.text = game.make.text(x, y-this.tileSize, `Available: ${TileStack.CONTAINERSIZE-this.currentNum}`,  
                    { font: "42px Arial", fill: '#ffffff' })
        assistance.addChild(this.text)

        console.log(Tile.TYPENUM)
        this.counter = new Array(Tile.TYPENUM).fill(0)

    }

    put(tile){
        let index = this.container.indexOf(null)
        if (index===-1){
            return {
                available: false
            }
        }
        this.container[index] = tile
        this.counter[tile.data.type] += 1
        this.tileChange(1)
        return {
            available: true,
            x: this.x + index*1.2*this.tileSize,
            y: this.y,
        }
        
    }

    tileChange(num){
        this.currentNum += num
        this.text.setText(`Available: ${TileStack.CONTAINERSIZE-this.currentNum}`)
    }

    eliminate(){
        let type = -1
        for (let i=0; i<this.counter.length; i++){
            if(this.counter[i] >= 3){
                type = i
                break
            }
        }
        if(type==-1){
            return
        }
        this.counter[type] -= 3
        this.tileChange(-3)

        let count = 0
        for (let i=0; i<this.container.length; i++) {
            let item = this.container[i]
            if (item===null)continue
            if (item.data.type===type){
                this.container[i] = null
                item.destroy()
                count += 1
            }
            if (count==3){
                break
            }
        }
    }
}