class Manager{
    constructor(){
        this.arr = new Array();

    }

    createLobby() {
        var lob = Math.floor(Math.random() * 10000000);
        this.arr.push(new Lobby(lob));
        database.ref("lobbies/" + lob).update({
            maxPlayers: 4,
            gameState: 0,
            finished: 0,
            playCount: 0,
        });

        return this.arr[this.arr.length-1];
    }
    
    getLobbies(){
        return this.arr;
    }

}