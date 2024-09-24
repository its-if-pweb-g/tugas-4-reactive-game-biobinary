import Phaser from "phaser";
import Bullet from "./Bullet";
import EnemyBullet from "./EnemyBullet";

class SceneTwo extends Phaser.Scene {   

    constructor() {

        super({key: "SceneTwo"});
        
        this.enemyGroup = null;
        this.enemySpeed = 30;
        
        this.rowSpacing = 60;
        this.columnSpacing = 120;

        this.playerSpeed = 200;
        
        this.playerHealthText = null;
        this.bulletGroup = null;
        this.score_label = null;
        this.enemyBulletGroup = null;

    }

    init() {
        this.direction = 1;
        this.playerHealth = 100;
        this.lastFired = 0.0;
        this.enemyLastFired = 0.0;
        this.score = 0;
        this.kamikazeCooldown = Phaser.Math.Between(6000, 10000);
        this.isEnemyReady = true;
        this.gameOver = false;
    }

    create() {

        this.space = this.add.tileSprite(400, 300, 800, 600, "background").setScrollFactor(0);
        this.stars = this.add.tileSprite(400, 300, 800, 600, "starfield").setScrollFactor(0);

        this.bulletGroup = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        this.enemyBulletGroup = this.physics.add.group({
            classType: EnemyBullet,
            maxSize: 50,
            runChildUpdate: true
        });

        this.enemyGroup = this.physics.add.group();
        this.spawnNewWave();

        this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
        this.player.setScale(2.0);
        this.player.setCollideWorldBounds(true);
        this.player.play("player_anim");
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(
            this.bulletGroup,
            this.enemyGroup,
            this.bulletHitEnemy,
            null,
            this
        );

        this.physics.add.overlap(this.player, this.enemyBulletGroup, this.bulletHitPlayer, null, this);
        this.physics.add.overlap(this.player, this.enemyGroup, this.handlePlayerCollisionWithEnemy, null, this);

        this.score_label = this.add.text(10, 5, "SCORE: 0", {
            fontFamily: 'VT323', 
            fontSize: '32px', 
            fill: '#ffffff'
        });

        this.playerHealthText = this.add.text(0, 5, "HEALTH: " + this.playerHealth, {
            fontFamily: 'VT323', 
            fontSize: '32px', 
            fill: '#ffffff' });
        this.playerHealthText.setX(this.scale.width - this.playerHealthText.width - 10);

        this.time.addEvent({
            delay: this.kamikazeCooldown,
            callback: this.randomKamikaze,
            callbackScope: this,
            loop: true
        });

    }

    update() {

        if( this.gameOver )
            return;

        if( this.isEnemyReady ) {
            
            this.moveEnemies();
            this.movePlayer();
            this.shootBullet();
            this.enemyShoot();

            if (this.enemyGroup.countActive(true) === 0) {
                this.spawnNewWave();
            }    

        }

        this.space.tilePositionY -= 0.5;
        this.stars.tilePositionY -= 1.0;

    }

