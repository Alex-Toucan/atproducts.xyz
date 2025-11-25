/**
 * Game Controller - Manages game state and input handling
 */
import { getInput, debugPhysicsBody, getIdFromBody, loadSound, playSound } from './utils.js';
import { createLevel } from './levels.js';

export class GameController {
  constructor(physics, entityManager, renderer, worldDimensions) {
    this.physics = physics;
    this.entityManager = entityManager;
    this.renderer = renderer;
    this.worldDimensions = worldDimensions;
    
    // Load sounds once
    this.sounds = {};
    loadSound('/sounds/laser.mp3').then(sound => {
      this.sounds.laser = sound;
    }).catch(e => console.log("Failed to load sound:", e));
    
    // Game state
    this.state = {
      isLoading: false,
      isAiming: false,
      isFiring: false,
      birdsRemaining: 3,
      pigsRemaining: 0,
      score: 0,
      totalScore: 0, // Track score across levels
      currentLevel: 1, // Start at level 1
      maxLevel: 4, // Maximum level available (now includes Level 4)
      worldDimensions: worldDimensions,
      slingPosition: { 
        x: worldDimensions.left + (worldDimensions.width * 0.15), 
        y: worldDimensions.groundY // Exactly at ground level
      },
      birdPosition: { 
        x: worldDimensions.left + (worldDimensions.width * 0.15), 
        y: worldDimensions.groundY + 2.5 // Positioned at the top of the slingshot
      },
      aimPosition: {
        x: worldDimensions.left + (worldDimensions.width * 0.15), 
        y: worldDimensions.groundY + 2.5
      },
      // Slingshot strap animation
      strapAnimation: {
        active: false,
        startTime: 0,
        duration: 2000, // 2 seconds for animation
        initialPosition: null,
        targetPosition: null
      },
      currentBird: null,
      aimDirection: { x: 0, y: 0 },
      aimPower: 0,
      gameOver: false,
      victory: false,
      levelComplete: false, // Track if current level is completed
      isGameStarted: false, // Will be set to true when first bird is fired
      lastUpdateTime: 0,
      startButtonPressed: false, // Track if Start button was pressed
      selectButtonPressed: false, // Track if Select button was pressed
      initTime: Date.now()
    };
  }
  
  // Helper method to check if a position is visible on screen
  isPositionOnScreen(x, y) {
    // Convert Box2D coordinates to screen coordinates
    const worldLeft = this.worldDimensions.left;
    const worldBottom = this.worldDimensions.bottom;
    const pixelsPerMeter = this.renderer.finalScale;
    const canvasWidth = this.renderer.ctx.canvas.width;
    const canvasHeight = this.renderer.ctx.canvas.height;
    
    // Apply the renderer's transformations
    const screenX = (x - worldLeft) * pixelsPerMeter;
    const screenY = canvasHeight - (y - worldBottom) * pixelsPerMeter;
    
    // Add a small margin (50 pixels) to ensure we catch slightly offscreen objects
    const margin = 50;
    return screenX > -margin && 
           screenX < canvasWidth + margin && 
           screenY > -margin && 
           screenY < canvasHeight + margin;
  }
  
  // Process input and update game state
  handleInput(deltaTime) {
    const input = getInput();
    const player = input[0]; // Get first player (keyboard or gamepad)
    
    // Check if the player object and button properties exist
    if (!player) return;
    
    // Extract pressed state more safely
    const isAButtonPressed = player.BUTTON_SOUTH && player.BUTTON_SOUTH.pressed === true;
    
    // Check for aiming input with safer property access
    if (isAButtonPressed && !this.state.isAiming && !this.state.isFiring && this.state.currentBird) {
      // Start aiming
      this.state.isAiming = true;
      this.state.aimDirection = { x: 0, y: 0 };
      this.state.aimPower = 0;
      this.state.aimPosition = { ...this.state.slingPosition }; // Track current position during aiming
    } else if (this.state.isAiming) {
      this.handleAiming(player, deltaTime);
    }
    
    // Check for restart game with Start button - use safer property checks
    const isStartPressed = player.START && player.START.pressed === true;
    if (isStartPressed && !this.state.startButtonPressed && this.state.gameOver) {
      this.resetGame();
      this.state.startButtonPressed = true;
    } else if (!isStartPressed && this.state.startButtonPressed) {
      // Reset the flag when button is released
      this.state.startButtonPressed = false;
    }
    
    // Check for SELECT button to move to next level (only in development mode)
    const isSelectPressed = player.SELECT && player.SELECT.pressed === true;
    if (isSelectPressed && !this.state.selectButtonPressed) {
      // Set the flag to prevent multiple actions on the same press
      this.state.selectButtonPressed = true;
      
      // Move to next level or reset game if at max level
      if (this.state.currentLevel < this.state.maxLevel) {
        this.loadNextLevel();
      } else {
        this.resetGame();
      }
    } else if (!isSelectPressed && this.state.selectButtonPressed) {
      // Reset the flag when button is released
      this.state.selectButtonPressed = false;
    }
  }
  
