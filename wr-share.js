Songs = new Mongo.Collection("songs");
Radios = new Mongo.Collection("radios");

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/r/:name', {
    name: 'radio',
    template: 'radio',
    data: function(){
        var radioName = this.params.name;
        return Radios.findOne({ name: radioName });
    }
});

Router.route('/r/:name/nuke', {
    name: 'nuke',
    template: 'nuke',
    data: function(){
        var radioName = this.params.name;
        return Radios.findOne({ name: radioName });
    }
});

if (Meteor.isClient) {
    Session.setDefault("volume", 50);

    Template.registerHelper('volume',function(input){
        return Session.get("volume");
    });

    Template.home.events({
        "submit .join-radio": function (event) {
            event.preventDefault();

            // Get value from form element
            var name = event.target.name.value;

            // If the radio doesn't exist
            if (Radios.find({ name: name }).count() == 0) {
                // Insert a radio into the collection
                Radios.insert({
                    name: name,
                    createdAt: new Date() // current time
                });
            }

            // Clear form
            event.target.name.value = "";

            // Go to the radio
            Router.go('radio', {name: name});
        }
    });

    Template.home.helpers({
        radios: function () {
            return Radios.find({}, {});
        }
    });
    
    Template.radio.helpers({
        currentSongs: function () {
            var radio = Radios.findOne({ name: Router.current().params.name });
            return Songs.find({radio: radio._id}, {sort: {createdAt: 1}, limit : 1});
        },
        songs: function () {
            var radio = Radios.findOne({ name: Router.current().params.name });
            return Songs.find({radio: radio._id}, {sort: {createdAt: 1}, skip: 1});
        }
    });
    
    Template.radio.events({
        "submit .new-song": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var artist = event.target.artist.value;
            var title = event.target.title.value;
            var name = event.target.link.value;
            var link = event.target.link.value;
            var radio = event.target.radio.value;

            // Insert a song into the collection
            Songs.insert({
                artist: artist,
                title: title,
                name: name,
                link: link,
                radio: radio,
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

    Template.nuke.events({
        "click .btn-danger": function (event) {
            event.preventDefault();

            // Delete the radio
            Radios.remove(event.target.id);
            Songs.remove({ radio: event.target.id });

            // Go to the radio
            Router.go('home');
        },

        "click .btn-success": function (event) {
            var name = event.target.name.value;
            // Go to the radio
            Router.go('radio', { name: event.target.id });
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
