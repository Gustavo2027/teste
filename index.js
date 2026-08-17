const CONFIG = {
  GRAVITY: 2400,
  JUMP_FORCE: 820,
  BASE_SPEED: 320,
  MAX_SPEED: 780,
  SPEED_PER_POINT: .35,
  SCORE_RATE: 8,
  QUESTION_INTERVAL: 500,
  START_LIVES: 3,
  MAX_LIVES: 5,
  SHIELD_DURATION: 10,
  INVULNERABLE_TIME: 1.4,
  MIN_OBSTACLE_GAP: .9,
  MAX_OBSTACLE_GAP: 1.9,
  WRONG_ANSWER_PENALTY: 100
};

const STORAGE_KEY = "corridaPelaVida_highscore";

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const dom = {
  scoreValue: document.getElementById("scoreValue"),
  highscoreValue: document.getElementById("highscoreValue"),
  livesValue: document.getElementById("livesValue"),
  speedValue: document.getElementById("speedValue"),
  shieldIndicator: document.getElementById("shieldIndicator"),
  startScreen: document.getElementById("startScreen"),
  startBtn: document.getElementById("startBtn"),
  questionScreen: document.getElementById("questionScreen"),
  questionText: document.getElementById("questionText"),
  optionsContainer: document.getElementById("optionsContainer"),
  feedbackBox: document.getElementById("feedbackBox"),
  feedbackText: document.getElementById("feedbackText"),
  continueBtn: document.getElementById("continueBtn"),
  gameOverScreen: document.getElementById("gameOverScreen"),
  finalScoreText: document.getElementById("finalScoreText"),
  newRecordText: document.getElementById("newRecordText"),
  restartBtn: document.getElementById("restartBtn"),
  tapHint: document.getElementById("tapHint")
};

let state = null;

function createInitialState() {
  return {
    running: false,
    paused: false,
    gameOver: false,
    score: 0,
    highscore: Number(localStorage.getItem(STORAGE_KEY)) || 0,
    lives: CONFIG.START_LIVES,
    speed: CONFIG.BASE_SPEED,
    shieldActive: false,
    shieldTimeLeft: 0,
    invulnerableTimeLeft: 0,
    nextQuestionScore: CONFIG.QUESTION_INTERVAL,
    scoreAccumulator: 0,
    obstacleTimer: 0,
    nextObstacleGap: randRange(CONFIG.MIN_OBSTACLE_GAP, CONFIG.MAX_OBSTACLE_GAP),
    obstacles: [],
    clouds: [],
    groundOffset: 0,
    lastTime: 0
  };
}

