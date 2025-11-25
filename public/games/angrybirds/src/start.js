/**
 * Main entry point for the Angry Tirds game
 */
import { setupPhysics } from './physics.js';
import { EntityManager } from './entities.js';
import { GameController } from './gameController.js';
import { createLevel } from './levels.js';
import GameRenderer from './gameRenderer.js';

function start(Box2DFactory) {
  Box2DFactory().then((box2d) => {
    // Get canvas and setup context
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    // Set physics scale based on canvas dimensions
    const physicsHeight = 30; // World is 30 meters high
    const pixelsPerMeter = canvas.height / physicsHeight;
    
    // Calculate world dimensions based on aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    const physicsWidth = physicsHeight * aspectRatio;
    const worldLeft = -physicsWidth / 2;
    const worldRight = physicsWidth / 2;
    const worldBottom = -physicsHeight / 2;
    const worldTop = physicsHeight / 2;
    
    // Put ground exactly at the bottom of the canvas
    const groundY = worldBottom;
    
    // World dimensions for consistent reference
    const worldDimensions = { 
      width: physicsWidth, 
      height: physicsHeight,
      left: worldLeft,
      right: worldRight,
      top: worldTop,
      bottom: worldBottom,
      groundY: groundY
    };
    
    // Initialize physics
    const physics = setupPhysics(box2d);
    const { worldId, taskSystem } = physics.setupWorld();
    
    // Initialize renderer
    const renderer = new GameRenderer(box2d, ctx, pixelsPerMeter, false);
    
    // Initialize entity manager
    const entityManager = new EntityManager(physics, worldId, renderer, worldDimensions);
    
    // Initialize game controller
    const gameController = new GameController(physics, entityManager, renderer, worldDimensions);
    
    // Start with level 1
    const levelConfig = createLevel(entityManager, worldDimensions, 1);
    
    // Update game state with level configuration
    gameController.state.slingPosition = levelConfig.slingshotPosition;
    gameController.state.birdPosition = levelConfig.initialBirdPosition;
    gameController.state.currentLevel = 1; // Explicitly set to level 1
    
    // Prepare first bird
    gameController.prepareBird();
    
    // Game loop
    let lastTimestamp = 0;
    function gameLoop(timestamp) {
      // Calculate time delta
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
      lastTimestamp = timestamp;
      
      // Pass deltaTime to handleInput for frame-rate independent movement
      gameController.handleInput(deltaTime);
      
      // Get current worldId (may change when levels change)
      const currentWorldId = entityManager.worldId;
      const currentTaskSystem = physics.taskSystem;
      
      // Step physics - use 4 substeps for smoother, faster animation
      physics.stepWorld(currentWorldId, deltaTime, 4);
      
      // Clean up task system
      if (currentTaskSystem) {
        currentTaskSystem.ClearTasks();
      }
      
      // Update game objects
      updateGameObjects();
      
      // Clean up physics objects
      gameController.cleanupBodies();
      
      // Render with current worldId
      renderer.Draw(currentWorldId, gameController.state);
      
      // Loop
      requestAnimationFrame(gameLoop);
    }
    
    // Update game objects from physics bodies
    function updateGameObjects() {
      const { b2Body_GetPosition, b2Body_GetAngle } = physics;
      const trackedBodies = entityManager.trackedBodies;
      
      // Update active entities
      for (const [uniqueId, birdInfo] of trackedBodies.birds.entries()) {
        if (!birdInfo.active) continue;
        updateEntityPosition(uniqueId, birdInfo);
      }
      
      for (const [uniqueId, pigInfo] of trackedBodies.pigs.entries()) {
        updateEntityPosition(uniqueId, pigInfo);
      }
      
      for (const [uniqueId, blockInfo] of trackedBodies.blocks.entries()) {
        if (!blockInfo.active) continue;
        updateEntityPosition(uniqueId, blockInfo);
      }
      
      // Helper to update entity positions
      function updateEntityPosition(uniqueId, info) {
        try {
          if (!info || !info.entityId) return;
          
          const entity = entityManager.getEntity(info.entityId);
          if (!entity || !entity.bodyId) return;
          
          const bodyId = entity.bodyId;
          const pos = b2Body_GetPosition(bodyId);
          let angle = 0;
          
          try {
            angle = b2Body_GetAngle(bodyId);
          } catch (e) {
            // Fallback if GetAngle fails
            if (physics.b2Body_GetRotation) {
              const rotation = physics.b2Body_GetRotation(bodyId);
              if (rotation) {
                angle = Math.atan2(rotation.s, rotation.c);
              }
            }
          }
          
          // Create new position object to ensure change detection
          const newPos = { x: pos.x, y: pos.y };
          renderer.updateGameObject(uniqueId, newPos, angle);
        } catch (e) {
          console.error("Error updating entity position:", e);
        }
      }
    }
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
  });
}

// Export the start function
export { start };