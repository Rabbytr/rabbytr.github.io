

function goodSequence(num,typeNum){
    const ret = []
    while(ret.length < num){
        let type = Tile.randomType()
        ret.push(type);ret.push(type);ret.push(type)
    }
    if (ret.length > num){
        ret.pop();ret.pop();ret.pop()
    }
    return shuffle(ret)
}