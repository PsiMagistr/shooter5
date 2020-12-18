class Shooter{
    constructor(canvasId, infoId, images_names, sounds_names){
        let canvas = document.querySelector(canvasId);
        this.checkbox = document.querySelector("#check");
        this.checkbox.addEventListener("change", this.onbox.bind(this));
        this.scena = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.images_names = images_names;
        this.sounds_names = sounds_names;
        this.resCount = 0;
        this.totalCount = images_names.length + sounds_names.length;
        this.iresourses = {};
        this.sresourses = {};
        this.pause = true;
        this.gameOver = false;
        this.countOfMeteors = 0;
        //this.ship = new Ship(0, this.width - 55, 50, 40, this.sresourses);
        this.maxGenerationDeley = 100;
        this.currentGenerationDeley = this.maxGenerationDeley;
        this.worldObjects = [];
        this.info = document.querySelector(infoId);
        for(let name of this.images_names){
            this.iresourses[name] = new Image();
            this.iresourses[name].src = "images/" + name + ".png";
            this.iresourses[name].addEventListener("load", this.loadedRes.bind(this));
        }
        for(let name of this.sounds_names){
            this.sresourses[name] = new Audio("sounds/" + name + ".mp3");
            this.sresourses[name].addEventListener("loadeddata", this.loadedRes.bind(this));
        }
        this.ship = new Ship(0, this.width - 55, this.iresourses.gun2, 50, 40, this.sresourses,[{x:4,y:555},{x:36, y:555}]);
        this.run();
        window.addEventListener("keydown", this.keyboard_down.bind(this));
        window.addEventListener("keyup", this.keyboard_up.bind(this));

    }

    keyboard_down(e){
        if(!this.pause){
            switch(e.key){
                case "ArrowRight":
                    this.ship.speed = 5;
                    break;
                case "ArrowLeft":
                    this.ship.speed = -5;
                    break;
                case " ":
                    this.ship.shoot();
                    break;
            }

        }
        if(e.key == "Escape"){
            if(this.gameOver == false){
                this.pause = !this.pause;
            }
            else{
                this.worldObjects = [];
                this.currentGenerationDeley = this.maxGenerationDeley;
                this.ship.reload();
                this.pause = false;
                this.gameOver = false;
            }
        }

    }
    onbox(e){
        /*!e.currentTarget.checked;*/
        for(let key in this.sresourses){
            this.sresourses[key].muted = !e.currentTarget.checked;
            /*!e.currentTarget.checked;*/
        }
        e.currentTarget.blur();
    }
    keyboard_up(e){
       if((e.key == "ArrowLeft")||(e.key == "ArrowRight")){
           this.ship.speed = 0;
       }
    }

    loadedRes(){
        this.resCount++;
    }
    rnd(min, max){
        let r = min + Math.random() * (max - min +1);
        return Math.floor(r);
    }
    generationWorld(){
        this.currentGenerationDeley--;
        if(this.currentGenerationDeley == 0){
            let x = (this.rnd(0, this.width / this.ship.size) -1) * this.ship.size;
            let speed = this.rnd(1, 5);
            this.worldObjects.push(new Meteor(x, 0, 50, speed, this.ship));
            this.currentGenerationDeley = this.maxGenerationDeley;
        }
    }
    clearAll(arr) {
        let temp = [];
        for (let item of arr) {
            if (!item.del) {
                temp.push(item);
            }
        }
        return temp;
    }
    moveAll(arr) {
        for (let item of arr) {
            if(item instanceof Rocet){
                item.move(this.worldObjects, this.rnd(1, 100), this.sresourses.boom, this.ship);
            }
            else if(item instanceof Meteor){
                item.move(this.width, this.height);
            }
            else{
                item.move(this.width, this.height);
            }
        }
    }
    update() {
        if (this.ship.currentShootDeley > 0) {
            this.ship.currentShootDeley--;
        }
        this.generationWorld();
        this.moveAll(this.worldObjects);
        this.moveAll(this.ship.bullets);
        for(let object of this.worldObjects){
            if((object.isShooting == true)){
                this.countOfMeteors++;
                object.isShooting = false;
            }
        }
        this.ship.bullets = this.clearAll(this.ship.bullets);
        this.worldObjects = this.clearAll(this.worldObjects);
        this.ship.move(this.width);
        if(this.ship.healthBar.current == 0){
            this.gameOver = true;
            this.pause = true;
        }
    }
    drawBar(bar){
        this.scena.fillStyle = bar.background;
        this.scena.fillRect(bar.x, bar.y, bar.width, bar.height);
        this.scena.fillStyle = bar.color;
        this.scena.fillRect(bar.x, bar.y, bar.getCurrentBar(), bar.height);
    }
    txtMessage(message){
        this.scena.font = "italic 15pt Arial";
        this.scena.fillStyle = "#B0C4DE";
        this.scena.textBaseline = "middle";
        this.scena.textAlign = "center";
        this.scena.fillText(message, this.width / 2, this.height / 2);
    }

    render(){
        let pausetxt;
        this.scena.clearRect(0, 0, this.width, this.height);
        this.scena.drawImage(this.iresourses.fon, 0, 0, this.width, this.height);
        this.drawBar(this.ship.healthBar);
        this.drawBar(this.ship.manaBar);
        this.drawBar(this.ship.fuelBar);
        this.ship.draw(this.scena);

        for (let bullet of this.ship.bullets) {
            this.scena.fillStyle = bullet.color;
            bullet.draw(this.scena);

        }
        for (let worldObject of this.worldObjects) {
            worldObject.draw(this.scena, this.iresourses.world);
        }
        this.info.innerHTML = `Загружено ресурсов ${this.resCount} из ${this.totalCount}<BR>Количество пулек во Вселенной: ${this.ship.bullets.length},<BR>Количество летающих объектов: ${this.worldObjects.length}<BR> Количество сбитых астероидов: ${this.countOfMeteors}<BR> Жизнь ${this.ship.healthBar.current} из ${this.ship.healthBar.max}`;

        if(this.pause){
            if(this.gameOver){
                pausetxt = "Пауза. Вы проиграли. Для начала новой";
            }
            else{
                pausetxt = "Пауза. Для запуска ";
            }
            this.txtMessage(pausetxt + " игры, нажмите Esc.");
        }

    }
    run(){
        if(this.resCount == this.totalCount && this.pause == false) {
            this.update();
        }
        this.render();
        window.requestAnimationFrame(this.run.bind(this));
    }
}

