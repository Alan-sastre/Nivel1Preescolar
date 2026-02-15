class Puzzle3Scene extends Phaser.Scene {
  constructor() {
    super("Puzzle3Scene");
  }

  init(data) {
    this.robotPos = data;
  }

  create() {
    const { width, height } = this.scale;

    // Fondo azul animado
    this.createAnimatedBackground();

    this.add
      .text(width / 2, 40, "PASO 3: EXTREMIDADES", {
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

    // Robot base (Cuerpo y Cabeza con Cara) con nuevos colores
    this.drawPuzzle2State(width / 2, height / 2);

    // Áreas de destino (Siluetas)
    const txArmL = width / 2 - 130;
    const txArmR = width / 2 + 130;
    const tyArm = height / 2 + 50;

    const txLegL = width / 2 - 50;
    const txLegR = width / 2 + 50;
    const tyLeg = height / 2 + 180;

    // Dibujar siluetas mejoradas (Más largas)
    this.drawPartSilhouette(txArmL, tyArm, 100, 45); // Brazo L
    this.drawPartSilhouette(txArmR, tyArm, 100, 45); // Brazo R
    this.drawPartSilhouette(txLegL, tyLeg, 50, 110); // Pierna L
    this.drawPartSilhouette(txLegR, tyLeg, 50, 110); // Pierna R

    // Crear piezas arrastrables (Brazos y piernas más largos y detallados)
    this.createDraggableLimb(
      120,
      180,
      100,
      45,
      this.colors.accent,
      "arm",
      txArmL,
      tyArm,
      "BRAZO IZQ",
    );
    this.createDraggableLimb(
      width - 120,
      180,
      100,
      45,
      this.colors.accent,
      "arm",
      txArmR,
      tyArm,
      "BRAZO DER",
    );

    this.createDraggableLimb(
      120,
      height - 150,
      50,
      110,
      this.colors.body,
      "leg",
      txLegL,
      tyLeg,
      "PIERNA IZQ",
    );
    this.createDraggableLimb(
      width - 120,
      height - 150,
      50,
      110,
      this.colors.body,
      "leg",
      txLegR,
      tyLeg,
      "PIERNA DER",
    );

    this.partsPlaced = 0;
    this.totalParts = 4;
  }

  createAnimatedBackground() {
    const { width, height } = this.scale;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000b1e, 0x000b1e, 0x001a3d, 0x001a3d, 1);
    bg.fillRect(0, 0, width, height);

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const p = this.add.circle(x, y, Phaser.Math.Between(2, 5), 0x00ffff, 0.3);
      this.tweens.add({
        targets: p,
        y: y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
      });
    }
  }

  drawPuzzle2State(x, y) {
    const g = this.add.graphics();
    const c = this.colors;

    // POSICIONES BASE
    const tx = x;
    const ty = y + 50;
    const hx = x;
    const hy = y - 80;

    // --- DIBUJAR TORSO (Detallado) ---
    const tw = 180;
    const th = 160;
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(tx - tw / 2 + 8, ty - th / 2 + 8, tw, th, 15);
    g.fillStyle(c.body, 1);
    g.fillRoundedRect(tx - tw / 2, ty - th / 2, tw, th, 15);
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(tx - tw / 2 + 4, ty - th / 2 + 4, tw - 8, 10, 5);
    g.lineStyle(5, 0x111111, 1);
    g.strokeRoundedRect(tx - tw / 2, ty - th / 2, tw, th, 15);

    // Panel de control
    g.fillStyle(0x111111, 1);
    g.fillRoundedRect(tx - tw / 2.5, ty - th / 3, tw / 1.25, th / 2, 10);
    g.fillStyle(0xffffff, 0.1);
    g.fillPath();
    g.moveTo(tx - tw / 2.5, ty - th / 3);
    g.lineTo(tx + tw / 2.5 - 20, ty - th / 3);
    g.lineTo(tx - tw / 2.5, ty + th / 6);
    g.closePath();
    g.fill();
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

    // --- DIBUJAR CABEZA (Detallada) ---
    const hw = 120;
    const hh = 100;
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(hx - hw / 2 + 8, hy - hh / 2 + 8, hw, hh, 15);
    g.fillStyle(c.head, 1);
    g.fillRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(hx - hw / 2 + 4, hy - hh / 2 + 4, hw - 8, 10, 5);
    g.lineStyle(5, 0x111111, 1);
    g.strokeRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);

    // Visor
    g.fillStyle(0x001111, 1);
    g.fillRoundedRect(hx - hw / 2 + 10, hy - 10, hw - 20, 40, 5);
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

    // OJOS (Ya colocados)
    [hx - 30, hx + 30].forEach((ex) => {
      // Base ojo
      g.fillStyle(0x222222, 1);
      g.fillCircle(ex, hy - 10, 22);
      g.lineStyle(3, 0x777777, 1);
      g.strokeCircle(ex, hy - 10, 22);
      // Cristal iris
      g.fillStyle(c.glow, 0.8);
      g.fillCircle(ex, hy - 10, 15);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(ex - 5, hy - 15, 5);
    });

    // SENSORES (Ya colocados)
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

  drawPartSilhouette(x, y, w, h) {
    const s = this.add.graphics();
    s.lineStyle(3, 0x00ffff, 0.2);
    s.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    this.tweens.add({
      targets: s,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  createDraggableLimb(x, y, w, h, color, type, tx, ty, label) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // Sombras y cuerpo principal
    g.fillStyle(0x000000, 0.4);
    g.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w, h, 10);
    g.fillStyle(color, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Efecto de pistón hidráulico interno
    g.fillStyle(0x999999, 1);
    if (type === "arm") {
      g.fillRect(-w / 4, -5, w / 2, 10);
      g.lineStyle(2, 0xffffff, 0.5);
      g.lineBetween(-w / 4, -5, w / 4, -5);
    } else {
      g.fillRect(-5, -h / 4, 10, h / 2);
      g.lineStyle(2, 0xffffff, 0.5);
      g.lineBetween(-5, -h / 4, -5, h / 4);
    }

    // Remaches metálicos
    g.fillStyle(0x333333, 1);
    const rivetSize = 3;
    if (type === "arm") {
      [
        [-w / 2 + 8, -h / 2 + 8],
        [w / 2 - 8, -h / 2 + 8],
        [-w / 2 + 8, h / 2 - 8],
        [w / 2 - 8, h / 2 - 8],
      ].forEach((p) => g.fillCircle(p[0], p[1], rivetSize));
    } else {
      [
        [-w / 2 + 8, -h / 2 + 8],
        [w / 2 - 8, -h / 2 + 8],
        [-w / 2 + 8, h / 2 - 8],
        [w / 2 - 8, h / 2 - 8],
      ].forEach((p) => g.fillCircle(p[0], p[1], rivetSize));
    }

    g.lineStyle(4, 0x111111, 1);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    // Articulación circular con detalle metálico
    g.fillStyle(0x333333, 1);
    let jx = 0;
    let jy = 0;
    if (type === "arm") {
      jx = tx < this.scale.width / 2 ? w / 2 - 10 : -w / 2 + 10;
      jy = 0;
    } else {
      jx = 0;
      jy = -h / 2 + 10;
    }

    // Dibujar cables externos para look robótico (Usamos lineBetween para máxima compatibilidad)
    g.lineStyle(2, 0x00ffff, 0.4);
    if (type === "arm") {
      // Cable superior segmentado
      g.lineBetween(-w / 2 + 20, -h / 2, 0, -h / 2 - 8);
      g.lineBetween(0, -h / 2 - 8, w / 2 - 20, -h / 2);
    } else {
      // Cable lateral segmentado
      g.lineBetween(-w / 2, -h / 2 + 20, -w / 2 - 8, 0);
      g.lineBetween(-w / 2 - 8, 0, -w / 2, h / 2 - 20);
    }

    g.fillStyle(0x333333, 1);
    g.fillCircle(jx, jy, 14);
    g.lineStyle(2, 0x00ffff, 0.5);
    g.strokeCircle(jx, jy, 14);
    g.fillStyle(0x777777, 1);
    g.fillCircle(jx, jy, 7);

    // Brillo metálico
    g.fillStyle(0xffffff, 0.2);
    if (type === "arm") {
      g.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, 6, 3);
    } else {
      g.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, 6, h - 8, 3);
    }

    const txt = this.add
      .text(0, h / 2 + 30, label, {
        fontFamily: "Rajdhani",
        fontSize: "20px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);
    container.add([g, txt]);

    container.setSize(w, h + 60);
    container.setInteractive();
    this.input.setDraggable(container);

    container.on("drag", (p, dx, dy) => {
      container.setPosition(dx, dy);
      container.setScale(1.2);
      txt.setColor("#00ffff");
    });

    container.on("dragend", () => {
      container.setScale(1);
      txt.setColor("#ffffff");
      if (Phaser.Math.Distance.Between(container.x, container.y, tx, ty) < 50) {
        container.setPosition(tx, ty);
        txt.setVisible(false);
        container.disableInteractive();
        this.partsPlaced++;
        this.checkWin();
      } else {
        this.tweens.add({
          targets: container,
          x: x,
          y: y,
          duration: 500,
          ease: "Back.out",
        });
      }
    });
  }

  checkWin() {
    if (this.partsPlaced === this.totalParts) {
      this.time.delayedCall(500, () => {
        this.scene.start("SuccessScene");
      });
    }
  }
}
