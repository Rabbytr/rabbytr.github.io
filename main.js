        
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-example', 
    { preload: preload, create: create, update:update,type: Phaser.WEBGL });

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
    game.load.image('mtile', 'assets/majiang.png', Tile.SIZE, Tile.SIZE);
    for(let i=0;i<Tile.TYPENUM;i++){
        game.load.image(`type${i}`, `assets/type${i}.jpg`, Tile.SIZE, Tile.SIZE);
    }
}

function create() {
    game.stage.backgroundColor = "#c2e9fb";

    window.sky = game.add.sprite(100, 100, 'sky')

    console.log(window.innerWidth, window.innerHeight)

    window.stack = new TileStack(50,window.innerHeight-250,Tile.SIZE)

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
    LAYER = 12
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

let flag = true
function update() {
    if (flag){
        console.log(sky.children[0].getBounds(), sky.children[5].getBounds())
        flag = false
    }
}

function moveToStack (sprite) {
    if (sky.children.length<7){
        success()
    }
    console.log(sky.children.length)

    if (!sprite.movable()){
        return
    }
    put = stack.put(sprite)
    if (put.available){
        // unclickable
        sprite.inputEnabled = false

        tween = game.add.tween(sprite).to( { x: put.x, y: put.y }, 200, 'Linear', true)
        tween.onComplete.add(()=>{
            stack.eliminate()
        })
    }else{
        failed()
    }
}

function success(){
    var textGroup = game.add.group();
    for (var i = 0; i < 50; i++) {
        textGroup.add(game.make.text(100, 64 + i * 36, '不愧是你小子, 不愧是你小子, 不愧是你小子, 不愧是你小子',  
            { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
    }
}

function failed(){
    var textGroup = game.add.group();
    for (var i = 0; i < 50; i++) {
        textGroup.add(game.make.text(100, 64 + i * 36, '你小子不行, 你小子不行, 你小子不行, 你小子不行',  
            { font: "32px Arial", fill: '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16) }));
    }
}