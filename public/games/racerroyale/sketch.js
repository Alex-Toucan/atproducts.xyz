var database, form, player,game, gameState = 0, playerCount = 0, playerDetails, distance=0

var car1, car2, car3, car4, carsArray, c1, c2, c3, c4, track, w1, wall, t1, teleporter, l1, laser, m1, mushroom

let xyz = 50

let c = 1

function preload(){
  c1 = loadImage("attachments/car1.png")
  c2 = loadImage("attachments/car2.png")
  c3 = loadImage("attachments/car3.png")
  c4 = loadImage("attachments/car4.png")
  track = loadImage("attachments/track.jpg")
  w1 = loadImage("attachments/slow.png")
  t1 = loadImage("attachments/teleporter.png")
  l1 = loadImage("attachments/laser.png")
  m1 = loadImage("attachments/mushroom.png")


}

function setup() {
  createCanvas(displayWidth-20,displayHeight-20);
  database = firebase.database()
  let added = false;
  Manager = new Manager();
    // Check for an available lobby with space for more players
    database.ref("lobbies").once("value").then((snapshot) => {
      const lobbies = snapshot.val();
      console.log("Current lobbies:", lobbies);  // Debugging line to see fetched lobbies
  
      // Loop through the lobbies to find an available one with space
      for (let lobbyID in lobbies) {
        let lobby = lobbies[lobbyID];
  
        // Check if the lobby has fewer than 4 players
        if (lobby.playCount < 4) {
          console.log(`Joining existing lobby: ${lobbyID}`);
          // Add player to this lobby
          database.ref(`lobbies/${lobbyID}/playCount`).set(lobby.playCount);
  
          // Create a new game instance with the existing lobby ID
          game = new Game(lobbyID);
          game.getState();
          game.start();
          added = true;
          break;  // Stop once we've added a player
        }
      }
  
      // If no lobby was found with space, create a new one
      if (!added) {
        console.log("No available lobby found, creating a new one.");
        newLob = Manager.createLobby();
        game = new Game(newLob.lobbyID);
        game.getState();
        game.start();
      }
    }).catch((error) => {
      console.error("Error fetching lobbies:", error);
    });

} 

function draw() {
  if(playerCount === 4){
    game.updateGameState(1)
  }
  if(gameState=== 1){
    clear()
    
      game.wait()
    
  }
 /* if(gameState === 2){
    game.updateGameState(2)
   game.end()
  }*/
  if(gameState === 2){
   // game.updateGameState(2)
    game.end();
  }

  setInterval(() => {
    // Loop through a list of all lobby IDs
    database.ref('lobbies').once('value', (snapshot) => {
        const lobbies = snapshot.val();
        for (let lobbyID in lobbies) {
            // Call the function to check and delete unused lobbies
            deleteUnusedLobbies(lobbyID);
        }
    });
}, 60000); // Check every minute (60000 ms)

}

// Function to check and delete unused lobbies
function deleteUnusedLobbies(lobbyID) {
  // You could check some conditions to determine if the lobby is unused
  // For example, if the gameState is 'finished' or if no players are in the lobby
  database.ref(`lobbies/${lobbyID}`).once("value", function(snapshot) {
      const lobbyData = snapshot.val();
      
      // Check if the lobby has no active players or if the game has finished
      if (lobbyData && lobbyData.gameState === 2) {
          // Delete the lobby if it's finished (gameState 2)
          database.ref(`lobbies/${lobbyID}`).remove()
              .then(() => {
                  console.log(`Lobby ${lobbyID} deleted successfully.`);
              })
              .catch(error => {
                  console.error(`Error deleting lobby ${lobbyID}:`, error);
              });
      }
  });
}
