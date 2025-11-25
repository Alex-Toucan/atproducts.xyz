/**
 * Entities module - Handles creation and management of game entities
 */
import { getIdFromBody, generateUniqueId } from './utils.js';

export class EntityManager {
  constructor(physics, worldId, renderer, worldDimensions) {
    this.physics = physics;
    this.worldId = worldId;
    this.renderer = renderer;
    this.worldDimensions = worldDimensions;
    
    // Entity tracking
    this.entities = {}; // Maps entityId -> { type, bodyId, properties }
    this.bodyToEntity = new Map(); // Maps bodyId -> entityId for fast lookups
    this.nextEntityId = 1; // For generating unique entity IDs
    
    // Tracked bodies for game mechanics
    this.trackedBodies = {
      birds: new Map(),  // Maps uniqueId -> { entityId, active }
      pigs: new Map(),   // Maps uniqueId -> { entityId, active }
      blocks: new Map(),  // Maps uniqueId -> { entityId, active }
      
      // Convenience method to get all tracked unique IDs
      getAllTrackedIds() {
        const allIds = [];
        this.birds.forEach((_, id) => allIds.push(id));
        this.pigs.forEach((_, id) => allIds.push(id));
        this.blocks.forEach((_, id) => allIds.push(id));
        return allIds;
      }
    };
  }
  
  // Create a new entity and get its ID
  createEntity(type, bodyId, properties = {}) {
    // Generate a unique ID for this entity
    const uniqueId = generateUniqueId();
    
    // Set the ID on the body's userData
    try {
      if (bodyId && typeof bodyId === 'object') {
        // Set userData with both id and type
        bodyId.userData = { id: uniqueId, type };
      }
    } catch (e) {
      console.error("Failed to set userData:", e);
    }
    
    // Store the entity in our entities map
    const entityId = this.nextEntityId++;
    this.entities[entityId] = {
      type,
      bodyId,
      uniqueId,
      properties
    };
    
    // Map the uniqueId to the entityId
    this.bodyToEntity.set(uniqueId, entityId);
    
    return entityId;
  }
  
  // Find entity by uniqueId
  findEntityByUniqueId(uniqueId) {
    if (!uniqueId) return null;
    
    // Get the entityId from the uniqueId
    const entityId = this.bodyToEntity.get(uniqueId);
    if (entityId) {
      const entity = this.entities[entityId];
      if (entity) {
        return { entityId, ...entity };
      }
    }
    
    return null;
  }
  
  // Get entity by its Box2D body ID
  getEntityByBodyId(bodyId) {
    // Get the ID from the userData - ONLY valid approach
    const id = getIdFromBody(bodyId);
    
    // If we have an ID, look up the entity
    if (id) {
      const entityId = this.bodyToEntity.get(id);
      if (entityId !== undefined) {
        const entity = this.entities[entityId];
        if (entity) {
          return { entityId, ...entity };
        }
      }
    }
    
    return null;
  }
  
  // Get entity by its entity ID
  getEntity(entityId) {
    return this.entities[entityId] || null;
  }
  
  // Get the Box2D body from uniqueId
  getBodyByUniqueId(uniqueId) {
    if (!uniqueId) return null;
    
    // Look up entity by uniqueId
    const entity = this.findEntityByUniqueId(uniqueId);
    if (entity && entity.bodyId) {
      return entity.bodyId;
    }
    
    // Try to find in tracked bodies
    const findInTracked = (map, mapName) => {
      const info = map.get(uniqueId);
      if (info && info.active) {
        const entity = this.entities[info.entityId];
        if (entity && entity.bodyId) {
          return entity.bodyId;
        }
      }
      return null;
    };
    
    // Try to find in birds, pigs, and blocks
    return findInTracked(this.trackedBodies.birds, 'birds') || 
           findInTracked(this.trackedBodies.pigs, 'pigs') || 
           findInTracked(this.trackedBodies.blocks, 'blocks');
  }
  
  // Remove entity
  removeEntity(entityId) {
    if (this.entities[entityId]) {
      delete this.entities[entityId];
      return true;
    }
    return false;
  }
  
