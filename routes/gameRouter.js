const express = require("express");
const logger = require("morgan");
const router = express.Router();
const uuidv4 = require("uuid").v4;

let games = [
    {
    id: "adowb1b3bb",
    game: "League of Legends",
    description: "League of Legends is a team-based game with over 140 champions to make epic plays with."
    },
    {
    id: "kd7b9ks2nda",
    game: "PlayerUnknown's Battlegrounds",
    description: "PLAYERUNKNOWN'S BATTLEGROUNDS is a last-man-standing shooter being developed with community feedback."
    }
];

// d. Make a GET "/get-all-games" route that responds with the array of the dummy data.

router.get("/get-all-games", (req, res) => {
    res.json({ games });
})

// e. Make a GET "/get-game-by-id" route that takes in a params then responds with game object info(game, id and description). If the ID is not found, then respond with "The game with the id does not exist, please check id"

router.get("/get-game-by-id/:id", (req, res) => {
    const id = req.params.id;
    let gameFound;

    games.forEach((game) => {
        if(game.id === id) {
            gameFound = game;
        }
    });

    if(!gameFound) {
        res.json({ data: "The game with the id does not exist, please check id" });
    } else {
        res.json({ data: gameFound })
    };
});

// f. Make a POST "/create-new-game" route that POST a new game (using req.body) and it's description. Don't forget to give it an id using uuid!. If any of the fields are empty, should respond with "cannot leave text area blank". Else should respond back with the whole games array with the new game. This should also check if there's a game that already has the same name, if the game already exists should respond with "Game already exists, cannot add game"

router.post("/create-new-game", (req, res) => {
    let newGame = {
        id: uuidv4(),
        game: req.body.game,
        description: req.body.description,
    };

    let gameFound;

    games.forEach((game) => {
        if(game.game === newGame.game) {
            gameFound = true;
        }
    });

    if(gameFound) {
        res.json({data: "Game already exists, cannot add game"});
    } else if(newGame.game === undefined || newGame.description === undefined) {
        res.json({data: "cannot leave text area blank"})
    } else {
        games.push(newGame);
        res.json({ data: games });
    };
});

// g. Make PUT "/update-game" route that takes in the id in the params. If there's no game with the id, respond with "game not found, cannot update". Then should check if game or description is in the req.body. If either or both are in the body, update them. Should not be able to update empty values. \*\*\* Using ID to find the game. Do not update ID. Can only change game and/or description.

router.put("/update-game/:id", (req, res) => {
    // 1. initialize a variable that is set to req.params.id;
    const gameID = req.params.id;

    // 2. Initialize a canUpdate variable and set to FALSE so that we can later change to true and work off that if game exists
    let canUpdate = false;
    // 3. Now initialize a foundGame variable and set to empty, if a game is found, we will set  foundGame to that game
    let foundGame;

    // Note: loop to check if the game even exists
    // if the game exists, we need to do two things:
        // Change canUpdate to true;
        // set foundGame to the game that it matches;
    games.forEach((game) => {
        if (gameID === game.id) {
            canUpdate = true;
            foundGame = game;
        }
    });

    //Note: hand if the game can be updated or not first handle errors first
    if(!canUpdate) {
        res.json({ message: "game not found, cannot update" })
    } else {
        // Note: we need to see if the description or game name already exists
        // so lets declare a gameNameExistsIndex and a gameDescExistsIndex and use findIndex to see if there are indices that shouldnt be overridden
        let gameNameExistsIndex = games.findIndex(game => game.game === req.body.game);
        let gameDescExistsIndex = games.findIndex(game => game.description === req.body.description);

        // now if either variable above is greater than -1, it means it exists and we cannot apply this to update the game
        if(gameNameExistsIndex > -1 || gameDescExistsIndex > -1){
            res.json({ data: "One or more updates already exists" })
        }
        if (gameNameExistsIndex === -1) {
            foundGame.game = req.body.game;
        }
        if (gameDescExistsIndex === -1) {
            foundGame.description = req.body.description;
        };
        res.json({foundGame: foundGame})
    };

});

// h. Make DELETE "/delete-game" route that takes in the id in the params. Once found, delete the game. If there's no game with the id, respond with "game not found, cannot delete")

router.delete("/delete-game/:id", (req, res) => {
    let indexOfFound = games.findIndex(game => game.id === req.params.id);
    if (indexOfFound === -1) {
        res.json({ data: "game not found, cannot delete" });
    } else {
        games.splice(indexOfFound, 1);
        res.json({ games });
    };
})


module.exports = router;