import Phaser from 'phaser';

class EnemyBullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        
        super(scene, x, y, "enemy_bullet");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.flipY = true;
        this.setScale(2.5);
    
    }

    update() {
        if (this.y > this.scene.scale.height) {
            this.destroy(); 
        }
    }
}

export default EnemyBullet;
