class Puzzle1Scene extends Phaser.Scene {
  constructor() {
    super("Puzzle1Scene");
  }

  create() {
    const { width, height } = this.scale;

    // Iniciar gestor de audio
    new AudioManager(this, "backgroundMusic");

    // Fondo azul animado
    this.createAnimatedBackground();

    this.add
      .text(width / 2, 40, "PASO 1: EL CUERPO", {
        fontFamily: "Orbitron",
        fontSize: "32px",
        color: "#00ffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#000000", 2, true, true);

    // Áreas de destino (Siluetas)
    const targetHeadX = width / 2;
    const targetHeadY = height / 2 - 80;
    const targetTorsoX = width / 2;
    const targetTorsoY = height / 2 + 50;

    // Dibujar siluetas mejoradas
    this.drawPartSilhouette(targetHeadX, targetHeadY, 120, 100); // Cabeza
    this.drawPartSilhouette(targetTorsoX, targetTorsoY, 180, 160); // Torso

    // Colores realistas definitivos y unificados
    this.colors = {
      body: 0x555555, // Gris acero oscuro
      head: 0x777777, // Gris titanio
      accent: 0xff6600, // Naranja industrial
      glass: 0x222222, // Vidrio oscuro
      glow: 0x00ffff, // Cian para luces/energía
      sensors: 0x333333, // Gris oscuro para la base de sensores
    };

    // Crear piezas arrastrables con etiquetas
    this.pieces = [];

    const head = this.createDraggablePart(
      width - 150,
      200,
      120,
      100,
      this.colors.head,
      "head",
      targetHeadX,
      targetHeadY,
      "CABEZA",
    );
    this.pieces.push({
      container: head,
      startX: width - 150,
      startY: 200,
      targetX: targetHeadX,
      targetY: targetHeadY,
      placed: false,
    });

    const torso = this.createDraggablePart(
      150,
      200,
      180,
      160,
      this.colors.body,
      "torso",
      targetTorsoX,
      targetTorsoY,
      "CUERPO",
    );
    this.pieces.push({
      container: torso,
      startX: 150,
      startY: 200,
      targetX: targetTorsoX,
      targetY: targetTorsoY,
      placed: false,
    });

    this.partsPlaced = 0;
    this.totalParts = 2;

    // Iniciar tutorial dinámico
    this.updateTutorial();
  }

  updateTutorial() {
    if (this.hand) {
      this.hand.destroy();
      this.hand = null;
    }

    const nextPiece = this.pieces.find((p) => !p.placed);
    if (nextPiece) {
      this.showTutorial(
        nextPiece.startX,
        nextPiece.startY,
        nextPiece.targetX,
        nextPiece.targetY,
      );
    }
  }

  showTutorial(startX, startY, endX, endY) {
    this.hand = this.add
      .text(startX, startY, "👆", {
        fontSize: "60px",
        fontFamily: "Arial",
        padding: { x: 20, y: 20 },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: this.hand,
      x: endX,
      y: endY,
      duration: 2000,
      ease: "Power2",
      repeat: -1,
      onRepeat: () => {
        if (this.hand) {
          this.hand.setPosition(startX, startY);
          this.hand.setAlpha(1);
        }
      },
      onUpdate: (tween) => {
        if (this.hand && tween.progress > 0.8) {
          this.hand.setAlpha((1 - tween.progress) * 5);
        }
      },
    });
  }

  createAnimatedBackground() {
    const { width, height } = this.scale;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000b1e, 0x000b1e, 0x001a3d, 0x001a3d, 1);
    bg.fillRect(0, 0, width, height);

    // Partículas flotantes
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(2, 5);
      const p = this.add.circle(x, y, size, 0x00ffff, 0.3);

      this.tweens.add({
        targets: p,
        y: y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        ease: "Linear",
      });
    }

