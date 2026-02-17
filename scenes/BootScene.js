class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Cargar música de fondo
    this.load.audio("backgroundMusic", "assets/musica.mp3");
  }

  create() {
    this.scene.start("Puzzle1Scene");
  }
}