const QUESTION_BANK = [ {
  question: "O que é feminicídio?",
  options: [ "Um crime comum sem relação com gênero", "O assassinato de uma mulher pela condição de ser mulher", "Um termo jurídico sem uso no Brasil", "Uma discussão entre casais" ],
  correctIndex: 1,
  explanationCorrect: "Isso mesmo! Feminicídio é o assassinato de mulheres motivado por razões de gênero, geralmente ligado a violência doméstica, menosprezo ou discriminação.",
  explanationWrong: "Feminicídio é o assassinato de uma mulher pela condição de ser mulher, previsto como crime hediondo na Lei 13.104/2015."
}, {
  question: "A violência psicológica também é uma forma de violência?",
  options: [ "Não, só a violência física conta", "Sim, humilhação e controle também ferem", "Apenas se deixar marcas visíveis", "Só é violência se houver testemunhas" ],
  correctIndex: 1,
  explanationCorrect: "Exato! Ameaças, humilhações, controle e manipulação causam danos emocionais profundos e são reconhecidos por lei como violência.",
  explanationWrong: "Sim! A Lei Maria da Penha reconhece a violência psicológica — humilhação, ameaça e controle — como uma forma grave de violência."
}, {
  question: "Qual é o telefone da Central de Atendimento à Mulher?",
  options: [ "190", "180", "100", "156" ],
  correctIndex: 1,
  explanationCorrect: "Correto! O 180 oferece orientação, acolhimento e encaminhamento para mulheres em situação de violência, 24h por dia.",
  explanationWrong: "O número correto é o 180 — Central de Atendimento à Mulher, disponível 24 horas para orientação e denúncia."
}, {
  question: "Em situação de emergência, qual número deve ser acionado?",
  options: [ "180", "192", "190", "181" ],
  correctIndex: 2,
  explanationCorrect: "Isso! O 190 aciona a Polícia Militar para atendimento imediato em situações de risco.",
  explanationWrong: "O número certo é o 190, para acionar a polícia em casos de emergência e risco imediato."
}, {
  question: "A denúncia pode salvar vidas?",
  options: [ "Não, denunciar não muda nada", "Sim, denunciar pode interromper um ciclo de violência", "Só a vítima pode denunciar", "Denúncias nunca são levadas a sério" ],
  correctIndex: 1,
  explanationCorrect: "Sim! Denunciar — mesmo por terceiros — pode acionar redes de proteção e impedir que a violência avance.",
  explanationWrong: "Denunciar pode salvar vidas! Qualquer pessoa pode denunciar pelo 180 ou 190, e isso pode interromper um ciclo de violência."
}, {
  question: "O que garante a Lei Maria da Penha?",
  options: [ "Nenhuma proteção prática", "Medidas protetivas e mecanismos de combate à violência doméstica", "Apenas multas simbólicas", "Proteção somente em grandes cidades" ],
  correctIndex: 1,
  explanationCorrect: "Correto! A Lei 11.340/2006 criou medidas protetivas de urgência e mecanismos para prevenir e punir a violência doméstica.",
  explanationWrong: "A Lei Maria da Penha (11.340/2006) garante medidas protetivas de urgência e outros mecanismos de combate à violência doméstica."
}, {
  question: "Testemunhar violência doméstica e não fazer nada é...",
  options: [ "A atitude mais segura sempre", "Uma forma de se omitir diante de um problema grave", "Um problema que não envolve a sociedade", "Algo que só a polícia deve perceber" ],
  correctIndex: 1,
  explanationCorrect: "Isso mesmo! Buscar ajuda com segurança (como ligar para o 180/190) é um passo importante para proteger vidas.",
  explanationWrong: "A omissão perpetua o ciclo de violência. Buscar ajuda com segurança, como ligar para o 180 ou 190, pode salvar vidas."
}, {
  question: "Onde uma mulher pode buscar apoio em situação de violência?",
  options: [ "Somente em delegacias comuns", "Delegacias da Mulher, Central 180 e Casas da Mulher Brasileira", "Não existe apoio disponível", "Apenas com advogados particulares" ],
  correctIndex: 1,
  explanationCorrect: "Exato! Delegacias Especializadas, a Central 180 e as Casas da Mulher Brasileira oferecem acolhimento, orientação jurídica e psicológica.",
  explanationWrong: "Existem diversos canais: Delegacias da Mulher, a Central 180 e as Casas da Mulher Brasileira, que oferecem apoio completo."
} ];

let questionQueue = [];

function refillQuestionQueue() {
  questionQueue = shuffleArray([ ...QUESTION_BANK ]);
}

function getNextQuestion() {
  if (questionQueue.length === 0) refillQuestionQueue();
  return questionQueue.pop();
}

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", volume = .15, delay = 0) {
  try {
    const ctxAudio = getAudioCtx();
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    const startTime = ctxAudio.currentTime + delay;
    osc.start(startTime);
    gain.gain.exponentialRampToValueAtTime(.001, startTime + duration);
    osc.stop(startTime + duration + .02);
  } catch (e) {}
}

const sfx = {
  jump: () => playTone(620, .12, "square", .12),
  hit: () => {
    playTone(140, .25, "sawtooth", .18);
    playTone(90, .3, "sawtooth", .15, .05);
  },
  correct: () => {
    playTone(523, .1, "sine", .15);
    playTone(659, .1, "sine", .15, .1);
    playTone(784, .18, "sine", .15, .2);
  },
  wrong: () => {
    playTone(300, .15, "triangle", .15);
    playTone(200, .2, "triangle", .15, .12);
  },
  shield: () => {
    playTone(700, .1, "sine", .12);
    playTone(900, .15, "sine", .12, .08);
  },
  gameOver: () => {
    playTone(400, .2, "sawtooth", .15);
    playTone(300, .2, "sawtooth", .15, .15);
    playTone(180, .35, "sawtooth", .15, .3);
  },
  point: () => playTone(880, .05, "sine", .06)
};

let gameWidth = 0;

