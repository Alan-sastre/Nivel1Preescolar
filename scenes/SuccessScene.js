class SuccessScene extends Phaser.Scene {
  constructor() {
    super("SuccessScene");
  }

  create() {
    const { width, height } = this.scale;

    // Iniciar gestor de audio
    new AudioManager(this, 'backgroundMusic');

    // Fondo azul animado de éxito
    this.createAnimatedBackground();

    // Título de éxito con resplandor
    const title = this.add
      .text(width / 2, 80, "¡ROBOT COMPLETADO!", {
        fontFamily: "Orbitron",
        fontSize: "48px",
        color: "#00ffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00ffff", 20, true, true);

    const subtitle = this.add
      .text(width / 2, 140, "¡Felicidades, armaste tu robot!", {
        fontFamily: "Rajdhani",
        fontSize: "28px",
        color: "#ffffff",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [title, subtitle],
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Dibujar robot final ultra-detallado
    this.drawFinalRobot(width / 2, height / 2 + 30);

    // Botón Jugar de nuevo mejorado
    this.createRestartButton(width / 2, height - 80);
  }

  createAnimatedBackground() {
    const { width, height } = this.scale;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000b1e, 0x000b1e, 0x001a3d, 0x001a3d, 1);
    bg.fillRect(0, 0, width, height);

    // Partículas tipo fuegos artificiales suaves
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const p = this.add.star(x, y, 5, 2, 5, 0x00ffff, 0.4);
      this.tweens.add({
        targets: p,
        rotation: Math.PI * 2,
        alpha: 0.1,
        scale: 1.5,
        duration: Phaser.Math.Between(2000, 4000),
        repeat: -1,
        yoyo: true,
      });
    }
  }

  drawFinalRobot(x, y) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();

    // Aura de energía pulsante
    const aura = this.add.graphics();
    aura.fillStyle(0x00ffff, 0.1);
    aura.fillCircle(0, 0, 200);
    container.add(aura);
    this.tweens.add({
      targets: aura,
      scale: 1.2,
      alpha: 0,
      duration: 2000,
      repeat: -1,
    });

    // Sombra en el suelo
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillEllipse(0, 180, 200, 40);
    container.add(shadow);

    // Robot Parts (Drawing them inside container)

    // Colores realistas definitivos y unificados
    const c = {
      body: 0x555555, // Gris acero oscuro
      head: 0x777777, // Gris titanio
      accent: 0xff6600, // Naranja industrial
      glass: 0x222222, // Vidrio oscuro
      glow: 0x00ffff, // Cian para luces/energía
      sensors: 0x333333, // Gris oscuro para la base de sensores
    };

    // --- DIBUJAR TORSO (Copia fiel de Puzzle1Scene) ---
    const tw = 180;
    const th = 160;
    const tx = 0;
    const ty = 50; // Posición relativa en container
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
      container.add(wire);
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
      container.add(btn);
      this.tweens.add({
        targets: btn,
        alpha: 0.5,
        duration: 400 + idx * 200,
        yoyo: true,
        repeat: -1,
      });
    });

    // --- DIBUJAR CABEZA (Copia fiel de Puzzle1Scene) ---
    const headGroup = this.add.container(0, -80);
    const headG = this.add.graphics();
    const hw = 120;
    const hh = 100;
    const hx = 0;
    const hy = 0; // Posición relativa en headGroup

    // Sombra
    headG.fillStyle(0x000000, 0.4);
    headG.fillRoundedRect(hx - hw / 2 + 8, hy - hh / 2 + 8, hw, hh, 15);
    // Cuerpo
    headG.fillStyle(c.head, 1);
    headG.fillRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);
    // Bevel
    headG.fillStyle(0xffffff, 0.3);
    headG.fillRoundedRect(hx - hw / 2 + 4, hy - hh / 2 + 4, hw - 8, 10, 5);
    // Borde
    headG.lineStyle(5, 0x111111, 1);
    headG.strokeRoundedRect(hx - hw / 2, hy - hh / 2, hw, hh, 15);

    // Visor
    headG.fillStyle(0x001111, 1);
    headG.fillRoundedRect(hx - hw / 2 + 10, hy - 10, hw - 20, 40, 5);
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
      headGroup.add(line);
      this.tweens.add({
        targets: line,
        alpha: 0.1,
        duration: 800 + i * 200,
        yoyo: true,
        repeat: -1,
      });
    }
    // SENSORES SUPERIORES (Antenas mejoradas)
    [-35, 35].forEach((ax) => {
      // Base de la antena
      headG.fillStyle(0x333333, 1);
      headG.fillRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);
      headG.lineStyle(2, 0x111111, 1);
      headG.strokeRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);

      // Mástil segmentado
      headG.lineStyle(4, 0x444444, 1);
      headG.lineBetween(hx + ax, hy - hh / 2 - 10, hx + ax, hy - hh / 2 - 45);

      // Anillos de señal
      for (let i = 0; i < 3; i++) {
        const ry = hy - hh / 2 - 20 - i * 10;
        headG.lineStyle(2, 0x00ffff, 0.3);
        headG.strokeEllipse(hx + ax, ry, 12, 4);
      }

      // Punta con luz pulsante
      const light = this.add.circle(hx + ax, hy - hh / 2 - 50, 6, 0x00ffff);
      const glow = this.add.circle(
        hx + ax,
        hy - hh / 2 - 50,
        12,
        0x00ffff,
        0.3,
      );
      headGroup.add([light, glow]);
      this.tweens.add({
        targets: [light, glow],
        alpha: { from: 0.4, to: 1 },
        scale: { from: 0.8, to: 1.2 },
        duration: 600,
        yoyo: true,
        repeat: -1,
      });
    });

    // OJOS LENTE
    [-30, 30].forEach((ex) => {
      headG.fillStyle(0x222222, 1);
      headG.fillCircle(ex, hy - 10, 22);
      headG.lineStyle(3, 0x777777, 1);
      headG.strokeCircle(ex, hy - 10, 22);
      headG.fillStyle(c.glow, 0.8);
      headG.fillCircle(ex, hy - 10, 15);
      headG.fillStyle(0xffffff, 0.5);
      headG.fillCircle(ex - 5, hy - 15, 5);

      const core = this.add.circle(ex, hy - 10, 4, 0xff0000);
      headGroup.add(core);
      this.tweens.add({
        targets: core,
        alpha: 0.5,
        duration: 400,
        yoyo: true,
        repeat: -1,
      });
    });

    // SENSORES SUPERIORES (Antenas)
    [-35, 35].forEach((ax) => {
      // Base de la antena
      headG.fillStyle(0x333333, 1);
      headG.fillRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);
      headG.lineStyle(2, 0x111111, 1);
      headG.strokeRect(hx + ax - 5, hy - hh / 2 - 10, 10, 15);

      // Mástil
      headG.lineStyle(4, 0x444444, 1);
      headG.lineBetween(hx + ax, hy - hh / 2 - 10, hx + ax, hy - hh / 2 - 45);

      // Anillos de señal
      for (let i = 0; i < 3; i++) {
        const ry = hy - hh / 2 - 20 - i * 10;
        headG.lineStyle(2, 0x00ffff, 0.3);
        headG.strokeEllipse(hx + ax, ry, 12, 4);
      }

      // Punta con luz pulsante
      const light = this.add.circle(hx + ax, hy - hh / 2 - 50, 6, 0x00ffff);
      const glow = this.add.circle(
        hx + ax,
        hy - hh / 2 - 50,
        12,
        0x00ffff,
        0.3,
      );
      headGroup.add([light, glow]);
      this.tweens.add({
        targets: [light, glow],
        alpha: { from: 0.4, to: 1 },
        scale: { from: 0.8, to: 1.2 },
        duration: 600,
        yoyo: true,
        repeat: -1,
      });
    });

    // SENSORES (Módem/Panel inferior)
    headG.fillStyle(c.sensors, 1);
    headG.fillRoundedRect(hx - 40, hy + 25, 80, 20, 5);
    headG.lineStyle(2, 0x111111, 1);
    headG.strokeRoundedRect(hx - 40, hy + 25, 80, 20, 5);
    for (let i = 0; i < 4; i++) {
      const sx = hx - 30 + i * 20;
      const light = this.add.circle(sx, hy + 35, 4, 0x00ffff, 0.3);
      headGroup.add(light);
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
      headG.fillStyle(0x777777, 1);
      headG.fillCircle(hx + pos[0], hy + pos[1], 5);
      headG.fillStyle(0xffffff, 0.5);
      headG.fillCircle(hx + pos[0] - 1, hy + pos[1] - 1, 2);
    });

    headGroup.add(headG);
    headG.setDepth(-1); // Detrás de luces/ojos en el container
    container.add(headGroup);

    // Animación de la cabeza
    this.tweens.add({
      targets: headGroup,
      angle: 3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Piernas (Más largas y detalladas)
    [-50, 50].forEach((px) => {
      const w = 50;
      const h = 110;
      const py = 180;

      // Sombra y cuerpo
      g.fillStyle(0x000000, 0.4);
      g.fillRoundedRect(px - w / 2 + 5, py - h / 2 + 5, w, h, 10);
      g.fillStyle(c.body, 1);
      g.fillRoundedRect(px - w / 2, py - h / 2, w, h, 10);

      // Cables externos (Usamos lineBetween para máxima compatibilidad)
      g.lineStyle(2, 0x00ffff, 0.4);
      g.lineBetween(px - w / 2, py - h / 2 + 20, px - w / 2 - 8, py);
      g.lineBetween(px - w / 2 - 8, py, px - w / 2, py + h / 2 - 20);

      // Pistón
      g.fillStyle(0x999999, 1);
      g.fillRect(px - 5, py - h / 4, 10, h / 2);
      g.lineStyle(2, 0xffffff, 0.5);
      g.lineBetween(px - 5, py - h / 4, px - 5, py + h / 4);

      // Remaches
      g.fillStyle(0x333333, 1);
      [
        [-w / 2 + 8, -h / 2 + 8],
        [w / 2 - 8, -h / 2 + 8],
        [-w / 2 + 8, h / 2 - 8],
        [w / 2 - 8, h / 2 - 8],
      ].forEach((p) => g.fillCircle(px + p[0], py + p[1], 3));

      // Borde
      g.lineStyle(4, 0x111111, 1);
      g.strokeRoundedRect(px - w / 2, py - h / 2, w, h, 10);

      // Articulación superior
      g.fillStyle(0x333333, 1);
      g.fillCircle(px, py - h / 2 + 10, 14);
      g.lineStyle(2, 0x00ffff, 0.5);
      g.strokeCircle(px, py - h / 2 + 10, 14);
      g.fillStyle(0x777777, 1);
      g.fillCircle(px, py - h / 2 + 10, 7);

      // Brillo
      g.fillStyle(0xffffff, 0.2);
      g.fillRoundedRect(px - w / 2 + 4, py - h / 2 + 4, 6, h - 8, 3);
    });

    // Brazos (Más largos y detallados)
    const arms = [];
    [-130, 130].forEach((px) => {
      const armGroup = this.add.container(px, 50);
      const armG = this.add.graphics();
      const w = 100;
      const h = 45;

      // Sombra y cuerpo
      armG.fillStyle(0x000000, 0.4);
      armG.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w, h, 10);
      armG.fillStyle(c.accent, 1);
      armG.fillRoundedRect(-w / 2, -h / 2, w, h, 10);

      // Cables externos (Usamos lineBetween para máxima compatibilidad)
      armG.lineStyle(2, 0x00ffff, 0.4);
      armG.lineBetween(-w / 2 + 20, -h / 2, 0, -h / 2 - 8);
      armG.lineBetween(0, -h / 2 - 8, w / 2 - 20, -h / 2);

      // Pistón
      armG.fillStyle(0x999999, 1);
      armG.fillRect(-w / 4, -5, w / 2, 10);
      armG.lineStyle(2, 0xffffff, 0.5);
      armG.lineBetween(-w / 4, -5, w / 4, -5);

      // Remaches
      armG.fillStyle(0x333333, 1);
      [
        [-w / 2 + 8, -h / 2 + 8],
        [w / 2 - 8, -h / 2 + 8],
        [-w / 2 + 8, h / 2 - 8],
        [w / 2 - 8, h / 2 - 8],
      ].forEach((p) => armG.fillCircle(p[0], p[1], 3));

      // Borde
      armG.lineStyle(4, 0x111111, 1);
      armG.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

      // Articulación
      const jx = px > 0 ? -w / 2 + 10 : w / 2 - 10;
      armG.fillStyle(0x333333, 1);
      armG.fillCircle(jx, 0, 14);
      armG.lineStyle(2, 0x00ffff, 0.5);
      armG.strokeCircle(jx, 0, 14);
      armG.fillStyle(0x777777, 1);
      armG.fillCircle(jx, 0, 7);

      // Brillo
      armG.fillStyle(0xffffff, 0.2);
      armG.fillRoundedRect(-w / 2 + 4, -h / 2 + 4, w - 8, 6, 3);

      armGroup.add(armG);
      container.add(armGroup);
      arms.push(armGroup);
    });

    // Animación de los brazos
    arms.forEach((arm, idx) => {
      this.tweens.add({
        targets: arm,
        angle: idx === 0 ? -15 : 15,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    container.add(g);
    g.setDepth(1);

    // Animación de respiración/flotación del robot
    this.tweens.add({
      targets: container,
      y: y - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  createRestartButton(x, y) {
    const btn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0x00ffff, 1);
    bg.fillRoundedRect(-100, -25, 200, 50, 10);
    bg.lineStyle(3, 0xffffff, 1);
    bg.strokeRoundedRect(-100, -25, 200, 50, 10);

    const txt = this.add
      .text(0, 0, "JUGAR OTRA VEZ", {
        fontFamily: "Orbitron",
        fontSize: "20px",
        color: "#000000",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    btn.add([bg, txt]);
    btn.setSize(200, 50);
    btn.setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      this.tweens.add({ targets: btn, scale: 1.1, duration: 100 });
      bg.clear();
      bg.fillStyle(0xffffff, 1);
      bg.fillRoundedRect(-100, -25, 200, 50, 10);
    });

    btn.on("pointerout", () => {
      this.tweens.add({ targets: btn, scale: 1, duration: 100 });
      bg.clear();
      bg.fillStyle(0x00ffff, 1);
      bg.fillRoundedRect(-100, -25, 200, 50, 10);
      bg.lineStyle(3, 0xffffff, 1);
      bg.strokeRoundedRect(-100, -25, 200, 50, 10);
    });

    btn.on("pointerdown", () => {
      this.scene.start("Puzzle1Scene");
    });
  }
}
