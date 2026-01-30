    showAssemblyComplete() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        
        // Stop timer
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        
        // Overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628, 0.85);
        overlay.setDepth(500);
        
        // Panel principal
        const panel = this.add.rectangle(width / 2, height / 2, 550, 380, 0xf7fafc);
        panel.setStrokeStyle(5, 0x00d2ff);
        panel.setDepth(501);
        
        // Decoración superior
        const decor = this.add.rectangle(width / 2, height / 2 - 187, 550, 6, 0x00d2ff);
        decor.setDepth(501);
        
        // Icono de éxito
        const icon = this.add.text(width / 2, height / 2 - 120, '🎉', {
            fontSize: '70px'
        }).setOrigin(0.5).setDepth(502);
        
        this.tweens.add({
            targets: icon,
            scale: { from: 0, to: 1.2 },
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Título
        const title = this.add.text(width / 2, height / 2 - 50, '¡ROBI ESTÁ COMPLETO!', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#00d2ff'
        }).setOrigin(0.5).setDepth(502);
        title.setStroke('#ffffff', 4);
        
        // Mensaje
        const message = this.add.text(width / 2, height / 2, 
            '¡Excelente trabajo ensamblando el robot!\nAhora vamos a poner a prueba lo que aprendiste.', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#2d3748',
            align: 'center'
        }).setOrigin(0.5).setDepth(502);
        
        // Botón para continuar al cuestionario
        const btnBg = this.add.rectangle(width / 2, height / 2 + 100, 320, 55, 0x00d2ff);
        btnBg.setStrokeStyle(3, 0x0099cc);
        btnBg.setInteractive({ useHandCursor: true });
        btnBg.setDepth(502);
        
        const btnText = this.add.text(width / 2, height / 2 + 100, 'IR AL CUESTIONARIO 📝', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(503);
        
        btnBg.on('pointerover', () => {
            this.tweens.add({
                targets: [btnBg, btnText],
                scale: 1.05,
                duration: 100
            });
        });
        
        btnBg.on('pointerout', () => {
            this.tweens.add({
                targets: [btnBg, btnText],
                scale: 1,
                duration: 100
            });
        });
        
        btnBg.on('pointerdown', () => {
            this.scene.start('QuizScene');
        });
        
        // Confeti
        this.time.delayedCall(300, () => {
            this.createVictoryConfetti(width, height);
        });
        
        // Animación del panel
        this.tweens.add({
            targets: panel,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    createVictoryConfetti(width, height) {
        const colors = [0x00d2ff, 0x48bb78, 0xed8936, 0xe53e3e, 0x9f7aea, 0xf6e05e];
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const color = Phaser.Utils.Array.GetRandom(colors);
            const size = 4 + Math.random() * 8;
            
            const confetti = this.add.rectangle(x, -20, size, size, color);
            confetti.setRotation(Math.random() * Math.PI);
            confetti.setDepth(600);
            
            const fallDuration = 2000 + Math.random() * 2000;
            
            this.tweens.add({
                targets: confetti,
                y: height + 50,
                rotation: Math.random() * Math.PI * 4,
                x: x + (Math.random() - 0.5) * 200,
                duration: fallDuration,
                ease: 'Power1',
                onComplete: () => confetti.destroy()
            });
        }
    }
}