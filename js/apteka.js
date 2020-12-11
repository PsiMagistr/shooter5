class Apteka extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 1;
        this.addEvent("onShip", ship.setBonus.bind(ship, ship.healthBar, 10));

    }
}