  // Handle when the aim button is first pressed
  handleAimButtonPressed(player) {
    if (!this.state.isAiming && !this.state.isFiring && this.state.currentBird) {
      // Start aiming
      this.state.isAiming = true;
      this.state.aimDirection = { x: 0, y: 0 };
      this.state.aimPower = 0;
      this.state.aimPosition = { ...this.state.slingPosition }; // Track current position during aiming
    }
  }
  
  // Handle the aiming process
  handleAiming(player, deltaTime = 1/60) {
    // Default to 60fps if no deltaTime is provided
    // This ensures consistent speed even if frame rate varies
    
    // Get directional input from left stick or d-pad
    const leftStickX = player.LEFT_STICK_X || 0;
    const leftStickY = player.LEFT_STICK_Y || 0;
    
    // Get directional input with small dead zone for precision
    let dirX = 0;
    let dirY = 0;
    
    // Use analog stick with small dead zone for precision
    if (Math.abs(leftStickX) > 0.05) {
      dirX = leftStickX;
    }
    if (Math.abs(leftStickY) > 0.05) {
      dirY = leftStickY;
    }
    
    // If analog stick isn't providing input, use d-pad with small incremental movement
    if (Math.abs(dirX) < 0.05) {
      // Safely check if the button exists and has the pressed property
      const isLeftPressed = player.DPAD_LEFT && player.DPAD_LEFT.pressed === true;
      const isRightPressed = player.DPAD_RIGHT && player.DPAD_RIGHT.pressed === true;
      
      // Fixed speed values for D-pad - increased for faster movement
      if (isLeftPressed) dirX = -0.35; // Increased from -0.2 to -0.35
      else if (isRightPressed) dirX = 0.35; // Increased from 0.2 to 0.35
    }
    
    if (Math.abs(dirY) < 0.05) {
      // Safely check if the button exists and has the pressed property
      const isDownPressed = player.DPAD_DOWN && player.DPAD_DOWN.pressed === true;
      const isUpPressed = player.DPAD_UP && player.DPAD_UP.pressed === true;
      
      // Fixed speed values for D-pad - increased for faster movement
      if (isDownPressed) dirY = -0.35; // Increased from -0.2 to -0.35
      else if (isUpPressed) dirY = 0.35; // Increased from 0.2 to 0.35
    }
    
    // Apply incremental position changes for smooth aiming
    if (Math.abs(dirX) > 0.05 || Math.abs(dirY) > 0.05) {
      // Base sensitivity value - increased for faster movement
      const baseSensitivity = 0.25; // Increased from 0.15 to 0.25 (about 67% faster)
      
      // Calculate time-based sensitivity
      // Multiply by 60 to normalize to 60fps (our base time unit)
      const timeScaledSensitivity = baseSensitivity * deltaTime * 60;
      
      // Update aim position incrementally for smooth movement with time scaling
      this.state.aimPosition = {
        x: this.state.aimPosition.x + dirX * timeScaledSensitivity,
        y: this.state.aimPosition.y + dirY * timeScaledSensitivity // Y should move in the same direction as input
      };
      
      // Allow bird to be pulled closer to ground level, but never below it
      // Use a smaller buffer (0.05) instead of the full radius to allow more downward aiming
      const birdRadius = 0.5; // This is the standard bird radius used in createBird
      const groundBuffer = 0.05; // Minimal buffer to keep bird just above ground
      if (this.state.aimPosition.y - groundBuffer < this.state.worldDimensions.groundY) {
        this.state.aimPosition.y = this.state.worldDimensions.groundY + groundBuffer;
      }
      
      // Prevent bird from being pulled more than one bird width to the right of slingshot
      // This restricts forward pulling and ensures reasonable launch angles
      const sling = this.state.slingPosition;
      if (this.state.aimPosition.x > sling.x + birdRadius) {
        this.state.aimPosition.x = sling.x + birdRadius;
      }
      
      // Calculate the vector from slingshot to current position
      const dx = this.state.aimPosition.x - sling.x;
      const dy = this.state.aimPosition.y - sling.y;
      
      // Calculate distance from slingshot
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Limit maximum stretch distance - increased for more powerful shots
      const maxStretch = 5.5; // Increased from 5.0 to 5.5
      if (distance > maxStretch) {
        // Normalize the direction and scale to max stretch
        const norm = maxStretch / distance;
        this.state.aimPosition = {
          x: sling.x + dx * norm,
          y: sling.y + dy * norm
        };
      }
      
      // Calculate normalized direction vector
      if (distance > 0.1) { // Avoid division by very small numbers
        this.state.aimDirection = {
          x: dx / distance,
          y: dy / distance
        };
      } else {
        this.state.aimDirection = { x: 0, y: 0 };
      }
      
      // Calculate power based on stretch distance (normalize to 0-1 range, then scale)
      this.state.aimPower = Math.min(distance / maxStretch, 1.0) * 5; 
      
      // Update bird position
      if (this.state.currentBird) {
        // Set transform with correct arguments (body, position, rotation)
        const { b2Vec2, b2Rot, b2Body_SetTransform } = this.physics;
        const newPos = new b2Vec2(this.state.aimPosition.x, this.state.aimPosition.y);
        const rot = new b2Rot();
        rot.SetAngle(0);
        b2Body_SetTransform(this.state.currentBird, newPos, rot);
        
        // Update bird position for rendering
        this.state.birdPosition = { ...this.state.aimPosition };
      }
    }
    
    // Check if aiming is finished (button released)
    const isButtonPressed = player.BUTTON_SOUTH && player.BUTTON_SOUTH.pressed === true;
    if (!isButtonPressed) {
      this.fireBird();
    }
  }
  
