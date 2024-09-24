import Phaser from "phaser";

class SceneOne extends Phaser.Scene {
    
    constructor() {
        super({key: "SceneOne"});
    }

    preload() {

        this.load.image("background", "assets/background.png");
        this.load.image("starfield", "assets/starfield.png");

        this.load.spritesheet("enemy_big", "assets/enemy-big.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("enemy_medium", "assets/enemy-medium.png", {
            frameWidth: 32,
            frameHeight: 16
        });

        this.load.spritesheet("enemy_small", "assets/enemy-small.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("player", "assets/ship.png", {
            frameWidth: 16,
            frameHeight: 24
        });

        this.load.spritesheet("player_bullet", "assets/PlayerBullet.png", {
            frameWidth: 9,
            frameHeight: 16
        });

        this.load.spritesheet("enemy_bullet", "assets/EnemyBullet.png", {
            frameWidth: 16,
            frameHeight: 16
        });

    }

    create() {

        this.add.tileSprite(400, 300, 800, 600, "background");

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'Deep In The Heart Of The Space', {
            fontFamily: 'VT323',
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Tutorial:', {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Move: LEFT / RIGHT arrows', {
            fontFamily: 'VT323',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Shoot: SPACEBAR', {
            fontFamily: 'VT323',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Press SPACE to Start', {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.spacebar.on('down', () => {
            this.scene.start('SceneTwo');
        });

        this.anims.create({
            key: "small_fly",
            frames: this.anims.generateFrameNumbers("enemy_small"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "medium_fly",
            frames: this.anims.generateFrameNumbers("enemy_medium"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "big_fly",
            frames: this.anims.generateFrameNumbers("enemy_big"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explosion_anim",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "player_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "player_bullet_fly",
            frames: this.anims.generateFrameNumbers("player_bullet"),
            frameRate: 20,
            repeat: -1
        });

    }
 
}

export default SceneOne;