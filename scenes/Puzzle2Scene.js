class Puzzle2Scene extends Phaser.Scene {
  constructor() {
    super("Puzzle2Scene");
  }

  init(data) {
    this.robotPos = data;
  }

  create() {
    const { width, height } = this.scale;

    // Iniciar gestor de audio
    new AudioManager(this, "backgroundMusic");

    // Fondo azul animado
    this.createAnimatedBackground();

    this.add
      .text(width / 2, 40, "PASO 2: LA CARA", {
        fontFamily: "Orbitron",
        fontSize: "32px",
        color: "#00ffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setShadow(2, 2, "#000000", 2, true, true);

    // Colores realistas definitivos y unificados
    this.colors = {
      body: 0x555555, // Gris acero oscuro
      head: 0x777777, // Gris titanio
      accent: 0xff6600, // Naranja industrial
      glass: 0x222222, // Vidrio oscuro
      glow: 0x00ffff, // Cian para luces/energía
      sensors: 0x333333, // Gris oscuro para la base de sensores
    };

    // Robot base mejorado (Cuerpo y Cabeza del Puzzle 1 con nuevos colores)
    this.drawPuzzle1State(width / 2, height / 2);

    // Siluetas de cara (Ajustadas a la cabeza) con indicadores de posición claros
    this.drawEyeTarget(width / 2 - 30, height / 2 - 90); // Ojo L
    this.drawEyeTarget(width / 2 + 30, height / 2 - 90); // Ojo R
    this.drawPartSilhouette(width / 2, height / 2 - 55, 80, 20, false); // Sensores

    // Piezas con etiquetas (Ajustadas a las siluetas)
    this.pieces = [];

    const eyeL = this.createDraggableEye(
      150,
      height / 2 - 100,
      width / 2 - 30,
      height / 2 - 90,
      "OJO",
    );
    this.pieces.push({
      container: eyeL,
      startX: 150,
      startY: height / 2 - 100,
      targetX: width / 2 - 30,
      targetY: height / 2 - 90,
      placed: false,
    });

    const eyeR = this.createDraggableEye(
      width - 150,
      height / 2 - 100,
      width / 2 + 30,
      height / 2 - 90,
      "OJO",
    );
    this.pieces.push({
      container: eyeR,
      startX: width - 150,
      startY: height / 2 - 100,
      targetX: width / 2 + 30,
      targetY: height / 2 - 90,
      placed: false,
    });

    const sensors = this.createDraggableSensors(
      width / 2,
      height - 100,
      width / 2,
      height / 2 - 55,
      "SENSORES",
    );
    this.pieces.push({
      container: sensors,
      startX: width / 2,
      startY: height - 100,
      targetX: width / 2,
      targetY: height / 2 - 55,
      placed: false,
    });

    this.partsPlaced = 0;
    this.totalParts = 3;

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
  }

  drawPuzzle1State(x, y) {
    const g = this.add.graphics();
    const c = this.colors;

    // POSICIONES BASE
    const tx = x;
    const ty = y + 50;
    const hx = x;
    const hy = y - 80;

    // --- DIBUJAR TORSO (Copia fiel de Puzzle1Scene) ---
    const tw = 180;
    const th = 160;
    // Sombra
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(tx - tw / 2 + 8, ty - th / 2 + 8, tw, th, 15);
    // Cuerpo
    g.fillStyle(c.body, 1);
    g.fillRoundedRect(tx - tw / 2, ty - th / 2, tw, th, 15);
    // Bevel
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(tx - tw / 2 + 4, ty - th / 2 + 4, tw - 8, 10, 5);
    // Borde
    g.lineStyle(5, 0x111111, 1);
    g.strokeRoundedRect(tx - tw / 2, ty - th / 2, tw, th, 15);

    // Panel de control (Detailed)
    g.fillStyle(0x111111, 1);
    g.fillRoundedRect(tx - tw / 2.5, ty - th / 3, tw / 1.25, th / 2, 10);
    // Reflejo cristal
    g.fillStyle(0xffffff, 0.1);
    g.fillPath();
    g.moveTo(tx - tw / 2.5, ty - th / 3);
    g.lineTo(tx + tw / 2.5 - 20, ty - th / 3);
    g.lineTo(tx - tw / 2.5, ty + th / 6);
    g.closePath();
    g.fill();
    // Cables
    for (let side of [-1, 1]) {
      const wire = this.add.graphics();
      wire.lineStyle(3, 0x00ffff, 0.4);
      wire.beginPath();
      wire.moveTo(tx + side * (tw / 2 - 15), ty - th / 2 + 20);
      wire.lineTo(tx + side * (tw / 2 - 15), ty + th / 2 - 20);
      wire.strokePath();
      this.tweens.add({
        targets: wire,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }
    // Botones
    const bColors = [0x00ff00, 0xffff00, 0xff0000];
    bColors.forEach((col, idx) => {
      const bx = tx - tw / 4 + (idx * tw) / 4;
      const btn = this.add.circle(bx, ty - th / 10, 8, col);
      this.tweens.add({
        targets: btn,
        alpha: 0.5,
        duration: 400 + idx * 200,
        yoyo: true,
        repeat: -1,
      });
    });

    // --- DIBUJAR CABEZA (Copia fiel de Puzzle1Scene) ---
    const hw = 120;
    const hh = 100;
    // Sombra
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(hx - hw / 2 + 8, hy - hh / 2 + 8, hw, hh, 15);
    // Cuerpo
    g.fillStyle(c.head, 1);
    g.fillRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);
    // Bevel
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(hx - hw / 2 + 4, hy - hh / 2 + 4, hw - 8, 10, 5);
    // Borde
    g.lineStyle(5, 0x111111, 1);
    g.strokeRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);

    // Visor
    g.fillStyle(0x001111, 1);
    g.fillRoundedRect(hx - hw / 2 + 10, hy - 10, hw - 20, 40, 5);
    // Líneas visor
    for (let i = 0; i < 3; i++) {
      const line = this.add.graphics();
      line.lineStyle(1, 0x00ffff, 0.5);
      line.lineBetween(
        hx - hw / 2 + 20,
        hy - 5 + i * 10,
        hx + hw / 2 - 20,
        hy - 5 + i * 10,
      );
      this.tweens.add({
        targets: line,
        alpha: 0.1,
        duration: 800 + i * 200,
        yoyo: true,
        repeat: -1,
      });
    }

    // SENSORES
    g.fillStyle(c.sensors, 1);
    g.fillRoundedRect(hx - 40, hy + 25, 80, 20, 5);
    g.lineStyle(2, 0x111111, 1);
    g.strokeRoundedRect(hx - 40, hy + 25, 80, 20, 5);
    for (let i = 0; i < 4; i++) {
      const sx = hx - 30 + i * 20;
      const light = this.add.circle(sx, hy + 35, 4, 0x00ffff, 0.3);
      this.tweens.add({
        targets: light,
        alpha: 1,
        duration: 400 + i * 150,
        yoyo: true,
        repeat: -1,
      });
    }

    // Tornillos
    [
      [-hw / 2 + 15, -hh / 2 + 15],
      [hw / 2 - 15, -hh / 2 + 15],
      [-hw / 2 + 15, hh / 2 - 15],
      [hw / 2 - 15, hh / 2 - 15],
    ].forEach((pos) => {
      g.fillStyle(0x777777, 1);
      g.fillCircle(hx + pos[0], hy + pos[1], 5);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(hx + pos[0] - 1, hy + pos[1] - 1, 2);
    });

    // SENSORES SUPERIORES (Antenas)
    [-35, 35].forEach((ax) => {
      // Base de la antena
      g.fillStyle(0x333333, 1);
      g.fillRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);
      g.lineStyle(2, 0x111111, 1);
      g.strokeRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);

      // Mástil
      g.lineStyle(4, 0x444444, 1);
      g.lineBetween(hx + ax, hy - hh / 2 - 10, hx + ax, hy - hh / 2 - 45);

      // Punta con luz pulsante
      const light = this.add.circle(hx + ax, hy - hh / 2 - 50, 6, 0x00ffff);
      this.tweens.add({
        targets: light,
        alpha: 0.4,
        duration: 600,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  drawEyeTarget(x, y) {
    const g = this.add.graphics();
    // Círculo exterior punteado o con brillo para indicar posición
    g.lineStyle(2, 0x00ffff, 0.5);
    g.strokeCircle(x, y, 22);

    // Icono de ojo sutil en el centro
    g.fillStyle(0x00ffff, 0.2);
    g.fillCircle(x, y, 15);

    // Texto sutil "AQUÍ"
    this.add
      .text(x, y + 25, "OJO", { fontSize: "12px", fill: "#00ffff" })
      .setOrigin(0.5)
      .setAlpha(0.6);
  }

  drawPartSilhouette(x, y, w, h, isCircle) {
    const s = this.add.graphics();
    s.lineStyle(3, 0x00ffff, 0.2);
    if (isCircle) s.strokeCircle(x, y, w / 2);
    else s.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 5);

    this.tweens.add({
      targets: s,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  createDraggableEye(x, y, tx, ty, label) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // Lente de cámara tecnológico
    g.fillStyle(0x222222, 1);
    g.fillCircle(0, 0, 22);
    g.lineStyle(3, 0x777777, 1);
    g.strokeCircle(0, 0, 22);

    // Cristal azul con brillo
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(0, 0, 16);

    // Anillo de energía exterior
    g.lineStyle(2, 0x00ffff, 0.5);
    g.strokeCircle(0, 0, 26);

    // Brillo de lente
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(-5, -5, 6);

    // Pupila electrónica
    g.fillStyle(0x000000, 1);
    g.fillCircle(0, 0, 8);
    const core = this.add.circle(0, 0, 3, 0xff0000);

    // Línea de escaneo
    const scanLine = this.add.graphics();
    scanLine.lineStyle(1, 0x00ffff, 0.8);
    scanLine.lineBetween(-15, 0, 15, 0);
    scanLine.setVisible(false);

    container.add([g, core, scanLine]);

    // Animación de parpadeo aleatorio
    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 5000),
      callback: () => {
        if (container.active) {
          this.tweens.add({
            targets: g,
            scaleY: 0.1,
            duration: 100,
            yoyo: true,
            onStart: () => {
              core.setVisible(false);
            },
            onComplete: () => {
              core.setVisible(true);
            },
          });
        }
      },
      loop: true,
    });

    // Animación de línea de escaneo
    this.tweens.add({
      targets: scanLine,
      y: 15,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: core,
      alpha: 0.2,
      duration: 300,
      yoyo: true,
      repeat: -1,
    });

    const txt = this.add
      .text(0, 40, label, {
        fontFamily: "Rajdhani",
        fontSize: "20px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add(txt);

    container.setSize(44, 80);
    container.setInteractive();
    this.input.setDraggable(container);

    container.on("pointerdown", () => {
      this.children.bringToTop(container);
      if (this.hand) {
        this.hand.destroy();
        this.hand = null;
      }
    });

    container.on("drag", (p, dx, dy) => {
      container.setPosition(dx, dy);
      container.setScale(1.2);
      txt.setColor("#00ffff");
    });

    container.on("dragend", () => {
      container.setScale(1);
      txt.setColor("#ffffff");
      if (Phaser.Math.Distance.Between(container.x, container.y, tx, ty) < 40) {
        container.setPosition(tx, ty);
        txt.setVisible(false);
        container.disableInteractive();
        this.playPlacementEffect(container);

        // Marcar como colocada y actualizar tutorial
        const pieceData = this.pieces.find((p) => p.container === container);
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
          ease: "Back.out",
          onComplete: () => {
            this.updateTutorial();
          },
        });
      }
    });

    return container;
  }

  createDraggableSensors(x, y, tx, ty, label) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    const w = 80;
    const h = 20;

    // Base de los sensores tecnológica
    g.fillStyle(this.colors.sensors, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 5);
    g.lineStyle(2, 0x111111, 1);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 5);

    // Luces indicadoras de los sensores
    for (let i = 0; i < 4; i++) {
      const sx = -30 + i * 20;
      const light = this.add.circle(sx, 0, 4, 0x00ffff, 0.3);
      container.add(light);
      this.tweens.add({
        targets: light,
        alpha: 1,
        duration: 400 + i * 150,
        yoyo: true,
        repeat: -1,
      });
    }

    const txt = this.add
      .text(0, h / 2 + 20, label, {
        fontFamily: "Rajdhani",
        fontSize: "18px",
        fill: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add([g, txt]);
    container.setSize(w, h + 40);
    container.setInteractive();
    this.input.setDraggable(container);

    container.on("pointerdown", () => {
      this.children.bringToTop(container);
      if (this.hand) {
        this.hand.destroy();
        this.hand = null;
      }
    });

    container.on("drag", (p, dx, dy) => {
      container.setPosition(dx, dy);
      container.setScale(1.2);
      txt.setColor("#00ffff");
    });

    container.on("dragend", () => {
      container.setScale(1);
      txt.setColor("#ffffff");
      if (Phaser.Math.Distance.Between(container.x, container.y, tx, ty) < 40) {
        container.setPosition(tx, ty);
        txt.setVisible(false);
        container.disableInteractive();
        this.playPlacementEffect(container);

        // Marcar como colocada y actualizar tutorial
        const pieceData = this.pieces.find((p) => p.container === container);
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
          ease: "Back.out",
          onComplete: () => {
            this.updateTutorial();
          },
        });
      }
    });

    return container;
  }

  snap(container, ox, oy, tx, ty) {
    const d = Phaser.Math.Distance.Between(container.x, container.y, tx, ty);
    if (d < 40) {
      container.x = tx;
      container.y = ty;
      container.disableInteractive();
      this.playPlacementEffect(container);
      this.partsPlaced++;
      this.checkWin();
    } else {
      this.tweens.add({
        targets: container,
        x: ox,
        y: oy,
        duration: 500,
        ease: "Back.easeOut",
      });
    }
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
        this.scene.start("Puzzle3Scene", this.robotPos);
      });
    }
  }

  showCelebration(onComplete) {
    const { width, height } = this.scale;

    // Texto de felicitación
    const text = this.add
      .text(width / 2, height / 2, "¡EXCELENTE!", {
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
