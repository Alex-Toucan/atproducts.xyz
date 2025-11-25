/**
 * Levels module - Handles level creation and structure
 */

// Create a level with birds, pigs, and blocks
export function createLevel(entityManager, worldDimensions, levelNumber = 1) {
  // Verify that we're starting with a clean slate (ground should be created first)
  console.log(`Creating level ${levelNumber} with a fresh start`);
  
  // Create ground - this is critical for each level reset
  const groundBody = entityManager.createGround();
  console.log(`Ground created for level ${levelNumber}`);
  
  // Get world dimensions
  const worldLeft = worldDimensions.left;
  const worldRight = worldDimensions.right;
  const worldBottom = worldDimensions.bottom;
  const worldWidth = worldDimensions.width;
  
  // Each level gets 3 birds
  console.log(`Setting birds remaining to 3 for level ${levelNumber}`);
  entityManager.birdsRemaining = 3;
  
  // Create standard slingshot position
  const slingshotX = worldLeft + (worldWidth * 0.15);
  const slingshotY = worldBottom;
  
  // Determine which level to create
  switch (levelNumber) {
    case 1:
      createLevel1(entityManager, worldDimensions);
      break;
    case 2:
      createLevel2(entityManager, worldDimensions);
      break;
    case 3:
      createLevel3(entityManager, worldDimensions);
      break;
    case 4:
      createLevel4(entityManager, worldDimensions);
      break;
    default:
      // Default to level 1 if invalid level number
      createLevel1(entityManager, worldDimensions);
  }
  
  // Return initial configuration
  return {
    slingshotPosition: { x: slingshotX, y: slingshotY },
    initialBirdPosition: { x: slingshotX, y: slingshotY + 2.5 },
    levelNumber: levelNumber
  };
}

