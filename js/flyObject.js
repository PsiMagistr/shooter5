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
        this.isShooting = false;
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