import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.currentScore = data.score || 0; // Mengambil nilai skor dari SceneTwo
        this.highScore = localStorage.getItem('highScore') || 0; // Ambil high score dari localStorage
    }

    create() {

        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            localStorage.setItem('highScore', this.highScore); // Simpan high score ke localStorage
        }

        // Teks "Game Over"
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over', {
            fontFamily: 'VT323', 
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Tampilkan current score
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, `Your Score: ${this.currentScore}`, {
            fontFamily: 'VT323', 
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Tampilkan high score
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, `High Score: ${this.highScore}`, {
            fontFamily: 'VT323', 
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Teks untuk restart
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Press SPACE to Restart', {
            fontFamily: 'VT323', 
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.spacebar.on('down', () => {
            this.scene.start('SceneTwo');
        });
    }

}

export default GameOverScene;