    spawnNewWave() {

        this.isEnemyReady = false;

        const rows = 3; 
        const cols = Phaser.Math.Between(3, 6);
        const startY = -50;
    
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                console.log("Spawnn");
                const enemyX = 100 + col * this.columnSpacing;
                const enemyY = startY + row * this.rowSpacing;
                const enemyKey = this.getRandomEnemyType();
                this.createEnemy(enemyX, enemyY, enemyKey, 
                    enemyKey == "enemy_small" ? "small_fly" : 
                    (enemyKey == "enemy_medium") ? "medium_fly" : "big_fly");
            }
        }
    
        this.enemyGroup.children.iterate((enemy) => {
            if (enemy) {
                this.tweens.add({
                    targets: enemy,
                    y: enemy.y + 100,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        this.isEnemyReady = true; 
                    }
                });
            }
        });
    }

    getRandomEnemyType() {
        const enemyTypes = ["enemy_small", "enemy_medium", "enemy_big"];
        return Phaser.Utils.Array.GetRandom(enemyTypes);
    }

    createEnemy(x, y, key, anim_key) {
        const enemy = this.enemyGroup.create(x, y, key).setScale(2.0);
        enemy.isKamikaze = false;
        enemy.play(anim_key);
    }

    moveEnemies() {

        let hitBoundary = false;
        
        this.enemyGroup.children.iterate((enemy) => {

            if(enemy && !enemy.isKamikaze) {

                enemy.x += this.enemySpeed * this.direction * 0.02;

                if (enemy.x > this.scale.width - 32 || enemy.x < 32) {
                    hitBoundary = true;
                }
            }

        });

        if (hitBoundary) {
            this.direction *= -1;
            this.enemyGroup.children.iterate((enemy) => {
                if( enemy && !enemy.isKamikaze )
                    enemy.y += 10;
            });
        }

        this.enemyGroup.children.iterate((enemy) => {
            if (enemy && enemy.y > this.scale.height) {
                enemy.destroy();
            }
        });

    }

    movePlayer() {

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }

        this.player.setVelocityY(0);
    
    }

    shootBullet() {

        const current_time = this.time.now;
        const fire_rate = 300;

        if(Phaser.Input.Keyboard.JustDown(this.spacebar) && current_time > this.lastFired + fire_rate) {
            let bullet = this.bulletGroup.get(this.player.x, this.player.y - 20);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setVelocityY(-400);
            }
            this.lastFired = current_time;
        }

    }

    enemyShoot() {
    
        const fire_rate = 2500;
        const current_time = this.time.now;
    
        if( current_time > this.enemyLastFired + fire_rate) {

            this.enemyGroup.children.iterate((enemy) => {
                if( enemy && this.enemyCanShoot(enemy) ) {
                    let bullet = this.enemyBulletGroup.get(enemy.x, enemy.y + 20);
                    if( bullet ) {
                        bullet.setActive(true);
                        bullet.setVisible(true);
                        bullet.setVelocityY(200);
                    }
                }
            });

            this.enemyLastFired = current_time;

        }

    }

    enemyCanShoot(shooter) {

        if(shooter.isKamikaze)
            return false;

        let canShoot = true;
    
        this.enemyGroup.children.iterate((otherEnemy) => {
            if (otherEnemy !== shooter) {
                if (otherEnemy.x === shooter.x && otherEnemy.y > shooter.y) {
                    canShoot = false;
                }
            }
        });
    
        return canShoot;

    }

    // Callback to do Kamikaze to random enemy ship 
    randomKamikaze() {
        
        const availableEnemies = this.enemyGroup.getChildren().filter(
            enemy => !enemy.isKamikaze && this.canDoKamikaze(enemy)
        );

        if( availableEnemies.length > 0 ) {
            
            const randomIdx = Phaser.Math.Between(0, availableEnemies.length - 1);
            const enemyToKamikaze = availableEnemies[randomIdx];

            enemyToKamikaze.isKamikaze = true;
            enemyToKamikaze.setVelocityY(250);

        }

    }

    // Check if enemy ship can do kamikaze
    canDoKamikaze(shooter) {

        let canKamikaze = true;

        this.enemyGroup.children.iterate((otherEnemy) => {

            if ( otherEnemy && otherEnemy !== shooter && !otherEnemy.isKamikaze) {
                if (otherEnemy.x === shooter.x && otherEnemy.y > shooter.y) {
                    canKamikaze = false;
                }
            }
        });

        return canKamikaze;

    }

    // This Happens when enemy bullet hit player
    bulletHitPlayer(player, bullet) {

        bullet.destroy();

        const explosion = this.add.sprite(player.x, player.y, "explosion").setScale(2.0);
        explosion.play("explosion_anim");
        explosion.on("animationcomplete", () => {
            explosion.destroy();
        });

        this.playerHealth -= 25;
        
        this.playerHealthText.setText("HEALTH: " + this.playerHealth);
        this.playerHealthText.setX(this.scale.width - this.playerHealthText.width - 10);

        if( this.playerHealth <= 0 )
            this.playerDeath();

    }

    handlePlayerCollisionWithEnemy(player, enemy) {

        enemy.destroy();

        const explosion = this.add.sprite(enemy.x, enemy.y, "explosion").setScale(2.0);
        explosion.play("explosion_anim");
        explosion.on("animationcomplete", () => {
            explosion.destroy();
        });

        this.playerHealth -= 50;

        this.playerHealthText.setText("HEALTH: " + this.playerHealth);
        this.playerHealthText.setX(this.scale.width - this.playerHealthText.width - 10);

        if( this.playerHealth <= 0 )
            this.playerDeath();

    }

    // This Happens When Player Bullet Hit an Enemy Ship
    bulletHitEnemy(bullet, enemy) {
        
        console.log(enemy)

        bullet.destroy();
        enemy.destroy();

        const explosion = this.add.sprite(enemy.x, enemy.y, "explosion").setScale(2.0);
        explosion.play("explosion_anim");
        explosion.on("animationcomplete", () => {
            explosion.destroy();
        });

        if (enemy.texture.key === "enemy_small") {
            this.score += 5;
        } else if (enemy.texture.key === "enemy_medium") {
            this.score += 10;
        } else if (enemy.texture.key === "enemy_big") {
            this.score += 20;
        }

        this.score_label.text = "SCORE: " + this.score; 

    }

    // Handling Player Death
    playerDeath() {
        this.gameOver = true;
        this.scene.stop();
        this.scene.start('GameOverScene', {score: this.score});
    }

}

export default SceneTwo;