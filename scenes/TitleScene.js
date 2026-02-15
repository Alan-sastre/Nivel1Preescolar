class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const { width, height } = this.scale;

        // Fondo colorido usando Graphics
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x001532, 0x001532, 0x003366, 0x003366, 1);
        graphics.fillRect(0, 0, width, height);

        // Decoración de fondo (círculos suaves)
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.Between(50, 200);
            graphics.fillStyle(0xffffff, 0.05);
            graphics.fillCircle(x, y, size);
        }

        // Título
        this.add.text(width / 2, height / 3, 'CONSTRUYE EL ROBOT', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '64px',
            color: '#00ffff',
            fontWeight: 'bold'
        }).setOrigin(0.5).setShadow(2, 2, '#000000', 2, true, true);

        this.add.text(width / 2, height / 3 + 80, 'Nivel 1', {
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botón de Jugar (creado con Graphics)
        const btnWidth = 200;
        const btnHeight = 80;
        const btnX = width / 2 - btnWidth / 2;
        const btnY = height * 0.7;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x00ff00, 1);
        btnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
        btnBg.lineStyle(4, 0xffffff);
        btnBg.strokeRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);

        const btnText = this.add.text(width / 2, btnY + btnHeight / 2, '¡JUGAR!', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '32px',
            color: '#000000',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Hacer el botón interactivo
        const hitArea = new Phaser.Geom.Rectangle(btnX, btnY, btnWidth, btnHeight);
        btnBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        btnBg.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x55ff55, 1);
            btnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
            btnBg.lineStyle(4, 0xffffff);
            btnBg.strokeRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
            btnText.setScale(1.1);
        });

        btnBg.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0x00ff00, 1);
            btnBg.fillRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
            btnBg.lineStyle(4, 0xffffff);
            btnBg.strokeRoundedRect(btnX, btnY, btnWidth, btnHeight, 20);
            btnText.setScale(1);
        });

        btnBg.on('pointerdown', () => {
            this.scene.start('Puzzle1Scene');
        });

        // Animación simple del título
        this.tweens.add({
            targets: btnText,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}