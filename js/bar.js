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