    // Líneas tecnológicas de fondo
    const lines = this.add.graphics();
    lines.lineStyle(1, 0x00ffff, 0.1);
    for (let i = 0; i < width; i += 50) {
      lines.lineBetween(i, 0, i, height);
    }
    for (let j = 0; j < height; j += 50) {
      lines.lineBetween(0, j, width, j);
    }
  }

  drawPartSilhouette(x, y, w, h) {
    const s = this.add.graphics();
    s.lineStyle(4, 0x00ffff, 0.15);
    s.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 15);
    s.fillStyle(0x00ffff, 0.05);
    s.fillRoundedRect(x - w / 2, y - h / 2, w, h, 15);

    // Efecto de pulso en la silueta
    this.tweens.add({
      targets: s,
      alpha: 0.5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  }

  createDraggablePart(x, y, w, h, color, id, tx, ty, label) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // Sombra de la pieza
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(-w / 2 + 8, -h / 2 + 8, w, h, 15);

    // Cuerpo principal con degradado metálico
    g.fillStyle(color, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 15);

    // Brillo superior (bevel)
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, 10, 5);

    // Borde metálico oscuro
    g.lineStyle(5, 0x111111, 1);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 15);

    // Detalles mecánicos
    if (id === "head") {
      // Visor tecnológico
      g.fillStyle(0x001111, 1);
      g.fillRoundedRect(-w / 2 + 10, -10, w - 20, 40, 5);
      g.lineStyle(2, 0x00ffff, 0.3);
      g.strokeRoundedRect(-w / 2 + 10, -10, w - 20, 40, 5);

      // Líneas de datos en el visor
      for (let i = 0; i < 3; i++) {
        const line = this.add.graphics();
        line.lineStyle(1, 0x00ffff, 0.5);
        line.lineBetween(-w / 2 + 20, -5 + i * 10, w / 2 - 20, -5 + i * 10);
        container.add(line);
        this.tweens.add({
          targets: line,
          alpha: 0.1,
          duration: 800 + i * 200,
          yoyo: true,
          repeat: -1,
        });
      }

      // SENSORES (Reemplaza a la boca)
      g.fillStyle(this.colors.sensors, 1);
      g.fillRoundedRect(-40, 25, 80, 20, 5);
      g.lineStyle(2, 0x111111, 1);
      g.strokeRoundedRect(-40, 25, 80, 20, 5);

      // Luces de sensores
      for (let i = 0; i < 4; i++) {
        const sx = -30 + i * 20;
        const light = this.add.circle(sx, 35, 4, 0x00ffff, 0.3);
        container.add(light);
        this.tweens.add({
          targets: light,
          alpha: 1,
          duration: 400 + i * 150,
          yoyo: true,
          repeat: -1,
        });
      }

      // Tornillos con brillo (Movidos para no chocar con bordes)
      [
        [-w / 2 + 15, -h / 2 + 15],
        [w / 2 - 15, -h / 2 + 15],
        [-w / 2 + 15, h / 2 - 15],
        [w / 2 - 15, h / 2 - 15],
      ].forEach((pos) => {
        g.fillStyle(0x777777, 1);
        g.fillCircle(pos[0], pos[1], 5);
        g.fillStyle(0xffffff, 0.5);
        g.fillCircle(pos[0] - 1, pos[1] - 1, 2);
      });

      // SENSORES SUPERIORES (Antenas)
      [-35, 35].forEach((ax) => {
        // Base de la antena
        g.fillStyle(0x333333, 1);
        g.fillRect(ax - 5, -h / 2 - 10, 10, 15);
        g.lineStyle(2, 0x111111, 1);
        g.strokeRect(ax - 5, -h / 2 - 10, 10, 15);

        // Mástil
        g.lineStyle(4, 0x444444, 1);
        g.lineBetween(ax, -h / 2 - 10, ax, -h / 2 - 45);

        // Punta con luz pulsante
        const light = this.add.circle(ax, -h / 2 - 50, 6, 0x00ffff);
        container.add(light);
        this.tweens.add({
          targets: light,
          alpha: 0.4,
          duration: 600,
          yoyo: true,
          repeat: -1,
        });
      });
    } else if (id === "torso") {
      // Panel de control más detallado con efecto de cristal
      g.fillStyle(0x111111, 1);
      g.fillRoundedRect(-w / 2.5, -h / 3, w / 1.25, h / 2, 10);

      // Reflejo de cristal en el panel
      g.fillStyle(0xffffff, 0.1);
      g.fillPath();
      g.moveTo(-w / 2.5, -h / 3);
      g.lineTo(w / 2.5 - 20, -h / 3);
      g.lineTo(-w / 2.5, h / 6);
      g.closePath();
      g.fill();

      // Cables brillantes laterales
      for (let side of [-1, 1]) {
        const wire = this.add.graphics();
        wire.lineStyle(3, 0x00ffff, 0.4);
        wire.beginPath();
        wire.moveTo(side * (w / 2 - 15), -h / 2 + 20);
        wire.lineTo(side * (w / 2 - 15), h / 2 - 20);
        wire.strokePath();
        container.add(wire);
        this.tweens.add({
          targets: wire,
          alpha: 0.1,
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });
      }

      // Rejilla de ventilación
      g.lineStyle(2, 0x333333, 1);
      for (let i = -w / 3; i < w / 3; i += 10) {
        g.lineBetween(i, h / 4, i, h / 3);
      }

      // Botones brillantes
      const colors = [0x00ff00, 0xffff00, 0xff0000];
      colors.forEach((c, idx) => {
        const bx = -w / 4 + (idx * w) / 4;
        const btn = this.add.circle(bx, -h / 10, 8, c);
        container.add(btn);
        this.tweens.add({
          targets: btn,
          alpha: 0.5,
          duration: 400 + idx * 200,
          yoyo: true,
          repeat: -1,
        });
      });
    }

    container.add(g);

    // Texto debajo de la pieza
    const txt = this.add
      .text(0, h / 2 + 30, label, {
        fontFamily: "Rajdhani",
        fontSize: "24px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add(txt);

    container.setSize(w, h + 60);
    container.setInteractive();
    this.input.setDraggable(container);

    container.on("pointerdown", () => {
      this.children.bringToTop(container);
      if (this.hand) {
        this.hand.destroy();
        this.hand = null;
      }
    });

    container.on("drag", (pointer, dragX, dragY) => {
      container.x = dragX;
      container.y = dragY;
      container.setScale(1.1);
      txt.setColor("#00ffff");
    });

    container.on("dragend", () => {
      container.setScale(1);
      txt.setColor("#ffffff");
      const distance = Phaser.Math.Distance.Between(
        container.x,
        container.y,
        tx,
        ty,
      );
      if (distance < 60) {
        container.x = tx;
        container.y = ty;
        txt.setVisible(false); // Ocultar etiqueta al encajar
        container.disableInteractive();
        this.playPlacementEffect(container);
        
        // Marcar como colocada y actualizar tutorial
        const pieceData = this.pieces.find(p => p.container === container);
        if (pieceData) pieceData.placed = true;
        this.updateTutorial();

        this.partsPlaced++;
        this.checkWin();
      } else {
        this.tweens.add({
          targets: container,
          x: x,
          y: y,
          duration: 500,
          ease: "Back.easeOut",
          onComplete: () => {
            this.updateTutorial();
          }
        });
      }
    });

    return container;
  }

  playPlacementEffect(target) {
    // Efecto de escala
    this.tweens.add({
      targets: target,
      scale: { from: 1.2, to: 1 },
      duration: 300,
      ease: "Back.out",
    });

    // Efecto de destello
    const flash = this.add.rectangle(
      target.x,
      target.y,
      target.width,
      target.height,
      0xffffff,
    );
    flash.setAlpha(0.8);
    flash.setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 400,
      onComplete: () => {
        flash.destroy();
      },
    });

    // Partículas simples
    for (let i = 0; i < 10; i++) {
      const p = this.add.circle(target.x, target.y, 4, 0x00ffff);
      this.tweens.add({
        targets: p,
        x: target.x + Phaser.Math.Between(-50, 50),
        y: target.y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: 500,
        onComplete: () => p.destroy(),
      });
    }
  }

  checkWin() {
    if (this.partsPlaced === this.totalParts) {
      this.showCelebration(() => {
        this.scene.start("Puzzle2Scene", {
          headPos: { x: this.scale.width / 2, y: this.scale.height / 2 - 80 },
          torsoPos: { x: this.scale.width / 2, y: this.scale.height / 2 + 50 },
        });
      });
    }
  }

  showCelebration(onComplete) {
    const { width, height } = this.scale;

    // Texto de felicitación
    const text = this.add
      .text(width / 2, height / 2, "¡MUY BIEN!", {
        fontFamily: "Orbitron",
        fontSize: "64px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScale(0)
      .setDepth(200);

    this.tweens.add({
      targets: text,
      scale: 1,
      angle: 360,
      duration: 1000,
      ease: "Back.out",
    });

    // Confeti
    const colors = [
      0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff,
    ];

    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-100, -10);
      const color = Phaser.Utils.Array.GetRandom(colors);
      const size = Phaser.Math.Between(5, 10);
      const shape = this.add.rectangle(x, y, size, size, color).setDepth(199);

      this.tweens.add({
        targets: shape,
        y: height + 50,
        x: x + Phaser.Math.Between(-100, 100),
        angle: Phaser.Math.Between(0, 360),
        duration: Phaser.Math.Between(2000, 4000),
        ease: "Sine.easeInOut",
      });
    }

    // Esperar y cambiar de escena
    this.time.delayedCall(3000, onComplete);
  }
}