  // Fire the bird when player releases the button
  fireBird() {
    // Calculate distance for launch check
    const sling = this.state.slingPosition;
    const dx = this.state.aimPosition.x - sling.x;
    const dy = this.state.aimPosition.y - sling.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Fire the bird if we have a valid aim
    if (this.state.currentBird && distance > 0.5) { // Require minimum stretch for launch
      // Calculate impulse based on aim and distance
      const launchPower = this.state.aimPower * 50;
      
      // Calculate the Y-branch point of the slingshot (the center of the Y where it branches)
      const slingStemHeight = 3 * 0.6; // Height of slingshot stem (height * 0.6)
      const slingForkY = sling.y + slingStemHeight; // Y position of the fork
      
      // Calculate horizontal component (always reverse of aim direction)
      const launchDirX = -this.state.aimDirection.x;
      
      // IMPORTANT HELPER FUNCTION: Enhances the one in gameRenderer.js with wider angle range
      const calculateTrajectoryDirection = (posY, forkY) => {
        // Calculate distance from the fork center point
        const distFromFork = posY - forkY; // Positive when below, negative when above
        
        // Initialize with zero vertical component
        let verticalComponent = 0;
        
        // Only calculate non-zero vertical component if not at the fork level
        if (Math.abs(distFromFork) >= 0.05) {
          // Calculate vertical direction - critical for correct trajectory
          // If below fork (positive distance) → go UP (negative Y)
          // If above fork (negative distance) → go DOWN (positive Y)
          const vertDirection = (distFromFork < 0) ? 1 : -1;
          
          // Calculate magnitude based on distance with higher cap for more extreme angles
          // Increased from 2.0 to 3.0 to allow for higher trajectory angles
          const distFactor = Math.min(3.0, Math.abs(distFromFork)) / 2.0;
          
          // Apply direction and magnitude with additional scaling
          // Use a steeper function that amplifies smaller distances
          // This gives more control in the critical aiming range
          const powerFactor = distFactor * (1.0 + 0.2 * (1.0 - Math.min(1.0, distFactor)));
          verticalComponent = vertDirection * powerFactor;
          
          console.log('PHYSICS HELPER - Distance:', distFromFork, 
                     'Direction:', vertDirection, 
                     'Power:', powerFactor,
                     'Result:', verticalComponent);
        }
        
        return verticalComponent;
      };
      
      // Calculate vertical component using the same helper function as the guide
      const launchDirY = calculateTrajectoryDirection(this.state.aimPosition.y, slingForkY);
      console.log('PHYSICS - Launch direction Y:', launchDirY);
      
      // Apply the direction components to the launch power
      // IMPORTANT: We use exactly the same calculation for both horizontal and vertical
      // components, and do NOT normalize or modify the direction vector in any way.
      // This ensures the bird flies exactly along the guide line.
      let impulseX = launchDirX * launchPower;
      let impulseY = launchDirY * launchPower;
      
      // Log for debugging
      console.log(`PHYSICS launch: ${impulseX.toFixed(2)}, ${impulseY.toFixed(2)}`);
      console.log(`Bird pos: (${this.state.aimPosition.x.toFixed(2)}, ${this.state.aimPosition.y.toFixed(2)}), Fork Y: ${slingForkY.toFixed(2)}`);
      
      // Apply impulse to bird
      const { b2Vec2, b2Body_ApplyLinearImpulse } = this.physics;
      const impulse = new b2Vec2(impulseX, impulseY);
      const worldPoint = new b2Vec2(this.state.birdPosition.x, this.state.birdPosition.y);
      
      b2Body_ApplyLinearImpulse(
        this.state.currentBird,
        impulse,
        worldPoint,
        true // wake the body
      );
      
      // Update game state after firing
      this.state.isAiming = false;
      this.state.isFiring = true;
      this.state.isGameStarted = true;
      this.state.birdsRemaining--;
      
      // Setup slingshot animation
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      const recoilDistance = Math.min(distance, 3);
      
      this.state.strapAnimation = {
        active: true,
        startTime: Date.now(),
        duration: 2000,
        initialPosition: { ...this.state.birdPosition },
        snapPosition: {
          x: sling.x - normalizedDx * recoilDistance,
          y: sling.y - normalizedDy * recoilDistance
        },
        targetPosition: {
          x: this.state.slingPosition.x,
          y: this.state.slingPosition.y + 2.5
        }
      };
      
      // Play sound using pre-loaded sound buffer
      if (this.sounds.laser) {
        playSound(this.sounds.laser);
      }
    } else {
      // Not enough pull, cancel aiming
      this.state.isAiming = false;
      
      // Reset bird position to slingshot
      if (this.state.currentBird) {
        const { b2Vec2, b2Rot, b2Body_SetTransform } = this.physics;
        const resetPos = new b2Vec2(this.state.slingPosition.x, this.state.slingPosition.y + 2.5);
        const rot = new b2Rot();
        rot.SetAngle(0);
        b2Body_SetTransform(
          this.state.currentBird, 
          resetPos,
          rot
        );
        this.state.birdPosition = { 
          x: this.state.slingPosition.x,
          y: this.state.slingPosition.y + 2.5
        };
      }
    }
  }
  
