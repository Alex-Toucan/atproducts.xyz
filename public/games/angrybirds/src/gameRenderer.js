/**
 * GameRenderer - A custom renderer for an Angry Birds-like game
 * Uses canvas drawing instead of images
 * 
 * IMPORTANT: This renderer does NOT use Box2D's debug drawing mechanism
 * or direct pointer values. It relies entirely on userData.id for entity tracking.
 */
import { getIdFromBody, generateUniqueId } from './utils.js';

export default class GameRenderer {
  constructor(Module, context, scale, autoHD = false) {
    this.Module = Module;
    this.ctx = context;
    this.baseScale = scale;
    this.offset = { x: 0, y: 0 };
    
    // Use the scale as provided - no DPI adjustment
    this.finalScale = this.baseScale;
    
    // FPS counter
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdateTime = 0;
    
    // Track world objects and their types - this is the primary entity storage
    // Maps uniqueId -> { type, properties, position, angle, etc. }
    this.gameObjects = new Map();
    
    // Color scheme
    this.colors = {
      background: '#87CEEB', // Sky blue
      ground: '#8B4513',     // Brown
      bird: '#FF0000',       // Bright red
      wood: '#DEB887',       // Burlywood
      pig: '#32CD32',        // Lime green  
      slingshot: '#8B4513',  // Brown
      rubber: {
        min: '#FFD700',      // Yellow/gold for minimum power
        max: '#FF0000',      // Red for maximum power
        highlight: '#FFEC8B' // Highlight color
      },
      ui: {
        text: '#FFFFFF',     // White
        score: '#FFD700',    // Gold
        background: 'rgba(0, 0, 0, 0.5)'  // Semi-transparent black
      }
    };
  }
  
  // Register a physics body with a specific game object type
  registerGameObject(bodyId, type, properties = {}) {
    // Get the unique ID from properties or from the body's userData
    let uniqueId = properties.uniqueId;
    if (!uniqueId && bodyId && bodyId.userData && bodyId.userData.id) {
      uniqueId = bodyId.userData.id;
    }
    
    if (!uniqueId) {
      console.error("ERROR: Must provide a uniqueId in properties for registration");
      return;
    }
    
    // Get initial position and angle from body if available
    let position = { x: 0, y: 0 };
    let angle = 0;
    
    try {
      if (bodyId && this.Module.b2Body_GetPosition && this.Module.b2Body_GetAngle) {
        const pos = this.Module.b2Body_GetPosition(bodyId);
        position = { x: pos.x, y: pos.y };
        angle = this.Module.b2Body_GetAngle(bodyId);
      } else if (properties.x !== undefined && properties.y !== undefined) {
        // Use provided position if available (for initialization)
        position = { x: properties.x, y: properties.y };
        if (properties.angle !== undefined) {
          angle = properties.angle;
        }
      }
      
    } catch (e) {
      console.warn("Could not get initial position/angle:", e);
    }
    
    // Create the game object data with position and angle
    const gameObjectData = { 
      type, 
      uniqueId,
      properties,
      position,
      angle,
      lastUpdated: Date.now()
    };
    
    // ONLY store by uniqueId - NEVER use pointer values
    
    // Register the object
    this.gameObjects.set(uniqueId, gameObjectData);
    
    
    return uniqueId;
  }
  
  // Update a game object's position and angle - call this from the game loop
  updateGameObject(uniqueId, position, angle) {
    if (!this.gameObjects.has(uniqueId)) {
      // Log warning but don't return - add to tracking if it's missing
      console.warn(`Cannot update object with uniqueId ${uniqueId} - not found in gameObjects`);
      
      // Create a minimal object for tracking when missing 
      // (will be properly updated on next frame)
      this.gameObjects.set(uniqueId, {
        type: 'unknown',
        uniqueId: uniqueId,
        position: { x: position.x, y: position.y },
        angle: angle,
        lastUpdated: Date.now()
      });
      
      return true;
    }
    
    const gameObject = this.gameObjects.get(uniqueId);
    
    // Create a new position object to ensure change detection
    gameObject.position = { x: position.x, y: position.y };
    gameObject.angle = angle;
    gameObject.lastUpdated = Date.now();
    
    return true;
  }
  
  // Set up the canvas transform
  prepareCanvas() {
    this.ctx.save();
    // Scale and flip the y-axis (standard in physics simulations)
    this.ctx.scale(this.finalScale, -this.finalScale);
    
    // Get canvas dimensions in physics units
    const canvasWidth = this.ctx.canvas.width / this.finalScale;
    const canvasHeight = this.ctx.canvas.height / this.finalScale;
    
    // Translate to center horizontally, and put ground at bottom
    // Physics coordinates have (0,0) at center, and -y is bottom half
    this.ctx.translate(
      canvasWidth/2 + this.offset.x,       // Center horizontally with offset
      -canvasHeight/2 + this.offset.y      // Bottom of the canvas (negative in flipped y coords)
    );
    this.ctx.lineWidth = 1 / this.finalScale;
  }
  
  // Restore canvas transform
  restoreCanvas() {
    this.ctx.restore();
  }
  