  // Track a body with its entity ID
  trackBody(bodyId, type, entityId) {
    // Get the entity info
    const entity = this.getEntity(entityId);
    if (!entity) {
      console.error(`Cannot track body - entity ${entityId} not found`);
      return;
    }
    
    // Ensure we have a uniqueId
    const uniqueId = entity.uniqueId;
    if (!uniqueId) {
      console.error(`Cannot track body - entity ${entityId} has no uniqueId`);
      return;
    }
    
    // Create tracking info
    const trackInfo = {
      entityId,
      uniqueId,
      active: true
    };
    
    // Add to the appropriate collection using ONLY the unique ID
    if (type === 'bird') {
      this.trackedBodies.birds.set(uniqueId, trackInfo);
    } else if (type === 'pig') {
      this.trackedBodies.pigs.set(uniqueId, trackInfo);
    } else { // blocks or wood - all go in blocks collection
      this.trackedBodies.blocks.set(uniqueId, trackInfo);
    }
  }
  
  // Create ground
  createGround() {
    console.log("Creating new ground for physics world");
    
    const { 
      b2DefaultBodyDef, b2BodyType, b2CreateBody, 
      b2DefaultShapeDef, b2Segment, b2Vec2, b2CreateSegmentShape 
    } = this.physics;
    const worldLeft = this.worldDimensions.left;
    const worldRight = this.worldDimensions.right;
    const worldBottom = this.worldDimensions.bottom;
    const physicsWidth = this.worldDimensions.width;
    
    const bd_ground = new b2DefaultBodyDef();
    // Static bodies for ground
    bd_ground.type = b2BodyType.b2_staticBody;
    
    // Create ground body in the current physics world
    const groundId = b2CreateBody(this.worldId, bd_ground);
    
    const shapeDefSegment = new b2DefaultShapeDef();
    shapeDefSegment.density = 0.0; // Static
    shapeDefSegment.friction = 0.6;
    shapeDefSegment.restitution = 0.0; // No bounce for ground
    
    // Ground segments - positioned based on calculated ground level (bottom of canvas)
    // Create a wide ground that extends well beyond visible area
    {
      const segment = new b2Segment();
      segment.point1 = new b2Vec2(worldLeft * 2, worldBottom); // Extend past visible area
      segment.point2 = new b2Vec2(worldRight * 2, worldBottom); // Extend past visible area
      b2CreateSegmentShape(groundId, shapeDefSegment, segment);
    }
    
    // Create an entity for ground
    const groundX = 0; // Center horizontally
    const groundY = worldBottom;
    const properties = { 
      isGround: true, 
      width: physicsWidth * 4, 
      height: 0.1,
      x: groundX,
      y: groundY,
      angle: 0,
      vertices: [
        { x: worldLeft * 2, y: worldBottom },
        { x: worldRight * 2, y: worldBottom }
      ]
    };
    const entityId = this.createEntity('ground', groundId, properties);
    
    // Get the entity to access the uniqueId
    const entity = this.getEntity(entityId);
    
    // Register with renderer with correct position information
    this.renderer.registerGameObject(groundId, 'ground', {
      ...properties,
      uniqueId: entity.uniqueId,
      x: groundX,
      y: groundY
    });
    
    console.log("Ground created successfully with ID:", groundId);
    return groundId;
  }
  
