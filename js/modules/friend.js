/* 
	1 - Friend Select /* App.vent.trigger("friend:selected", this.model.get('likes'));
    2 - Add 'like' className to view
*/

(function (App, FriendModule) {
    var m = FriendModule;

    /* Models */

    m.Friend = Backbone.Model.extend({
        initialize: function () {
            this.set('highlight', true);
        }
    });
    m.Like = Backbone.Model.extend({});

    /* Collections */

    m.Friends = Backbone.Collection.extend({
        model: m.Friend,
        initialize: function () {
            this.selectedLikes = [];
        },
        addLike: function (name) {
            if (_.contains(this.selectedLikes, name))
                this.selectedLikes = _.reject(this.selectedLikes, function (n) { return n == name; });
            else
                this.selectedLikes.push(name);

            this.highlight();
        },
        highlight: function () {
            var self = this;
            this.each(function (friend) {
                var friendLikes = _.map(friend.get('likes'), function (l) { return l.name; });
                var diff = _.difference(self.selectedLikes, friendLikes);
                var hasLike = (diff.length == 0); //return the selectedLikes not present in friends likes

                if (hasLike || self.selectedLikes.length == 0) {
                    friend.set('highlight', true);
                }
                else {
                    friend.set('highlight', false);
                }

            });
        },
        clearLike: function () {
            this.selectedLikes = [];
        }
    });

    m.Likes = Backbone.Collection.extend({
        model: m.Like,
        comparator: function (like) {
            return -like.get('likecount');
        }
    });

    /* Views */

    m.Views.Friend = Backbone.View.extend({
        template: "#friend-item-template",
        initialize: function () {
            this.model.on("change", this.render, this);
        },
        serialize: function () {
            return { model: this.model }; /* <-- For Template Manager --> */
        },
        events: {
            "click": "clicked"
        },
        clicked: function () {
            App.vent.trigger("friend:selected", this.model.get('likes'));
        }
    });

    m.Views.Like = Backbone.View.extend({
        template: "#friend-like-template",
        className: "like",
        serialize: function () {
            return { model: this.model };
        },
        events: {
            "click": "clicked"
        },
        clicked: function () {
            this.$el.toggleClass('selected');
            App.vent.trigger("like:selected", this.model.get('name'));
        }
    });

    /* Collection Views */

    m.Views.FriendList = Backbone.View.extend({
        beforeRender: function () {
            this.collection.each(function (model) {
                var s = new m.Views.Friend({ model: model });
                this.insertView(s);
            }, this);
        }
    });

    m.Views.LikeList = Backbone.View.extend({
        beforeRender: function () {
            this.collection.each(function (model) {
                var s = new m.Views.Like({ model: model });
                this.insertView(s);
            }, this);
        }
    });

})(App, App.module("friendmodule"));

/*  App.vent.trigger("friend:selected", this.model.get('likes')); */

