import re

with open('public/gra_3d.html', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove pass in the ruimte and use velocity
code = re.sub(
    r'if \(intersects\.length > 0\) \{[\s\S]*?passing = true;\s*\}',
    '''      let dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
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
''',
    code
)

# 2. Render loop pass logic
code = re.sub(
    r'if \(passing && passTarget\) \{[\s\S]*?\} else if \(isGameRunning\) \{',
    '''if (passing && window.passVelocity) {
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
                    showMessage('Goede pass!\\n(Mooie bal!)', '#00ff00', true);
                    hit = true;
                 }
              }
           } else if (st === 'opponent' || st === 'opponent_press') {
              if (c.position.distanceTo(ball.position) < 1.5) {
                 showMessage('Onderschept door tegenstander!\\n(Przechwyt!)', '#ff0000', false);
                 hit = true;
              }
           }
        });
        if (hit) passing = false;
        else if (Math.abs(ball.position.x) > 13 || Math.abs(ball.position.z) > 18) {
           showMessage('Pass buiten de lijnen!\\n(Podanie poza boisko)', '#ffaaaa', false);
           passing = false;
        }
      } else if (isGameRunning) {''',
    code
)

# 3. UI
code = re.sub(
    r'<div id="mobile-hint">Kijken \(Swipe\)</div><div id="mobile-pass-btn">PASSEN</div>',
    '''  <div id="joystick-zone-right"><div id="joystick-knob-right"></div></div>
  <div id="mobile-pass-btn">PASSEN</div>''',
    code
)

code = re.sub(
    r'#mobile-pass-btn \{ display: none;[^}]+\}',
    '''    #joystick-zone-right { position: absolute; bottom: 30px; right: 30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.5); touch-action: none; display: none; z-index: 15; }
    #joystick-knob-right { position: absolute; top: 35px; left: 35px; width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.8); pointer-events: none; }
    #mobile-pass-btn { display: none; position: absolute; bottom: 170px; right: 45px; width: 90px; height: 90px; border-radius: 50%; background: rgba(220,38,38,0.85); border: 3px solid rgba(255,255,255,0.9); color: white; font-weight: 900; font-size: 1.2rem; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4); z-index: 15; user-select: none; touch-action: none; font-family: sans-serif; text-shadow: 1px 1px 2px black; }''',
    code
)

code = re.sub(
    r'#mobile-pass-btn \{ bottom: 120px; \}\s*#mobile-hint \{ bottom: 220px; \}',
    '''      #joystick-zone-right { bottom: 120px; }
      #mobile-pass-btn { bottom: 260px; }''',
    code
)

code = re.sub(
    r'document\.getElementById\(\'mobile-hint\'\)\.style\.display = \'block\';',
    "document.getElementById('joystick-zone-right').style.display = 'block';",
    code
)

# 4. Vars and touch
code = re.sub(
    r'let touchMoveID = null, touchLookID = null, lastLookPos = \{x: 0, y: 0\}, isTapping = false;',
    'let touchMoveID = null, touchLookID = null, lastLookPos = {x: 0, y: 0}, isTapping = false; let joystickLookDelta = {x: 0, y: 0};',
    code
)

code = re.sub(
    r'const joyZone = document\.getElementById\(\'joystick-zone\'\), joyKnob = document\.getElementById\(\'joystick-knob\'\);',
    '''const joyZone = document.getElementById('joystick-zone'), joyKnob = document.getElementById('joystick-knob');
      const joyZoneRight = document.getElementById('joystick-zone-right'), joyKnobRight = document.getElementById('joystick-knob-right');''',
    code
)

code = re.sub(
    r'function updateJoystick\(x, y\) \{[\s\S]*?maxD; \}',
    '''      function updateJoystick(x, y, zone, knob, isLook) {
        let rect = zone.getBoundingClientRect(), cX = rect.left + rect.width / 2, cY = rect.top + rect.height / 2;
        let dx = x - cX, dy = y - cY, dist = Math.sqrt(dx*dx + dy*dy), maxD = rect.width/2 - 25;
        if(dist > maxD) { dx = (dx/dist)*maxD; dy = (dy/dist)*maxD; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`; 
        if(isLook) joystickLookDelta = { x: dx/maxD, y: dy/maxD };
        else joystickDelta = { x: dx/maxD, y: dy/maxD };
      }''',
    code
)

code = re.sub(
    r'updateJoystick\(t\.clientX, t\.clientY\)',
    'updateJoystick(t.clientX, t.clientY, joyZone, joyKnob, false)',
    code
)

code = re.sub(
    r'let dx = t\.clientX - lastLookPos\.x[\s\S]*?isTapping = false;\s*\}',
    'updateJoystick(t.clientX, t.clientY, joyZoneRight, joyKnobRight, true); }',
    code
)

code = re.sub(
    r'lastLookPos = \{x: t\.clientX, y: t\.clientY\}; isTapping = true;',
    'updateJoystick(t.clientX, t.clientY, joyZoneRight, joyKnobRight, true);',
    code
)

code = re.sub(
    r'if\(isTapping && !passing\) passBall\(\);',
    "joystickLookDelta = {x: 0, y: 0}; joyKnobRight.style.transform = 'translate(0px, 0px)';",
    code
)

# 5. Look rotation
code = re.sub(
    r'if\(isMobile\) \{ vZ = -joystickDelta\.y \* 5; vX = joystickDelta\.x \* 5; \}',
    '''if(isMobile) { 
            vZ = -joystickDelta.y * 5; vX = joystickDelta.x * 5; 
            lookEuler.y -= joystickLookDelta.x * delta * 2.5; 
            lookEuler.x -= joystickLookDelta.y * delta * 2.5; 
            lookEuler.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, lookEuler.x));
            camera.quaternion.setFromEuler(lookEuler);
        }''',
    code
)

with open('public/gra_3d.html', 'w', encoding='utf-8') as f:
    f.write(code)
