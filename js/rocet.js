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

                    //alert();
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
                    worldObjects[i].isShooting = true;
                    this.del = true;
                    sound.play();
                }
            }
        }
    }
}