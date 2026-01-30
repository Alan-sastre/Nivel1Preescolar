class QuizScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuizScene' });
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // Fondo tecnológico
        this.createTechBackground(width, height);

        // Título
        this.createGlowingTitle(width);

        // Preguntas y respuestas
        this.questions = [
            {
                question: '¿Qué es un robot?',
                options: [
                    'Una máquina que ayuda a las personas',
                    'Un animal de juguete',
                    'Un tipo de planta',
                    'Un carro de carreras'
                ],
                correct: 0
            },
            {
                question: '¿Qué partes tiene un robot?',
                options: [
                    'Solo cabeza',
                    'Solo brazos',
                    'Cabeza, cuerpo, brazos y piernas',
                    'Solo piernas'
                ],
                correct: 2
            },
            {
                question: '¿Los robots son?',
                options: [
                    'Seres vivos como tú y yo',
                    'Máquinas especiales e inteligentes',
                    'Juguetes de madera',
                    'Animales del bosque'
                ],
                correct: 1
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;

        // Contador de progreso - CREAR PRIMERO
        this.createProgressCounter(width, height);

        // Mostrar primera pregunta
        this.showQuestion(width, height);
    }

    createTechBackground(width, height) {
        // Fondo azul oscuro tecnológico
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628);

        // Grid
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x1e3a5f, 0.2);

        for (let y = 0; y < height; y += 40) {
            graphics.lineBetween(0, y, width, y);
        }
        for (let x = 0; x < width; x += 40) {
            graphics.lineBetween(x, 0, x, height);
        }
    }

    createGlowingTitle(width) {
        const titleContainer = this.add.container(width / 2, 50);

        const glow = this.add.text(0, 0, '📝 TEST DE ROBOTS', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#00d2ff',
        }).setOrigin(0.5);
        glow.setStroke('#ffffff', 6);
        glow.setShadow(0, 0, '#00d2ff', 15, true, true);

        const title = this.add.text(0, 0, '📝 TEST DE ROBOTS', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5);
        title.setStroke('#00d2ff', 3);

        titleContainer.add([glow, title]);

        this.tweens.add({
            targets: glow,
            scale: 1.03,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createProgressCounter(width, height) {
        this.progressText = this.add.text(width - 50, 45, `1/${this.questions.length}`, {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '28px',
            color: '#00d2ff'
        }).setOrigin(1, 0.5);
    }

    showQuestion(width, height) {
        // Limpiar elementos anteriores
        if (this.questionContainer) {
            this.questionContainer.destroy();
        }

        this.questionContainer = this.add.container(0, 0);

        const q = this.questions[this.currentQuestion];

        // Panel de pregunta
        const panelY = height / 2 - 110;

        // Sombra del panel
        const shadow = this.add.rectangle(width / 2 + 8, panelY + 8, 650, 120, 0x000000, 0.4);
        this.questionContainer.add(shadow);

        // Panel principal
        const panel = this.add.rectangle(width / 2, panelY, 650, 120, 0x1a365d, 0.95);
        panel.setStrokeStyle(4, 0x00d2ff);
        this.questionContainer.add(panel);

        // Línea decorativa
        const accent = this.add.rectangle(width / 2, panelY - 58, 650, 6, 0x00d2ff);
        this.questionContainer.add(accent);

        // Texto de la pregunta
        const questionText = this.add.text(width / 2, panelY, q.question, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        this.questionContainer.add(questionText);

        // Opciones de respuesta (botones)
        const startY = height / 2 + 40;
        const spacing = 55;

        q.options.forEach((option, index) => {
            const btnY = startY + (index * spacing);
            this.createOptionButton(width / 2, btnY, option, index, q.correct);
        });

        // Actualizar contador
        this.progressText.setText(`${this.currentQuestion + 1}/${this.questions.length}`);
    }

    createOptionButton(x, y, text, index, correctIndex) {
        const buttonGroup = this.add.container(x, y);
        this.questionContainer.add(buttonGroup);

        // Fondo del botón
        const btnBg = this.add.rectangle(0, 0, 500, 45, 0x2d3748);
        btnBg.setStrokeStyle(3, 0x4a5568);
        buttonGroup.add(btnBg);

        // Letra de opción (A, B, C, D)
        const letters = ['A', 'B', 'C', 'D'];
        const letterText = this.add.text(-225, 0, letters[index], {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '24px',
            color: '#00d2ff'
        }).setOrigin(0.5);
        buttonGroup.add(letterText);

        // Texto de la opción
        const optionText = this.add.text(-200, 0, text, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        buttonGroup.add(optionText);

        // Hacer interactivo
        const hitArea = this.add.rectangle(0, 0, 500, 45, 0x000000, 0);
        buttonGroup.add(hitArea);
        hitArea.setInteractive({ useHandCursor: true });

        // Guardar referencias a los eventos para poder removerlos después
        const pointerOverHandler = () => {
            btnBg.setFillStyle(0x4a5568);
            btnBg.setStrokeStyle(3, 0x00d2ff);
            this.tweens.add({
                targets: buttonGroup,
                scale: 1.02,
                duration: 100
            });
        };

        const pointerOutHandler = () => {
            btnBg.setFillStyle(0x2d3748);
            btnBg.setStrokeStyle(3, 0x4a5568);
            this.tweens.add({
                targets: buttonGroup,
                scale: 1,
                duration: 100
            });
        };

        hitArea.on('pointerover', pointerOverHandler);
        hitArea.on('pointerout', pointerOutHandler);

        hitArea.on('pointerdown', () => {
            this.checkAnswer(index, correctIndex, btnBg, buttonGroup, hitArea, pointerOverHandler, pointerOutHandler);
        });
    }

    checkAnswer(selected, correct, btnBg, buttonGroup, hitArea, pointerOverHandler, pointerOutHandler) {
        // Remover eventos hover para que no cambie el color
        hitArea.off('pointerover', pointerOverHandler);
        hitArea.off('pointerout', pointerOutHandler);

        if (selected === correct) {
            // Respuesta CORRECTA - desactivar todos y avanzar
            this.questionContainer.list.forEach(child => {
                if (child instanceof Phaser.GameObjects.Container) {
                    child.list.forEach(subChild => {
                        if (subChild.input) {
                            subChild.disableInteractive();
                        }
                    });
                }
            });

            this.score++;
            btnBg.setFillStyle(0x48bb78);
            btnBg.setStrokeStyle(3, 0x2f855a);

            // Efecto de éxito
            this.createSuccessEffect(btnBg.x, btnBg.y);

            // Pausar 1 segundo mostrando la respuesta correcta en verde
            this.time.delayedCall(1000, () => {
                this.nextQuestion();
            });
        } else {
            // Respuesta INCORRECTA - solo desactivar esta opción y dejar que intente de nuevo
            buttonGroup.list.forEach(subChild => {
                if (subChild.input) {
                    subChild.disableInteractive();
                }
            });

            // Marcar en ROJO
            btnBg.setFillStyle(0xe53e3e);
            btnBg.setStrokeStyle(3, 0x9b2c2c);

            // Efecto de error (shake)
            this.tweens.add({
                targets: buttonGroup,
                x: buttonGroup.x + 10,
                duration: 50,
                yoyo: true,
                repeat: 3,
                ease: 'Power1',
                onComplete: () => {
                    this.tweens.add({
                        targets: buttonGroup,
                        x: buttonGroup.x - 10,
                        duration: 50,
                        yoyo: true,
                        repeat: 3,
                        ease: 'Power1'
                    });
                }
            });

            // NO avanzar - dejar que el usuario intente otra opción
            // Las demás opciones siguen activas
        }
    }

    createSuccessEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 6, 0x48bb78);

            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion < this.questions.length) {
            this.showQuestion(
                this.sys.game.config.width,
                this.sys.game.config.height
            );
        } else {
            // Fin del quiz, mostrar felicitaciones finales
            this.showFinalCongratulations();
        }
    }

    showFinalCongratulations() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // Limpiar
        if (this.questionContainer) {
            this.questionContainer.destroy();
        }
        this.progressText.destroy();

        // Overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628, 0.9);
        overlay.setDepth(500);

        // Panel con gradiente de fondo - AHORA 550x380
        const panelWidth = 550;
        const panelHeight = 380;
        const panelY = height / 2;
        const panelX = width / 2;

        // Crear gráficos para gradiente
        const graphics = this.add.graphics();
        graphics.setDepth(501);

        // Fondo del panel con gradiente
        const gradientColors = [0x667eea, 0x764ba2];
        for (let i = 0; i < panelHeight; i++) {
            const ratio = i / panelHeight;
            const r = Math.floor(((1 - ratio) * ((gradientColors[0] >> 16) & 255)) + (ratio * ((gradientColors[1] >> 16) & 255)));
            const g = Math.floor(((1 - ratio) * ((gradientColors[0] >> 8) & 255)) + (ratio * ((gradientColors[1] >> 8) & 255)));
            const b = Math.floor(((1 - ratio) * (gradientColors[0] & 255)) + (ratio * (gradientColors[1] & 255)));
            const color = (r << 16) | (g << 8) | b;
            graphics.lineStyle(1, color, 0.3);
            graphics.lineBetween(panelX - panelWidth/2, panelY - panelHeight/2 + i, panelX + panelWidth/2, panelY - panelHeight/2 + i);
        }

        // Panel principal - FONDO OSCURO AZUL (no blanco)
        const panel = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x1a365d);
        panel.setStrokeStyle(6, 0x00d2ff);
        panel.setDepth(501);

        // Glow effect alrededor del panel
        const glowGraphics = this.add.graphics();
        glowGraphics.setDepth(500);
        for (let i = 1; i <= 3; i++) {
            glowGraphics.lineStyle(i * 2, 0x00d2ff, 0.1 / i);
            glowGraphics.strokeRect(panelX - panelWidth/2 - i * 4, panelY - panelHeight/2 - i * 4, panelWidth + i * 8, panelHeight + i * 8);
        }

        // Decoración superior con gradiente
        const decorGraphics = this.add.graphics();
        decorGraphics.setDepth(501);
        decorGraphics.fillStyle(0x00d2ff, 1);
        decorGraphics.fillRect(panelX - panelWidth/2, panelY - panelHeight/2, panelWidth, 8);
        decorGraphics.fillStyle(0x48bb78, 1);
        decorGraphics.fillRect(panelX - panelWidth/2, panelY - panelHeight/2 + 8, panelWidth, 4);

        // Icono de trofeo con animación de pulso continuo
        const icon = this.add.text(panelX, panelY - 140, '🏆', {
            fontSize: '70px'
        }).setOrigin(0.5).setDepth(502);

        // Animación de entrada
        this.tweens.add({
            targets: icon,
            scale: { from: 0, to: 1.3 },
            rotation: Math.PI * 2,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Pulsación continua
                this.tweens.add({
                    targets: icon,
                    scale: { from: 1.3, to: 1.5 },
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // Estrellas/sparkles alrededor del trofeo
        this.createTrophySparkles(panelX, panelY - 140);

        // Título principal con gradiente de color
        const title = this.add.text(panelX, panelY - 80, '¡FELICITACIONES!', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#667eea'
        }).setOrigin(0.5).setDepth(502);
        title.setStroke('#ffffff', 5);
        title.setShadow(2, 2, '#764ba2', 5, true, true);

        // Animación del título
        this.tweens.add({
            targets: title,
            y: panelY - 85,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Barra de progreso
        const progressBarY = panelY - 30;
        const progressBarWidth = 400;
        const progressBarHeight = 20;
        const percentage = this.score / this.questions.length;
        const progressBarX = panelX - progressBarWidth / 2;

        // Fondo de la barra
        const progressBg = this.add.rectangle(panelX, progressBarY, progressBarWidth, progressBarHeight, 0xe2e8f0);
        progressBg.setDepth(502);

        // Barra de progreso que crece de izquierda a derecha
        const progressFill = this.add.rectangle(progressBarX, progressBarY, 0, progressBarHeight, 0x48bb78);
        progressFill.setOrigin(0, 0.5);
        progressFill.setDepth(503);

        // Borde de la barra
        const progressBorder = this.add.rectangle(panelX, progressBarY, progressBarWidth, progressBarHeight);
        progressBorder.setStrokeStyle(2, 0x4a5568);
        progressBorder.setDepth(504);

        // Texto de porcentaje
        const percentageText = this.add.text(panelX, progressBarY - 30, '0%', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '20px',
            color: '#48bb78'
        }).setOrigin(0.5).setDepth(502);

        // Animación de la barra de progreso
        this.tweens.add({
            targets: progressFill,
            width: progressBarWidth * percentage,
            duration: 1500,
            ease: 'Power2',
            onUpdate: (tween) => {
                const currentPercent = Math.floor(tween.progress * percentage * 100);
                percentageText.setText(`${currentPercent}%`);
            }
        });

        // Score con animación de conteo
        const scoreText = this.add.text(panelX, panelY + 10, '0/0', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(502);

        // Animación de conteo del score
        let scoreCounter = { value: 0 };
        this.tweens.add({
            targets: scoreCounter,
            value: this.score,
            duration: 1500,
            ease: 'Power2',
            onUpdate: () => {
                scoreText.setText(``);
            }
        });

        // Mensaje educativo con iconos como bullets
        const eduContainer = this.add.container(panelX, panelY + 60);
        eduContainer.setDepth(502);

        const eduTitle = this.add.text(0, -60, '¡Has completado el juego!', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '22px',
            color: '#00d2ff'
        }).setOrigin(0.5);
        eduContainer.add(eduTitle);

        const learnings = [
            { icon: '🤖', text: 'Un robot es una máquina inteligente' },
            { icon: '🦾', text: 'Los robots ayudan a las personas' },
            { icon: '👤', text: 'Tienen cabeza, cuerpo, brazos y piernas' }
        ];

        learnings.forEach((item, index) => {
            const yPos = -20 + (index * 35);

            // Icono
            const iconText = this.add.text(-180, yPos, item.icon, {
                fontSize: '24px'
            }).setOrigin(0.5);
            eduContainer.add(iconText);

            // Texto
            const textItem = this.add.text(-160, yPos, item.text, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#e2e8f0'
            }).setOrigin(0, 0.5);
            eduContainer.add(textItem);

            // Animación de entrada
            this.tweens.add({
                targets: [iconText, textItem],
                x: `+=${20}`,
                alpha: { from: 0, to: 1 },
                duration: 400,
                delay: 1000 + (index * 200),
                ease: 'Power2'
            });
        });

        // Mensaje de cierre
        const closingText = this.add.text(panelX, panelY + 140, '¡Gracias por jugar!', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#00d2ff'
        }).setOrigin(0.5).setDepth(502);

        // Animación del mensaje de cierre
        this.tweens.add({
            targets: closingText,
            alpha: { from: 0.5, to: 1 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Confeti explosivo desde el centro
        this.time.delayedCall(400, () => {
            this.createExplosiveConfetti(width, height, panelX, panelY);
        });

        // Confeti explosivo al aparecer el panel
        this.createExplosiveConfetti(width, height);

        // Animación del panel
        panel.setScale(0);
        glowGraphics.setVisible(false);
        decorGraphics.setVisible(false);
        graphics.setVisible(false);

        this.tweens.add({
            targets: panel,
            scale: { from: 0, to: 1 },
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                glowGraphics.setVisible(true);
                decorGraphics.setVisible(true);
                graphics.setVisible(true);
            }
        });
    }

    createTrophySparkles(x, y) {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const positions = [
            { x: -70, y: -40, delay: 0 },
            { x: 70, y: -30, delay: 200 },
            { x: -60, y: 30, delay: 400 },
            { x: 60, y: 40, delay: 600 },
            { x: -80, y: 0, delay: 800 },
            { x: 80, y: -10, delay: 1000 }
        ];

        positions.forEach((pos, index) => {
            const sparkle = this.add.text(x + pos.x, y + pos.y, sparkles[index % sparkles.length], {
                fontSize: '30px'
            }).setOrigin(0.5).setDepth(501);

            this.tweens.add({
                targets: sparkle,
                alpha: { from: 0, to: 1 },
                scale: { from: 0.5, to: 1.2 },
                duration: 500,
                delay: pos.delay + 500,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // Parpadeo continuo
                    this.tweens.add({
                        targets: sparkle,
                        alpha: { from: 1, to: 0.3 },
                        scale: { from: 1.2, to: 0.8 },
                        duration: 800 + Math.random() * 400,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });

                    // Rotación lenta
                    this.tweens.add({
                        targets: sparkle,
                        rotation: Math.PI * 2,
                        duration: 3000 + Math.random() * 2000,
                        repeat: -1,
                        ease: 'Linear'
                    });
                }
            });
        });
    }

    createExplosiveConfetti(width, height) {
        const colors = [0x00d2ff, 0x48bb78, 0xed8936, 0xe53e3e, 0x9f7aea, 0xf6e05e, 0x667eea, 0x764ba2];
        const centerX = width / 2;
        const centerY = height / 2;

        // Explosión desde el centro
        for (let i = 0; i < 150; i++) {
            const angle = (i / 150) * Math.PI * 2 + (Math.random() * 0.5);
            const distance = 100 + Math.random() * 300;
            const color = Phaser.Utils.Array.GetRandom(colors);
            const size = 6 + Math.random() * 10;

            const confetti = this.add.rectangle(centerX, centerY, size, size, color);
            confetti.setRotation(Math.random() * Math.PI);
            confetti.setDepth(600);
            confetti.setScale(0);

            // Explosión hacia afuera
            this.tweens.add({
                targets: confetti,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                scale: { from: 0, to: 1 },
                rotation: Math.random() * Math.PI * 6,
                duration: 800,
                delay: Math.random() * 300,
                ease: 'Power3',
                onComplete: () => {
                    // Caída después de la explosión
                    this.tweens.add({
                        targets: confetti,
                        y: height + 100,
                        x: confetti.x + (Math.random() - 0.5) * 100,
                        rotation: confetti.rotation + Math.PI * 2,
                        duration: 1500 + Math.random() * 1000,
                        ease: 'Power1',
                        onComplete: () => confetti.destroy()
                    });
                }
            });
        }

        // Confeti adicional cayendo desde arriba
        this.time.delayedCall(800, () => {
            for (let i = 0; i < 50; i++) {
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