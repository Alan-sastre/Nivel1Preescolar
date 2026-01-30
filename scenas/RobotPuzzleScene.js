class RobotPuzzleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RobotPuzzleScene' });
        this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
        this.piecesPlaced = 0;
        this.totalPieces = 6;
        this.gameTime = 240; // 4 minutes in seconds
        this.timeRemaining = this.gameTime;
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // Fondo tecnológico
        this.createTechBackground(width, height);

        // Título con efecto
        this.createGlowingTitle(width);

        // Instrucciones
        this.add.text(width / 2, 85, '🔧 Arrastra cada pieza al lugar correcto', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#a0aec0'
        }).setOrigin(0.5);

        // Área de ensamblaje del robot
        const assemblyY = height / 2 + 40;
        this.createAssemblyArea(width / 2, assemblyY);

        // Silueta del robot (zonas de drop)
        this.createRobotSilhouette(width / 2, assemblyY);

        // Piezas del puzzle
        this.createPuzzlePieces(width, height);

        // Contador de progreso
        this.createProgressBar(width, height);

        // Timer
        this.createTimer(width, height);
        this.startTimer();

        // Botón de reinicio
        this.createResetButton(width - 100, 40);
    }

    createTechBackground(width, height) {
        // Fondo azul oscuro tecnológico
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628);
        
        // Grid de trabajo
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x1e3a5f, 0.2);
        
        for (let y = 0; y < height; y += 40) {
            graphics.lineBetween(0, y, width, y);
        }
        for (let x = 0; x < width; x += 40) {
            graphics.lineBetween(x, 0, x, height);
        }

        // Área de trabajo circular decorativa - AJUSTADA A NUEVA POSICIÓN
        const assemblyY = height / 2 + 120;
        const workArea = this.add.circle(width / 2, assemblyY, 200, 0x1e3a5f, 0.15);
        workArea.setStrokeStyle(2, 0x4fc3f7, 0.3);
        
        // Anillos decorativos
        const ring1 = this.add.circle(width / 2, assemblyY, 180, 0x000000, 0);
        ring1.setStrokeStyle(2, 0x00d2ff, 0.2);
        
        const ring2 = this.add.circle(width / 2, assemblyY, 220, 0x000000, 0);
        ring2.setStrokeStyle(1, 0x4fc3f7, 0.15);

        // Líneas de medición
        for (let angle = 0; angle < 360; angle += 45) {
            const rad = (angle * Math.PI) / 180;
            const x1 = width / 2 + Math.cos(rad) * 190;
            const y1 = assemblyY + Math.sin(rad) * 190;
            const x2 = width / 2 + Math.cos(rad) * 210;
            const y2 = assemblyY + Math.sin(rad) * 210;
            
            const line = this.add.line(0, 0, x1, y1, x2, y2, 0x4fc3f7, 0.4);
            line.setLineWidth(2);
        }
    }

    createGlowingTitle(width) {
        const titleContainer = this.add.container(width / 2, 45);
        
        const glow = this.add.text(0, 0, '🔧 MESA DE TRABAJO', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '42px',
            fontStyle: 'bold',
            color: '#00d2ff',
        }).setOrigin(0.5);
        glow.setStroke('#ffffff', 6);
        glow.setShadow(0, 0, '#00d2ff', 15, true, true);
        
        const title = this.add.text(0, 0, '🔧 MESA DE TRABAJO', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '42px',
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

    createAssemblyArea(x, y) {
        // Base de la mesa de trabajo
        const table = this.add.rectangle(x, y + 180, 400, 15, 0x4a5568);
        table.setStrokeStyle(2, 0x2d3748);
        
        // Sombra de la mesa
        const tableShadow = this.add.rectangle(x, y + 188, 400, 8, 0x000000, 0.3);
        
        // Indicador "ÁREA DE ENSAMBLAJE"
        const label = this.add.text(x, y - 220, 'ÁREA DE ENSAMBLAJE', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#4fc3f7'
        }).setOrigin(0.5).setAlpha(0.6);
    }

    createRobotSilhouette(x, y) {
        const alpha = 0.25;
        
        // Cabeza (at the top)
        const head = this.add.circle(x, y - 110, 40, 0x1a202c, alpha);
        head.name = 'head';
        head.setStrokeStyle(3, 0x3182ce, 0.5);
        
        // Cuerpo (below head, no overlap)
        const body = this.add.rectangle(x, y - 20, 80, 95, 0x1a202c, alpha);
        body.name = 'body';
        body.setStrokeStyle(3, 0x3182ce, 0.5);
        
        // Brazos (at sides of body)
        const leftArm = this.add.rectangle(x - 62, y - 20, 20, 66, 0x1a202c, alpha);
        leftArm.name = 'leftArm';
        leftArm.setStrokeStyle(3, 0x3182ce, 0.5);
        
        const rightArm = this.add.rectangle(x + 62, y - 20, 20, 66, 0x1a202c, alpha);
        rightArm.name = 'rightArm';
        rightArm.setStrokeStyle(3, 0x3182ce, 0.5);
        
        // Piernas (below body)
        const leftLeg = this.add.rectangle(x - 28, y + 72, 22, 70, 0x1a202c, alpha);
        leftLeg.name = 'leftLeg';
        leftLeg.setStrokeStyle(3, 0x3182ce, 0.5);
        
        const rightLeg = this.add.rectangle(x + 28, y + 72, 22, 70, 0x1a202c, alpha);
        rightLeg.name = 'rightLeg';
        rightLeg.setStrokeStyle(3, 0x3182ce, 0.5);

        this.dropZones = [head, body, leftArm, rightArm, leftLeg, rightLeg];
        
        // Efecto de pulso en las siluetas
        this.dropZones.forEach(zone => {
            this.tweens.add({
                targets: zone,
                alpha: { from: 0.15, to: 0.35 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createPuzzlePieces(width, height) {
        // Piezas MUCHO más separadas para evitar solapamiento
        const pieceY1 = height - 220; // Primera fila (arriba) - más arriba
        const pieceY2 = height - 90;  // Segunda fila (abajo) - más abajo
        const spacing = 220; // ESPACIADO AUMENTADO A 220px
        const startX = width / 2 - (spacing * 1.8); // Ajustado para 4 piezas en fila 2

        // FILA 1: Cabeza y Cuerpo (piezas grandes) - separadas
        this.createPiece(startX, pieceY1, 'head', (container) => {
            this.drawHeadPiece(container);
        });

        this.createPiece(startX + spacing * 1.2, pieceY1, 'body', (container) => {
            this.drawBodyPiece(container);
        });

        // FILA 2: Brazos y Piernas (piezas más pequeñas) - separadas
        const row2StartX = width / 2 - (spacing * 1.5);
        
        this.createPiece(row2StartX, pieceY2, 'leftArm', (container) => {
            this.drawArmPiece(container, true);
        });

        this.createPiece(row2StartX + spacing, pieceY2, 'rightArm', (container) => {
            this.drawArmPiece(container, false);
        });

        this.createPiece(row2StartX + spacing * 2, pieceY2, 'leftLeg', (container) => {
            this.drawLegPiece(container, true);
        });

        this.createPiece(row2StartX + spacing * 3, pieceY2, 'rightLeg', (container) => {
            this.drawLegPiece(container, false);
        });
    }

    drawHeadPiece(container) {
        // Cabeza metálica
        const head = this.add.circle(0, 0, 40, 0xa0aec0);
        head.setStrokeStyle(4, 0x718096);
        
        // Brillo metálico
        const highlight = this.add.ellipse(-15, -18, 22, 15, 0xffffff, 0.4);
        highlight.setRotation(-0.5);
        
        // Visor
        const visor = this.add.rectangle(0, 4, 58, 25, 0x1a202c);
        visor.setStrokeStyle(3, 0x4a5568);
        
        // Ojos LED azules
        const leftEye = this.add.ellipse(-13, 4, 14, 18, 0x00d2ff);
        leftEye.setStrokeStyle(2, 0x0099cc);
        const rightEye = this.add.ellipse(13, 4, 14, 18, 0x00d2ff);
        rightEye.setStrokeStyle(2, 0x0099cc);
        
        // Pupilas
        this.add.circle(-13, 4, 4, 0xffffff);
        this.add.circle(13, 4, 4, 0xffffff);
        
        // Antenas
        this.createAntennaPiece(container, -26, -33, -37, -58);
        this.createAntennaPiece(container, 26, -33, 37, -58);
        
        container.add([head, highlight, visor, leftEye, rightEye]);
    }

    drawBodyPiece(container) {
        // Torso metálico
        const torso = this.add.rectangle(0, 0, 80, 95, 0x3182ce);
        torso.setStrokeStyle(4, 0x2c5282);
        
        // Sombreado
        const highlight = this.add.rectangle(-18, 0, 15, 92, 0x63b3ed, 0.4);
        const shadow = this.add.rectangle(26, 0, 11, 92, 0x2c5282, 0.3);
        
        // Panel de control
        const screen = this.add.rectangle(0, -11, 51, 37, 0x1a202c);
        screen.setStrokeStyle(3, 0x4a5568);
        
        // LEDs del panel
        const led1 = this.add.circle(-15, -18, 4, 0x48bb78);
        led1.setStrokeStyle(2, 0x2f855a);
        const led2 = this.add.circle(0, -18, 4, 0xed8936);
        led2.setStrokeStyle(2, 0xc05621);
        const led3 = this.add.circle(15, -18, 4, 0xe53e3e);
        led3.setStrokeStyle(2, 0x9b2c2c);
        
        // Tornillos
        this.add.circle(-33, -40, 3, 0x4a5568);
        this.add.circle(33, -40, 3, 0x4a5568);
        this.add.circle(-33, 40, 3, 0x4a5568);
        this.add.circle(33, 40, 3, 0x4a5568);
        
        // Cuello
        const neck = this.add.rectangle(0, -51, 29, 15, 0x4a5568);
        neck.setStrokeStyle(2, 0x2d3748);
        
        container.add([torso, highlight, shadow, screen, led1, led2, led3, neck]);
    }

    drawArmPiece(container, isLeft) {
        // Hombro
        const shoulder = this.add.circle(0, -21, 13, 0x4a5568);
        shoulder.setStrokeStyle(3, 0x2d3748);
        
        // Brazo superior
        const upperArm = this.add.rectangle(0, 0, 20, 35, 0x718096);
        upperArm.setStrokeStyle(3, 0x4a5568);
        
        // Sombreado
        const highlight = this.add.rectangle(isLeft ? -6 : 6, 0, 6, 32, 0xa0aec0, 0.5);
        
        // Codo
        const elbow = this.add.circle(0, 21, 8, 0x4a5568);
        elbow.setStrokeStyle(2, 0x2d3748);
        
        // Antebrazo
        const forearm = this.add.rectangle(0, 38, 17, 32, 0x718096);
        forearm.setStrokeStyle(3, 0x4a5568);
        
        // Mano
        const hand = this.add.rectangle(0, 59, 21, 18, 0x4a5568);
        hand.setStrokeStyle(2, 0x2d3748);
        
        // Dedos
        const finger1 = this.add.rectangle(isLeft ? -6 : 6, 70, 6, 14, 0x718096);
        finger1.setStrokeStyle(2, 0x4a5568);
        const finger2 = this.add.rectangle(0, 72, 6, 14, 0x718096);
        finger2.setStrokeStyle(2, 0x4a5568);
        const finger3 = this.add.rectangle(isLeft ? 6 : -6, 70, 6, 14, 0x718096);
        finger3.setStrokeStyle(2, 0x4a5568);
        
        container.add([shoulder, upperArm, highlight, elbow, forearm, hand, finger1, finger2, finger3]);
    }

    drawLegPiece(container, isLeft) {
        // Muslo
        const thigh = this.add.rectangle(0, -24, 22, 28, 0x718096);
        thigh.setStrokeStyle(3, 0x4a5568);
        
        // Sombreado
        const thighHighlight = this.add.rectangle(isLeft ? -6 : 6, -24, 6, 25, 0xa0aec0, 0.5);
        
        // Rodilla
        const knee = this.add.circle(0, -10, 7, 0x4a5568);
        knee.setStrokeStyle(2, 0x2d3748);
        
        // Pierna
        const shin = this.add.rectangle(0, 7, 21, 35, 0xa0aec0);
        shin.setStrokeStyle(3, 0x718096);
        
        // Sombreado pierna
        const shinHighlight = this.add.rectangle(isLeft ? -6 : 6, 7, 6, 32, 0xe2e8f0, 0.5);
        
        // Tobillo
        const ankle = this.add.circle(0, 24, 6, 0x718096);
        ankle.setStrokeStyle(2, 0x4a5568);
        
        // Pie
        const foot = this.add.rectangle(0, 35, 35, 18, 0x4a5568);
        foot.setStrokeStyle(2, 0x2d3748);
        
        // Tornillos decorativos
        const screw1 = this.add.circle(isLeft ? -7 : 7, -32, 2, 0x2d3748);
        const screw2 = this.add.circle(isLeft ? 7 : -7, -32, 2, 0x2d3748);
        
        container.add([thigh, thighHighlight, knee, shin, shinHighlight, ankle, foot, screw1, screw2]);
    }

    createAntennaPiece(container, x1, y1, x2, y2) {
        const base = this.add.circle(x1, y1, 6, 0x4a5568);
        base.setStrokeStyle(2, 0x2d3748);
        
        const rod = this.add.line(0, 0, x1, y1, x2, y2, 0x718096);
        rod.setLineWidth(3);
        
        const tip = this.add.circle(x2, y2, 7, 0xe53e3e);
        tip.setStrokeStyle(3, 0x9b2c2c);
        
        container.add([base, rod, tip]);
    }

    createPiece(x, y, name, drawFunction) {
        const container = this.add.container(x, y);
        container.name = name;
        container.originalX = x;
        container.originalY = y;
        
        // Sombra de la pieza
        const shadow = this.add.rectangle(4, 4, 100, 100, 0x000000, 0.2);
        container.add(shadow);
        
        // Base de la pieza (área de agarre)
        const base = this.add.rectangle(0, 0, 105, 105, 0x2d3748, 0.3);
        base.setStrokeStyle(2, 0x4a5568, 0.5);
        container.add(base);
        
        // Dibujar la pieza específica
        drawFunction(container);
        
        // Área de hit invisible más grande
        const hitArea = this.add.rectangle(0, 0, 105, 105, 0x000000, 0);
        container.add(hitArea);
        
        // Configurar interactividad
        container.setSize(105, 105);
        container.setInteractive({ draggable: true, useHandCursor: true });
        
        // Efectos hover
        container.on('pointerover', () => {
            document.body.style.cursor = 'grab';
            this.tweens.add({
                targets: container,
                scale: 1.05,
                duration: 100
            });
            base.setStrokeStyle(3, 0x00d2ff, 0.8);
        });
        
        container.on('pointerout', () => {
            document.body.style.cursor = 'default';
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 100
            });
            base.setStrokeStyle(2, 0x4a5568, 0.5);
        });
        
        // Eventos de drag mejorados
        container.on('dragstart', (pointer, dragX, dragY) => {
            document.body.style.cursor = 'grabbing';
            container.setDepth(1000);
            this.tweens.add({
                targets: container,
                scale: 1.15,
                duration: 150,
                ease: 'Back.easeOut'
            });
            // Efecto de levantamiento
            this.tweens.add({
                targets: shadow,
                alpha: 0.05,
                scale: 0.8,
                duration: 150
            });
        });
        
        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });
        
        container.on('dragend', () => {
            document.body.style.cursor = 'default';
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 200
            });
            this.tweens.add({
                targets: shadow,
                alpha: 0.2,
                scale: 1,
                duration: 200
            });
            this.checkPlacement(container);
        });
    }

    createProgressBar(width, height) {
        const barWidth = 300;
        const barHeight = 25;
        const x = width / 2;
        const y = height - 40;
        
        // Fondo de la barra
        const bg = this.add.rectangle(x, y, barWidth + 4, barHeight + 4, 0x2d3748);
        bg.setStrokeStyle(2, 0x4a5568);
        
        // Barra vacía
        this.progressBarEmpty = this.add.rectangle(x - barWidth/2 + 2, y, barWidth, barHeight, 0x1a202c);
        this.progressBarEmpty.setOrigin(0, 0.5);
        
        // Barra de progreso
        this.progressBarFill = this.add.rectangle(x - barWidth/2 + 2, y, 0, barHeight - 4, 0x00d2ff);
        this.progressBarFill.setOrigin(0, 0.5);
        
        // Texto del progreso
        this.progressText = this.add.text(x, y, '0%', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Etiqueta
        this.add.text(x, y - 25, 'PROGRESO', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#4fc3f7'
        }).setOrigin(0.5);
    }

    createTimer(width, height) {
        // Timer display in top left
        const timerBg = this.add.rectangle(120, 40, 140, 40, 0x2d3748);
        timerBg.setStrokeStyle(2, 0x4a5568);
        
        this.timerText = this.add.text(120, 40, this.formatTime(this.timeRemaining), {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Timer icon
        this.add.text(55, 40, '⏱️', {
            fontSize: '28px'
        }).setOrigin(0.5);
        
        // Label
        this.add.text(120, 18, 'TIEMPO', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#4fc3f7'
        }).setOrigin(0.5);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.timeRemaining--;
        this.timerText.setText(this.formatTime(this.timeRemaining));
        
        // Change color when time is running low
        if (this.timeRemaining <= 30) {
            this.timerText.setColor('#e53e3e');
        } else if (this.timeRemaining <= 60) {
            this.timerText.setColor('#ed8936');
        }
        
        // Time's up
        if (this.timeRemaining <= 0) {
            this.timerEvent.remove();
            this.showTimeUp();
        }
    }

    showTimeUp() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        
        // Disable all pieces
        this.children.list.forEach(child => {
            if (child.name && ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].includes(child.name)) {
                child.disableInteractive();
            }
        });
        
        // Overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628, 0.85);
        overlay.setDepth(500);
        
        // Panel
        const panel = this.add.rectangle(width / 2, height / 2, 450, 280, 0xf7fafc);
        panel.setStrokeStyle(5, 0xe53e3e);
        panel.setDepth(501);
        
        // Icon
        const icon = this.add.text(width / 2, height / 2 - 80, '⏰', {
            fontSize: '70px'
        }).setOrigin(0.5).setDepth(502);
        
        this.tweens.add({
            targets: icon,
            scale: { from: 0, to: 1.2 },
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Title
        const title = this.add.text(width / 2, height / 2 - 20, '¡SE ACABÓ EL TIEMPO!', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#e53e3e'
        }).setOrigin(0.5).setDepth(502);
        
        // Message
        const message = this.add.text(width / 2, height / 2 + 25, 
            '¡No lograste armar a ROBI a tiempo!\nPero no te rindas, inténtalo de nuevo.', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#2d3748',
            align: 'center'
        }).setOrigin(0.5).setDepth(502);
        
        // Restart button
        const btnBg = this.add.rectangle(width / 2, height / 2 + 95, 220, 55, 0x00d2ff);
        btnBg.setStrokeStyle(3, 0x0099cc);
        btnBg.setInteractive({ useHandCursor: true });
        btnBg.setDepth(502);
        
        const btnText = this.add.text(width / 2, height / 2 + 95, 'INTENTAR DE NUEVO ↻', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '20px',
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
            this.scene.restart();
        });
        
        // Animation
        this.tweens.add({
            targets: panel,
            scale: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.easeOut'
        });
    }

    updateProgress() {
        const percentage = (this.piecesPlaced / this.totalPieces) * 100;
        const maxWidth = 296;
        const newWidth = (percentage / 100) * maxWidth;
        
        this.tweens.add({
            targets: this.progressBarFill,
            width: newWidth,
            duration: 500,
            ease: 'Cubic.easeOut'
        });
        
        this.progressText.setText(`${Math.round(percentage)}%`);
        
        // Efecto de pulso en el texto cuando avanza
        this.tweens.add({
            targets: this.progressText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }

    createResetButton(x, y) {
        const btnBg = this.add.circle(x, y, 30, 0xe53e3e);
        btnBg.setStrokeStyle(3, 0x9b2c2c);
        
        const icon = this.add.text(x, y, '↻', {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        btnBg.setInteractive({ useHandCursor: true });
        
        btnBg.on('pointerover', () => {
            this.tweens.add({
                targets: [btnBg, icon],
                scale: 1.1,
                duration: 100
            });
        });
        
        btnBg.on('pointerout', () => {
            this.tweens.add({
                targets: [btnBg, icon],
                scale: 1,
                duration: 100
            });
        });
        
        btnBg.on('pointerdown', () => {
            this.scene.restart();
        });
        
        // Tooltip
        const tooltip = this.add.text(x, y + 50, 'Reiniciar', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#a0aec0'
        }).setOrigin(0.5).setAlpha(0);
        
        btnBg.on('pointerover', () => {
            tooltip.setAlpha(1);
        });
        btnBg.on('pointerout', () => {
            tooltip.setAlpha(0);
        });
    }

    checkPlacement(piece) {
        const dropZone = this.dropZones.find(zone => zone.name === piece.name);
        
        if (dropZone) {
            const distance = Phaser.Math.Distance.Between(
                piece.x, piece.y,
                dropZone.x, dropZone.y
            );
            
            if (distance < 70) {
                this.snapPiece(piece, dropZone);
                this.piecesPlaced++;
                this.updateProgress();
                this.createSuccessEffect(dropZone.x, dropZone.y);
                
                if (this.piecesPlaced === this.totalPieces) {
                    this.time.delayedCall(600, () => {
                        this.showAssemblyComplete();
                    });
                }
            } else {
                this.returnPiece(piece);
                this.createErrorEffect(piece.x, piece.y);
            }
        }
    }

    snapPiece(piece, zone) {
        piece.disableInteractive();
        piece.setDepth(0);
        
        this.tweens.add({
            targets: piece,
            x: zone.x,
            y: zone.y,
            scale: 1,
            duration: 350,
            ease: 'Back.easeOut'
        });
        
        // Hacer transparente el recuadro/base de la pieza (índice 1 en el container)
        const base = piece.list[1]; // El base es el segundo elemento (índice 1)
        if (base) {
            this.tweens.add({
                targets: base,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
        }
        
        // También hacer transparente la sombra (índice 0)
        const shadow = piece.list[0];
        if (shadow) {
            this.tweens.add({
                targets: shadow,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
        }
        
        // Efecto de brillo en la zona
        const flash = this.add.rectangle(zone.x, zone.y, 
            zone.width || 120, zone.height || 120, 0x00d2ff, 0.4);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 1.3,
            duration: 400,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
    }

    returnPiece(piece) {
        this.tweens.add({
            targets: piece,
            x: piece.originalX,
            y: piece.originalY,
            scale: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Vibración de error
        this.tweens.add({
            targets: piece,
            x: piece.x + 8,
            duration: 60,
            yoyo: true,
            repeat: 4
        });
    }

    createSuccessEffect(x, y) {
        const colors = [0x00d2ff, 0x48bb78, 0xed8936, 0xe53e3e, 0x9f7aea];
        
        // Anillo expansivo
        const ring = this.add.circle(x, y, 20, 0x000000, 0);
        ring.setStrokeStyle(4, 0x00d2ff, 0.8);
        
        this.tweens.add({
            targets: ring,
            radius: 100,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Partículas
        for (let i = 0; i < 12; i++) {
            const color = Phaser.Utils.Array.GetRandom(colors);
            const particle = this.add.circle(x, y, 8, color);
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60 + Math.random() * 20;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                scale: { from: 1, to: 0 },
                alpha: { from: 1, to: 0 },
                duration: 700,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Chispas
        for (let i = 0; i < 8; i++) {
            const spark = this.add.line(x, y, 0, 0, 
                Math.cos(i * Math.PI / 4) * 30, 
                Math.sin(i * Math.PI / 4) * 30, 
                0xfff5e6, 0.8);
            spark.setLineWidth(3);
            
            this.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }
    }

    createErrorEffect(x, y) {
        // X roja
        const x1 = this.add.line(x, y, -15, -15, 15, 15, 0xe53e3e, 0.8);
        x1.setLineWidth(4);
        const x2 = this.add.line(x, y, 15, -15, -15, 15, 0xe53e3e, 0.8);
        x2.setLineWidth(4);
        
        this.tweens.add({
            targets: [x1, x2],
            alpha: 0,
            scale: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                x1.destroy();
                x2.destroy();
            }
        });
    }

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