  // Create a static wood block (for bases that shouldn't move)
  createStaticWoodBlock(x, y, width, height, angle = 0) {
    const { 
      b2DefaultBodyDef, b2BodyType, b2Vec2, b2CreateBody, 
      b2DefaultShapeDef, b2MakeBox, b2CreatePolygonShape 
    } = this.physics;
    
    const bd = new b2DefaultBodyDef();
    bd.type = b2BodyType.b2_staticBody; // Static body type
    bd.position = new b2Vec2(x, y);
    bd.angle = angle;
    
    const bodyId = b2CreateBody(this.worldId, bd);
    
    const shapeDef = new b2DefaultShapeDef();
    shapeDef.density = 0.0;      // Static density
    shapeDef.friction = 0.8;     // High friction
    shapeDef.restitution = 0.0;  // No bounce
    
    const box = b2MakeBox(width/2, height/2);
    b2CreatePolygonShape(bodyId, shapeDef, box);
    
    // Create an entity for this block
    const properties = { width, height, x, y, angle, isStatic: true };
    const entityId = this.createEntity('wood', bodyId, properties);
    
    // Get the entity to access the uniqueId
    const entity = this.getEntity(entityId);
    
    // Register with renderer using ONLY userData.id and including position
    this.renderer.registerGameObject(bodyId, 'wood', {
      ...properties,
      uniqueId: entity.uniqueId,
      x, y, angle
    });
    
    this.trackBody(bodyId, 'wood', entityId);
    
    return bodyId;
  }
  
  // Create a wood block
  createWoodBlock(x, y, width, height, angle = 0) {
    const { 
      b2DefaultBodyDef, b2BodyType, b2Vec2, b2CreateBody, 
      b2DefaultShapeDef, b2MakeBox, b2CreatePolygonShape 
    } = this.physics;
    
    const bd = new b2DefaultBodyDef();
    bd.type = b2BodyType.b2_dynamicBody;
    bd.position = new b2Vec2(x, y);
    bd.angle = angle;
    bd.linearDamping = 0.2;   // Add damping to reduce jittering
    bd.angularDamping = 0.4;  // Add angular damping to prevent rotation
    
    const bodyId = b2CreateBody(this.worldId, bd);
    
    const shapeDef = new b2DefaultShapeDef();
    shapeDef.density = 1.0;      // Moderate density
    shapeDef.friction = 0.6;     // Slightly higher friction for better stability
    shapeDef.restitution = 0.0;  // No bounce to prevent initial jittering
    
    // Use exact dimensions for physics to match rendering
    // No size adjustment needed
    
    const box = b2MakeBox(width/2, height/2);
    b2CreatePolygonShape(bodyId, shapeDef, box);
    
    // Create an entity for this block
    const properties = { width, height, x, y, angle };
    const entityId = this.createEntity('wood', bodyId, properties);
    
    // Get the entity to access the uniqueId
    const entity = this.getEntity(entityId);
    
    // Register with renderer using ONLY userData.id and including position
    this.renderer.registerGameObject(bodyId, 'wood', {
      ...properties,
      uniqueId: entity.uniqueId,
      x, y, angle
    });
    
    this.trackBody(bodyId, 'wood', entityId);
    
    return bodyId;
  }
  