// LEVEL 4 - Inverted pyramid with narrow base - FIXED STABILITY ISSUES
function createLevel4(entityManager, worldDimensions) {
  // Get world dimensions
  const worldLeft = worldDimensions.left;
  const worldRight = worldDimensions.right;
  const worldBottom = worldDimensions.bottom;
  const worldWidth = worldDimensions.width;
  
  // Create standard slingshot position
  const slingshotX = worldLeft + (worldWidth * 0.15);
  
  // Position for the inverted pyramid structure
  const pyramidX = slingshotX + 18;
  
  // Define standard sizes
  const cornerSize = 0.6; // Size of corner blocks
  const cornerHeight = 0.6; // Height of corner blocks
  
  // ======== BASE STRUCTURE - WIDER AND MORE STABLE ========
  // Make the base significantly wider for better initial stability
  const baseWidth = 5.0; // Increased from 3.5 to 5.0
  const baseHeight = 1.5;
  const baseY = worldBottom + (baseHeight/2); // Ensure base is exactly on ground level
  
  // Create a wider static base that provides more stability
  entityManager.createStaticWoodBlock(pyramidX, baseY, baseWidth, baseHeight); // Wider base
  
  // Create more spaced-out vertical supports
  const supportSpacing = 1.2; // Increased from 0.8 to 1.2 for better stability
  const supportHeight = 4;
  const supportY = baseY + (baseHeight/2) + (supportHeight/2); // Ensure supports sit exactly on the base
  
  // Supports with exact positioning to prevent shifting
  entityManager.createWoodBlock(pyramidX - supportSpacing, supportY, 0.7, supportHeight); // Left support - thicker
  entityManager.createWoodBlock(pyramidX + supportSpacing, supportY, 0.7, supportHeight); // Right support - thicker
  
  // Stronger cross-bracing to prevent leaning
  const bracingWidth = 3.0; // Increased from 2.2 to 3.0
  entityManager.createWoodBlock(pyramidX, baseY + baseHeight + 1.0, bracingWidth, 0.6); // Lower brace - thicker
  entityManager.createWoodBlock(pyramidX, baseY + baseHeight + 2.5, bracingWidth, 0.6); // Higher brace - thicker
  
  // ======== FIRST LEVEL ========
  // First level platform - precise positioning and support
  const level1Width = 7; // Good width for stability
  const level1Height = 1.2;
  const level1Y = supportY + (supportHeight/2) + (level1Height/2); // Exact positioning on supports
  
  // Create platform with exact positioning
  entityManager.createWoodBlock(pyramidX, level1Y, level1Width, level1Height);
  
  // More stable diagonal supports with corrected angles and rotations
  // Replace diagonal supports with vertical supports for better stability
  const level1SupportSpacing = 2.5;
  entityManager.createWoodBlock(pyramidX - level1SupportSpacing, level1Y - 1.5, 0.6, 1.5); // Left stabilizer
  entityManager.createWoodBlock(pyramidX + level1SupportSpacing, level1Y - 1.5, 0.6, 1.5); // Right stabilizer
  
  // ======== SECOND LEVEL ========
  // Second level - calculate height based on first level
  const level2Height = 1.3;
  const support2Height = 3;
  const support2Y = level1Y + (level1Height/2) + (support2Height/2); // Exact positioning
  
  // More evenly spaced supports for second level
  entityManager.createWoodBlock(pyramidX - 3, support2Y, 0.7, support2Height); // Far left - thicker
  entityManager.createWoodBlock(pyramidX, support2Y, 0.7, support2Height); // Center - thicker
  entityManager.createWoodBlock(pyramidX + 3, support2Y, 0.7, support2Height); // Far right - thicker
  
  // Second level platform with calculated position
  const level2Width = 10;
  const level2Y = support2Y + (support2Height/2) + (level2Height/2); // Exact positioning
  entityManager.createWoodBlock(pyramidX, level2Y, level2Width, level2Height);
  
  // Add cross bracing for second level supports
  entityManager.createWoodBlock(pyramidX - 1.5, support2Y, 2.5, 0.5); // Left brace
  entityManager.createWoodBlock(pyramidX + 1.5, support2Y, 2.5, 0.5); // Right brace
  
  // Position corner blocks to prevent pig from rolling
  entityManager.createWoodBlock(pyramidX - 1.0, level2Y + (level2Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left corner
  entityManager.createWoodBlock(pyramidX + 1.0, level2Y + (level2Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right corner
  
  // Add a pig in the middle of second level - positioned correctly
  entityManager.createPig(pyramidX, level2Y + (level2Height/2) + 1.0, 1.0);
  
  // ======== THIRD LEVEL ========
  // Third level - calculate position based on second level
  const level3Height = 1.3;
  const support3Height = 3;
  const support3Y = level2Y + (level2Height/2) + (support3Height/2); // Exact positioning
  
  // More evenly placed vertical supports for third level
  entityManager.createWoodBlock(pyramidX - 4, support3Y, 0.7, support3Height); // Far left
  entityManager.createWoodBlock(pyramidX - 1.3, support3Y, 0.7, support3Height); // Middle left
  entityManager.createWoodBlock(pyramidX + 1.3, support3Y, 0.7, support3Height); // Middle right
  entityManager.createWoodBlock(pyramidX + 4, support3Y, 0.7, support3Height); // Far right
  
  // Add cross-bracing for better stability
  entityManager.createWoodBlock(pyramidX - 2.65, support3Y, 2.5, 0.5); // Left horizontal brace
  entityManager.createWoodBlock(pyramidX + 2.65, support3Y, 2.5, 0.5); // Right horizontal brace
  
  // Third level platform with calculated position
  const level3Width = 13;
  const level3Y = support3Y + (support3Height/2) + (level3Height/2); // Exact positioning
  entityManager.createWoodBlock(pyramidX, level3Y, level3Width, level3Height);
  
  // Corner blocks for left pig with correct positioning
  entityManager.createWoodBlock(pyramidX - 3.8, level3Y + (level3Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left outer corner
  entityManager.createWoodBlock(pyramidX - 2.2, level3Y + (level3Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left inner corner
  
  // Corner blocks for right pig with correct positioning
  entityManager.createWoodBlock(pyramidX + 3.8, level3Y + (level3Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right outer corner
  entityManager.createWoodBlock(pyramidX + 2.2, level3Y + (level3Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right inner corner
  
  // Add pigs on third level - positioned correctly
  entityManager.createPig(pyramidX - 3, level3Y + (level3Height/2) + 1.0, 1.0); // Left pig
  entityManager.createPig(pyramidX + 3, level3Y + (level3Height/2) + 1.0, 1.0); // Right pig
  
  // ======== FOURTH LEVEL ========
  // Fourth level - calculate position based on third level
  const level4Height = 1.5;
  const support4Height = 3;
  const support4Y = level3Y + (level3Height/2) + (support4Height/2); // Exact positioning
  
  // Add vertical supports for fourth level with optimal spacing and placement
  entityManager.createWoodBlock(pyramidX - 6, support4Y, 0.8, support4Height); // Outer left - thicker
  entityManager.createWoodBlock(pyramidX - 3, support4Y, 0.8, support4Height); // Inner left - thicker
  entityManager.createWoodBlock(pyramidX, support4Y, 0.8, support4Height); // Center - thicker
  entityManager.createWoodBlock(pyramidX + 3, support4Y, 0.8, support4Height); // Inner right - thicker
  entityManager.createWoodBlock(pyramidX + 6, support4Y, 0.8, support4Height); // Outer right - thicker
  
  // Add cross-bracing for better support
  entityManager.createWoodBlock(pyramidX - 4.5, support4Y, 3, 0.6); // Left horizontal brace - thicker
  entityManager.createWoodBlock(pyramidX + 4.5, support4Y, 3, 0.6); // Right horizontal brace - thicker
  
  // Fourth level platform - calculated position
  const level4Width = 16;
  const level4Y = support4Y + (support4Height/2) + (level4Height/2); // Exact positioning
  entityManager.createWoodBlock(pyramidX, level4Y, level4Width, level4Height);
  
  // Corner blocks for left pig with correct positioning
  entityManager.createWoodBlock(pyramidX - 5.8, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left outer corner
  entityManager.createWoodBlock(pyramidX - 4.2, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left inner corner
  
  // Corner blocks for center pig with correct positioning
  entityManager.createWoodBlock(pyramidX - 0.8, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Center left corner
  entityManager.createWoodBlock(pyramidX + 0.8, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Center right corner
  
  // Corner blocks for right pig with correct positioning
  entityManager.createWoodBlock(pyramidX + 5.8, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right outer corner
  entityManager.createWoodBlock(pyramidX + 4.2, level4Y + (level4Height/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right inner corner
  
  // Add top blocks with better positioning and placement
  const topBlockHeight = 2;
  const topBlockY = level4Y + (level4Height/2) + (topBlockHeight/2);
  entityManager.createWoodBlock(pyramidX - 5, topBlockY, 1.8, topBlockHeight); // Left block
  entityManager.createWoodBlock(pyramidX, topBlockY, 1.8, topBlockHeight); // Center block
  entityManager.createWoodBlock(pyramidX + 5, topBlockY, 1.8, topBlockHeight); // Right block
  
  // Add pigs on fourth level - positioned correctly
  entityManager.createPig(pyramidX - 5, level4Y + (level4Height/2) + 1.0, 1.0); // Left pig
  entityManager.createPig(pyramidX, level4Y + (level4Height/2) + 1.0, 1.0); // Center pig
  entityManager.createPig(pyramidX + 5, level4Y + (level4Height/2) + 1.0, 1.0); // Right pig
  
  // ======== TOP CROWN ========
  // Define variables for top section
  const topSupportHeight = 4;
  const topSupportY = level4Y + (level4Height/2) + (topSupportHeight/2); // Exact position
  const topWidth = 6;
  const topHeight = 1.2;
  
  // Strategic supports for the very top - thicker and properly positioned
  entityManager.createWoodBlock(pyramidX - 2, topSupportY, 0.8, topSupportHeight); // Left support - thicker
  entityManager.createWoodBlock(pyramidX + 2, topSupportY, 0.8, topSupportHeight); // Right support - thicker
  
  // Add cross-bracing between top supports for stability
  entityManager.createWoodBlock(pyramidX, topSupportY - 1, 4.5, 0.6); // Lower brace
  entityManager.createWoodBlock(pyramidX, topSupportY + 1, 4.5, 0.6); // Upper brace
  
  // Top platform with calculated position
  const level5Y = topSupportY + (topSupportHeight/2) + (topHeight/2); // Exact positioning
  entityManager.createWoodBlock(pyramidX, level5Y, topWidth, topHeight);
  
  // Corner blocks for the final pig with correct positioning
  entityManager.createWoodBlock(pyramidX - 0.8, level5Y + (topHeight/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left corner
  entityManager.createWoodBlock(pyramidX + 0.8, level5Y + (topHeight/2) + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right corner
  
  // Final pig at the very top - positioned correctly
  entityManager.createPig(pyramidX, level5Y + (topHeight/2) + 1.0, 1.0);
}

// LEVEL 1 - Simple structure with fewer blocks and 2 pigs
function createLevel1(entityManager, worldDimensions) {
  const worldLeft = worldDimensions.left;
  const worldBottom = worldDimensions.bottom;
  const worldWidth = worldDimensions.width;
  
  // Create standard slingshot position
  const slingshotX = worldLeft + (worldWidth * 0.15);
  
  // Simple structure position
  const structureX = slingshotX + 15; // Position to the right of slingshot
  
  // ========= BASE AND SUPPORTS ==========
  // Bottom platform - solid ground base using static wood block
  const baseHeight = 1.5;
  const baseY = worldBottom + (baseHeight/2); // Position exactly at ground level
  entityManager.createStaticWoodBlock(structureX, baseY, 8, baseHeight);
  
  // Calculate exact positions for supports
  const supportWidth = 1; // Width of vertical supports
  const supportHeight = 4;
  const supportY = baseY + (baseHeight/2) + (supportHeight/2); // Position exactly on top of base
  
  // Precisely positioned vertical supports
  entityManager.createWoodBlock(structureX - 2, supportY, supportWidth, supportHeight);
  entityManager.createWoodBlock(structureX + 2, supportY, supportWidth, supportHeight);
  
  // ========= TOP PLATFORM ==========
  // Top platform - positioned exactly on supports, widened to accommodate both pigs with corner blocks
  const platformHeight = 1.5;
  const platformY = supportY + (supportHeight/2) + (platformHeight/2); // Position exactly on top of supports
  entityManager.createWoodBlock(structureX, platformY, 7, platformHeight); // Increased width from 5 to 7
  
  // ========= CORNER BLOCKS & PIGS ==========
  // Create corner blocks to prevent pigs from rolling off
  const cornerBlockSize = 0.6; // Size of corner blocks
  const cornerBlockHeight = 0.6; // Height of corner blocks
  const pigRadius = 1.0; // Radius of pigs
  
  // Calculate positions for the first pig area - moved further left
  const pig1X = structureX - 2; // X position of first pig (moved further left)
  const pigY = platformY + (platformHeight/2) + pigRadius; // Position pigs directly on the platform
  
  // Corner blocks for first pig - only left and right blocks
  entityManager.createWoodBlock(pig1X - 1.0, platformY + (platformHeight/2) + (cornerBlockHeight/2), 
                               cornerBlockSize, cornerBlockHeight); // Left corner
  entityManager.createWoodBlock(pig1X + 1.0, platformY + (platformHeight/2) + (cornerBlockHeight/2), 
                               cornerBlockSize, cornerBlockHeight); // Right corner
  
  // Calculate positions for the second pig area - moved further right
  const pig2X = structureX + 2; // X position of second pig
  
  // Corner blocks for second pig - only left and right blocks
  entityManager.createWoodBlock(pig2X - 1.0, platformY + (platformHeight/2) + (cornerBlockHeight/2), 
                               cornerBlockSize, cornerBlockHeight); // Left corner
  entityManager.createWoodBlock(pig2X + 1.0, platformY + (platformHeight/2) + (cornerBlockHeight/2), 
                               cornerBlockSize, cornerBlockHeight); // Right corner
  
  // Position pigs between the corner blocks
  entityManager.createPig(pig1X, pigY, pigRadius); // First pig
  entityManager.createPig(pig2X, pigY, pigRadius); // Second pig
}

// LEVEL 2 - More complex structure with more blocks and 3 pigs
function createLevel2(entityManager, worldDimensions) {
  // Get world dimensions
  const worldLeft = worldDimensions.left;
  const worldRight = worldDimensions.right;
  const worldBottom = worldDimensions.bottom;
  const worldWidth = worldDimensions.width;
  
  // Create standard slingshot position
  const slingshotX = worldLeft + (worldWidth * 0.15);
  
  // First structure - simple stack
  // Bottom row - horizontal blocks
  const structure1X = slingshotX + 15; // Position to the right of slingshot
  
  // Create initial blocks
  // Bottom row - wider foundation using static block to prevent bounce
  entityManager.createStaticWoodBlock(structure1X, worldBottom + 0.75, 10, 1.5);
  
  // Second row - three vertical supports for better stability with exactly matching width
  // Spacing carefully calculated to prevent overlap and instability
  entityManager.createWoodBlock(structure1X - 3, worldBottom + 3, 0.8, 4);
  entityManager.createWoodBlock(structure1X, worldBottom + 3, 0.8, 4);
  entityManager.createWoodBlock(structure1X + 3, worldBottom + 3, 0.8, 4);
  
  // Horizontal platform resting on the supports - made narrower to match supports better
  entityManager.createWoodBlock(structure1X, worldBottom + 5.5, 7.8, 1.5);
  
  // Corner blocks to prevent the pig from rolling off - positioned on the platform
  const cornerSize = 0.6;
  const cornerHeight = 0.6;
  const pigY = worldBottom + 7.0; // Position directly on the platform
  
  // Add corner blocks on the left and right sides to prevent rolling
  entityManager.createWoodBlock(structure1X - 1.5, worldBottom + 6.3, cornerSize, cornerHeight); // Left block
  entityManager.createWoodBlock(structure1X + 1.5, worldBottom + 6.3, cornerSize, cornerHeight); // Right block
  
  // Place a pig in the center of the corner blocks
  entityManager.createPig(structure1X, pigY, 1.0);
  
  // Small protective walls on the middle level - slightly reduce width
  entityManager.createWoodBlock(structure1X - 2, worldBottom + 8, 0.9, 2);
  entityManager.createWoodBlock(structure1X + 2, worldBottom + 8, 0.9, 2);
  
  // Second structure - tower on the right
  const structure2X = structure1X + 12;
  
  // Bottom platform - wider for stability using static block to prevent bounce
  entityManager.createStaticWoodBlock(structure2X, worldBottom + 0.75, 8, 1.5);
  
  // Ground level supports - ensure precise spacing with smaller width
  entityManager.createWoodBlock(structure2X - 3, worldBottom + 3, 0.8, 4);
  entityManager.createWoodBlock(structure2X, worldBottom + 3, 0.8, 4);
  entityManager.createWoodBlock(structure2X + 3, worldBottom + 3, 0.8, 4);
  
  // Middle platform - made narrower to match supports exactly
  entityManager.createWoodBlock(structure2X, worldBottom + 5.5, 7, 1.5);
  
  // Corner blocks to prevent the pig from rolling off - positioned on the platform
  // Add corner blocks on the left and right sides to prevent rolling
  entityManager.createWoodBlock(structure2X - 1.5, worldBottom + 6.3, cornerSize, cornerHeight); // Left block
  entityManager.createWoodBlock(structure2X + 1.5, worldBottom + 6.3, cornerSize, cornerHeight); // Right block
  
  // Place a pig in the center of the corner blocks
  entityManager.createPig(structure2X, worldBottom + 7.0, 1.0);
  
  // Middle level supports
  entityManager.createWoodBlock(structure2X - 2, worldBottom + 8, 0.9, 4);
  entityManager.createWoodBlock(structure2X + 2, worldBottom + 8, 0.9, 4);
  
  // Top platform - smaller than middle for pyramid stability
  entityManager.createWoodBlock(structure2X, worldBottom + 10.5, 5, 1.5);
  
  // Corner blocks to prevent the top pig from rolling off
  entityManager.createWoodBlock(structure2X - 1.2, worldBottom + 11.3, cornerSize, cornerHeight); // Left block
  entityManager.createWoodBlock(structure2X + 1.2, worldBottom + 11.3, cornerSize, cornerHeight); // Right block
  
  // Top pig - positioned between the corner blocks
  entityManager.createPig(structure2X, worldBottom + 12.0, 1.0);
}

// LEVEL 3 - Better structured top-heavy tower that's challenging but stable
function createLevel3(entityManager, worldDimensions) {
  // Get world dimensions
  const worldLeft = worldDimensions.left;
  const worldRight = worldDimensions.right;
  const worldBottom = worldDimensions.bottom;
  const worldWidth = worldDimensions.width;
  
  // Create standard slingshot position
  const slingshotX = worldLeft + (worldWidth * 0.15);
  
  // Position for the tower structure
  const towerX = slingshotX + 18; // Position to the right of slingshot
  
  // ========= MAIN TOWER ==========
  // Calculate exact dimensions for each component
  const baseHeight = 1.5;
  const baseWidth = 6;
  const supportWidth = 0.8;
  const supportHeight = 4;
  const platform1Height = 1.2;
  const platform1Width = 5;
  const middleSupportWidth = 0.8;
  const middleSupportHeight = 3.5;
  const platform2Height = 1.2;
  const platform2Width = 6;
  const topSupportWidth = 0.8;
  const topSupportHeight = 3;
  const platform3Height = 1.2;
  const platform3Width = 4;
  const pigRadius = 1.0;
  
  // ========= BASE LEVEL ==========
  // Solid base for the tower - use static block to prevent bounce
  const baseY = worldBottom + (baseHeight/2);
  entityManager.createStaticWoodBlock(towerX, baseY, baseWidth, baseHeight);
  
  // ========= FIRST LEVEL SUPPORTS ==========
  // Calculate exact position for supports
  const supportY = baseY + (baseHeight/2) + (supportHeight/2);
  
  // First level supports with exact width and positioning
  entityManager.createWoodBlock(towerX - 2, supportY, supportWidth, supportHeight); // Left support
  entityManager.createWoodBlock(towerX, supportY, supportWidth, supportHeight); // Center support
  entityManager.createWoodBlock(towerX + 2, supportY, supportWidth, supportHeight); // Right support
  
  // ========= FIRST PLATFORM ==========
  // Precise positioning for first platform
  const platform1Y = supportY + (supportHeight/2) + (platform1Height/2);
  entityManager.createWoodBlock(towerX, platform1Y, platform1Width, platform1Height);
  
  // ========= MIDDLE LEVEL SUPPORTS ==========
  // Precise positioning for middle level supports
  const middleSupportY = platform1Y + (platform1Height/2) + (middleSupportHeight/2);
  entityManager.createWoodBlock(towerX - 1.5, middleSupportY, middleSupportWidth, middleSupportHeight); // Left side
  entityManager.createWoodBlock(towerX + 1.5, middleSupportY, middleSupportWidth, middleSupportHeight); // Right side
  
  // ========= MIDDLE PLATFORM ==========
  // Precise positioning for middle platform
  const platform2Y = middleSupportY + (middleSupportHeight/2) + (platform2Height/2);
  entityManager.createWoodBlock(towerX, platform2Y, platform2Width, platform2Height);
  
  // ========= MIDDLE PIG CORNER BLOCKS ==========
  // Corner blocks to prevent middle pig from rolling off
  const cornerSize = 0.6; // Size of corner blocks
  const cornerHeight = 0.6; // Height of corner blocks
  
  // Position corner blocks on left and right sides
  entityManager.createWoodBlock(towerX - 1.3, platform2Y + (platform2Height/2) + (cornerHeight/2), 
                                cornerSize, cornerHeight); // Left corner
  entityManager.createWoodBlock(towerX + 1.3, platform2Y + (platform2Height/2) + (cornerHeight/2), 
                                cornerSize, cornerHeight); // Right corner
  
  // Position middle pig directly on the platform, surrounded by corner blocks
  const middlePigY = platform2Y + (platform2Height/2) + pigRadius;
  entityManager.createPig(towerX, middlePigY, pigRadius);
  
  // ========= TOP LEVEL SUPPORTS ==========
  // Precise positioning for top level supports - add more supports for the wider platform
  const topSupportY = platform2Y + (platform2Height/2) + (topSupportHeight/2);
  entityManager.createWoodBlock(towerX - 2.3, topSupportY, topSupportWidth, topSupportHeight); // Far left support
  entityManager.createWoodBlock(towerX - 0.7, topSupportY, topSupportWidth, topSupportHeight); // Left center support
  entityManager.createWoodBlock(towerX + 0.7, topSupportY, topSupportWidth, topSupportHeight); // Right center support
  entityManager.createWoodBlock(towerX + 2.3, topSupportY, topSupportWidth, topSupportHeight); // Far right support
  
  // ========= TOP PLATFORM ==========
  // Precise positioning for top platform - make it wider to accommodate both pigs
  const platform3Y = topSupportY + (topSupportHeight/2) + (platform3Height/2);
  entityManager.createWoodBlock(towerX, platform3Y, 7, platform3Height); // Increased width from 4 to 7
  
  // ========= TOP PIG CORNER BLOCKS ==========
  // Corner blocks for the left pig - only left and right, with wider spacing
  entityManager.createWoodBlock(towerX - 2.2, platform3Y + (platform3Height/2) + (cornerHeight/2), 
                               cornerSize, cornerHeight); // Left outer corner
  entityManager.createWoodBlock(towerX - 0.8, platform3Y + (platform3Height/2) + (cornerHeight/2), 
                               cornerSize, cornerHeight); // Left inner corner
  
  // Corner blocks for the right pig - only left and right, with wider spacing
  entityManager.createWoodBlock(towerX + 2.2, platform3Y + (platform3Height/2) + (cornerHeight/2), 
                               cornerSize, cornerHeight); // Right outer corner
  entityManager.createWoodBlock(towerX + 0.8, platform3Y + (platform3Height/2) + (cornerHeight/2), 
                               cornerSize, cornerHeight); // Right inner corner
  
  // Position top pigs directly on the platform, surrounded by corner blocks
  const topPigY = platform3Y + (platform3Height/2) + pigRadius;
  entityManager.createPig(towerX - 1.5, topPigY, pigRadius); // Left pig - moved further left
  entityManager.createPig(towerX + 1.5, topPigY, pigRadius); // Right pig - moved further right
  
  // ========= SIDE STRUCTURE ==========
  // Small structure on side with proper spacing
  const smallStructureX = towerX + 8;
  
  // Static base for side structure
  entityManager.createStaticWoodBlock(smallStructureX, baseY, 3, baseHeight);
  
  // Support with exact positioning
  const sideStructureSupportY = baseY + (baseHeight/2) + 2;
  entityManager.createWoodBlock(smallStructureX, sideStructureSupportY, 0.8, 4);
  
  // Platform with exact positioning
  const sideStructurePlatformY = sideStructureSupportY + 2 + 0.6;
  entityManager.createWoodBlock(smallStructureX, sideStructurePlatformY, 3, 1.2);
  
  // Corner blocks for side pig - only left and right
  entityManager.createWoodBlock(smallStructureX - 0.8, sideStructurePlatformY + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Left corner
  entityManager.createWoodBlock(smallStructureX + 0.8, sideStructurePlatformY + (cornerHeight/2), 
                              cornerSize, cornerHeight); // Right corner
  
  // Position pig precisely between the corner blocks
  const sidePigY = sideStructurePlatformY + pigRadius;
  entityManager.createPig(smallStructureX, sidePigY, pigRadius);
}