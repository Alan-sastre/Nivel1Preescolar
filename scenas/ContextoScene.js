class ContextoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ContextoScene' });
        this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    preload() {
        // Generamos todo con código - no necesitamos assets externos
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // Fondo con gradiente y patrón de circuitos
        this.createTechBackground(width, height);

        // Título con efecto de brillo
        this.createGlowingTitle(width);

        // Crear Robi PRO (robot detallado) - movido más abajo para no tapar el título
        this.createProRobi(width / 2, height / 2 + 40);

        // Panel de diálogo moderno
        this.createModernDialogPanel(width, height);
        this.setupDialogs(width, height);

        // Partículas decorativas
        this.createFloatingParticles();
    }

    createTechBackground(width, height) {
        // Fondo azul oscuro tecnológico
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1628);
        
        // Grid de circuitos
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x1e3a5f, 0.3);
        
        // Líneas horizontales
        for (let y = 0; y < height; y += 60) {
            graphics.lineBetween(0, y, width, y);
        }
        
        // Líneas verticales
        for (let x = 0; x < width; x += 80) {
            graphics.lineBetween(x, 0, x, height);
        }
        
        // Nodos de circuito (puntos brillantes)
        for (let x = 0; x < width; x += 80) {
            for (let y = 0; y < height; y += 60) {
                if (Math.random() > 0.7) {
                    const node = this.add.circle(x, y, 3, 0x4fc3f7, 0.6);
                    this.tweens.add({
                        targets: node,
                        alpha: { from: 0.2, to: 0.8 },
                        duration: 2000 + Math.random() * 1000,
                        yoyo: true,
                        repeat: -1
                    });
                }
            }
        }
        
        // Hexágonos decorativos flotantes
        for (let i = 0; i < 5; i++) {
            const hex = this.createHexagon(
                100 + Math.random() * (width - 200),
                100 + Math.random() * (height - 200),
                20,
                0x1e3a5f,
                0.2
            );
            
            this.tweens.add({
                targets: hex,
                y: '+=30',
                rotation: Math.PI,
                duration: 8000 + i * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createHexagon(x, y, radius, color, alpha) {
        const graphics = this.add.graphics();
        graphics.fillStyle(color, alpha);
        graphics.lineStyle(2, color, alpha + 0.2);
        
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            points.push({
                x: x + radius * Math.cos(angle),
                y: y + radius * Math.sin(angle)
            });
        }
        
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
        
        return graphics;
    }

    createGlowingTitle(width) {
        // Contenedor del título
        const titleContainer = this.add.container(width / 2, 50);
        
        // Sombra/brillo del título
        const glow = this.add.text(0, 0, '¿QUÉ ES UN ROBOT?', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '52px',
            fontStyle: 'bold',
            color: '#00d2ff',
        }).setOrigin(0.5);
        glow.setStroke('#ffffff', 8);
        glow.setShadow(0, 0, '#00d2ff', 20, true, true);
        
        // Título principal
        const title = this.add.text(0, 0, '¿QUÉ ES UN ROBOT?', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '52px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5);
        title.setStroke('#00d2ff', 4);
        
        titleContainer.add([glow, title]);
        
        // Animación de pulso
        this.tweens.add({
            targets: glow,
            scale: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createProRobi(x, y) {
        this.robiContainer = this.add.container(x, y);
        
        // Sombra del robot en el suelo
        const shadow = this.add.ellipse(0, 140, 120, 30, 0x000000, 0.3);
        this.robiContainer.add(shadow);
        
        // GRUPO: PIERNAS
        const leftLeg = this.createMetallicLeg(-35, 80);
        const rightLeg = this.createMetallicLeg(35, 80);
        this.robiContainer.add([leftLeg, rightLeg]);
        
        // GRUPO: CUERPO (torso)
        const body = this.createMetallicBody(0, 0);
        this.robiContainer.add(body);
        
        // GRUPO: CABEZA
        const head = this.createMetallicHead(0, -110);
        this.robiContainer.add(head);
        
        // GRUPO: BRAZOS
        const leftArm = this.createMetallicArm(-75, 10, true);
        const rightArm = this.createMetallicArm(75, 10, false);
        this.robiContainer.add([leftArm, rightArm]);
        
        // Animación de flotación suave
        this.tweens.add({
            targets: this.robiContainer,
            y: y + 8,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Animación de la sombra
        this.tweens.add({
            targets: shadow,
            scaleX: 0.9,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createMetallicLeg(x, y) {
        const legGroup = this.add.container(x, y);
        
        // Base del pie (robótica)
        const foot = this.add.rectangle(0, 50, 50, 25, 0x4a5568);
        foot.setStrokeStyle(2, 0x2d3748);
        
        // Articulación del tobillo
        const ankle = this.add.circle(0, 35, 8, 0x718096);
        ankle.setStrokeStyle(2, 0x4a5568);
        
        // Pierna metálica
        const shin = this.add.rectangle(0, 10, 30, 50, 0xa0aec0);
        shin.setStrokeStyle(3, 0x718096);
        
        // Sombreado gradiente simulado
        const shinHighlight = this.add.rectangle(-8, 10, 8, 46, 0xe2e8f0, 0.5);
        
        // Articulación de la rodilla
        const knee = this.add.circle(0, -15, 10, 0x4a5568);
        knee.setStrokeStyle(2, 0x2d3748);
        
        // Muslo
        const thigh = this.add.rectangle(0, -35, 32, 40, 0x718096);
        thigh.setStrokeStyle(3, 0x4a5568);
        
        // Tornillos decorativos
        const screw1 = this.add.circle(-10, -45, 3, 0x2d3748);
        const screw2 = this.add.circle(10, -45, 3, 0x2d3748);
        
        legGroup.add([foot, ankle, shin, shinHighlight, knee, thigh, screw1, screw2]);
        return legGroup;
    }

    createMetallicBody(x, y) {
        const bodyGroup = this.add.container(x, y);
        
        // Cuerpo principal (forma de pecho metálico)
        const torso = this.add.rectangle(0, 0, 110, 130, 0x3182ce);
        torso.setStrokeStyle(4, 0x2c5282);
        
        // Sombreado metálico
        const torsoHighlight = this.add.rectangle(-25, 0, 20, 126, 0x63b3ed, 0.4);
        const torsoShadow = this.add.rectangle(35, 0, 15, 126, 0x2c5282, 0.3);
        
        // Panel de control central (pantalla)
        const screen = this.add.rectangle(0, -15, 70, 50, 0x1a202c);
        screen.setStrokeStyle(3, 0x4a5568);
        
        // Luces LED del panel
        const led1 = this.add.circle(-20, -25, 6, 0x48bb78);
        led1.setStrokeStyle(2, 0x2f855a);
        const led2 = this.add.circle(0, -25, 6, 0xed8936);
        led2.setStrokeStyle(2, 0xc05621);
        const led3 = this.add.circle(20, -25, 6, 0xe53e3e);
        led3.setStrokeStyle(2, 0x9b2c2c);
        
        // Animación de luces parpadeantes
        this.tweens.add({
            targets: [led1, led2, led3],
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            stagger: 200
        });
        
        // Indicadores de energía
        const powerBar = this.add.rectangle(0, 20, 60, 8, 0x2d3748);
        const powerFill = this.add.rectangle(-25, 20, 10, 6, 0x48bb78);
        
        // Tornillos en las esquinas
        const screwTL = this.add.circle(-45, -55, 4, 0x4a5568);
        const screwTR = this.add.circle(45, -55, 4, 0x4a5568);
        const screwBL = this.add.circle(-45, 55, 4, 0x4a5568);
        const screwBR = this.add.circle(45, 55, 4, 0x4a5568);
        
        // Cuello
        const neck = this.add.rectangle(0, -70, 40, 20, 0x4a5568);
        neck.setStrokeStyle(2, 0x2d3748);
        
        bodyGroup.add([
            torso, torsoHighlight, torsoShadow,
            screen, led1, led2, led3,
            powerBar, powerFill,
            screwTL, screwTR, screwBL, screwBR,
            neck
        ]);
        
        return bodyGroup;
    }

    createMetallicHead(x, y) {
        const headGroup = this.add.container(x, y);
        
        // Cabeza principal (cúpula metálica)
        const head = this.add.circle(0, 0, 55, 0xa0aec0);
        head.setStrokeStyle(4, 0x718096);
        
        // Brillo metálico en la cúpula
        const highlight = this.add.ellipse(-20, -25, 30, 20, 0xffffff, 0.4);
        highlight.setRotation(-0.5);
        
        // Visor/ojos (pantalla oscura)
        const visor = this.add.rectangle(0, 5, 80, 35, 0x1a202c);
        visor.setStrokeStyle(3, 0x4a5568);
        
        // Ojos brillantes LED
        const leftEye = this.add.ellipse(-18, 5, 20, 25, 0x00d2ff);
        leftEye.setStrokeStyle(2, 0x0099cc);
        const rightEye = this.add.ellipse(18, 5, 20, 25, 0x00d2ff);
        rightEye.setStrokeStyle(2, 0x0099cc);
        
        // Pupilas
        const leftPupil = this.add.circle(-18, 5, 6, 0xffffff);
        const rightPupil = this.add.circle(18, 5, 6, 0xffffff);
        
        // Brillo de ojos
        const eyeGlow1 = this.add.circle(-18, 5, 15, 0x00d2ff, 0.3);
        const eyeGlow2 = this.add.circle(18, 5, 15, 0x00d2ff, 0.3);
        
        // Animación de brillo de ojos
        this.tweens.add({
            targets: [leftEye, rightEye],
            scaleX: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Antenas
        const leftAntenna = this.createAntenna(-35, -45, -50, -80);
        const rightAntenna = this.createAntenna(35, -45, 50, -80);
        
        headGroup.add([
            head, highlight, visor,
            leftEye, rightEye, leftPupil, rightPupil,
            eyeGlow1, eyeGlow2,
            leftAntenna, rightAntenna
        ]);
        
        return headGroup;
    }

    createAntenna(x1, y1, x2, y2) {
        const antennaGroup = this.add.container(0, 0);
        
        // Base de la antena
        const base = this.add.circle(x1, y1, 8, 0x4a5568);
        base.setStrokeStyle(2, 0x2d3748);
        
        // Varilla de la antena
        const rod = this.add.line(0, 0, x1, y1, x2, y2, 0x718096);
        rod.setLineWidth(4);
        
        // Punta brillante de la antena
        const tip = this.add.circle(x2, y2, 10, 0xe53e3e);
        tip.setStrokeStyle(3, 0x9b2c2c);
        
        // Luz de la antena
        const light = this.add.circle(x2, y2, 6, 0xff6b6b, 0.8);
        
        // Animación de pulso de la luz
        this.tweens.add({
            targets: light,
            scale: 1.5,
            alpha: 0.4,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        antennaGroup.add([base, rod, tip, light]);
        return antennaGroup;
    }

    createMetallicArm(x, y, isLeft) {
        const armGroup = this.add.container(x, y);
        
        // Hombro
        const shoulder = this.add.circle(0, -30, 18, 0x4a5568);
        shoulder.setStrokeStyle(3, 0x2d3748);
        
        // Brazo superior
        const upperArm = this.add.rectangle(0, 0, 28, 50, 0x718096);
        upperArm.setStrokeStyle(3, 0x4a5568);
        
        // Sombreado
        const upperHighlight = this.add.rectangle(isLeft ? -8 : 8, 0, 8, 46, 0xa0aec0, 0.5);
        
        // Codo
        const elbow = this.add.circle(0, 30, 12, 0x4a5568);
        elbow.setStrokeStyle(2, 0x2d3748);
        
        // Antebrazo
        const forearm = this.add.rectangle(0, 55, 24, 45, 0x718096);
        forearm.setStrokeStyle(3, 0x4a5568);
        
        // Mano robótica
        const hand = this.createRoboticHand(0, 85, isLeft);
        
        armGroup.add([
            shoulder, upperArm, upperHighlight,
            elbow, forearm, hand
        ]);
        
        return armGroup;
    }

    createRoboticHand(x, y, isLeft) {
        const handGroup = this.add.container(x, y);
        
        // Base de la mano
        const palm = this.add.rectangle(0, 0, 30, 25, 0x4a5568);
        palm.setStrokeStyle(2, 0x2d3748);
        
        // Dedos
        const finger1 = this.add.rectangle(isLeft ? -8 : 8, 15, 8, 20, 0x718096);
        finger1.setStrokeStyle(2, 0x4a5568);
        const finger2 = this.add.rectangle(0, 18, 8, 20, 0x718096);
        finger2.setStrokeStyle(2, 0x4a5568);
        const finger3 = this.add.rectangle(isLeft ? 8 : -8, 15, 8, 20, 0x718096);
        finger3.setStrokeStyle(2, 0x4a5568);
        
        // Pulgar
        const thumb = this.add.rectangle(isLeft ? -12 : 12, 5, 6, 15, 0x718096);
        thumb.setStrokeStyle(2, 0x4a5568);
        thumb.setRotation(isLeft ? -0.5 : 0.5);
        
        handGroup.add([palm, finger1, finger2, finger3, thumb]);
        return handGroup;
    }

    createModernDialogPanel(width, height) {
        const panelY = height - 140;
        
        // Sombra del panel con blur
        const shadow = this.add.rectangle(width / 2 + 8, panelY + 8, 780, 140, 0x000000, 0.4);
        shadow.setDepth(-1);
        
        // Panel principal con fondo azul oscuro semi-transparente
        const panel = this.add.rectangle(width / 2, panelY, 780, 140, 0x1a365d, 0.95);
        panel.setStrokeStyle(4, 0x00d2ff);
        
        // Borde interior brillante
        const innerBorder = this.add.rectangle(width / 2, panelY, 770, 130, 0x000000, 0);
        innerBorder.setStrokeStyle(2, 0x4fc3f7, 0.6);
        
        // Línea decorativa superior brillante
        const accent = this.add.rectangle(width / 2, panelY - 68, 780, 6, 0x00d2ff);
        
        // Brillo de neón en la línea
        const accentGlow = this.add.rectangle(width / 2, panelY - 68, 780, 6, 0x00d2ff, 0.3);
        this.tweens.add({
            targets: accentGlow,
            scaleY: 2,
            alpha: { from: 0.1, to: 0.5 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Esquinas decorativas más prominentes
        this.createCornerAccent(width / 2 - 380, panelY - 66, true, true);
        this.createCornerAccent(width / 2 + 380, panelY - 66, false, true);
        this.createCornerAccent(width / 2 - 380, panelY + 66, true, false);
        this.createCornerAccent(width / 2 + 380, panelY + 66, false, false);
    }

    createCornerAccent(x, y, isLeft, isTop) {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x00d2ff, 0.6);
        
        const size = 15;
        const xDir = isLeft ? 1 : -1;
        const yDir = isTop ? 1 : -1;
        
        graphics.beginPath();
        graphics.moveTo(x, y + (size * yDir));
        graphics.lineTo(x, y);
        graphics.lineTo(x + (size * xDir), y);
        graphics.strokePath();
    }

    createFloatingParticles() {
        // Partículas flotantes de datos/código
        const symbols = ['01', '10', '{}', '[]', '++', '//'];
        
        for (let i = 0; i < 8; i++) {
            const symbol = this.add.text(
                50 + Math.random() * 900,
                50 + Math.random() * 400,
                symbols[Math.floor(Math.random() * symbols.length)],
                {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#4fc3f7'
                }
            ).setAlpha(0.3);
            
            this.tweens.add({
                targets: symbol,
                y: '-=50',
                alpha: { from: 0.1, to: 0.4 },
                duration: 4000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    setupDialogs(width, height) {
        this.dialogText = this.add.text(width / 2, height - 140, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(10);

        this.dialogs = [
            '¡Hola pequeño científico! Soy ROBI, un robot inteligente.',
            '¿Sabes qué es un robot? Te lo explicaré...',
            'Los robots somos máquinas especiales que ayudamos a las personas.',
            'Tenemos partes como tú: cabeza, cuerpo, brazos y piernas.',
            'Pero ¡oh no! Alguien desarmó mi cuerpo...',
            '¿Podrías ayudarme a volver a armarme? ¡Confío en ti!'
        ];

        this.currentDialog = 0;
        this.showNextDialog();

        // Indicador "Clic para continuar" - MÁS VISIBLE Y BRILLANTE
        const clickY = height - 95;
        
        // Fondo del indicador para mejor visibilidad
        this.clickBg = this.add.rectangle(width / 2, clickY, 280, 35, 0x00d2ff, 0.15);
        this.clickBg.setStrokeStyle(2, 0x00d2ff, 0.5);
        this.clickBg.setDepth(10);
        
        // Texto principal con brillo
        this.clickIndicator = this.add.text(width / 2, clickY, '👆 CLICK PARA CONTINUAR', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#00d2ff'
        }).setOrigin(0.5).setDepth(11);
        
        // Efecto de brillo y sombra
        this.clickIndicator.setShadow(0, 0, '#00d2ff', 15, true, true);
        
        // Animación más llamativa
        this.tweens.add({
            targets: this.clickIndicator,
            alpha: { from: 0.6, to: 1 },
            scale: { from: 0.92, to: 1.08 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Animación del fondo
        this.tweens.add({
            targets: this.clickBg,
            alpha: { from: 0.1, to: 0.25 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.input.on('pointerdown', () => {
            if (this.currentDialog < this.dialogs.length - 1) {
                this.currentDialog++;
                this.showNextDialog();
            }
        });

        this.helpButton = this.createFuturisticButton(width / 2, height - 55);
        this.helpButton.setVisible(false);
    }

    createFuturisticButton(x, y) {
        const buttonGroup = this.add.container(x, y);
        
        // Fondo del botón con gradiente simulado
        const buttonBg = this.add.rectangle(0, 0, 220, 55, 0x00d2ff);
        buttonBg.setStrokeStyle(3, 0x0099cc);
        
        // Brillo interior
        const highlight = this.add.rectangle(0, -12, 200, 8, 0x80e7ff, 0.6);
        
        // Texto del botón
        const buttonText = this.add.text(0, 0, '¡AYUDAR! 🤖', {
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Sombra del texto
        buttonText.setShadow(2, 2, '#0099cc', 4, true, true);
        
        buttonGroup.add([buttonBg, highlight, buttonText]);
        
        // Hacer interactivo
        const hitArea = this.add.rectangle(0, 0, 220, 55, 0x000000, 0);
        buttonGroup.add(hitArea);
        hitArea.setInteractive({ useHandCursor: true });
        
        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: buttonGroup,
                scale: 1.08,
                duration: 150,
                ease: 'Back.easeOut'
            });
            buttonBg.setFillStyle(0x33ddff);
        });
        
        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: buttonGroup,
                scale: 1,
                duration: 150
            });
            buttonBg.setFillStyle(0x00d2ff);
        });
        
        hitArea.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonGroup,
                scale: 0.95,
                duration: 80,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('RobotPuzzleScene');
                }
            });
        });
        
        return buttonGroup;
    }

    showNextDialog() {
        this.tweens.add({
            targets: this.dialogText,
            alpha: 0,
            duration: 100,
            onComplete: () => {
                this.dialogText.setText(this.dialogs[this.currentDialog]);
                this.tweens.add({
                    targets: this.dialogText,
                    alpha: 1,
                    duration: 100
                });
            }
        });

        if (this.currentDialog === this.dialogs.length - 1) {
            this.clickIndicator.setVisible(false);
            if (this.clickBg) this.clickBg.setVisible(false);
            this.time.delayedCall(400, () => {
                this.helpButton.setVisible(true);
                this.tweens.add({
                    targets: this.helpButton,
                    scale: { from: 0, to: 1 },
                    duration: 400,
                    ease: 'Back.easeOut'
                });
            });
        }
    }
}