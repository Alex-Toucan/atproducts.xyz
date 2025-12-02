class Lobby {
    constructor(id) {
        this.lobbyID = id;
        this.players = [];
        this.maxPlayers = 4;
        this.playCount = 0;
    }

    addPlayer(){
        this.count = this.count+1;
    }

    // Join an existing lobby
    joinLobby(playerName) {
        database.ref("lobbies").once("value", (snapshot) => {
            const lobbies = snapshot.val();
            let joined = false;

            // Check for available lobbies
            for (let id in lobbies) {
                if (lobbies[id].playerCount < lobbies[id].maxPlayers) {
                    this.lobbyID = id;
                    this.players = lobbies[id].players;
                    this.players.push(playerName);

                    // Update Firebase
                    database.ref("lobbies/" + id).update({
                        players: this.players,

                    });

                    joined = true;
                    break;
                }
            }

            // If no available lobbies, create a new one
            if (!joined) {
                this.createLobby();
                this.joinLobby(playerName);
            }
        });
    }

    // Listen for lobby updates
    listenForLobbyUpdates(callback) {
        database.ref("lobbies/" + this.lobbyID + "/players").on("value", (snapshot) => {
            this.players = snapshot.val() || [];
            callback(this.players);
        });
    }

    // Leave the lobby
    leaveLobby(playerName) {
        const index = this.players.indexOf(playerName);
        if (index > -1) {
            this.players.splice(index, 1);

            // Update Firebase
            database.ref("lobbies/" + this.lobbyID).update({
                players: this.players,
            });
        }
    }

    getLobbyID() {
        return this.lobbyID;
    }
}