let gameHeight = 0;

let groundY = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  gameWidth = rect.width;
  gameHeight = rect.height;
  canvas.width = Math.round(gameWidth * dpr);
  canvas.height = Math.round(gameHeight * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  groundY = gameHeight * .82;
  if (player) {
    player.y = Math.min(player.y, groundY - player.height);
    if (!player.jumping) player.y = groundY - player.height;
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

let player = {
  x: 60,
  y: 0,
  width: 40,
  height: 54,
  vy: 0,
  jumping: false,
  runCycle: 0
};

function resetPlayer() {
  player.width = 40;
  player.height = 54;
  player.x = Math.max(50, gameWidth * .08);
  player.y = groundY - player.height;
  player.vy = 0;
  player.jumping = false;
  player.runCycle = 0;
}

function jump() {
  if (state.gameOver || state.paused || !state.running) return;
  if (!player.jumping) {
    player.vy = -CONFIG.JUMP_FORCE;
    player.jumping = true;
    sfx.jump();
  }
}

const OBSTACLE_TYPES = [ {
  width: 26,
  height: 40,
  color: "#6a3ea1"
}, {
  width: 34,
  height: 56,
  color: "#3b1f5c"
}, {
  width: 22,
  height: 30,
  color: "#ff6fa5"
}, {
  width: 46,
  height: 34,
  color: "#9d6fd1"
} ];

function spawnObstacle() {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  state.obstacles.push({
    x: gameWidth + type.width,
    y: groundY - type.height,
    width: type.width,
    height: type.height,
    color: type.color,
    passed: false
  });
}

function initClouds() {
  state.clouds = [];
  for (let i = 0; i < 5; i++) {
    state.clouds.push({
      x: Math.random() * gameWidth,
      y: 20 + Math.random() * (gameHeight * .35),
      size: 18 + Math.random() * 22,
      speedFactor: .15 + Math.random() * .15
    });
  }
}

function updatePlayer(dt) {
  if (player.jumping) {
    player.vy += CONFIG.GRAVITY * dt;
    player.y += player.vy * dt;
    if (player.y >= groundY - player.height) {
      player.y = groundY - player.height;
      player.vy = 0;
      player.jumping = false;
    }
  } else {
    player.runCycle += dt * 10;
  }
}

function updateSpeed() {
  state.speed = Math.min(CONFIG.MAX_SPEED, CONFIG.BASE_SPEED + state.score * CONFIG.SPEED_PER_POINT);
}

function updateScore(dt) {
  state.scoreAccumulator += dt * (state.speed / CONFIG.BASE_SPEED) * CONFIG.SCORE_RATE;
  while (state.scoreAccumulator >= 1) {
    state.score += 1;
    state.scoreAccumulator -= 1;
  }
}

function updateObstacles(dt) {
  state.obstacleTimer += dt;
  const gapScale = CONFIG.BASE_SPEED / state.speed;
  if (state.obstacleTimer >= state.nextObstacleGap * gapScale) {
    spawnObstacle();
    state.obstacleTimer = 0;
    state.nextObstacleGap = randRange(CONFIG.MIN_OBSTACLE_GAP, CONFIG.MAX_OBSTACLE_GAP);
  }
  for (let i = state.obstacles.length - 1; i >= 0; i--) {
    const obs = state.obstacles[i];
    obs.x -= state.speed * dt;
    if (obs.x + obs.width < 0) {
      state.obstacles.splice(i, 1);
    }
  }
}

function updateClouds(dt) {
  state.clouds.forEach(cloud => {
    cloud.x -= state.speed * cloud.speedFactor * dt;
    if (cloud.x < -40) {
      cloud.x = gameWidth + 40;
      cloud.y = 20 + Math.random() * (gameHeight * .35);
    }
  });
}

function updateGround(dt) {
  state.groundOffset -= state.speed * dt;
  if (state.groundOffset <= -40) state.groundOffset = 0;
}

function updateShieldAndInvulnerability(dt) {
  if (state.shieldActive) {
    state.shieldTimeLeft -= dt;
    if (state.shieldTimeLeft <= 0) {
      state.shieldActive = false;
      dom.shieldIndicator.style.display = "none";
    }
  }
  if (state.invulnerableTimeLeft > 0) {
    state.invulnerableTimeLeft -= dt;
  }
}

function checkCollisions() {
  if (state.invulnerableTimeLeft > 0) return;
  const px = player.x + 6;
  const py = player.y + 6;
  const pw = player.width - 12;
  const ph = player.height - 10;
  for (const obs of state.obstacles) {
    const overlap = px < obs.x + obs.width && px + pw > obs.x && py < obs.y + obs.height && py + ph > obs.y;
    if (overlap) {
      handleCollision(obs);
      break;
    }
  }
}

function handleCollision(obstacle) {
  if (state.shieldActive) {
    state.shieldActive = false;
    state.shieldTimeLeft = 0;
    dom.shieldIndicator.style.display = "none";
    state.invulnerableTimeLeft = .6;
    sfx.shield();
    const idx = state.obstacles.indexOf(obstacle);
    if (idx > -1) state.obstacles.splice(idx, 1);
    return;
  }
  state.lives -= 1;
  state.invulnerableTimeLeft = CONFIG.INVULNERABLE_TIME;
  sfx.hit();
  updateLivesDisplay();
  const idx = state.obstacles.indexOf(obstacle);
  if (idx > -1) state.obstacles.splice(idx, 1);
  if (state.lives <= 0) {
    triggerGameOver();
  }
}

function checkQuestionTrigger() {
  if (state.score >= state.nextQuestionScore) {
    state.nextQuestionScore += CONFIG.QUESTION_INTERVAL;
    openQuestionScreen();
  }
}

function draw() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  drawSky();
  drawClouds();
  drawGround();
  drawObstacles();
  drawPlayer();
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, gameHeight);
  gradient.addColorStop(0, "#ffe6f2");
  gradient.addColorStop(.6, "#fdf6ff");
  gradient.addColorStop(1, "#f3e9fb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawClouds() {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  state.clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * .6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGround() {
  ctx.strokeStyle = "#9d6fd1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(gameWidth, groundY);
  ctx.stroke();
  ctx.strokeStyle = "#d8b9f0";
  ctx.lineWidth = 2;
  ctx.setLineDash([ 16, 20 ]);
  ctx.lineDashOffset = state.groundOffset;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 10);
  ctx.lineTo(gameWidth, groundY + 10);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawObstacles() {
  state.obstacles.forEach(obs => {
    ctx.save();
    ctx.fillStyle = obs.color;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    const cx = obs.x + obs.width / 2;
    ctx.beginPath();
    ctx.moveTo(cx, obs.y);
    ctx.lineTo(obs.x + obs.width, obs.y + obs.height * .4);
    ctx.lineTo(obs.x + obs.width * .7, obs.y + obs.height);
    ctx.lineTo(obs.x + obs.width * .3, obs.y + obs.height);
    ctx.lineTo(obs.x, obs.y + obs.height * .4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawPlayer() {
  ctx.save();
  if (state.shieldActive) {
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, Math.max(player.width, player.height) * .75, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,111,165,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,111,165,0.12)";
    ctx.fill();
  }
  const blinking = state.invulnerableTimeLeft > 0 && Math.floor(state.invulnerableTimeLeft * 10) % 2 === 0;
  ctx.globalAlpha = blinking ? .35 : 1;
  const x = player.x;
  const y = player.y;
  const w = player.width;
  const h = player.height;
  ctx.fillStyle = "#3b1f5c";
  ctx.beginPath();
  ctx.roundRect(x + w * .18, y + h * .28, w * .64, h * .5, 6);
  ctx.fill();
  ctx.fillStyle = "#ffd9c7";
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * .16, w * .26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6a3ea1";
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * .1, w * .28, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = "#ff6fa5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w * .5, y + h * .36);
  ctx.lineTo(x + w * .42, y + h * .5);
  ctx.moveTo(x + w * .5, y + h * .36);
  ctx.lineTo(x + w * .58, y + h * .5);
  ctx.stroke();
  ctx.strokeStyle = "#3b1f5c";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  const legSwing = player.jumping ? .3 : Math.sin(player.runCycle) * .5;
  ctx.beginPath();
  ctx.moveTo(x + w * .35, y + h * .78);
  ctx.lineTo(x + w * .35 - legSwing * 12, y + h * 1);
  ctx.moveTo(x + w * .65, y + h * .78);
  ctx.lineTo(x + w * .65 + legSwing * 12, y + h * 1);
  ctx.stroke();
  ctx.lineWidth = 5;
  const armSwing = player.jumping ? -.4 : Math.sin(player.runCycle + Math.PI) * .4;
  ctx.beginPath();
  ctx.moveTo(x + w * .2, y + h * .4);
  ctx.lineTo(x + w * .2 - armSwing * 10, y + h * .62);
  ctx.moveTo(x + w * .8, y + h * .4);
  ctx.lineTo(x + w * .8 + armSwing * 10, y + h * .62);
  ctx.stroke();
  ctx.restore();
}

let currentQuestion = null;

function openQuestionScreen() {
  state.paused = true;
  currentQuestion = getNextQuestion();
  dom.questionText.textContent = currentQuestion.question;
  dom.optionsContainer.innerHTML = "";
  dom.feedbackBox.classList.add("hidden");
  currentQuestion.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => handleAnswer(index, btn));
    dom.optionsContainer.appendChild(btn);
  });
  dom.questionScreen.classList.remove("hidden");
}

function handleAnswer(selectedIndex, selectedBtn) {
  const buttons = Array.from(dom.optionsContainer.children);
  buttons.forEach(b => b.disabled = true);
  const isCorrect = selectedIndex === currentQuestion.correctIndex;
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    sfx.correct();
    grantReward();
    dom.feedbackText.textContent = "✅ Correto! " + currentQuestion.explanationCorrect;
  } else {
    selectedBtn.classList.add("wrong");
    buttons[currentQuestion.correctIndex].classList.add("correct");
    sfx.wrong();
    applyPenalty();
    dom.feedbackText.textContent = "❌ Resposta incorreta. " + currentQuestion.explanationWrong;
  }
  updateHUD();
  dom.feedbackBox.classList.remove("hidden");
}

