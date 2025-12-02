class Player{
    constructor(lobbyID){
        this.name = null;
        this.index = 0;
        this.distance = 0;
        this.carsAtEnd = 0;
        this.x = 0;
        this.place = 0;
        this.lobbyID = lobbyID;


    }
    getCount(){
        database.ref(`lobbies/${this.lobbyID}/playCount`).on("value",function(data){
            playerCount = data.val()

        })
    }
    update(){
        var details = `lobbies/${this.lobbyID}/players/player${this.index}`;
        database.ref(details).set({
            playerName: this.name,
            playerDistance: this.distance,
            playerX: this.x,
            place: this.place
        })
    }
    updateCount(count){
        database.ref(`lobbies/${this.lobbyID}/`).update({
            playCount: count
        })
    }
    static playerDetails(lobby){
        const path = `lobbies/${lobby}/players`;
        console.log("Fetching player details from path:", path);    
        database.ref(path).on("value",(data)=>{
            playerDetails = data.val()
            console.log("Player details received:", playerDetails);
            console.log("lobby used:", lobby);

        })
    }
    clearPlayerDetails(){
        database.ref(`lobbies/${this.lobbyID}/players`).set({
            playerDetails: []
        })
    }

    clearFinished(){
        const lobbyRef = database.ref(`lobbies/${this.lobbyID}/finished`);  // Reference to the specific lobby
  lobbyRef.remove()
    .then(() => {
      console.log("Lobby successfully deleted!");
      // Optionally, you can navigate the user to a new screen or reset the UI here
    })
    .catch((error) => {
      console.error("Error deleting lobby: ", error);
    });
    }


    static finished(x, y){
       // var details = 'finished/finish'+ this.finish
        database.ref(`lobbies/${y}/`).update({
            finished: x,
           // finishedPlayer: this.name
        })
    }
    readFinished(){
        database.ref(`lobbies/${this.lobbyID}/finished`).on("value",(data)=>{
            this.carsAtEnd = data.val();
        })
    }
}