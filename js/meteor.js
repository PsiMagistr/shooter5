class Meteor extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 0;
        this.addEvent("onEarth", ship.setDamage.bind(ship, ship.healthBar, 10));
    }
}