

class TileStack{
    constructor(x,y,tileSize){
        this.x = x
        this.y = y
        this.tileSize = tileSize  
        this.container = new Array(7).fill(null)

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
        return {
            available: true,
            x: this.x + index*1.2*this.tileSize,
            y: this.y,
        }
        
    }

    eliminate(){
        let type = -1
        for (let i=0; i<this.counter.length; i++){
            if(this.counter[i] >= 3){
                type = i
                break
            }
        }
        this.counter[type] -= 3

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