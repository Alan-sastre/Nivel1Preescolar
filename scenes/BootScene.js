class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // No hay assets externos, pero podemos mostrar un mensaje de carga si fuera necesario
    }

    create() {
        this.scene.start('TitleScene');
    }
}