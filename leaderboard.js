PlayersList = new Mongo.Collection("players");

if (Meteor.isClient) {
    Meteor.subscribe("thePlayers");

    Template.leaderboard.player = function() {
        return "some other text"
    }

    Template.leaderboard.helpers({
        "bleble": function() {
            return("bleble");
        },
        "testing": function() {
            return(["lubie","cos tam"]);
        },
        "playersListFind": function() {
            var currentUserId = Meteor.userId();
            return PlayersList.find({createdBy: currentUserId},{sort: {score: -1,name: 1} });
        },
        "selectedClass": function() {
            var playerId = this._id;
            var selectedPlayer = Session.get("selectedPlayer");
            if (playerId == selectedPlayer) {
                return("selected");    
            }
            //return(this._id);
        },
        "showSelectedPlayer": function() {
            var selectedPlayer = Session.get("selectedPlayer");
            return(PlayersList.findOne(selectedPlayer));
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
            var selectedPlayer = Session.get('selectedPlayer');
            //console.log(selectedPlayer);
        },
        // 'click .increment': function() {
        //     var selectedPlayer = Session.get("selectedPlayer");
        //     console.log(selectedPlayer);
        //     //PlayersList.update(selectedPlayer,{$set: {score: 5} });
        //     //PlayersList.update(selectedPlayer,{score: 5});
        //     PlayersList.update(selectedPlayer,{$inc: {score: 5} });
        // },
        // 'click .decrement': function() {
        //     var selectedPlayer = Session.get("selectedPlayer");
        //     PlayersList.update(selectedPlayer,{$inc: {score: -5} });
        // },
        'click .remove': function() {
            // var selectedPlayer = Session.get("selectedPlayer");
            // PlayersList.remove(selectedPlayer);

            var selectedPlayer = Session.get("selectedPlayer");
            Meteor.call("removePlayerData",selectedPlayer);
        },
        'click .increment': function() {
            var selectedPlayer = Session.get("selectedPlayer");
            Meteor.call("modifyPlayerScore",selectedPlayer,5);
        },
        'click .decrement': function() {
            var selectedPlayer = Session.get("selectedPlayer");
            Meteor.call("modifyPlayerScore",selectedPlayer,-5);
        }
    });

    Template.addPlayerForm.events({
        "submit form": function(event) {
            // event.preventDefault();
            // // console.log("submitted");
            // // console.log(event.type);
            // var playerNameVar = event.target.playerName.value;
            // var playerScoreVar = event.target.playerScore.value;
            // var currentUserId = Meteor.userId();
            // PlayersList.insert({
            //     name: playerNameVar,
            //     score: playerScoreVar,
            //     createdBy: currentUserId
            // });
            // // console.log(event.target.playerName)
            // var emptyMe = document.getElementById("add_player");
            // emptyMe.value = "";

            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            var playerScoreVar = event.target.playerScore.value;
            Meteor.call("insertPlayerData",playerNameVar,playerScoreVar);
        }

    });
}
if (Meteor.isServer) {
    // console.log(PlayersList.find().fetch
    Meteor.publish('thePlayers',function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId})
    });

    Meteor.methods({
        "insertPlayerData": function(playerNameVar,playerScoreVar) {
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: playerScoreVar,
                createdBy: currentUserId
            });
        },
        "removePlayerData": function(selectedPlayer) {
            PlayersList.remove(selectedPlayer);
        },
        "modifyPlayerScore": function(selectedPlayer,scoreValue) {
            PlayersList.update(selectedPlayer, {$inc: {score: scoreValue} });
        }
    });
}