  // Draw a bird (circular physics object)
  drawBird(x, y, radius, angle, gameState) {
    // Match display radius with physics radius
    const birdRadius = radius; // Bird visual size matches physics size
    
    this.ctx.save();
    this.ctx.translate(x, y);
    // Use positive angle rotation with PI offset to match physics
    this.ctx.rotate(angle + Math.PI);
    
    // Shadow for depth
    this.ctx.beginPath();
    this.ctx.arc(0.1, 0.1, birdRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fill();
    
    // Main body (circle)
    this.ctx.beginPath();
    this.ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
    
    // Create a radial gradient for a more vibrant red
    const gradient = this.ctx.createRadialGradient(
      -birdRadius * 0.3, -birdRadius * 0.3, 0,
      0, 0, birdRadius * 1.2
    );
    gradient.addColorStop(0, '#FF6666'); // Lighter red highlight
    gradient.addColorStop(0.7, '#FF0000'); // Bright red
    gradient.addColorStop(1, '#CC0000'); // Darker red edge
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Subtle outline
    this.ctx.strokeStyle = '#CC0000';
    this.ctx.lineWidth = birdRadius * 0.05;
    this.ctx.stroke();
    
    // Eyes (white part) - make both eyes visible
    const eyeRadius = birdRadius * 0.25;
    const eyeXOffset = birdRadius * 0.3;
    const eyeYOffset = -birdRadius * 0.15;
    
    // Left eye
    this.ctx.beginPath();
    this.ctx.arc(-eyeXOffset, eyeYOffset, eyeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    
    // Right eye
    this.ctx.beginPath();
    this.ctx.arc(eyeXOffset, eyeYOffset, eyeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    
    // Pupils
    const pupilRadius = eyeRadius * 0.6;
    
    // Left pupil with angry look
    this.ctx.beginPath();
    this.ctx.arc(-eyeXOffset + eyeRadius * 0.2, eyeYOffset, pupilRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();
    
    // Right pupil with angry look
    this.ctx.beginPath();
    this.ctx.arc(eyeXOffset + eyeRadius * 0.2, eyeYOffset, pupilRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();
    
    // Eyebrows for angry look
    this.ctx.beginPath();
    this.ctx.moveTo(-eyeXOffset - eyeRadius * 0.8, eyeYOffset - eyeRadius * 0.8);
    this.ctx.lineTo(-eyeXOffset + eyeRadius * 0.4, eyeYOffset - eyeRadius * 0.3);
    this.ctx.lineWidth = birdRadius * 0.06;
    this.ctx.strokeStyle = '#CC0000';
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(eyeXOffset + eyeRadius * 0.8, eyeYOffset - eyeRadius * 0.8);
    this.ctx.lineTo(eyeXOffset - eyeRadius * 0.4, eyeYOffset - eyeRadius * 0.3);
    this.ctx.lineWidth = birdRadius * 0.06;
    this.ctx.strokeStyle = '#CC0000';
    this.ctx.stroke();
    
    // Yellow/orange beak
    this.ctx.beginPath();
    this.ctx.moveTo(birdRadius * 0.7, 0);
    this.ctx.lineTo(birdRadius * 1.4, birdRadius * 0.2);
    this.ctx.lineTo(birdRadius * 1.4, -birdRadius * 0.2);
    this.ctx.closePath();
    
    // Gradient for beak
    const beakGradient = this.ctx.createLinearGradient(
      birdRadius * 0.7, 0, 
      birdRadius * 1.4, 0
    );
    beakGradient.addColorStop(0, '#FFCC00');
    beakGradient.addColorStop(1, '#FF9900');
    
    this.ctx.fillStyle = beakGradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#CC7700';
    this.ctx.lineWidth = birdRadius * 0.03;
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  // Draw a wooden block (box physics object)
  drawWood(x, y, width, height, angle, gameState) {
    // Match display size with physics size
    const displayWidth = width;  // 100% of physics width
    const displayHeight = height; // 100% of physics height
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(-angle);
    
    // Main rectangle - use full physics size
    this.ctx.fillStyle = this.colors.wood;
    this.ctx.fillRect(-displayWidth/2, -displayHeight/2, displayWidth, displayHeight);
    
    // Border with consistent thickness (not proportional to width)
    this.ctx.strokeStyle = '#5D4037';
    this.ctx.lineWidth = 0.05; // Fixed thickness for all boards
    this.ctx.strokeRect(-displayWidth/2, -displayHeight/2, displayWidth, displayHeight);
    
    // Wood grain (horizontal lines)
    const grainCount = Math.max(2, Math.floor(displayHeight / 0.7));
    const grainSpacing = displayHeight / grainCount;
    
    this.ctx.strokeStyle = '#A1887F';
    this.ctx.lineWidth = 0.03; // Fixed thickness for grain lines
    
    for (let i = 1; i < grainCount; i++) {
      const y = -displayHeight/2 + i * grainSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(-displayWidth/2, y);
      this.ctx.lineTo(displayWidth/2, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  // Draw a pig (enemy, circular physics object)
  drawPig(x, y, radius, angle, gameState) {
    // Match visual radius with physics radius
    const pigRadius = radius; // Visual size matches physics size
    
    // Check if this pig is marked as dead
    let isPigDead = false;
    // Track damage level for visual feedback (0-1 scale)
    let damageLevel = 0;
    // Reference to the game object for later use
    let currentPigObject = null;
    
    // Direct dead status and damage level from the gameObject itself
    for (const [uniqueId, gameObject] of this.gameObjects.entries()) {
      if (gameObject.type === 'pig' && 
          Math.abs(gameObject.position.x - x) < 0.01 && 
          Math.abs(gameObject.position.y - y) < 0.01) {
        
        // Store reference to the game object
        currentPigObject = gameObject;
        
        // Check for dead flag directly on the gameObject
        if (gameObject.dead === true) {
          isPigDead = true;
        }
        
        // Check for damage level
        if (gameObject.damageLevel !== undefined) {
          damageLevel = gameObject.damageLevel;
        }
        
        // Also check activity status from trackedBodies as backup
        if (!isPigDead && gameState && gameState.trackedBodies && gameState.trackedBodies.pigs) {
          const pigInfo = gameState.trackedBodies.pigs.get(uniqueId);
          if (pigInfo && pigInfo.active === false) {
            isPigDead = true;
            
            // If not already marked as dead, mark it now
            if (gameObject.dead !== true) {
              gameObject.dead = true;
            }
          }
        }
        
        break;
      }
    }
    
    this.ctx.save();
    this.ctx.translate(x, y);
    // Keep the 180-degree offset for proper orientation, but use positive angle
    this.ctx.rotate(angle + Math.PI);
    
    // Shadow for depth
    this.ctx.beginPath();
    this.ctx.arc(0.1, 0.1, pigRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fill();
    
    // Main body (circle) with appropriate gradient based on alive/dead state
    this.ctx.beginPath();
    this.ctx.arc(0, 0, pigRadius, 0, Math.PI * 2);
    
    // Create a radial gradient based on pig's state
    const gradient = this.ctx.createRadialGradient(
      -pigRadius * 0.3, -pigRadius * 0.3, 0,
      0, 0, pigRadius * 1.2
    );
    
    if (isPigDead) {
      // Grey gradient for dead pigs
      gradient.addColorStop(0, '#AAAAAA'); // Light grey highlight
      gradient.addColorStop(0.6, '#888888'); // Medium grey
      gradient.addColorStop(1, '#555555'); // Dark grey edge
    } else {
      // Green gradient for living pigs
      gradient.addColorStop(0, '#70FF70'); // Lighter green highlight
      gradient.addColorStop(0.6, '#32CD32'); // Bright green (LimeGreen)
      gradient.addColorStop(1, '#228B22'); // Darker green edge (ForestGreen)
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Outline color based on alive/dead state
    this.ctx.strokeStyle = isPigDead ? '#555555' : '#228B22';
    this.ctx.lineWidth = pigRadius * 0.05;
    this.ctx.stroke();
    
    // Eyes - make whites SIGNIFICANTLY bigger to emphasize damage level
    // The white part is the sclera and should be large and prominent
    const eyeRadius = pigRadius * 0.28; // Made even bigger (previously 0.22)
    const eyeXOffset = pigRadius * 0.35;
    const eyeYOffset = -pigRadius * 0.2;
    
    // Get pupil color from the game object if available
    let pupilColor = '#000000'; // Default black
    if (currentPigObject && currentPigObject.pupilColor) {
      pupilColor = currentPigObject.pupilColor;
    }
    
    if (!isPigDead) {
      // Calculate eye white color based on damage level
      // Interpolate from white to red as damage increases
      const red = 255;
      const green = Math.max(0, Math.floor(255 * (1 - damageLevel)));
      const blue = Math.max(0, Math.floor(255 * (1 - damageLevel)));
      const eyeColor = `rgb(${red}, ${green}, ${blue})`;
      
      // Left eye white (sclera) with color based on damage
      this.ctx.beginPath();
      this.ctx.arc(-eyeXOffset, eyeYOffset, eyeRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = eyeColor;
      this.ctx.fill();
      
      // Right eye white (sclera) with color based on damage
      this.ctx.beginPath();
      this.ctx.arc(eyeXOffset, eyeYOffset, eyeRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = eyeColor;
      this.ctx.fill();
    }
    
    if (!isPigDead) {
      // Live pigs - show pupils and highlights
      
      // Add eye highlights (specular reflection)
      // Position changes based on damage level to show stress
      const highlightOffsetX = eyeRadius * (0.3 - damageLevel * 0.1);
      const highlightOffsetY = eyeRadius * (0.3 - damageLevel * 0.1);
      const highlightRadius = eyeRadius * (0.3 - damageLevel * 0.1);
      
      // Left eye highlight
      this.ctx.beginPath();
      this.ctx.arc(-eyeXOffset - highlightOffsetX, eyeYOffset - highlightOffsetY, highlightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.fill();
      
      // Right eye highlight
      this.ctx.beginPath();
      this.ctx.arc(eyeXOffset - highlightOffsetX, eyeYOffset - highlightOffsetY, highlightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.fill();
      
      // Pupils - keep them smaller relative to the now larger eye whites
      // Size still changes with damage to show dilation from stress
      const pupilRadius = eyeRadius * (0.35 + damageLevel * 0.2); // Smaller relative to eye white
      const pupilOffset = damageLevel * eyeRadius * 0.2; // Pupils move outward as damage increases
      
      // Left pupil - use the random pupil color from the entity
      this.ctx.beginPath();
      this.ctx.arc(-eyeXOffset - pupilOffset, eyeYOffset, pupilRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = pupilColor; // Use the pig's unique eye color
      this.ctx.fill();
      
      // Right pupil - match the left pupil color
      this.ctx.beginPath();
      this.ctx.arc(eyeXOffset + pupilOffset, eyeYOffset, pupilRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = pupilColor; // Use the pig's unique eye color
      this.ctx.fill();
      
      // Add pupil highlight for more depth and realism
      const pupilHighlightRadius = pupilRadius * 0.3;
      const pupilHighlightOffset = pupilRadius * 0.2;
      
      // Left pupil highlight
      this.ctx.beginPath();
      this.ctx.arc(-eyeXOffset - pupilOffset - pupilHighlightOffset, 
                   eyeYOffset - pupilHighlightOffset, 
                   pupilHighlightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fill();
      
      // Right pupil highlight
      this.ctx.beginPath();
      this.ctx.arc(eyeXOffset + pupilOffset - pupilHighlightOffset, 
                   eyeYOffset - pupilHighlightOffset, 
                   pupilHighlightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fill();
      
      // Add eyebrows that become more angled as damage increases
      const eyebrowLength = eyeRadius * (1.0 + damageLevel * 0.5);
      const eyebrowThickness = pigRadius * (0.04 + damageLevel * 0.03);
      const eyebrowAngle = 0.3 + damageLevel * 0.4; // Radians - becomes more angled
      
      // Calculate eyebrow points
      const leftEyebrowX1 = -eyeXOffset - eyeRadius * 1.0;
      const leftEyebrowY1 = eyeYOffset - eyeRadius * (0.8 + damageLevel * 0.3);
      const leftEyebrowX2 = -eyeXOffset + eyeRadius * 0.4;
      const leftEyebrowY2 = eyeYOffset - eyeRadius * 0.2;
      
      // Left eyebrow
      this.ctx.beginPath();
      this.ctx.moveTo(leftEyebrowX1, leftEyebrowY1);
      this.ctx.lineTo(leftEyebrowX2, leftEyebrowY2);
      this.ctx.lineWidth = eyebrowThickness;
      this.ctx.strokeStyle = '#553311';
      this.ctx.stroke();
      
      // Right eyebrow
      this.ctx.beginPath();
      this.ctx.moveTo(eyeXOffset + eyeRadius * 1.0, eyeYOffset - eyeRadius * (0.8 + damageLevel * 0.3));
      this.ctx.lineTo(eyeXOffset - eyeRadius * 0.4, eyeYOffset - eyeRadius * 0.2);
      this.ctx.lineWidth = eyebrowThickness;
      this.ctx.strokeStyle = '#553311';
      this.ctx.stroke();
      
    } else {
      // X eyes for dead pigs - with no white background
      // Make X's smaller as requested
      const xSize = eyeRadius * 0.8; // Reduced from 1.1 to 0.8
      
      // Left X eye - thicker and with white outline for contrast against green body
      this.ctx.beginPath();
      this.ctx.moveTo(-eyeXOffset - xSize, eyeYOffset - xSize);
      this.ctx.lineTo(-eyeXOffset + xSize, eyeYOffset + xSize);
      this.ctx.moveTo(-eyeXOffset + xSize, eyeYOffset - xSize);
      this.ctx.lineTo(-eyeXOffset - xSize, eyeYOffset + xSize);
      this.ctx.lineWidth = pigRadius * 0.09; // Even thicker lines
      this.ctx.strokeStyle = '#000000';
      this.ctx.stroke();
      
      // Add white outline for better visibility (reduced to match smaller X size)
      this.ctx.beginPath();
      this.ctx.moveTo(-eyeXOffset - xSize - 1, eyeYOffset - xSize - 1);
      this.ctx.lineTo(-eyeXOffset + xSize + 1, eyeYOffset + xSize + 1);
      this.ctx.moveTo(-eyeXOffset + xSize + 1, eyeYOffset - xSize - 1);
      this.ctx.lineTo(-eyeXOffset - xSize - 1, eyeYOffset + xSize + 1);
      this.ctx.lineWidth = pigRadius * 0.12; // Thicker than the black line
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.globalCompositeOperation = 'destination-over'; // Put white behind black
      this.ctx.stroke();
      this.ctx.globalCompositeOperation = 'source-over'; // Reset to default
      
      // Right X eye - with the same treatment
      this.ctx.beginPath();
      this.ctx.moveTo(eyeXOffset - xSize, eyeYOffset - xSize);
      this.ctx.lineTo(eyeXOffset + xSize, eyeYOffset + xSize);
      this.ctx.moveTo(eyeXOffset + xSize, eyeYOffset - xSize);
      this.ctx.lineTo(eyeXOffset - xSize, eyeYOffset + xSize);
      this.ctx.lineWidth = pigRadius * 0.09; // Even thicker lines
      this.ctx.strokeStyle = '#000000';
      this.ctx.stroke();
      
      // Add white outline for better visibility (reduced to match smaller X size)
      this.ctx.beginPath();
      this.ctx.moveTo(eyeXOffset - xSize - 1, eyeYOffset - xSize - 1);
      this.ctx.lineTo(eyeXOffset + xSize + 1, eyeYOffset + xSize + 1);
      this.ctx.moveTo(eyeXOffset + xSize + 1, eyeYOffset - xSize - 1);
      this.ctx.lineTo(eyeXOffset - xSize - 1, eyeYOffset + xSize + 1);
      this.ctx.lineWidth = pigRadius * 0.12; // Thicker than the black line
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.globalCompositeOperation = 'destination-over'; // Put white behind black
      this.ctx.stroke();
      this.ctx.globalCompositeOperation = 'source-over'; // Reset to default
    }
    
    // Snout - make it more prominent and pink
    const noseWidth = pigRadius * 0.7;
    const noseHeight = pigRadius * 0.4;
    const noseY = pigRadius * 0.15;
    
    // Snout background
    this.ctx.beginPath();
    this.ctx.ellipse(0, noseY, noseWidth/2, noseHeight/2, 0, 0, Math.PI * 2);
    
    // Create a gradient for the snout
    const snoutGradient = this.ctx.createRadialGradient(
      0, noseY, 0,
      0, noseY, noseWidth/2
    );
    
    if (isPigDead) {
      snoutGradient.addColorStop(0, '#CCAAAA'); // Lighter grayish-pink in center
      snoutGradient.addColorStop(1, '#AA7777'); // Darker grayish-pink at edge
    } else {
      snoutGradient.addColorStop(0, '#FFBBCC'); // Lighter pink in center
      snoutGradient.addColorStop(1, '#FF7799'); // Darker pink at edge
    }
    
    this.ctx.fillStyle = snoutGradient;
    this.ctx.fill();
    this.ctx.strokeStyle = isPigDead ? '#AA7777' : '#FF5577';
    this.ctx.lineWidth = pigRadius * 0.03;
    this.ctx.stroke();
    
    // Nostrils - make them darker and more prominent
    const nostrilRadius = noseWidth * 0.15;
    const nostrilOffset = noseWidth * 0.25;
    
    this.ctx.beginPath();
    this.ctx.arc(-nostrilOffset, noseY, nostrilRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = isPigDead ? '#AA4444' : '#CC3355';
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(nostrilOffset, noseY, nostrilRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = isPigDead ? '#AA4444' : '#CC3355';
    this.ctx.fill();
    
    // Optional: Add ears for more pig-like appearance
    this.ctx.beginPath();
    this.ctx.ellipse(-pigRadius * 0.6, -pigRadius * 0.6, pigRadius * 0.4, pigRadius * 0.3, Math.PI/4, 0, Math.PI * 2);
    this.ctx.fillStyle = isPigDead ? '#888888' : '#32CD32'; // Grey or green ears based on state
    this.ctx.fill();
    this.ctx.strokeStyle = isPigDead ? '#555555' : '#228B22';
    this.ctx.lineWidth = pigRadius * 0.03;
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.ellipse(pigRadius * 0.6, -pigRadius * 0.6, pigRadius * 0.4, pigRadius * 0.3, -Math.PI/4, 0, Math.PI * 2);
    this.ctx.fillStyle = isPigDead ? '#888888' : '#32CD32'; // Grey or green ears based on state
    this.ctx.fill();
    this.ctx.strokeStyle = isPigDead ? '#555555' : '#228B22';
    this.ctx.lineWidth = pigRadius * 0.03;
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  // Draw ground (static physics objects)
  drawGround(vertices) {
    this.ctx.beginPath();
    
    for (let i = 0; i < vertices.length; i++) {
      const { x, y } = vertices[i];
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    // Fill with a gradient for a terrain-like appearance
    const gradient = this.ctx.createLinearGradient(0, -40, 0, -35);
    gradient.addColorStop(0, this.colors.ground);
    gradient.addColorStop(1, '#A0522D');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#654321';
    this.ctx.lineWidth = 0.1;
    this.ctx.stroke();
  }
  
  // Draw slingshot
  drawSlingshot(x, y, width = 2, height = 3) {
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Base at ground level
    const groundLevel = 0;
    
    // Draw the Y-shape slingshot
    this.ctx.beginPath();
    
    // Stem (vertical part)
    this.ctx.moveTo(0, groundLevel);
    this.ctx.lineTo(0, height * 0.6);
    
    // Left fork
    this.ctx.moveTo(0, height * 0.6);
    this.ctx.lineTo(-width/2, height);
    
    // Right fork
    this.ctx.moveTo(0, height * 0.6);
    this.ctx.lineTo(width/2, height);
    
    // Set line properties
    this.ctx.lineWidth = width/3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.colors.slingshot;
    this.ctx.stroke();
    
    // Draw a small base at the bottom for stability
    this.ctx.beginPath();
    this.ctx.rect(-width/3, groundLevel, width/1.5, 0.2);
    this.ctx.fillStyle = this.colors.slingshot;
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  // Draw slingshot rubber band
  drawSlingshotBand(fromX, fromY, toX, toY, controlX, controlY) {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.quadraticCurveTo(controlX, controlY, toX, toY);
    this.ctx.lineWidth = 0.15;
    this.ctx.strokeStyle = this.colors.rubber;
    this.ctx.stroke();
  }
  
  // Draw a simple background with blue sky and green hills
  drawBackground() {
    const canvas = this.ctx.canvas;
    
    // Save current transform
    this.ctx.save();
    
    // Reset transform to work in screen coordinates
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Draw sky - plain blue background
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground / hills
    this.ctx.fillStyle = '#4CAF50'; // Green color
    
    // Calculate hill height - increased to 30% of canvas height
    const hillHeight = canvas.height * 0.3;
    
    // Draw hills using a smooth bezier curve approach with raised edges
    this.ctx.beginPath();
    
    // Start at left edge already elevated
    this.ctx.moveTo(0, canvas.height - hillHeight * 0.4); // 40% of max height at left edge
    
    // First hill (rising from left edge)
    this.ctx.bezierCurveTo(
      canvas.width * 0.1, canvas.height - hillHeight * 0.35, // control point 1
      canvas.width * 0.2, canvas.height - hillHeight * 0.3,  // control point 2
      canvas.width * 0.25, canvas.height - hillHeight * 0.45 // end point
    );
    
    // Valley between first and second hills
    this.ctx.bezierCurveTo(
      canvas.width * 0.3, canvas.height - hillHeight * 0.5,  // control point 1
      canvas.width * 0.35, canvas.height - hillHeight * 0.55, // control point 2
      canvas.width * 0.4, canvas.height - hillHeight * 0.6   // end point
    );
    
    // Second hill (medium)
    this.ctx.bezierCurveTo(
      canvas.width * 0.45, canvas.height - hillHeight * 0.7, // control point 1
      canvas.width * 0.5, canvas.height - hillHeight * 0.8,  // control point 2
      canvas.width * 0.6, canvas.height - hillHeight * 0.75  // end point
    );
    
    // Third hill (tallest)
    this.ctx.bezierCurveTo(
      canvas.width * 0.7, canvas.height - hillHeight * 0.9,  // control point 1
      canvas.width * 0.8, canvas.height - hillHeight,        // control point 2
      canvas.width * 0.9, canvas.height - hillHeight * 0.7   // end point
    );
    
    // End with elevated right edge
    this.ctx.bezierCurveTo(
      canvas.width * 0.95, canvas.height - hillHeight * 0.6, // control point 1
      canvas.width * 0.98, canvas.height - hillHeight * 0.5, // control point 2
      canvas.width, canvas.height - hillHeight * 0.5         // end at 50% height
    );
    
    // Close the shape
    this.ctx.lineTo(canvas.width, canvas.height);
    this.ctx.lineTo(0, canvas.height);
    this.ctx.closePath();
    
    // Fill the landscape
    this.ctx.fill();
    
    // Restore the transform
    this.ctx.restore();
  }
  
  // Render all game objects directly without using Box2D's debug drawing
  renderGameObjects(gameStateObj) {
    try {
      this.prepareCanvas();
      
      // Draw background first
      this.drawBackground();
      
      // Get canvas dimensions in physics units
      const canvas = this.ctx.canvas;
      const worldWidth = canvas.width / this.finalScale;
      const worldHeight = canvas.height / this.finalScale;
      
      // Calculate slingshot position from left, at bottom
      // Use gameState if provided, otherwise use default position
      let slingX = -worldWidth * 0.35; // 35% from left
      let slingY = -2; // Just above ground level (ground is at y=0)
      
      if (gameStateObj && gameStateObj.slingPosition) {
        slingX = gameStateObj.slingPosition.x;
        slingY = gameStateObj.slingPosition.y;
      }
      
      // Draw slingshot at the calculated position
      this.drawSlingshot(slingX, slingY);
      
      // Draw all registered game objects based on their current position and type
      for (const [uniqueId, gameObject] of this.gameObjects.entries()) {
        // If it's the current bird and we're in aiming mode, skip rendering here
        // (it will be rendered at the slingshot position)
        const isCurrentBird = gameStateObj && 
                          gameStateObj.currentBird && 
                          gameStateObj.currentBird.userData && 
                          gameStateObj.currentBird.userData.id === uniqueId;
        
        if (isCurrentBird && gameStateObj.isAiming) {
          continue; // Skip during aiming - will be handled by UI
        }
        
        // Get the position and angle from physics
        const position = gameObject.position || { x: 0, y: 0 };
        const angle = gameObject.angle || 0;
        
        // Render based on type
        switch (gameObject.type) {
          case 'bird':
            const birdRadius = gameObject.properties.radius || 0.5;
            this.drawBird(position.x, position.y, birdRadius, angle, gameStateObj);
            break;
            
          case 'pig':
            const pigRadius = gameObject.properties.radius || 1.0;
            this.drawPig(position.x, position.y, pigRadius, angle, gameStateObj);
            break;
            
          case 'wood':
            const blockWidth = gameObject.properties.width || 2.0;
            const blockHeight = gameObject.properties.height || 2.0;
            this.drawWood(position.x, position.y, blockWidth, blockHeight, angle, gameStateObj);
            break;
            
          case 'ground':
            // Ground is a special case - draw a horizontal line
            if (gameObject.properties.vertices) {
              this.drawGround(gameObject.properties.vertices);
            } else {
              // Default ground if no specific vertices
              const groundWidth = gameObject.properties.width || worldWidth * 2;
              const groundY = position.y || worldHeight * -0.5;
              const vertices = [
                { x: -groundWidth/2, y: groundY },
                { x: groundWidth/2, y: groundY }
              ];
              this.drawGround(vertices);
            }
            break;
        }
      }
      
      // If we have a current bird in aiming mode, render it at its current position
      if (gameStateObj && gameStateObj.currentBird && gameStateObj.isAiming && gameStateObj.birdPosition) {
        const birdPosition = gameStateObj.birdPosition;
        const bird = gameStateObj.currentBird;
        
        // Get uniqueId from the bird
        const birdUniqueId = bird.userData?.id;
        
        // Find bird properties (radius) from registration
        let birdRadius = 0.5; // Default
        if (birdUniqueId && this.gameObjects.has(birdUniqueId)) {
          const birdObj = this.gameObjects.get(birdUniqueId);
          if (birdObj && birdObj.properties && birdObj.properties.radius) {
            birdRadius = birdObj.properties.radius;
          }
        }
        
        // Draw the current bird at the aiming position
        this.drawBird(birdPosition.x, birdPosition.y, birdRadius, 0, gameStateObj);
      }
      
      this.restoreCanvas();
      
      // Store basic statistics
      if (gameStateObj) {
        gameStateObj.bodyShapesCount = this.gameObjects.size;
      }
    } catch (error) {
      console.error("Error in renderGameObjects:", error);
    }
  }
  
  // Transform point with rotation and translation
  transformPoint(xf, v) {
    return {
      x: xf.p.x + xf.q.c * v.x - xf.q.s * v.y,
      y: xf.p.y + xf.q.s * v.x + xf.q.c * v.y
    };
  }
  
  // Configure debug draw flags
  SetFlags(flags) {
    const debugDraw = this.debugDrawCommandBuffer.GetDebugDraw();
    for (const [key, value] of Object.entries(flags)) {
      debugDraw[key] = value;
    }
  }
  
  // Draw game UI elements
  drawUI(gameState) {
    const canvas = this.ctx.canvas;
    const ctx = this.ctx;
    
    // Calculate strap end position based on game state and animation
    let strapEndPosition;
    
    // Handle strap animation after bird is launched
    if (gameState.strapAnimation && gameState.strapAnimation.active) {
      const animation = gameState.strapAnimation;
      const currentTime = Date.now();
      const elapsedTime = currentTime - animation.startTime;
      
      if (elapsedTime < animation.duration) {
        // First 25% - Snap quickly to the opposite side (recoil)
        if (elapsedTime < animation.duration * 0.25) {
          const fastProgress = Math.min(1, elapsedTime / (animation.duration * 0.25));
          // Quadratic ease out for quick snap
          const snapEase = 1 - Math.pow(1 - fastProgress, 2);
          strapEndPosition = {
            x: animation.initialPosition.x * (1 - snapEase) + animation.snapPosition.x * snapEase,
            y: animation.initialPosition.y * (1 - snapEase) + animation.snapPosition.y * snapEase
          };
        } 
        // For the rest of the time (1500ms), gradually settle back to resting position
        else {
          // Use a natural spring-like motion with damped oscillation
          const t = (elapsedTime - animation.duration * 0.25) / (animation.duration * 0.75);
          
          // Damped oscillation: e^(-6*t) * cos(12*t)
          // Simulates a spring with a bit of bounce
          const oscillation = Math.exp(-6 * t) * Math.cos(12 * t);
          
          // Add oscillation to a standard ease-out
          const progress = 1 - Math.pow(1 - Math.min(t, 1), 3); // Cubic ease-out
          const finalProgress = progress + oscillation * (1 - progress) * 0.15; // 15% oscillation effect
          
          strapEndPosition = {
            x: animation.snapPosition.x * (1 - finalProgress) + animation.targetPosition.x * finalProgress,
            y: animation.snapPosition.y * (1 - finalProgress) + animation.targetPosition.y * finalProgress
          };
        }
      } else {
        // Animation complete, use rest position
        strapEndPosition = { ...animation.targetPosition };
        gameState.strapAnimation.active = false;
      }
    }
    // Default behavior - straps follow bird during aiming
    else if (gameState.isAiming && gameState.birdPosition) {
      strapEndPosition = { ...gameState.birdPosition };
    }
    // When not animating or aiming, show straps at rest position
    else {
      strapEndPosition = {
        x: gameState.slingPosition.x,
        y: gameState.slingPosition.y + 2.5 // Default position at top of slingshot
      };
    }
    
    // Save current transform
    ctx.save();
    // Switch to physics space for drawing straps
    this.prepareCanvas();
    
    // Draw the straps, passing gameState for power-based coloring
    this.drawSlingshotRubber(strapEndPosition, gameState.slingPosition, gameState);
    
    // Draw trajectory guide if aiming
    if (gameState.isAiming && gameState.aimDirection && gameState.aimPower) {
      this.drawTrajectoryGuide(
        gameState.birdPosition,
        gameState.slingPosition,
        gameState.aimDirection,
        gameState.aimPower,
        gameState.isAiming
      );
    }
    
    // Restore to screen space
    this.restoreCanvas();
    // Restore the original context state
    ctx.restore();
    
    // Switch to screen space for UI elements
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Draw score panel with larger background that includes the total score
    ctx.fillStyle = this.colors.ui.background;
    ctx.fillRect(10, 10, 300, gameState.totalScore > 0 ? 60 : 40);
    
    // Draw level and score info
    ctx.font = '20px Arial';
    ctx.fillStyle = this.colors.ui.score;
    ctx.textAlign = 'left';
    ctx.fillText(`Level: ${gameState.currentLevel || 1}`, 20, 32);
    ctx.fillText(`Score: ${gameState.score || 0}`, 140, 32);
    
    // Draw total score if greater than 0 - now inside the background panel
    if (gameState.totalScore > 0) {
      ctx.fillStyle = this.colors.ui.score; // Use same gold color as other scores
      ctx.fillText(`Total: ${gameState.totalScore}`, 20, 60);
    }
    
    // Draw birds remaining
    ctx.fillStyle = this.colors.ui.text;
    ctx.textAlign = 'right';
    ctx.fillText(`Birds: ${gameState.birdsRemaining || 0}`, canvas.width - 20, 32);
    
    // Draw FPS counter in top right corner, below birds count
    ctx.fillStyle = this.colors.ui.background;
    ctx.fillRect(canvas.width - 90, 45, 70, 30);
    ctx.fillStyle = '#00FF00'; // Bright green for FPS
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`FPS: ${this.fps}`, canvas.width - 55, 65);
    
    // If level is complete but not game over, show level complete message
    if (gameState.levelComplete && !gameState.gameOver) {
      // Semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw level complete message
      ctx.font = '42px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#4CAF50'; // Green
      ctx.fillText('Level Complete!', canvas.width / 2, canvas.height / 2 - 30);
      
      // Show level completion bonus
      ctx.font = '28px Arial';
      ctx.fillStyle = '#FFD700'; // Gold
      ctx.fillText('Level Bonus: 1000', canvas.width / 2, canvas.height / 2 + 10);
      
      // Show bird bonus if any birds remaining
      if (gameState.birdsRemaining > 0) {
        const birdBonus = gameState.birdsRemaining * 500;
        ctx.fillText(`Bird Bonus: ${birdBonus} (${gameState.birdsRemaining} × 500)`, 
                    canvas.width / 2, canvas.height / 2 + 50);
      }
      
      // Show next level message
      ctx.font = '24px Arial';
      ctx.fillStyle = this.colors.ui.text;
      ctx.fillText('Loading next level...', canvas.width / 2, canvas.height / 2 + 90);
    }
    
    // If game is over, show message
    else if (gameState.gameOver) {
      let message;
      if (gameState.victory && gameState.currentLevel >= gameState.maxLevel) {
        message = 'GAME COMPLETE!';
      } else if (gameState.victory) {
        message = 'VICTORY!';
      } else {
        message = 'GAME OVER';
      }
      
      // Semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw message
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = gameState.victory ? '#4CAF50' : '#F44336';
      ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
      
      // Draw score
      if (gameState.victory) {
        ctx.font = '30px Arial';
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.fillText(`Total Score: ${gameState.totalScore}`, canvas.width / 2, canvas.height / 2 + 30);
      }
      
      // Draw restart message
      ctx.font = '24px Arial';
      ctx.fillStyle = this.colors.ui.text;
      ctx.fillText('Press START to play again', canvas.width / 2, canvas.height / 2 + 80);
    }
    
    // No game instructions at bottom of screen
    
    ctx.restore();
  }
  
  // Draw slingshot rubber connecting to bird
  drawSlingshotRubber(birdPos, slingPos, gameState) {
    if (!birdPos || !slingPos) return;
    
    // Draw in physics space
    this.ctx.save();
    
    // Calculate Y slingshot top positions
    const width = 2; // Same as slingshot width
    const height = 3; // Same as slingshot height
    const leftForkX = slingPos.x - width/2;
    const rightForkX = slingPos.x + width/2;
    const forkY = slingPos.y + height;
    
    // Calculate the distance for curve adjustment
    const dx = birdPos.x - slingPos.x;
    const dy = birdPos.y - slingPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Always use yellow color for rubber bands
    const strapColor = this.colors.rubber.min; // Yellow/gold color
    const strapColorDarker = this.darkenColor(strapColor, 0.2); // 20% darker for gradient middle
    
    // Make curve more pronounced as the bird is pulled back
    const curveFactor = Math.min(0.25, distance * 0.05);
    
    // Calculate curve control points
    const dxLeft = birdPos.x - leftForkX;
    const dyLeft = birdPos.y - forkY;
    const controlX = (leftForkX + birdPos.x) / 2 - dyLeft * curveFactor;
    const controlY = (forkY + birdPos.y) / 2 + dxLeft * curveFactor;
    
    // Path for left strap
    this.ctx.beginPath();
    this.ctx.moveTo(leftForkX, forkY);
    this.ctx.quadraticCurveTo(controlX, controlY, birdPos.x, birdPos.y);
    
    // Strap style with gradient
    this.ctx.lineWidth = 0.3;
    
    // Create gradient for the strap
    const leftGradient = this.ctx.createLinearGradient(leftForkX, forkY, birdPos.x, birdPos.y);
    leftGradient.addColorStop(0, strapColor); // Yellow at the fork
    leftGradient.addColorStop(0.5, strapColorDarker); // Darker in the middle for depth
    leftGradient.addColorStop(1, strapColor); // Yellow at the bird
    
    this.ctx.strokeStyle = leftGradient;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
    
    // Right strap
    const dxRight = birdPos.x - rightForkX;
    const dyRight = birdPos.y - forkY;
    const controlX2 = (rightForkX + birdPos.x) / 2 + dyRight * curveFactor;
    const controlY2 = (forkY + birdPos.y) / 2 - dxRight * curveFactor;
    
    // Path for right strap
    this.ctx.beginPath();
    this.ctx.moveTo(rightForkX, forkY);
    this.ctx.quadraticCurveTo(controlX2, controlY2, birdPos.x, birdPos.y);
    
    // Similar gradient for right strap
    const rightGradient = this.ctx.createLinearGradient(rightForkX, forkY, birdPos.x, birdPos.y);
    rightGradient.addColorStop(0, strapColor); // Yellow
    rightGradient.addColorStop(0.5, strapColorDarker); // Darker in the middle
    rightGradient.addColorStop(1, strapColor); // Yellow
    
    this.ctx.strokeStyle = rightGradient;
    this.ctx.stroke();
    
    // Add slight 3D effect with a thinner highlight
    const highlightColor = this.lightenColor(strapColor, 0.3); // 30% lighter
    
    this.ctx.beginPath();
    this.ctx.moveTo(leftForkX, forkY);
    this.ctx.quadraticCurveTo(controlX, controlY, birdPos.x, birdPos.y);
    this.ctx.lineWidth = 0.1;
    this.ctx.strokeStyle = highlightColor;
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(rightForkX, forkY);
    this.ctx.quadraticCurveTo(controlX2, controlY2, birdPos.x, birdPos.y);
    this.ctx.strokeStyle = highlightColor;
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  // Helper function to convert hex color to RGB
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  }
  
  // Helper function to convert RGB to hex
  rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Helper function to darken a color by percentage
  darkenColor(color, percentage) {
    const rgb = this.hexToRgb(color);
    const darker = {
      r: Math.max(0, Math.floor(rgb.r * (1 - percentage))),
      g: Math.max(0, Math.floor(rgb.g * (1 - percentage))),
      b: Math.max(0, Math.floor(rgb.b * (1 - percentage)))
    };
    return this.rgbToHex(darker.r, darker.g, darker.b);
  }
  
  // Helper function to lighten a color by percentage
  lightenColor(color, percentage) {
    const rgb = this.hexToRgb(color);
    const lighter = {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percentage)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percentage)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percentage))
    };
    return this.rgbToHex(lighter.r, lighter.g, lighter.b);
  }
  
  // IMPORTANT HELPER FUNCTION: Calculate trajectory direction
  // Used by both the trajectory guide and physics calculation to ensure consistency
  // Matches the enhanced version in gameController.js
  calculateTrajectoryDirection(posY, forkY) {
    // Calculate distance from the fork center point
    const distanceFromFork = posY - forkY; // Positive when below, negative when above
    
    // Initialize with zero vertical component
    let verticalComponent = 0;
    
    // Only calculate non-zero vertical component if not at the fork level
    if (Math.abs(distanceFromFork) >= 0.05) {
      // Calculate vertical direction - critical for correct trajectory
      // If below fork (positive distance) → go UP (negative Y)
      // If above fork (negative distance) → go DOWN (positive Y)
      const verticalDirection = (distanceFromFork < 0) ? 1 : -1;
      
      // Calculate magnitude based on distance with higher cap for more extreme angles
      // Increased from 2.0 to 3.0 to allow for higher trajectory angles
      const distanceFactor = Math.min(3.0, Math.abs(distanceFromFork)) / 2.0;
      
      // Apply direction and magnitude with additional scaling
      // Use a steeper function that amplifies smaller distances
      // This gives more control in the critical aiming range
      const powerFactor = distanceFactor * (1.0 + 0.2 * (1.0 - Math.min(1.0, distanceFactor)));
      verticalComponent = verticalDirection * powerFactor;
    }
    
    return verticalComponent;
  }
  
  // Draw trajectory guide for aiming
  drawTrajectoryGuide(birdPos, slingPos, aimDirection, aimPower, isAiming) {
    if (!isAiming || !birdPos || !slingPos || !aimDirection) return;
    
    const ctx = this.ctx;
    ctx.save();
    
    // Only draw if we have a meaningful direction
    if (Math.abs(aimDirection.x) < 0.001 && Math.abs(aimDirection.y) < 0.001) {
      ctx.restore();
      return;
    }
    
    // Calculate trajectory start point (bird position)
    const startX = birdPos.x;
    const startY = birdPos.y;
    
    // Calculate the slingshot Y-branch point (fork)
    const slingStemHeight = 3 * 0.6; // Height * 0.6 is the branch point
    const slingForkY = slingPos.y + slingStemHeight;
    
    // Calculate horizontal component (always reverse of aim direction)
    const launchDirX = -aimDirection.x;
    
    // Calculate vertical component using the shared helper function
    // This ensures the exact same calculation is used in physics and guide
    const launchDirY = this.calculateTrajectoryDirection(birdPos.y, slingForkY);
    
    // Create a local copy of these variables for normalization
    let normLaunchDirX = launchDirX;
    let normLaunchDirY = launchDirY;
    
    // Normalize the direction vector for consistent line length
    const magnitude = Math.sqrt(normLaunchDirX * normLaunchDirX + normLaunchDirY * normLaunchDirY);
    if (magnitude > 0) {
      normLaunchDirX /= magnitude;
      normLaunchDirY /= magnitude;
    }
    
    // Trajectory length based on power
    const lineLength = aimPower * 2;
    
    // Calculate end point using normalized direction
    const endX = startX + normLaunchDirX * lineLength;
    const endY = startY + normLaunchDirY * lineLength;
    
    // Calculate color based on power (white at minimum, red at maximum)
    const normalizedPower = Math.min(1.0, aimPower / 5.0); // 5.0 is the max power
    
    // Generate a color between white (min) and red (max)
    const r = 255; // Red always at max
    const g = Math.floor(255 * (1 - normalizedPower)); // Green decreases with power
    const b = Math.floor(255 * (1 - normalizedPower)); // Blue decreases with power
    const alpha = 0.7 + (normalizedPower * 0.2); // Slightly more opaque at max power
    
    // Create the color string
    const lineColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
    // Draw dotted line with power-based color
    ctx.beginPath();
    ctx.setLineDash([0.3, 0.3]); // Small dashes and gaps for dotted effect
    ctx.lineWidth = 0.15;
    ctx.strokeStyle = lineColor;
    
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw small circle at the end of trajectory guide with same color
    ctx.beginPath();
    ctx.arc(endX, endY, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
    
    ctx.restore();
  }
  
  // Main draw method called from game loop - does NOT use Box2D debug drawing
  Draw(worldId, gameState = {}) {
    try {
      const canvas = this.ctx.canvas;
      
      // Calculate and update FPS
      this.frameCount++;
      const now = performance.now();
      const elapsed = now - this.lastFpsUpdateTime;
      
      // Update FPS every 500ms
      if (elapsed >= 500) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastFpsUpdateTime = now;
      }
      
      // Clear the canvas completely
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Fill with background color
      this.ctx.fillStyle = this.colors.background;
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Display registered game objects on first render for debugging
      if (!this.hasLoggedEntityMapping) {
        this.hasLoggedEntityMapping = true;
      }
      
      // Render all game objects directly
      this.renderGameObjects(gameState);
      
      // Draw UI elements on top
      this.drawUI(gameState);
    } catch (error) {
      console.error("Error in Draw function:", error);
    }
  }
}