class Ship{
    constructor(x , y, sprite, size, maxShootDeley, sounds){
        this.x = x;
        this.y = y;
        this.size = size;
        this.sprite = sprite;
        this.bullets = [];
        this.speed = 0;
        this.maxShootDeley = maxShootDeley;
        this.currentShootDeley = 0;
        this.sounds = sounds;
        this.healthBar = new Bar({x:5,
            y:5,
            current:100,
            max:100,
            width:170,
            height:10,
            background:"#FFC0CB",
            color:"#FF0000"});
        this.manaBar = new Bar({x:5,
            y:18,
            current:100,
            max:100,
            width:170,
            height:10,
            background:"#E0FFFF",
            color:"#00FF00"});
        this.fuelBar = new Bar({x:5,
            y:30,
            current:100,
            max:100,
            width:170,
            height:10,
            background:"#B0E0E6",
            color:"#00BFFF"});
    }
    reload(){
        this.healthBar.current = this.healthBar.max;
        this.manaBar.current = this.manaBar.max;
    }
    move(cw){
        this.x += this.speed;
        if((this.x < 0)||(this.x >= cw - 50)){
            this.x -= this.speed;
        }
    }
    setBonus(bar, bonus){
        bar.current += bonus;
        if(bar.current > bar.max){
            bar.current = bar.max;
        }
        this.sounds.bonus.play();

    }
    setDamage(bar, damage){
        bar.current -= damage;
        if(bar.current < 0){
            bar.current = 0;
        }

    }
    shoot() {
        if (this.currentShootDeley == 0) {
            this.bullets.push(new Rocet(this.x + 10, 555, 4, "#00FF00"), new Rocet(this.x + 35, 555, 4, "#00FF00"));
            this.currentShootDeley = this.maxShootDeley;
            this.setDamage(this.manaBar, 1);
            this.sounds.blaster.play();

        }
    }
   draw(scena){
       scena.drawImage(this.sprite, this.x, this.y, this.size, this.size);

   }
}