  // Create a pig
  createPig(x, y, radius = 1.0) {
    const { 
      b2DefaultBodyDef, b2BodyType, b2Vec2, b2CreateBody, 
      b2DefaultShapeDef, b2Circle, b2CreateCircleShape
    } = this.physics;
    
    const bd = new b2DefaultBodyDef();
    bd.type = b2BodyType.b2_dynamicBody;
    bd.position = new b2Vec2(x, y);
    bd.fixedRotation = false; // Ensure rotation is enabled for rolling
    bd.linearDamping = 0.5;   // Higher linear damping to significantly reduce movement
    bd.angularDamping = 0.7;  // Higher angular damping to greatly slow down rotation
    
    const bodyId = b2CreateBody(this.worldId, bd);
    
    const shapeDef = new b2DefaultShapeDef();
    shapeDef.density = 1.0;      // Heavier to resist movement more
    shapeDef.friction = 0.8;     // Much higher friction to greatly reduce rolling
    shapeDef.restitution = 0.2;  // Even less bounce for pigs
    
    try {
      // Create a proper circle shape
      const circle = new b2Circle();
      circle.center.Set(0, 0); // Center relative to body position
      
      // Increase physics radius by 10% to better match visual size
      // This helps prevent visual overlap with wooden blocks
      circle.radius = radius * 1.1;
      
      // Create the circle shape
      b2CreateCircleShape(bodyId, shapeDef, circle);
      
      console.log("Created pig using circle shape");
    } catch (e) {
      console.error("Error creating pig with circle:", e);
    }
    
    // Create an entity for this pig with the circle radius and damage tracking
    // Add initial health and damage properties
    // Randomly choose a pupil color for variety
    const possiblePupilColors = [
      '#000000', // Black
      '#332211', // Dark Brown
      '#225533', // Green
      '#223355'  // Blue
    ];
    const randomPupilColor = possiblePupilColors[Math.floor(Math.random() * possiblePupilColors.length)];
    
    const properties = { 
      radius, 
      x, 
      y, 
      angle: 0,
      // Add health and damage tracking for cumulative damage system
      // Slightly increased health values (still easier to kill than original, but 20% stronger than last adjustment)
      maxHealth: 60, // Increased from 50 to 60 (20% more health)
      health: 60,
      damageLevel: 0, // 0-1 value representing damage percentage
      lastImpactTime: 0, // Track time of last impact
      lastImpactSpeed: 0, // Track speed of last impact
      // Assign a random pupil color for this pig
      pupilColor: randomPupilColor
    };
    
    const entityId = this.createEntity('pig', bodyId, properties);
    
    // Get the entity to access the uniqueId
    const entity = this.getEntity(entityId);
    
    // Register with renderer using ONLY userData.id
    // Also include health and damage properties for visual feedback
    this.renderer.registerGameObject(bodyId, 'pig', {
      ...properties,
      uniqueId: entity.uniqueId,
      x, y
    });
    
    this.trackBody(bodyId, 'pig', entityId);
    
    return bodyId;
  }
  
  // Create a bird
  createBird(x, y, radius = 0.5) {
    const { 
      b2DefaultBodyDef, b2BodyType, b2Vec2, b2CreateBody, 
      b2Body_SetBullet, b2DefaultShapeDef, b2Circle,
      b2CreateCircleShape
    } = this.physics;
    
    const bd = new b2DefaultBodyDef();
    bd.type = b2BodyType.b2_dynamicBody;
    bd.position = new b2Vec2(x, y);
    bd.bullet = true; // Enable continuous collision detection for fast-moving objects
    bd.fixedRotation = false; // Allow rotation for more realistic physics
    bd.linearDamping = 0.3;   // Add moderate linear damping to reduce excessive movement
    bd.angularDamping = 0.5;  // Add angular damping to limit excessive rotation
    
    // Create the Box2D body
    const bodyId = b2CreateBody(this.worldId, bd);
    
    // Explicitly enable bullet mode for continuous collision detection
    try {
      if (typeof b2Body_SetBullet === 'function') {
        b2Body_SetBullet(bodyId, true);
      }
    } catch (e) {
      console.error("Failed to enable bullet mode:", e);
    }
    
    // Create the shape
    const shapeDef = new b2DefaultShapeDef();
    shapeDef.density = 5.0;      // Heavy enough for impact but not too much
    shapeDef.friction = 0.6;     // Increased friction to reduce rolling
    shapeDef.restitution = 0.2;  // Small amount of bounce for better physics response
    
    try {
      // Create a proper circle shape
      const circle = new b2Circle();
      circle.center.Set(0, 0); // Center relative to body position
      circle.radius = radius;
      
      // Create the circle shape
      b2CreateCircleShape(bodyId, shapeDef, circle);
      
      console.log("Created bird using circle shape");
    } catch (e) {
      console.error("Error creating bird with circle:", e);
    }
    
    // Create an entity for this bird with the circle radius
    // This way it's still drawn as a circle even though physics uses boxes
    const properties = { radius, x, y, angle: 0 };
    const entityId = this.createEntity('bird', bodyId, properties);
    
    // Get the entity to access the uniqueId
    const entity = this.getEntity(entityId);
    
    // Register with renderer using ONLY userData.id
    this.renderer.registerGameObject(bodyId, 'bird', {
      ...properties,
      uniqueId: entity.uniqueId,
      x, y
    });
    
    this.trackBody(bodyId, 'bird', entityId);
    
    return bodyId;
  }
}