function grantReward() {
  if (!state.shieldActive) {
    state.shieldActive = true;
    state.shieldTimeLeft = CONFIG.SHIELD_DURATION;
    dom.shieldIndicator.style.display = "flex";
  } else if (state.lives < CONFIG.MAX_LIVES) {
    state.lives += 1;
  }
}

function applyPenalty() {
  state.score = Math.max(0, state.score - CONFIG.WRONG_ANSWER_PENALTY);
  state.lives -= 1;
  if (state.lives <= 0) {
    state.pendingGameOver = true;
  }
}

dom.continueBtn.addEventListener("click", () => {
  dom.questionScreen.classList.add("hidden");
  state.paused = false;
  if (state.pendingGameOver) {
    state.pendingGameOver = false;
    triggerGameOver();
  }
});

function gameLoop(timestamp) {
  if (!state.running) return;
  if (!state.lastTime) state.lastTime = timestamp;
  let dt = (timestamp - state.lastTime) / 1e3;
  dt = Math.min(dt, .05);
  state.lastTime = timestamp;
  if (!state.paused && !state.gameOver) {
    updatePlayer(dt);
    updateSpeed();
    updateScore(dt);
    updateObstacles(dt);
    updateClouds(dt);
    updateGround(dt);
    updateShieldAndInvulnerability(dt);
    checkCollisions();
    checkQuestionTrigger();
    updateHUD();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

function updateHUD() {
  dom.scoreValue.textContent = state.score;
  dom.highscoreValue.textContent = state.highscore;
  dom.speedValue.textContent = "x" + (state.speed / CONFIG.BASE_SPEED).toFixed(1);
  updateLivesDisplay();
}

function updateLivesDisplay() {
  dom.livesValue.textContent = "❤".repeat(Math.max(0, state.lives)) || "—";
}

function startGame() {
  dom.startScreen.classList.add("hidden");
  dom.gameOverScreen.classList.add("hidden");
  resetGame();
  state.running = true;
  state.lastTime = 0;
  requestAnimationFrame(gameLoop);
  if ("ontouchstart" in window) {
    dom.tapHint.classList.remove("hidden");
    setTimeout(() => dom.tapHint.classList.add("hidden"), 3e3);
  }
}

function resetGame() {
  state = createInitialState();
  refillQuestionQueue();
  resizeCanvas();
  resetPlayer();
  initClouds();
  dom.shieldIndicator.style.display = "none";
  updateHUD();
  }
