Songs = new Mongo.Collection("songs");

if (Meteor.isClient) { 
    Session.setDefault("volume", 50);

    Template.body.helpers({
        songs: function () {
            return Songs.find({}, {sort: {createdAt: 1}});
        }
    });

    Template.registerHelper('volume',function(input){
        return Session.get("volume");
    });

    Template.body.events({
        "submit .new-song": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var artist = event.target.artist.value;
            var title = event.target.title.value;
            var name = event.target.link.value;
            var link = event.target.link.value;

            // Insert a song into the collection
            Songs.insert({
                artist: artist,
                title: title,
                name: name,
                link: link,
                createdAt: new Date() // current time
            });

            // Clear form
            event.target.artist.value = "";
            event.target.title.value = "";
            event.target.link.value = "";
        },

        "click .volume-up": function (event) {
            if (Session.get("volume") < 100)
                Session.set("volume", Session.get("volume")+1);
        },

        "click .volume-down": function (event) {
            if (Session.get("volume") > 0)
                Session.set("volume", Session.get("volume")-1);
        }
    });

    Template.song.events({
        "click .delete": function () {
            Songs.remove(this._id);
        }
    });
}

if (Meteor.isServer) { 
    Meteor.startup(function () { 
        // code to run on server at startup 
    });
}