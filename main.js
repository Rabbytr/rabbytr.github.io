        
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'canvas', 
    { preload: preload, create: create, update:update});

function shuffle(list) {
  const len = list.length;
  let result = [...list];
  for (let i = len - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[swapIndex]] = [result[swapIndex], result[i]];
  }
  return result;
}

function preload() {
    const IMAGE_NUM = 17
    let level = 5
    const local_level = localStorage.getItem('level')
    if (local_level!==null){
        level = Math.min(parseInt(local_level), IMAGE_NUM)
    }

    console.log('level: ', level)
    Tile.setLevel(level)

    game.load.image('mtile', 'assets/majiang.png', Tile.SIZE, Tile.SIZE);

    let choose = Array.from(new Array(IMAGE_NUM).keys())
    types = shuffle(choose).slice(0,Tile.TYPENUM)

    for(let i=0;i<types.length;i++){
        game.load.image(`type${i}`, `assets/type${types[i]}.jpg`, Tile.SIZE, Tile.SIZE);
    }
}

function create() {
    game.stage.backgroundColor = "#c2e9fb";

    window.sky = game.add.sprite(200, 400, 'sky')

    console.log(window.innerWidth, window.innerHeight)

    window.stack = new TileStack(-100,window.innerHeight-600,Tile.SIZE)

    initPiles()

    console.log(sky.children[0], sky.children[5])
}

function goodSequence(num){
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

function initPiles(){
    LAYER = 2
    ROW = 5
    COL = 5

    const seq = goodSequence(LAYER*ROW*COL)

    let type = -1
    for(let layer=0;layer<LAYER;layer++){
        for(let row=0;row<ROW;row++){
            for(let col=0;col<COL;col++){
                
                if (seq.length > 0){
                    type = seq.pop()
                }else{
                    return
                }

                let sprite = new Tile(game, row*102+50*(layer%2),col*102+50*(layer%2), 'mtile',layer, type)
            
                for(let child of sky.children){
                    if (sprite.data.layer===child.data.layer+1&&sprite.mask(child)) {
                        child.addUpTile()
                        sprite.data.downs.push(child)
                    }
                }
                sky.addChild(sprite)

                sprite.inputEnabled = true;
                // 鼠标移上去变手型
                sprite.input.useHandCursor = true;
                sprite.events.onInputDown.add(moveToStack, this);
            }
        }
    }
}

function update() {

}

function moveToStack (sprite) {
    if (sky.children.length<7){
        success()
    }

    if (!sprite.movable()){
        return
    }
    put = stack.put(sprite)
    if (put.available){
        // unclickable
        sprite.inputEnabled = false

        tween = game.add.tween(sprite).to( { x: put.x, y: put.y }, 500, 'Linear', true)
        tween.onComplete.add(()=>{
            stack.eliminate()
        })
    }else{
        failed()
    }
}

function success(){
    var textGroup = game.add.group();
    for (var i = 0; i < 48; i++) {
        textGroup.add(game.make.text(100, 64 + i * 36, '不愧是你小子, 不愧是你小子, 不愧是你小子, 不愧是你小子',  
            { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
    }

    const local_level = localStorage.getItem('level')
    localStorage.setItem('level', parseInt(local_level)+1)
}

function failed(){
    var textGroup = game.add.group();
    for (var i = 0; i < 50; i++) {
        textGroup.add(game.make.text(100, 64 + i * 36, '你小子不行, 你小子不行, 你小子不行, 你小子不行',  
            { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
        // textGroup.add(game.make.text(100, 64 + i * 36, '天上白玉京，十二楼五城。仙人抚我顶，结发受长生',  
        //     { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
        // textGroup.add(game.make.text(100, 64 + i * 36, '牌必定triple, 堆必定有解. 牌必定triple, 堆必定有解',  
        //     { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
    }
}