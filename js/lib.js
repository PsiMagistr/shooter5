class Bar{
    constructor(param){
        for(let prop in param){
            this[prop] = param[prop];
        }
    }
    getCurrentBar(){
        return Math.floor(this.width / this.max * this.current);
    }
}

class Ship{
    constructor(x , y, size, maxShootDeley, sounds){
        this.x = x;
        this.y = y;
        this.size = size;
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
    move(cw){
        this.x += this.speed;
        if((this.x < 0)||(this.x >= cw - 50)){
           this.x -= this.speed;
        }
    }
    setBonus(bar, bonus){
        bar.current += bonus;
        if(bar.current < 0){
            bar.current = 0;
        }
        else if(bar.current > bar.max){
            bar.current = bar.max;
           // this.sounds.bonus.play();

        }
        this.sounds.bonus.play();
    }
    shoot() {
        if (this.currentShootDeley == 0) {
             this.bullets.push(new Rocet(this.x + 10, 555, 4, "#00FF00"), new Rocet(this.x + 35, 555, 4, "#00FF00"));
             this.currentShootDeley = this.maxShootDeley;
             this.setBonus(this.manaBar, -1);
             this.sounds.blaster.play();

        }        
    }
}

class Rocet{
    constructor(x, y, speed, color){
        this.x = x;
        this.y = y;
        this.del = false;
        this.speed = speed;
        this.color = color;
    }
    move(worldObjects, r, sound, ship){
        this.y -= this.speed;
        if (this.y < 0) {
            this.del = true;  
        }
        else{
            for(let i  = 0; i < worldObjects.length; i++){
                if((this.x >= worldObjects[i].x) &&
                    (this.x < worldObjects[i].x + worldObjects[i].size)&&
                    (this.y >= worldObjects[i].y)&&
                    (this.y < worldObjects[i].y + worldObjects[i].size)){
                    if(worldObjects[i] instanceof Meteor){
                        if(r <= 50){
                            worldObjects[i].del = true;
                        }
                        else if(r > 50 && r < 75){
                            worldObjects.splice(i, 1, new EnergyBallon(worldObjects[i].x, worldObjects[i].y, worldObjects[i].size, 5, ship));

                        }
                        else{
                            worldObjects.splice(i, 1, new Apteka(worldObjects[i].x, worldObjects[i].y, worldObjects[i].size, 5, ship));

                        }
                    }
                   this.del = true;
                   sound.play();
                }
            }
        }
    }
}

class flyObject{
    constructor(x, y, size, speed, ship){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.del = false;
        this.onEarth = [];
        this.onShip = [];
        this.ship = ship;
        this.collision = false;
    }
    addEvent(name, callback){
        this[name].push(callback);
    }

    move(cheight, cwidth){
        this.y += this.speed;
        if(this.y >= cheight){
            this.del = true;
            for(let callback of this.onEarth){
               callback();
            }
        }
        if((this.y >= this.ship.y) && (!this.collision)){
            if(((this.ship.x >= this.x) &&
                (this.ship.x < this.x + this.size))||
                (this.x >= this.ship.x) &&
                (this.x < this.ship.x + this.size)){
                for(let callback of this.onShip){
                    callback();
                    this.collision = true;
                    //alert();
                }
            }
        }

    }
}

class Meteor extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 0;
        this.addEvent("onEarth", ship.setBonus.bind(ship, ship.healthBar, -10));
    }
}

class Apteka extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 1;
        this.addEvent("onShip", ship.setBonus.bind(ship, ship.healthBar, 5));

    }
}

class EnergyBallon extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 2;
        this.addEvent("onShip", ship.setBonus.bind(ship, ship.manaBar, 5));
    }
}