  // Check for bodies to remove (objects off-screen or pigs hit)
  cleanupBodies() {
    const { b2Body_GetPosition, b2Body_GetLinearVelocity, b2DestroyBody } = this.physics;
    const { groundY, left: worldLeft, right: worldRight } = this.worldDimensions;
    const trackedBodies = this.entityManager.trackedBodies;
    
    // Update physics state for each tracked pig
    for (const [uniqueId, pigInfo] of trackedBodies.pigs.entries()) {
      try {
        // Skip if no entity data
        const entityId = pigInfo.entityId;
        const entity = this.entityManager.entities[entityId];
        
        if (!entity || !entity.bodyId) {
          continue;
        }
        
        // Now use the actual Box2D body for physics
        const bodyId = entity.bodyId;
        const pos = b2Body_GetPosition(bodyId);
        const vel = b2Body_GetLinearVelocity(bodyId);
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        
        // Get rotation angle via transforms
        let angle = 0;
        try {
          if (typeof this.physics.b2Body_GetRotation === 'function') {
            const rotation = this.physics.b2Body_GetRotation(bodyId);
            if (rotation) {
              angle = Math.atan2(rotation.s, rotation.c);
            }
          } else if (typeof this.physics.b2Body_GetAngle === 'function') {
            angle = this.physics.b2Body_GetAngle(bodyId);
          }
        } catch (e) {
          console.warn("Error getting pig rotation:", e);
        }
        
        // Always update position and rotation for ALL pigs (active and inactive)
        const newPos = { x: pos.x, y: pos.y };
        this.renderer.updateGameObject(uniqueId, newPos, angle);
        
        // ALWAYS check if pig is offscreen, regardless of previous state
        // Use EXTREMELY aggressive bounds checking to ensure pigs don't get stuck offscreen
        // Note: Box2D coordinates are different from screen pixels
        // In Box2D, the world is typically around 50-100 units wide, while the screen can be 800+ pixels
        
        // Calculate extreme bounds with tighter thresholds
        const visibleLeft = worldLeft * 0.95;    // 5% buffer inside world left edge
        const visibleRight = worldRight * 0.95;  // 5% buffer inside world right edge
        const visibleBottom = -25;               // Very aggressive bottom detection
        const visibleTop = 25;                   // High enough to catch anything off top of screen
        
        // Only check offscreen conditions now, speed is handled separately with cumulative damage
        const isOffscreen = (
          pos.y < visibleBottom ||          // Fell below visible area
          pos.y > visibleTop ||             // Went above visible area
          pos.x < visibleLeft ||            // Went off left edge of visible area
          pos.x > visibleRight ||           // Went off right edge of visible area
          !this.isPositionOnScreen(pos.x, pos.y)  // Additional check based on screen coordinates
        );
        
        // Process damage if the pig has been hit with sufficient speed
        // Get the renderer object to update visual state
        const pigObj = this.renderer.gameObjects.get(uniqueId);
        const pigEntity = this.entityManager.getEntity(pigInfo.entityId);
        
        if (pigEntity && pigObj && pigInfo.active) {
          // Current time for tracking impact cooldown
          const currentTime = Date.now();
          
          // Damage thresholds - adjusted to make pigs 20% stronger (but still easier to kill than original)
          const minDamageSpeed = 2.2;  // Increased from 2.0 to 2.2 (10% increase)
          const maxDamageSpeed = 12.0; // Kept the same as before
          
          // Check if pig was hit with sufficient force and enough time has passed since last impact
          // The 250ms cooldown stays the same
          if (speed >= minDamageSpeed && (currentTime - pigEntity.properties.lastImpactTime > 250)) {
            // Calculate damage amount based on speed (0-100%)
            const speedFactor = Math.min((speed - minDamageSpeed) / (maxDamageSpeed - minDamageSpeed), 1.0);
            const damageAmount = Math.ceil(speedFactor * 42); // Reduced from 50% to 42% max damage per hit (about 16% less damage)
            
            // Apply damage to health
            pigEntity.properties.health = Math.max(0, pigEntity.properties.health - damageAmount);
            
            // Update damage level (percentage for visual feedback)
            pigEntity.properties.damageLevel = 1 - (pigEntity.properties.health / pigEntity.properties.maxHealth);
            
            // Update last impact time and speed
            pigEntity.properties.lastImpactTime = currentTime;
            pigEntity.properties.lastImpactSpeed = speed;
            
            // Update renderer object with new damage level
            pigObj.damageLevel = pigEntity.properties.damageLevel;
            
            // Log damage
            console.log(`Pig ${uniqueId} hit with speed ${speed.toFixed(2)}, damage: ${damageAmount}, health: ${pigEntity.properties.health}/${pigEntity.properties.maxHealth}, damage level: ${(pigEntity.properties.damageLevel * 100).toFixed(0)}%`);
            
            // Kill pig if health reaches zero
            if (pigEntity.properties.health <= 0) {
              console.log(`Pig ${uniqueId} died from accumulated damage!`);
              // Will be marked as inactive below
            }
          }
        }
        
        // Check if pig should be killed - either from going offscreen or from accumulated damage
        const shouldKill = isOffscreen || (pigEntity && pigEntity.properties.health <= 0);
        
        // Using the isPositionOnScreen helper method defined in the class
        
        // Kill pig if it should be killed (offscreen or accumulated damage)
        if (shouldKill) {
          // Force pig to be marked as inactive no matter what
          // This ensures we never get stuck with invisible pigs
          
          // Output detailed log only if this is the first time detecting this pig as dead
          if (pigInfo.active) {
            // Log pig destruction with reason and detailed position
            if (pigEntity && pigEntity.properties.health <= 0) {
              // Killed from accumulated damage (already logged above)
              // No additional log needed here
            } else if (pos.y < visibleBottom) {
              console.log(`Pig ${uniqueId} killed: fell below screen (y: ${pos.y.toFixed(2)}, bottom: ${visibleBottom})`);
            } else if (pos.y > visibleTop) {
              console.log(`Pig ${uniqueId} killed: went above screen (y: ${pos.y.toFixed(2)}, top: ${visibleTop})`);
            } else if (pos.x < visibleLeft) {
              console.log(`Pig ${uniqueId} killed: went off left edge (x: ${pos.x.toFixed(2)}, left: ${visibleLeft})`);
            } else if (pos.x > visibleRight) {
              console.log(`Pig ${uniqueId} killed: went off right edge (x: ${pos.x.toFixed(2)}, right: ${visibleRight})`);
            } else if (!this.isPositionOnScreen(pos.x, pos.y)) {
              // Convert to screen coordinates for logging
              const pixelsPerMeter = this.renderer.finalScale;
              const canvasWidth = this.renderer.ctx.canvas.width;
              const canvasHeight = this.renderer.ctx.canvas.height;
              const screenX = (pos.x - worldLeft) * pixelsPerMeter;
              const screenY = canvasHeight - (pos.y - worldBottom) * pixelsPerMeter;
              
              console.log(`Pig ${uniqueId} killed: off screen in pixel space (physics: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) (screen: ${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
            } else {
              console.log(`Pig ${uniqueId} killed: position (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
            }
            
            // Add to score only when newly killed
            this.state.score += 500;
          } else if (!pigInfo.loggedAsKilled) {
            // Log even if already inactive (but not previously logged)
            console.log(`Forcing inactive status for offscreen pig ${uniqueId} at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
            // Mark that we've logged this pig as killed
            pigInfo.loggedAsKilled = true;
          }
          
          // ALWAYS mark as inactive - belt and suspenders approach
          pigInfo.active = false;
          
          // ALWAYS mark this pig as dead in the renderer
          if (this.renderer.gameObjects.has(uniqueId)) {
            const pigObj = this.renderer.gameObjects.get(uniqueId);
            pigObj.dead = true;
          }
          
          // Check if this was the last pig
          const remainingPigs = Array.from(this.entityManager.trackedBodies.pigs.values())
            .filter(info => info && info.active).length;
          
          console.log(`Pigs remaining: ${remainingPigs}`);
          
          // If no pigs left, level is complete
          if (remainingPigs === 0) {
            console.log("All pigs killed! Level complete!");
          }
        }
      } catch (e) {
        console.error("Error updating pig:", e);
      }
    }
    
    // Update physics state for current bird
    if (this.state.currentBird) {
      // Get the userData.id from the current bird
      const currentBirdId = getIdFromBody(this.state.currentBird);
      // Look up bird info by userData.id
      const birdInfo = currentBirdId ? trackedBodies.birds.get(currentBirdId) : null;
      
      try {
        const pos = b2Body_GetPosition(this.state.currentBird);
        const vel = b2Body_GetLinearVelocity(this.state.currentBird);
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        
        // Remove bird if it falls off screen or goes off screen horizontally
        if (pos.y < -50 || pos.x < worldLeft - 10 || pos.x > worldRight + 10) {
          // Delete from renderer using ONLY uniqueId
          if (birdInfo && birdInfo.uniqueId) {
            // Remove from renderer by uniqueId
            this.renderer.gameObjects.delete(birdInfo.uniqueId);
          }
          
          // Get entity info and remove from entity system
          const entityId = birdInfo ? birdInfo.entityId : null;
          if (entityId) {
            this.entityManager.removeEntity(entityId);
          }
          
          // Mark as inactive in tracking list
          if (birdInfo) {
            birdInfo.active = false;
          }
          
          try {
            b2DestroyBody(this.state.currentBird);
          } catch (e) {
            console.error("Error destroying bird body:", e);
          }
          
          // Clear current bird
          this.state.currentBird = null;
          this.state.isFiring = false;
          
          // Prepare next bird with a delay if there are birds remaining
          if (this.state.birdsRemaining > 0) {
            setTimeout(() => {
              this.prepareBird();
            }, 1000);
          }
        }
        // Check if bird has come to rest
        else if (this.state.isFiring && speed < 0.2) {
          // Bird has almost stopped - allow for next bird
          this.state.currentBird = null;
          this.state.isFiring = false;
          
          // Prepare next bird with a delay
          setTimeout(() => {
            this.prepareBird();
          }, 1000);
        }
      } catch (e) {
        // Body might have been already destroyed
        if (birdInfo) {
          birdInfo.active = false;
        }
        this.state.currentBird = null;
        this.state.isFiring = false;
      }
    }
    
    // Check for game over/victory conditions
    // Count active pigs to determine game status
    const activePigs = Array.from(trackedBodies.pigs.values())
      .filter(info => info && info.active).length;
    
    if (activePigs === 0 && this.state.isGameStarted) {
      // Level complete!
      if (!this.state.levelComplete) {
        console.log(`Level ${this.state.currentLevel} COMPLETE! No more active pigs.`);
        this.state.levelComplete = true;
        
        // Add level completion bonus
        const levelCompletionBonus = 1000;
        this.state.score += levelCompletionBonus;
        
        // Add bonus for birds remaining (500 points per bird)
        const birdsRemainingCount = this.state.birdsRemaining;
        if (birdsRemainingCount > 0) {
          const birdBonus = birdsRemainingCount * 500;
          this.state.score += birdBonus;
          console.log(`Added bonus of ${birdBonus} for ${birdsRemainingCount} bird(s) remaining!`);
        }
        
        this.state.totalScore += this.state.score;
        console.log(`Level completion bonus: ${levelCompletionBonus}. Level score: ${this.state.score}, Total score: ${this.state.totalScore}`);
        
        // Check if there are more levels
        if (this.state.currentLevel < this.state.maxLevel) {
          // Set victory for this level but don't end the game
          this.state.victory = true;
          console.log(`Advancing to level ${this.state.currentLevel + 1} in 3 seconds...`);
          
          // Schedule next level after a delay
          setTimeout(() => {
            this.loadNextLevel();
          }, 3000);
        } else {
          // Final victory - game complete!
          console.log("GAME COMPLETE! All levels finished!");
          this.state.victory = true;
          this.state.gameOver = true;
        }
      }
    } else if (this.state.birdsRemaining <= 0 && !this.state.currentBird && !this.state.isFiring && !this.state.gameOver) {
      // Game over - no birds left and pigs remain
      this.state.gameOver = true;
    }
    
    // Store number of active pigs
    this.state.pigsRemaining = activePigs;
    
    // Periodically do a global check for offscreen pigs that weren't caught
    // Do this check every 3 seconds
    const currentTime = Date.now();
    if (!this.lastPigScanTime || currentTime - this.lastPigScanTime > 3000) {
      this.lastPigScanTime = currentTime;
      this.performGlobalPigCheck();
    }
  }
  
  // Global check for any pigs that might be offscreen
  performGlobalPigCheck() {
    const trackedBodies = this.entityManager.trackedBodies;
    const { b2Body_GetPosition } = this.physics;
    const worldLeft = this.worldDimensions.left;
    const worldRight = this.worldDimensions.right;
    
    // Extra-wide boundaries for this check
    const extremeLeft = worldLeft * 1.5;
    const extremeRight = worldRight * 1.5;
    const extremeBottom = -50;
    const extremeTop = 50;
    
    let pigsKilled = 0;
    
    // Go through all pigs and check if any are way offscreen
    for (const [uniqueId, pigInfo] of trackedBodies.pigs.entries()) {
      // Only check active pigs
      if (pigInfo && pigInfo.active && pigInfo.entityId) {
        try {
          const entity = this.entityManager.entities[pigInfo.entityId];
          if (!entity || !entity.bodyId) continue;
          
          const bodyId = entity.bodyId;
          const pos = b2Body_GetPosition(bodyId);
          
          // Check if WAY offscreen
          if (pos.y < extremeBottom || pos.y > extremeTop || 
              pos.x < extremeLeft || pos.x > extremeRight ||
              !this.isPositionOnScreen(pos.x, pos.y)) {
              
            // Kill the pig
            pigInfo.active = false;
            pigsKilled++;
            console.log(`GLOBAL CHECK: Forced kill of pig ${uniqueId} at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
            
            // Mark in renderer
            if (this.renderer.gameObjects.has(uniqueId)) {
              const pigObj = this.renderer.gameObjects.get(uniqueId);
              pigObj.dead = true;
            }
          }
        } catch (e) {
          console.error("Error in global pig check:", e);
        }
      }
    }
    
    if (pigsKilled > 0) {
      console.log(`GLOBAL CHECK: Killed ${pigsKilled} straggling pigs!`);
      
      // Check if this killed the last pigs
      const remainingPigs = Array.from(trackedBodies.pigs.values())
        .filter(info => info && info.active).length;
      
      if (remainingPigs === 0) {
        console.log("GLOBAL CHECK: All pigs killed! Level complete!");
      }
    }
  }
  
  prepareBird() {
    if (this.state.birdsRemaining <= 0) return;
    
    // Position the bird at the top of the slingshot, not at the slingshot base
    const birdPosition = {
      x: this.state.slingPosition.x,
      y: this.state.slingPosition.y + 2.5 // Position at the top of the slingshot
    };
    
    const birdId = this.entityManager.createBird(
      birdPosition.x,
      birdPosition.y
    );
    
    this.state.currentBird = birdId;
    this.state.birdPosition = { ...birdPosition };
  }
  
  // Load a specific level
  loadLevel(levelNumber) {
    console.log(`Loading level ${levelNumber}`);
    
    // First clear the existing level, which attempts to destroy all physics bodies
    this.clearLevel();
    
    // IMPORTANT: Recreate physics world for a completely fresh state
    // Save old values before recreating
    const oldWorldId = this.entityManager.worldId;
    const oldTaskSystem = this.physics.taskSystem;
    
    // After clearing the level, ensure entity manager ground references are also cleared
    // This is critical to prevent trying to destroy the same ground body twice
    for (const entityId in this.entityManager.entities) {
      const entity = this.entityManager.entities[entityId];
      if (entity && entity.type === 'ground') {
        console.log(`Clearing ground entity reference: ${entityId}`);
        delete this.entityManager.entities[entityId];
        
        // Also cleanup from bodyToEntity mapping
        if (entity.uniqueId) {
          this.entityManager.bodyToEntity.delete(entity.uniqueId);
        }
      }
    }
    
    // Also cleanup any marked ground bodies from previous error handling
    if (this.groundBodiesForCleanup && this.groundBodiesForCleanup.length > 0) {
      console.log(`Cleaning up ${this.groundBodiesForCleanup.length} previously marked ground bodies`);
      for (const uniqueId of this.groundBodiesForCleanup) {
        // Remove from renderer if it exists there
        if (this.renderer.gameObjects.has(uniqueId)) {
          console.log(`Removing ground object from renderer: ${uniqueId}`);
          this.renderer.gameObjects.delete(uniqueId);
        }
        
        // Remove from entityManager's bodyToEntity map
        this.entityManager.bodyToEntity.delete(uniqueId);
      }
      
      // Clear the cleanup list
      this.groundBodiesForCleanup = [];
    }
    
    // Recreate the physics world - this ensures we get a completely fresh world
    console.log("Calling physics.recreateWorld to create a fresh physics world");
    const { worldId, taskSystem } = this.physics.recreateWorld(oldWorldId, oldTaskSystem);
    
    // Update entity manager with new world ID
    this.entityManager.worldId = worldId;
    // Store task system reference
    this.physics.taskSystem = taskSystem;
    
    console.log(`Physics world recreated. New world ID: ${worldId}`);
    
    // Set the current level
    this.state.currentLevel = levelNumber;
    
    // Reset level-specific state
    this.state.isAiming = false;
    this.state.isFiring = false;
    this.state.score = 0;
    this.state.gameOver = false;
    this.state.victory = false;
    this.state.levelComplete = false;
    this.state.isGameStarted = false;
    this.state.currentBird = null;
    
    // Make sure bird count is reset to 3 for each level
    // This is set in multiple places to ensure it always happens
    this.state.birdsRemaining = 3;
    
    // Reinitialize entity manager's tracking state
    this.entityManager.entities = {};
    this.entityManager.bodyToEntity = new Map();
    this.entityManager.nextEntityId = 1;
    this.entityManager.trackedBodies.birds.clear();
    this.entityManager.trackedBodies.pigs.clear();
    this.entityManager.trackedBodies.blocks.clear();
    
    // Clear renderer object registry to ensure no ghost objects remain
    this.renderer.gameObjects.clear();
    
    // Create the new level with new worldId - this recreates the ground and all entities
    const levelConfig = createLevel(this.entityManager, this.worldDimensions, levelNumber);
    
    // Update game state with level configuration
    this.state.slingPosition = levelConfig.slingshotPosition;
    this.state.birdPosition = levelConfig.initialBirdPosition;
    
    // Explicitly reset bird count to 3 for the new level
    this.state.birdsRemaining = 3;
    console.log(`Reset birds remaining to ${this.state.birdsRemaining} for level ${levelNumber}`);
    
    // Prepare first bird
    this.prepareBird();
    
    console.log(`Level ${levelNumber} loaded successfully with new physics world (ID: ${worldId})`);
  }
  
  // Load the next level
  loadNextLevel() {
    const nextLevel = this.state.currentLevel + 1;
    console.log(`Loading next level: ${nextLevel}`);
    
    // Check if next level exists
    if (nextLevel <= this.state.maxLevel) {
      console.log(`Valid level: ${nextLevel}. Loading level...`);
      this.loadLevel(nextLevel);
    } else {
      // No more levels, complete the game
      console.log(`Level ${nextLevel} does not exist. Game complete!`);
      this.state.victory = true;
      this.state.gameOver = true;
    }
  }
  
  // Clear the current level without resetting the entire game
  clearLevel() {
    console.log("Clearing current level");
    const { b2DestroyBody } = this.physics;
    const trackedBodies = this.entityManager.trackedBodies;
    
    // First, save any existing bodies to destroy
    const bodiesToDestroy = [];
    const uniqueIdsProcessed = new Set(); // Track uniqueIds we've processed to avoid duplicates
    
    // Get all existing body IDs from trackedBodies
    for (const collection of [trackedBodies.birds, trackedBodies.pigs, trackedBodies.blocks]) {
      for (const [uniqueId, info] of collection.entries()) {
        // Skip if already processed this uniqueId
        if (uniqueIdsProcessed.has(uniqueId)) continue;
        uniqueIdsProcessed.add(uniqueId);
        
        if (info && info.entityId) {
          const entity = this.entityManager.entities[info.entityId];
          if (entity && entity.bodyId) {
            bodiesToDestroy.push({
              bodyId: entity.bodyId,
              type: entity.type,
              uniqueId: uniqueId
            });
          }
        }
      }
    }
    
    // Also search for any ground entities that might exist
    for (const entityId in this.entityManager.entities) {
      const entity = this.entityManager.entities[entityId];
      if (entity && entity.type === 'ground' && entity.bodyId) {
        const uniqueId = entity.uniqueId;
        if (!uniqueIdsProcessed.has(uniqueId)) {
          // Verify the ground body is valid before adding to destruction list
          try {
            // Use getIdFromBody to verify the body exists and has valid userData
            const isValid = getIdFromBody(entity.bodyId) !== null;
            
            if (isValid) {
              console.log(`Found valid ground body (uniqueId: ${uniqueId}) to destroy`);
              uniqueIdsProcessed.add(uniqueId);
              bodiesToDestroy.push({
                bodyId: entity.bodyId,
                type: 'ground',
                uniqueId: uniqueId
              });
            } else {
              console.log(`Skipping invalid ground body (uniqueId: ${uniqueId})`);
            }
          } catch (e) {
            console.warn(`Error verifying ground body (uniqueId: ${uniqueId}):`, e);
          }
        }
      }
    }
    
    // Log what we're about to destroy
    console.log(`Found ${bodiesToDestroy.length} bodies to destroy:`);
    const typeCount = { bird: 0, pig: 0, wood: 0, ground: 0, other: 0 };
    bodiesToDestroy.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    console.log(`Types: ${JSON.stringify(typeCount)}`);
    
    // Destroy all bodies we gathered
    for (const item of bodiesToDestroy) {
      try {
        // Check if body is valid before destroying it
        if (item.bodyId) {
          // Add safety check using getIdFromBody to verify the body exists and has valid userData
          const bodyId = getIdFromBody(item.bodyId) ? item.bodyId : null;
          if (bodyId) {
            b2DestroyBody(item.bodyId);
            console.log(`Successfully destroyed ${item.type} body with uniqueId: ${item.uniqueId}`);
          } else {
            console.log(`Skipping destroy for ${item.type} body - body appears invalid`);
          }
        }
      } catch (e) {
        // Special handling for memory access error, which indicates the body is already destroyed
        if (e.message && e.message.includes('memory access out of bounds')) {
          console.warn(`Skipping already destroyed ${item.type} body with uniqueId: ${item.uniqueId}`);
          
          // If this is a ground entity, mark it for cleanup in our entity registry
          if (item.type === 'ground') {
            console.log(`Marking ground body for cleanup - it's already been destroyed by Box2D`);
            // Track for cleanup so we don't try to use this reference again
            this.groundBodiesForCleanup = this.groundBodiesForCleanup || [];
            this.groundBodiesForCleanup.push(item.uniqueId);
          }
        } else {
          console.error(`Error destroying ${item.type} body:`, e);
        }
      }
    }
    
    console.log(`Cleared ${bodiesToDestroy.length} physics bodies`);
    console.log("Level cleared successfully");
  }
  
  // Reset the entire game (back to level 1)
  resetGame() {
    console.log("Resetting game - back to level 1");
    
    // Clear current level
    this.clearLevel();
    
    // Reset game-wide state
    this.state.totalScore = 0;
    this.state.currentLevel = 1;
    this.state.startButtonPressed = false;
    
    // Load level 1
    this.loadLevel(1);
    
    console.log("Game reset complete - back to level 1");
  }
}