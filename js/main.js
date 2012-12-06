jQuery(function($) {

    Backbone.Layout.configure({
        manage: true
    });

	var module = App.module("friendmodule");    

    var friends = new module.Friends(FriendStubData.friends);
    
    
    var main = new Backbone.Layout({
        template: "#main-layout",
        views: {
            "#left": new module.Views.FriendList({ collection: friends })
        }
    });
    

    //subscribe to app level events we care about
    App.vent.on("friend:selected", function (data) {
        var likes = new module.Likes(data);
        var likeViews = new module.Views.LikeList({ collection: likes });
        main.setView("#likeList", likeViews).render();
    });
    
    App.vent.on("like:selected", function (name) {;
        friends.addLike(name);
    });
    
    main.render();
    $("#container").empty().append(main.el);

});
