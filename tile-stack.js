

class TileStack{
    constructor(x,y,tileSize){
        this.x = x
        this.y = y
        this.tileSize = tileSize  
        this.currentTileIndex = 8  
        this.container = new Array(7).fill(null)
    }

    put(tile){
        let index = this.container.indexOf(null)
        if (index===-1){
            return {
                available: false
            }
        }
        this.container[index] = tile
        this.currentTileIndex = index   
        return {
            available: true,
            x: this.x + index*1.2*this.tileSize,
            y: this.y,
        }
        
    }

    eliminate(){
        let tile = this.container[this.currentTileIndex]
        if (tile===null){
            return
        }
        let type = tile.data.type
        let count = 0
        for(let item of this.container){
            if (item===null)continue
            if (item.data.type===type){
                count += 1
            }
        }
        if (count < 3){
            return 
        }
        count = 0
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