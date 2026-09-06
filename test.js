
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window);
    
    if(isMobile) {
      document.getElementById('desktop-instructions').style.display = 'none';
      document.getElementById('mobile-instructions').style.display = 'block';
    }

    let camera, scene, renderer, controls;
    let raycaster = new THREE.Raycaster();
    let ball, entitiesGroup = new THREE.Group();
    
    let isGameRunning = false, passing = false, passTarget = null, hasDribbledIn = true;
    let currentRole = 'linkerflank';
    let scenarioCount = 1;
    const MAX_SCENARIOS = 20;
    
    let moveState = { forward: false, backward: false, left: false, right: false };
    let touchMoveID = null, touchLookID = null, joystickDelta = {x: 0, y: 0}, lookEuler = new THREE.Euler(0, 0, 0, 'YXZ'), lastLookPos = {x: 0, y: 0}, isTapping = false;
    let prevTime = performance.now();

    // UI Logic
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentRole = e.target.dataset.role;
      });
    });

    // Generator
    const j = (val, amt=2.5) => val + (Math.random()*amt*2 - amt); // Add Jitter (randomness)

    function generateScenario(role, index) {
      let sc = { title: `${index}/${MAX_SCENARIOS}: `, desc: "", playerPos: {x:0, z:0}, mustDribbleIn: false, entities: [] };
      let r = Math.random();
      
      let teammatesData = []; 
      
      if (role === 'doelman') {
        sc.title += "Uitverdedigen (Keeper)"; sc.desc = "Snelle pass! Ze zetten druk!";
        sc.playerPos = {x: 0, z: 16};
        // 1-2-1 Formation
        teammatesData.push({ x: j(0,1), z: j(8,1), isCovered: Math.random()>0.5 }); // Defender
        teammatesData.push({ x: j(-10,2), z: j(2,2), isCovered: Math.random()>0.5 }); // Left Winger
        teammatesData.push({ x: j(10,2), z: j(2,2), isCovered: Math.random()>0.5 }); // Right Winger
        teammatesData.push({ x: j(0,2), z: j(-8,2), isCovered: false }); // Striker
      } else {
        sc.entities.push({ color: 0x3366ff, x: j(0, 1), z: 17, status: 'keeper' });
        if (role === 'verdediger') {
          sc.title += "Opbouw (Verdediger)"; sc.desc = "Speel de bal naar voren of de flanken. Denk snel!";
          sc.playerPos = {x: j(0,3), z: 10};
          teammatesData.push({ x: j(-10,2), z: j(2,3), isCovered: Math.random()>0.5 });
          teammatesData.push({ x: j(10,2), z: j(2,3), isCovered: Math.random()>0.5 });
          teammatesData.push({ x: j(0,3), z: j(-2,3), isCovered: true });
        } else if (role === 'linkerflank') {
          if (r < 0.33) {
            sc.title += "Indribbelen Links"; sc.desc = "Bal is uit. DRIBBEL het veld in (WASD/Joystick) en pas!";
            sc.playerPos = {x: -12.5, z: j(0, 5)}; sc.mustDribbleIn = true;
          } else if (r < 0.66) {
            sc.title += "Hoekschop Links"; sc.desc = "Corner! Geef een strakke voorzet voor het doel!";
            sc.playerPos = {x: -12.5, z: -17.5};
          } else {
            sc.title += "Aanval Links"; sc.desc = "Je bent op de flank. Zoek een medespeler voor het doel!";
            sc.playerPos = {x: j(-10,2), z: j(-5,4)};
          }
          teammatesData.push({ x: j(0,3), z: j(8,3), isCovered: false });
          teammatesData.push({ x: j(8,3), z: j(-2,3), isCovered: true });
          teammatesData.push({ x: j(0,3), z: j(-10,3), isCovered: Math.random()>0.5 });
        } else if (role === 'rechterflank') {
          if (r < 0.33) {
            sc.title += "Indribbelen Rechts"; sc.desc = "Bal is uit. DRIBBEL het veld in (WASD/Joystick) en pas!";
            sc.playerPos = {x: 12.5, z: j(0, 5)}; sc.mustDribbleIn = true;
          } else if (r < 0.66) {
            sc.title += "Hoekschop Rechts"; sc.desc = "Corner! Geef een strakke voorzet voor het doel!";
            sc.playerPos = {x: 12.5, z: -17.5};
          } else {
            sc.title += "Aanval Rechts"; sc.desc = "Je bent op de flank. Zoek een medespeler voor het doel!";
            sc.playerPos = {x: j(10,2), z: j(-5,4)};
          }
          teammatesData.push({ x: j(0,3), z: j(8,3), isCovered: false });
          teammatesData.push({ x: j(-8,3), z: j(-2,3), isCovered: true });
          teammatesData.push({ x: j(0,3), z: j(-10,3), isCovered: Math.random()>0.5 });
        } else if (role === 'aanvaller') {
          sc.title += "Aanval Centrum"; sc.desc = "Kaats de bal of zoek een flankspeler. Snel!";
          // Napastnik niżej (bliżej środka/własnej połowy)
          sc.playerPos = {x: j(0,3), z: j(2,3)};
          // Obrońca z tyłu
          teammatesData.push({ x: j(0,2), z: j(12,2), isCovered: false });
          // Skrzydłowi bardzo wysoko (głęboko na połowie przeciwnika)
          teammatesData.push({ x: j(-11,2), z: j(-14,2), isCovered: true });
          teammatesData.push({ x: j(11,2), z: j(-14,2), isCovered: Math.random()>0.5 });
        }
      }
      
      teammatesData.forEach(t => {
         t.timeOffset = Math.random() * Math.PI * 2;
         sc.entities.push({ color: 0xff0000, x: t.x, z: t.z, status: t.isCovered ? 'covered_teammate' : 'open_teammate', timeOffset: t.timeOffset });
      });

      let pX = sc.playerPos.x, pZ = sc.playerPos.z;
      let dirX = pX > 0 ? -1 : 1, dirZ = pZ > 0 ? -1 : 1;
      
      let isCorner = sc.title.toLowerCase().includes('hoekschop');
      let isThrowIn = sc.title.toLowerCase().includes('indribbelen');
      let isGoalKick = sc.title.toLowerCase().includes('uitverdedigen');
      
      let minDist = 0;
      if (isCorner || isGoalKick) minDist = 8.0;
      else if (isThrowIn) minDist = 3.0;

      let pressX = pX + dirX * Math.max(4, minDist * 0.8);
      let pressZ = pZ + dirZ * Math.max(6, minDist * 0.8);
      
      let distPress = Math.sqrt((pressX - pX)**2 + (pressZ - pZ)**2);
      if (distPress < minDist) {
         let fixX = pressX - pX, fixZ = pressZ - pZ;
         let fixLen = Math.sqrt(fixX*fixX + fixZ*fixZ) || 1;
         pressX = pX + (fixX / fixLen) * minDist;
         pressZ = pZ + (fixZ / fixLen) * minDist;
      }
      
      sc.entities.push({ color: 0x00cc00, x: pressX, z: pressZ, status: 'opponent_press' }); 
      
      for(let i=0; i<3; i++) {
         if(i < teammatesData.length) {
            let t = teammatesData[i];
            let dX = pX - t.x, dZ = pZ - t.z;
            let dist = Math.sqrt(dX*dX + dZ*dZ);
            if(dist > 0) { dX /= dist; dZ /= dist; }
            let oX, oZ;
            if(t.isCovered) {
               oX = t.x + dX * 1.8; oZ = t.z + dZ * 1.8;
            } else {
               oX = t.x + dX * 6.0 + j(0, 2); oZ = t.z + dZ * 6.0 + j(0, 2);
            }
            
            let distToPlayer = Math.sqrt((oX - pX)**2 + (oZ - pZ)**2);
            if (distToPlayer < minDist) {
               let pushX = oX - pX, pushZ = oZ - pZ;
               let pushLen = Math.sqrt(pushX*pushX + pushZ*pushZ) || 1;
               oX = pX + (pushX / pushLen) * minDist;
               oZ = pZ + (pushZ / pushLen) * minDist;
            }
            
            oX = Math.max(-14, Math.min(14, oX)); oZ = Math.max(-19, Math.min(19, oZ));
            sc.entities.push({ color: 0x00cc00, x: oX, z: oZ, status: 'opponent', timeOffset: Math.random() * Math.PI * 2 });
         }
      }
      
      sc.entities.push({ color: 0xffffff, x: j(0,1), z: -17, status: 'opponent_gk' });
      return sc;
    }

    function init() {
      scene = new THREE.Scene(); scene.background = new THREE.Color(0x87ceeb); scene.fog = new THREE.Fog(0x87ceeb, 15, 60);
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      scene.add(entitiesGroup);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true; document.body.appendChild(renderer.domElement);

      if(!isMobile) {
        controls = new THREE.PointerLockControls(camera, document.body);
        controls.addEventListener('lock', () => { document.getElementById('start-screen').style.display = 'none'; isGameRunning = true; });
        controls.addEventListener('unlock', () => { document.getElementById('start-screen').style.display = 'flex'; isGameRunning = false; });
      }

      document.getElementById('start-btn').addEventListener('click', () => { 
        scenarioCount = 1; // Reset progress
        loadScenario();
        if(isMobile) {
          document.getElementById('start-screen').style.display = 'none';
          document.getElementById('joystick-zone').style.display = 'block';
          document.getElementById('joystick-zone-right').style.display = 'block'; document.getElementById('mobile-pass-btn').style.display = 'flex';
          isGameRunning = true;
        } else { controls.lock(); }
      });

      // Inputs
      document.addEventListener('keydown', (e) => {
        switch(e.code) { case 'KeyW': moveState.forward = true; break; case 'KeyS': moveState.backward = true; break; case 'KeyA': moveState.left = true; break; case 'KeyD': moveState.right = true; break; }
      });
      document.addEventListener('keyup', (e) => {
        switch(e.code) { case 'KeyW': moveState.forward = false; break; case 'KeyS': moveState.backward = false; break; case 'KeyA': moveState.left = false; break; case 'KeyD': moveState.right = false; break; }
      });
      document.body.addEventListener('mousedown', (e) => { if (!isMobile && isGameRunning && !passing) passBall(); });
      document.getElementById('mobile-pass-btn').addEventListener('touchstart', (e) => {
        e.preventDefault(); e.stopPropagation();
        if(isGameRunning && !passing) passBall();
      });


      // Touch Inputs
      const joyZone = document.getElementById('joystick-zone'), joyKnob = document.getElementById('joystick-knob');
      const joyZoneRight = document.getElementById('joystick-zone-right'), joyKnobRight = document.getElementById('joystick-knob-right');
      document.body.addEventListener('touchstart', (e) => {
        if(!isGameRunning) return;
        for(let i=0; i<e.changedTouches.length; i++) {
          let t = e.changedTouches[i];
          if(t.clientX < window.innerWidth / 2) { touchMoveID = t.identifier; updateJoystick(t.clientX, t.clientY, joyZone, joyKnob, false); }
          else { touchLookID = t.identifier; updateJoystick(t.clientX, t.clientY, joyZoneRight, joyKnobRight, true); }
        }
      }, {passive: false});

      document.body.addEventListener('touchmove', (e) => {
        if(!isGameRunning) return; e.preventDefault();
        for(let i=0; i<e.changedTouches.length; i++) {
          let t = e.changedTouches[i];
          if(t.identifier === touchMoveID) { updateJoystick(t.clientX, t.clientY, joyZone, joyKnob, false); }
          else if(t.identifier === touchLookID) {
            updateJoystick(t.clientX, t.clientY, joyZoneRight, joyKnobRight, true); }
        }
      }, {passive: false});

      document.body.addEventListener('touchend', (e) => {
        if(!isGameRunning) return;
        for(let i=0; i<e.changedTouches.length; i++) {
          let t = e.changedTouches[i];
          if(t.identifier === touchMoveID) { touchMoveID = null; joystickDelta = {x: 0, y: 0}; joyKnob.style.transform = `translate(0px, 0px)`; }
          else if(t.identifier === touchLookID) { touchLookID = null; joystickLookDelta = {x: 0, y: 0}; joyKnobRight.style.transform = 'translate(0px, 0px)'; }
        }
      });

            function updateJoystick(x, y, zone, knob, isLook) {
        let rect = zone.getBoundingClientRect(), cX = rect.left + rect.width / 2, cY = rect.top + rect.height / 2;
        let dx = x - cX, dy = y - cY, dist = Math.sqrt(dx*dx + dy*dy), maxD = rect.width/2 - 25;
        if(dist > maxD) { dx = (dx/dist)*maxD; dy = (dy/dist)*maxD; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`; 
        if(isLook) joystickLookDelta = { x: dx/maxD, y: dy/maxD };
        else joystickDelta = { x: dx/maxD, y: dy/maxD };
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.7); dirLight.position.set(20, 30, 10); dirLight.castShadow = true; scene.add(dirLight);

      createPitch(); createGoal(0, 0, -17.5); createGoal(0, 0, 17.5);

      // High Res Procedural Patrick Ball
      const bCanvas = document.createElement('canvas'); bCanvas.width = 1024; bCanvas.height = 1024; const bCtx = bCanvas.getContext('2d');
      bCtx.fillStyle = '#ffffff'; bCtx.fillRect(0,0,1024,1024); 
      bCtx.fillStyle = '#fff44f'; bCtx.beginPath(); bCtx.moveTo(0,0); bCtx.lineTo(512,0); bCtx.lineTo(256,256); bCtx.fill(); bCtx.beginPath(); bCtx.moveTo(1024,1024); bCtx.lineTo(512,1024); bCtx.lineTo(768,768); bCtx.fill(); bCtx.beginPath(); bCtx.moveTo(0,1024); bCtx.lineTo(0,512); bCtx.lineTo(256,768); bCtx.fill();
      bCtx.fillStyle = '#87cefa'; bCtx.beginPath(); bCtx.moveTo(1024,0); bCtx.lineTo(512,0); bCtx.lineTo(768,256); bCtx.fill(); bCtx.beginPath(); bCtx.moveTo(1024,512); bCtx.lineTo(1024,1024); bCtx.lineTo(768,768); bCtx.fill();
      bCtx.strokeStyle = '#222222'; bCtx.lineWidth = 10; bCtx.beginPath(); bCtx.moveTo(0, 512); bCtx.lineTo(1024, 512); bCtx.stroke(); bCtx.beginPath(); bCtx.moveTo(512, 0); bCtx.lineTo(512, 1024); bCtx.stroke(); bCtx.beginPath(); bCtx.arc(512, 512, 250, 0, Math.PI*2); bCtx.stroke();
      bCtx.fillStyle = '#000000'; bCtx.textAlign = 'center'; bCtx.textBaseline = 'middle'; bCtx.font = '900 120px "Arial Black", sans-serif'; bCtx.fillText('PATRICK', 512, 470); bCtx.font = 'bold 70px Arial'; bCtx.fillText('PRO801', 512, 580);
      
      const ballTex = new THREE.CanvasTexture(bCanvas);
      ballTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      ballTex.minFilter = THREE.LinearMipmapLinearFilter;
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.35, 64, 64), new THREE.MeshLambertMaterial({ map: ballTex })); 
      ball.castShadow = true; scene.add(ball);

      animate();
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });
    function addRect(x, z, w, l) { scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0.02, z), new THREE.Vector3(x+w, 0.02, z), new THREE.Vector3(x+w, 0.02, z+l), new THREE.Vector3(x, 0.02, z+l), new THREE.Vector3(x, 0.02, z)]), lineMat)); }
    function addLine(x1, z1, x2, z2) { scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, 0.02, z1), new THREE.Vector3(x2, 0.02, z2)]), lineMat)); }
    function addCircle(x, z, r) { const pts = []; for(let i=0; i<=64; i++) pts.push(new THREE.Vector3(x + Math.cos((i/64)*Math.PI*2)*r, 0.02, z + Math.sin((i/64)*Math.PI*2)*r)); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat)); }

    function createPitch() {
      const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128; const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#4CAF50'; ctx.fillRect(0,0,128,128); ctx.fillStyle = '#45a049'; ctx.fillRect(0,0,64,128); ctx.fillRect(128,0,64,128); 
      const grassTex = new THREE.CanvasTexture(canvas); grassTex.wrapS = THREE.RepeatWrapping; grassTex.wrapT = THREE.RepeatWrapping; grassTex.repeat.set(15, 15);
      const pitch = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshLambertMaterial({ map: grassTex })); pitch.rotation.x = -Math.PI / 2; pitch.receiveShadow = true; scene.add(pitch);
      addRect(-12.5, -17.5, 25, 35); addLine(-12.5, 0, 12.5, 0); addCircle(0, 0, 3); addRect(-6, -17.5, 12, 5); addRect(-6, 12.5, 12, 5);
    }

    function createGoal(x, y, z) {
      const mat = new THREE.MeshLambertMaterial({ color: 0xffffff }), postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2);
      const postL = new THREE.Mesh(postGeo, mat); postL.position.set(x - 2.5, y + 1, z);
      const postR = new THREE.Mesh(postGeo, mat); postR.position.set(x + 2.5, y + 1, z);
      const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5), mat); cross.rotation.z = Math.PI / 2; cross.position.set(x, y + 2, z);
      scene.add(postL); scene.add(postR); scene.add(cross);
    }

    let redShirtMat = null;
    function getRedShirtMat() {
      if(redShirtMat) return redShirtMat;
      const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256; const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#e60000'; ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#ffffff'; for(let i=15; i<256; i+=28) ctx.fillRect(i, 0, 3, 256); 
      ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(176, 0); ctx.lineTo(128, 50); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4; ctx.textAlign = 'center';
      ctx.font = 'italic bold 60px "Brush Script MT", cursive, sans-serif'; ctx.fillText('Bos', 128, 120);
      ctx.font = 'italic 14px Arial'; ctx.fillText('taverne-restaurant', 128, 140);
      ctx.font = 'bold 26px Arial'; ctx.fillText('DEWITTE', 128, 175); ctx.font = 'bold 11px Arial'; ctx.fillText('POMPSERVICE', 128, 190);
      ctx.shadowBlur = 0; ctx.font = 'bold 12px Arial'; ctx.fillText('PATRICK', 180, 70);
      return redShirtMat = new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(canvas) });
    }

    function createCharacter(colorHex, x, y, z, status, timeOffset) {
      const group = new THREE.Group(), isOpponent = status.includes('opponent'), isTeammate = (colorHex === 0xff0000);
      const shirtMat = isTeammate ? getRedShirtMat() : new THREE.MeshLambertMaterial({ color: colorHex }), sleeveMat = isTeammate ? new THREE.MeshLambertMaterial({ color: 0xe60000 }) : shirtMat, skinMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 }), pantsMat = new THREE.MeshLambertMaterial({ color: isTeammate ? 0xe60000 : 0x222222 }), shoesMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), skinMat); head.position.y = 1.5; head.castShadow = true; group.add(head);
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.08, 0.37), new THREE.MeshLambertMaterial({ color: 0x4a3018 })); hair.position.y = 1.7; hair.castShadow = true; group.add(hair);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 }), eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), eyeMat); eyeL.position.set(-0.08, 1.55, 0.18); group.add(eyeL); const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), eyeMat); eyeR.position.set(0.08, 1.55, 0.18); group.add(eyeR);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.25), shirtMat); body.position.y = 1.05; body.castShadow = true; group.add(body);
      const armGeo = new THREE.BoxGeometry(0.16, 0.5, 0.16), armL = new THREE.Mesh(armGeo, skinMat); armL.position.set(-0.35, 1.0, 0); armL.castShadow = true; group.add(armL); const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.18), sleeveMat); sleeveL.position.set(-0.35, 1.2, 0); sleeveL.castShadow = true; group.add(sleeveL);
      const armR = new THREE.Mesh(armGeo, skinMat); armR.position.set(0.35, 1.0, 0); armR.castShadow = true; group.add(armR); const sleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.18), sleeveMat); sleeveR.position.set(0.35, 1.2, 0); sleeveR.castShadow = true; group.add(sleeveR);
      const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.25, 0.27), pantsMat); shorts.position.y = 0.65; shorts.castShadow = true; group.add(shorts);
      const legGeo = new THREE.BoxGeometry(0.18, 0.45, 0.18), legL = new THREE.Mesh(legGeo, skinMat); legL.position.set(-0.15, 0.3, 0); legL.castShadow = true; group.add(legL); const legR = new THREE.Mesh(legGeo, skinMat); legR.position.set(0.15, 0.3, 0); legR.castShadow = true; group.add(legR);
      const shoeGeo = new THREE.BoxGeometry(0.2, 0.12, 0.25), shoeL = new THREE.Mesh(shoeGeo, shoesMat); shoeL.position.set(-0.15, 0.06, 0.05); shoeL.castShadow = true; group.add(shoeL); const shoeR = new THREE.Mesh(shoeGeo, shoesMat); shoeR.position.set(0.15, 0.06, 0.05); shoeR.castShadow = true; group.add(shoeR);

      group.position.set(x, y, z);
      group.userData = { baseX: x, baseZ: z, timeOffset: timeOffset || 0 };
      const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.8), new THREE.MeshBasicMaterial({ visible: false })); hitbox.position.y = 0.9; hitbox.userData = { status: status, parentGroup: group }; group.add(hitbox);
      entitiesGroup.add(group);
    }

    function loadScenario() {
      if (scenarioCount > MAX_SCENARIOS) {
        document.getElementById('start-screen').style.display = 'flex';
        document.getElementById('start-screen').innerHTML = `
          <h1 style="font-size:3rem;color:#00ff00;">Sessie Voltooid! 🏆</h1>
          <p style="font-size:1.5rem;margin:20px;">Je hebt alle 20 situaties perfect uitgespeeld!</p>
          <button id="restart-btn" style="padding:15px 40px;font-size:1.5rem;background:#e60000;color:white;border:3px solid white;border-radius:10px;cursor:pointer;font-weight:bold;">Opnieuw Spelen</button>`;
        document.getElementById('restart-btn').onclick = () => location.reload();
        if(!isMobile) controls.unlock();
        return;
      }
      
      entitiesGroup.clear();
      const sc = generateScenario(currentRole, scenarioCount);
      document.getElementById('scenario-title').innerText = sc.title; document.getElementById('scenario-desc').innerText = sc.desc;
      camera.position.set(sc.playerPos.x, 1.7, sc.playerPos.z); camera.lookAt(0, 1.7, camera.position.z > 0 ? -17 : 17);
      lookEuler.setFromQuaternion(camera.quaternion, 'YXZ');
      hasDribbledIn = !sc.mustDribbleIn; passing = false;
      sc.entities.forEach(e => createCharacter(e.color, e.x, 0, e.z, e.status, e.timeOffset));
    }

    function passBall() {
      const isIndribbel = (entitiesGroup.children.length > 0 && !hasDribbledIn);
      if (isIndribbel) {
        if (Math.abs(camera.position.x) < 12 && Math.abs(camera.position.z) < 17) hasDribbledIn = true;
        else { showMessage("Fout! Je moet eerst indribbelen!\n(Błąd! Najpierw wejdź z piłką!)", "#ff0000", false); return; }
      }

      raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
      const hitboxes = []; entitiesGroup.traverse(c => { if (c.userData && c.userData.status) hitboxes.push(c); });
      const intersects = raycaster.intersectObjects(hitboxes);

            let dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
      dir.y = 0; dir.normalize();

      if (intersects.length > 0) {
        let pt = intersects[0].object.userData.parentGroup.position.clone();
        pt.y = 0.35;
        dir.subVectors(pt, ball.position).normalize();
      } else {
        const pt = new THREE.Vector3(); raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0), 0), pt);
        if (pt) {
            pt.y = 0.35;
            dir.subVectors(pt, ball.position).normalize();
        }
      }
      
      window.passVelocity = dir.multiplyScalar(15);
      passing = true;

    }

    function showMessage(text, color, success) {
      const msg = document.getElementById('message'); msg.innerText = text; msg.style.color = color; msg.style.display = 'block';
      setTimeout(() => { 
        msg.style.display = 'none'; passing = false; 
        if (success) { scenarioCount++; loadScenario(); } 
        else { loadScenario(); } // reload same scenario if failed
      }, 2500);
    }

    function animate() {
      requestAnimationFrame(animate);
      const time = performance.now(), delta = (time - prevTime) / 1000; prevTime = time;

      if (isGameRunning) {
        let vX = 0, vZ = 0;
        if(isMobile) { 
            vZ = -joystickDelta.y * 5; vX = joystickDelta.x * 5; 
            lookEuler.y -= joystickLookDelta.x * delta * 2.5; 
            lookEuler.x -= joystickLookDelta.y * delta * 2.5; 
            lookEuler.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, lookEuler.x));
            camera.quaternion.setFromEuler(lookEuler);
        } 
        else if (controls && controls.isLocked) {
          let dirZ = Number(moveState.forward) - Number(moveState.backward), dirX = Number(moveState.right) - Number(moveState.left);
          if (dirZ || dirX) { let d = new THREE.Vector2(dirX, dirZ).normalize(); vX = d.x * 6; vZ = d.y * 6; }
        }

        if(vX !== 0 || vZ !== 0) {
          let moveDir = new THREE.Vector3(vX, 0, -vZ); moveDir.applyQuaternion(camera.quaternion); moveDir.y = 0; moveDir.normalize();
          let speed = Math.sqrt(vX*vX + vZ*vZ); camera.position.add(moveDir.multiplyScalar(speed * delta));
          if (camera.position.x > 18) camera.position.x = 18; if (camera.position.x < -18) camera.position.x = -18;
          if (camera.position.z > 22) camera.position.z = 22; if (camera.position.z < -22) camera.position.z = -22;
        }

        // Active Opponent AI (Pressing)
        if (!passing && hasDribbledIn) {
          let opponentPressing = null;
          entitiesGroup.children.forEach(c => {
            const st = c.children.find(m => m.userData && m.userData.status)?.userData.status;
            if(st === 'opponent_press' || st === 'opponent') {
               if (!opponentPressing) opponentPressing = c;
               else if (c.position.distanceTo(camera.position) < opponentPressing.position.distanceTo(camera.position)) opponentPressing = c;
            }
          });

          if (opponentPressing) {
             let dist = opponentPressing.position.distanceTo(camera.position);
             if (dist > 1.2) {
                let speed = 1.5; // Opponent speed (zmniejszona z 2.5 by dać więcej czasu)
                let d = new THREE.Vector3().subVectors(camera.position, opponentPressing.position);
                d.y = 0; d.normalize();
                opponentPressing.position.add(d.multiplyScalar(speed * delta));
                // Constrain opponent to pitch
                opponentPressing.position.x = Math.max(-12.5, Math.min(12.5, opponentPressing.position.x));
                opponentPressing.position.z = Math.max(-17.5, Math.min(17.5, opponentPressing.position.z));
             } else {
                // Te traag!
                showMessage("Te traag gereageerd! De tegenstander heeft de bal!\n(Za wolno - strata piłki!)", "#ff0000", false);
                isGameRunning = false;
             }
          }
        }
      }

      if (passing && window.passVelocity) {
        ball.position.add(window.passVelocity.clone().multiplyScalar(delta)); 
        ball.rotation.x += 0.3; ball.rotation.z -= 0.1; 
        
        let hit = false;
        entitiesGroup.children.forEach(c => {
           const st = c.children.find(m => m.userData && m.userData.status)?.userData.status;
           if (!st) return;
           
           if (st === 'open_teammate' || st === 'covered_teammate' || st === 'keeper') {
              if (c.position.distanceTo(ball.position) < 3.5) {
                 c.position.lerp(new THREE.Vector3(ball.position.x, c.position.y, ball.position.z), 0.15);
                 if (c.position.distanceTo(ball.position) < 1.5) {
                    showMessage('Goede pass!\n(Mooie bal!)', '#00ff00', true);
                    hit = true;
                 }
              }
           } else if (st === 'opponent' || st === 'opponent_press') {
              if (c.position.distanceTo(ball.position) < 1.5) {
                 showMessage('Onderschept door tegenstander!\n(Przechwyt!)', '#ff0000', false);
                 hit = true;
              }
           }
        });
        if (hit) passing = false;
        else if (Math.abs(ball.position.x) > 13 || Math.abs(ball.position.z) > 18) {
           showMessage('Pass buiten de lijnen!\n(Podanie poza boisko)', '#ffaaaa', false);
           passing = false;
        }
      } else if (isGameRunning) {
        const camDir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion); camDir.y = 0; camDir.normalize();
        const feetPos = camera.position.clone(); feetPos.y = 0.35; feetPos.add(camDir.multiplyScalar(1.5));
        ball.position.lerp(feetPos, 0.3);
        if(joystickDelta.x || joystickDelta.y || moveState.forward || moveState.backward) ball.rotation.x += delta * 5;
      }
      
      entitiesGroup.children.forEach(group => { 
        const st = group.children.find(m => m.userData && m.userData.status)?.userData.status;
        if (st === 'open_teammate' || st === 'covered_teammate') {
           const offset = group.userData.timeOffset;
           group.position.x = group.userData.baseX + Math.sin(time * 0.0025 + offset) * 2.0;
           group.position.z = group.userData.baseZ + Math.cos(time * 0.0020 + offset) * 1.5;
        } else if (st === 'opponent') {
           const offset = group.userData.timeOffset;
           group.position.x = group.userData.baseX + Math.sin(time * 0.0018 + offset) * 1.8;
           group.position.z = group.userData.baseZ + Math.cos(time * 0.0015 + offset) * 1.3;
        }
        group.lookAt(camera.position.x, group.position.y, camera.position.z); 
      });
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    init();
  