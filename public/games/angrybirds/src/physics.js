/**
 * Physics module - Handles Box2D physics functionality
 */

// Helper function to extract Box2D functions from the module
export function setupPhysics(box2d) {
  // Debug the Box2D module
  console.log('PHYSICS DEBUG - Inspecting Box2D module:');
  console.log('Box2D module type:', typeof box2d);
  
  // List all methods related to circles for debugging
  const circleMethods = Object.keys(box2d).filter(key => 
    key.toLowerCase().includes('circle')
  );
  console.log('Circle related methods:', circleMethods);
  
  // Extract needed Box2D functions
  const {
    b2DefaultWorldDef,
    b2CreateWorld,
    b2CreateBody,
    b2CreatePolygonShape,
    b2CreateCircleShape,
    b2CreateSegmentShape,
    b2World_Step,
    b2MakeBox,
    b2DefaultBodyDef,
    b2DefaultShapeDef,
    b2BodyType,
    b2Segment,
    b2Vec2,
    b2Rot,
    TaskSystem,
    b2CreateThreadedWorld,
    b2World_GetProfile,
    b2World_GetBodyList,
    b2Body_GetPosition,
    b2Body_GetAngle,
    b2Body_GetRotation,
    b2Body_GetLinearVelocity,
    b2Body_ApplyLinearImpulse,
    b2Body_SetTransform,
    b2Body_GetType,
    b2Body_GetNext,
    b2DestroyBody,
    b2Body_GetUserData,
    b2Body_SetUserData,
    b2MakeCircle,
    b2Body_SetBullet,
    b2World_SetContinuousPhysics,
    b2Body_GetTransform,
    b2Circle
  } = box2d;
  
  // Debug the extracted functions
  console.log('PHYSICS DEBUG - Extracted functions:');
  console.log('- b2CreateCircleShape type:', typeof b2CreateCircleShape);
  console.log('- b2MakeCircle type:', typeof b2MakeCircle);
  
  // Show all function names to help identify circle-related functions we might have missed
  const allBox2dFunctions = Object.keys(box2d).filter(key => typeof box2d[key] === 'function');
  console.log('All box2d functions:', allBox2dFunctions);
  globalThis.box2d = box2d;

  // Global task system to reuse across worlds - declared outside the function
  let globalTaskSystem = null;
  
  // Setup world
  const setupWorld = () => {
    const worldDef = b2DefaultWorldDef();
    worldDef.gravity.Set(0, -10); // Earth-like gravity
    
    // Set global physics settings for better collision detection
    if (worldDef.velocityIterations !== undefined) {
      worldDef.velocityIterations = 6; // Use default for performance
    }
    if (worldDef.positionIterations !== undefined) {
      worldDef.positionIterations = 3; // Use default for performance
    }
    
    // Create or reuse task system
    let worldId, taskSystem;
    
    // Reuse global task system if available, otherwise create a new one
    if (globalTaskSystem) {
      taskSystem = globalTaskSystem;
      console.log("Reusing existing task system");
    } else if (navigator.hardwareConcurrency > 1) {
      // Only create one task system for the entire session
      taskSystem = new TaskSystem(navigator.hardwareConcurrency);
      globalTaskSystem = taskSystem; // Store globally
      console.log("Created new task system");
    }
    
    // Create world - use threaded if task system exists, otherwise use single-threaded
    if (taskSystem) {
      worldId = b2CreateThreadedWorld(worldDef, taskSystem);
      console.log("Created threaded world");
    } else {
      worldId = b2CreateWorld(worldDef);
      console.log("Created single-threaded world");
    }
    
    // Enable continuous physics for the world if function is available
    const enableContinuousPhysics = typeof b2World_SetContinuousPhysics === 'function';
    if (enableContinuousPhysics) {
      try {
        b2World_SetContinuousPhysics(worldId, true);
        console.log("Enabled continuous physics for the world");
      } catch (e) {
        console.error("Failed to enable continuous physics:", e);
      }
    }
    
    return { worldId, taskSystem };
  };

  // Step the physics simulation
  const stepWorld = (worldId, deltaTime, subSteps = 4) => {
    // Use a fixed timestep for consistent physics at any framerate
    const fixedTimeStep = 1/60; // 60fps fixed step
    // Don't cap the deltaTime, allow physics to "catch up" if frames are slow
    
    for (let i = 0; i < subSteps; i++) {
      // The third parameter combines velocity and position iterations
      // Use 10 iterations for better accuracy and speed
      b2World_Step(worldId, fixedTimeStep / subSteps, 10);
    }
  };

  // Destroy current world and create a new one
  const recreateWorld = (oldWorldId, oldTaskSystem) => {
    try {
      // Clean up old world if it exists
      if (oldWorldId && typeof b2DestroyWorld === 'function') {
        console.log("Destroying old physics world");
        try {
          b2DestroyWorld(oldWorldId);
        } catch (e) {
          console.error("Error destroying world:", e);
        }
      }
      
      // Instead of creating a new task system, reuse the existing one if possible
      let taskSystem = oldTaskSystem;
      
      // Clean up task system if it exists
      if (taskSystem) {
        try {
          taskSystem.ClearTasks();
          console.log("Cleared tasks in existing task system");
        } catch (e) {
          console.error("Error clearing tasks:", e);
          taskSystem = null; // Force creating a new one if clearing fails
        }
      }
      
      // Create a fresh new world with either the existing task system or a new one
      console.log("Creating new physics world");
      const worldDef = b2DefaultWorldDef();
      worldDef.gravity.Set(0, -10); // Earth-like gravity
      
      // Set physics settings
      if (worldDef.velocityIterations !== undefined) {
        worldDef.velocityIterations = 6;
      }
      if (worldDef.positionIterations !== undefined) {
        worldDef.positionIterations = 3;
      }
      
      // Create world - reuse task system or use a single-threaded approach to avoid thread pool exhaustion
      let worldId;
      if (taskSystem) {
        // Reuse existing task system
        worldId = b2CreateThreadedWorld(worldDef, taskSystem);
        console.log("Created new threaded world with existing task system");
      } else {
        // Use single-threaded approach
        worldId = b2CreateWorld(worldDef);
        console.log("Created new single-threaded world");
      }
      
      // Enable continuous physics
      const enableContinuousPhysics = typeof b2World_SetContinuousPhysics === 'function';
      if (enableContinuousPhysics) {
        try {
          b2World_SetContinuousPhysics(worldId, true);
          console.log("Enabled continuous physics for the world");
        } catch (e) {
          console.error("Failed to enable continuous physics:", e);
        }
      }
      
      return { worldId, taskSystem };
    } catch (e) {
      console.error("Error recreating world:", e);
      // Create a single-threaded world as fallback
      const worldDef = b2DefaultWorldDef();
      worldDef.gravity.Set(0, -10);
      const worldId = b2CreateWorld(worldDef);
      console.log("Created fallback single-threaded world");
      return { worldId, taskSystem: null };
    }
  };

  // Return all functions and objects needed for physics
  return {
    setupWorld,
    recreateWorld, // Add the new recreateWorld function
    stepWorld,
    b2DefaultWorldDef,
    b2CreateWorld,
    b2CreateBody,
    b2CreatePolygonShape,
    b2CreateCircleShape,
    b2CreateSegmentShape,
    b2World_Step,
    b2MakeBox,
    b2DefaultBodyDef,
    b2DefaultShapeDef,
    b2BodyType,
    b2Segment,
    b2Vec2,
    b2Rot,
    TaskSystem,
    b2CreateThreadedWorld,
    b2World_GetProfile,
    b2World_GetBodyList,
    b2Body_GetPosition,
    b2Body_GetAngle,
    b2Body_GetRotation,
    b2Body_GetLinearVelocity,
    b2Body_ApplyLinearImpulse,
    b2Body_SetTransform,
    b2Body_GetType,
    b2Body_GetNext,
    b2DestroyBody,
    b2Body_GetUserData,
    b2Body_SetUserData,
    b2MakeCircle,
    b2Body_SetBullet,
    b2World_SetContinuousPhysics,
    b2Body_GetTransform,
    b2Circle
  };
}