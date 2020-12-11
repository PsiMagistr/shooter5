class EnergyBallon extends flyObject{
    constructor(x, y, size, speed, ship){
        super(x, y, size, speed, ship);
        this.kadrIndex = 2;
        this.addEvent("onShip", ship.setBonus.bind(ship, ship.manaBar, 5));
    }
}