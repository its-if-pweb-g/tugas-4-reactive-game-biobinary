import Phaser from 'phaser';

class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        
        super(scene, x, y, "player_bullet");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play("player_bullet_fly");
        this.setScale(2.5);

    }

    update() {
        if (this.y < 0) {
            this.destroy();
        }
    }
    
}

export default Bullet;