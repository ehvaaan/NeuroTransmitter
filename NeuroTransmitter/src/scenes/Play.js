//var cursors;

class Play extends Phaser.Scene { 
    constructor() {
        super("playScene")
    }
    
    preload () {
        //load images and tile sprites
        this.load.image('neurotransmitter', './assets/neurotransmitter.png');
        this.load.image('neuron', './assets/neuron.png');
        this.load.image('receptor', './assets/receptor.png');
        //this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ufo', './assets/ufo1.png'); // bonus ship
        this.load.image('brain', './assets/brain.png'); // load brain background
        
        this.load.spritesheet('explosion', './assets/explosion.png',
            {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion1', './assets/explosion.png',
            {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 9});
        
        this.load.image('particle1', './assets/circle_03.png');
        this.load.image('particle2', './assets/circle_02.png')
        this.load.image('particle3', './assets/circle_04.png')

        
          
        }
        
        
        
    
    
        
    
    create() {

        
        
        // Speed up after 30 seconds
        this.clock1 = this.time.delayedCall(30000, () => {
            game.settings.spaceshipSpeed = game.settings.spaceshipSpeed*1.5;
        }, null, this);
    
        
        //game.debug.text('Press down arrow keys to move the tileSprite', 20, 20);
        // place tile sprite 
        this.brain = this.add.tileSprite(0, 0, 640, 480, 'brain').setOrigin(0, 0);
        //this.brain.setTileScale(0.5, 0.5);
        //this.brain = this.add.tileSprite(0, 0, 640, 480, 'brain');
        
        
        
        this.explodeParticles = this.add.particles('particle1');
        this.explodeParticles1 = this.add.particles('particle2');
        this.explodeParticles2 = this.add.particles('particle3');

        // white rectangle backings
        /*
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        */
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // FIRE text
        let fireConfig = {
            fontFamily: 'Montserrat Subrayada',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        } 

        fireConfig.fixedWidth = 0;

        //this.icon = this.add.image(150, 300, 'neuron').setScale(1.5, 1.5);
        //this.add.rectangle(260, 55, 100, 34, 0xF3B141).setOrigin(0, 0);
        //this.add.rectangle(260, 55, 100, 34, 0xF3B141).setOrigin(0, 0);
        this.fire = this.add.text(260, 70, 'FIRE', fireConfig).setOrigin(0.5);
        this.fire.setVisible(false);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'neurotransmitter').setScale(2, 2).setOrigin(0, 0);
    
        // add 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width, 195, 'neuron', 0, 10).setScale(0.5, 0.5).setOrigin(0, 0); // third lowest
        this.ship02 = new Spaceship(this, game.config.width, 325, 'neuron', 0, 10).setScale(0.5, 0.5).setOrigin(0, 0); // lowest neuron
        
        this.ship03 = new Spaceship(this, game.config.width, 260, 'neuron', 0, 10).setScale(0.5, 0.5).setOrigin(0, 0); // second lowest
        
        
        // bonus ship - MAKE A SMALL ELECTRIC CHARGE THAT YOU NEED TO ACTIVATE THE LAST COLLISION WITH THE IMAGE AT TOP OF CHAIN
        //this.ship04 = new SmallShip(this, game.config.width + 300, 100, 'ufo', 0, 50).setScale(0.2, 0.2).setOrigin(0, 0);

        // display timer
        //this.timeLeft = this.add.text(69, 54, this.game.settings.gameTimer.duration, fireConfig);        
        //this.timeLeft.setVisible(true);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        
        // animation config
        /*
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
        start: 0, end: 9, first: 0}),
                frameRate:30
        }); 

        // smaller anim config
        this.anims.create({
            key: 'explode1',
            frames: this.anims.generateFrameNumbers('explosion1', {
        start: 0, end: 9, first: 0}),
                frameRate:30
        });
        */

        

        // score
        this.p1score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Georgia',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        let scoreConfig2 = {
            fontFamily: 'Georgia',
            fontSize: '24px',
            backgroundColor: '#FFFFFF',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.scoreLeft = this.add.text(39, 24, this.p1score, scoreConfig);
        

        // game over flag
        this.gameOver = false;

        


        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or (M) to return to the Menu', scoreConfig2).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        /*if(localStorage.getItem(this.p1score != null)) {
            let storedScore = parseInt(localStorage.getItem(this.p1score));
            console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(level > storedScore) {
                console.log(`New high score: ${level}`);
                localStorage.setItem(this.p1score, level);
                highScore = level;
                newHighScore = true;
            } else {
                console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem(this.p1score));
                newHighScore = false;
            }
        } else {
            console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem(this.p1score, highScore);
            newHighScore = true;
        } */
    
        /*if(this.p1score == 60) {
            return this.gameOver = true;
        }*/
    }

    update() {
        // check key input for restart
        let scoreConfig = {
            fontFamily: 'Georgia',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        if(this.p1score >= 60) {
            this.gameOver = true;
        }

        scoreConfig.fixedWidth = 0;
        if(this.gameOver) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or (M) to return to the Menu', scoreConfig).setOrigin(0.5);
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            game.settings.spaceshipSpeed = game.settings.spaceshipSpeed/1.5;
            this.scene.restart(this.p1score);
        }


        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }

        if((!this.gameOver) && (Phaser.Input.Keyboard.JustDown(keyLEFT) || (keyLEFT.isDown))) {
            this.brain.tilePositionX -= 2;
        }

        if((!this.gameOver) && (Phaser.Input.Keyboard.JustDown(keyRIGHT) || (keyRIGHT.isDown))) {
            this.brain.tilePositionX += 5;
        }
        // scroll tile sprite
        //this.brain.tilePositionX -= 2;

        if(!this.gameOver) {
        // update rocket
        this.p1Rocket.update();

        // update spaceships
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
        // this.ship04.update();
        }

        // check collisions - FIX DETAILED COLLISIONS
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.add.image(this.ship03.x - this.ship03.width * this.ship03.scale, this.ship03.y + this.ship03.height * this.ship03.scale, 'neuron').setScale(0.5, 0.5);
            this.add.sh
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
            
            
            // make second reset method so it will reset coming from other direction
        }
        
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.add.image(this.ship02.x + this.ship02.width * this.ship02.scale, this.ship02.y + this.ship02.height * this.ship02.scale, 'neuron').setScale(0.5, 0.5);
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            //this.ship02.spaceshipSpeed = 0;
            //this.ship02.alpha = 0;
        }
        
       if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.add.image(this.ship01.x + this.ship01.width/2 * this.ship01.scale, this.ship01.y - this.ship01.height/2 * this.ship01.scale, 'neuron').setScale(0.5, 0.5);
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        } 
        /*  if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }   */
        // check collision for second time and reset coming from other direction
    }

        // simple AABB bounds checking - do they overlap
    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width * ship.scale && rocket.x + rocket.width * rocket.scale > ship.x && rocket.y < ship.y + ship.height * ship.scale && rocket.height * rocket.scale + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
        
    }


    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        ship.destroy(); 
        
        // create explosion sprite at ship's position
        //let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        
        if(ship.isSmallShip()) {
            this.explodeParticles.createEmitter({
                x: ship.x, 
                y: ship.y,
                lifespan: 1000,
                speed: { min: 20, max: 100},
                gravityY: 300,
                quantity: 3,
                frequency: 0,
                scale: 0.5
            }).explode();
    
            this.explodeParticles1.createEmitter({
                x: ship.x, 
                y: ship.y,
                lifespan: 1000,
                speed: { min: 20, max: 100},
                gravityY: 300,
                quantity: 3,
                frequency: 0,
                scale: 0.5
            }).explode();
    
            this.explodeParticles2.createEmitter({
                x: ship.x, 
                y: ship.y,
                lifespan: 2000,
                speed: { min: 20, max: 100},
                gravityY: 300,
                quantity: 6,
                frequency: 0,
                scale: 0.5
            }).explode();
            ship.reset(); // reset ship position
            ship.alpha = 1;
            //boom.anims.play('explode').setScale(0.5, 0.5); // play explode animation
        } else {
        this.explodeParticles.createEmitter({
            x: ship.x, 
            y: ship.y,
            lifespan: 2000,
            speed: { min: 20, max: 100},
            gravityY: 300,
            quantity: 6,
            frequency: 0
        }).explode();

        this.explodeParticles1.createEmitter({
            x: ship.x, 
            y: ship.y,
            lifespan: 1000,
            speed: { min: 20, max: 100},
            gravityY: 300,
            quantity: 3,
            frequency: 0,
        }).explode();

        this.explodeParticles2.createEmitter({
            x: ship.x, 
            y: ship.y,
            lifespan: 1000,
            speed: { min: 20, max: 100},
            gravityY: 300,
            quantity: 3,
            frequency: 0,
        }).explode();
        ship.reset();
        this.game.settings.spaceshipSpeed = game.settings.spaceshipSpeed; 
        //this.game.settings.spaceshipSpeed = 0; // reset ship position
        //ship.alpha = 1;
        //boom.anims.play('explode'); // play explode animation
    }
        
    
        
        /*boom.on('animationcomplete', () => { // callback after animation completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
        });
        */
        // score incrememnt and repaint
        this.p1score += ship.points;
        this.scoreLeft.text = this.p1score;

        
        

        if(this.sound) {
            var x = Math.floor(Math.random() * 3);
            if(x == 0){
                this.sound.play('target');
            } else if(x == 1) {
                this.sound.play('target1');
            } else if(x == 2) {
                this.sound.play('target2');
            } else if(x == 3) {
                this.sound.play('target3');
            }
        }
        
        
    }
}