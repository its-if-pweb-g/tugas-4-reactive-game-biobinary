import React, { useEffect, useRef } from "react";
import Phaser, { Game } from "phaser";
import SceneOne from "./scenes/SceneOne";
import SceneTwo from "./scenes/SceneTwo";
import GameOverScene from "./scenes/GameOverScene";
import './Game.css'

const PhaserGame = () => {

    const gameRef = useRef(null);

    useEffect(() => {

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            pixelArt: true,
            physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [SceneOne, SceneTwo, GameOverScene],
        parent: gameRef.current
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };

  }, []);

  return (
    <div className="game-page">
      <h1 className="game-title">Deep In The Heart Of The Space</h1>
      <div className="game-frame" ref={gameRef} />
      <div className="game-description">
        <p>
          Ayo selamatkan umat manusia dari bedebah-bedebah gelombang alien yang sedang mencoba menginvansi galaksi kita.
          Jadi lah pilot pada pesawat tempur yang telah dilengkapi oleh persenjataan yang sangat canggih.
        </p>
      </div>
    </div>
  );

};

export default PhaserGame;