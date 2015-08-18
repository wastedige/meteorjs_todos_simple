Router.configure({
    layoutTemplate: 'main'
});


Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('register');
Router.route('login');

// the colon is telling Iron Router that this part of the URL is a dynamic parameter.
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  //By using the “data” option, we’re able to pass data into a route from within the associated function
  data: function() {
    //console.log(this.params.someParameter);
    var currentList = this.params._id;
    return Lists.findOne({ _id: currentList }); // will be used to fetch list's name
  },
  // hook! redirects user to login page instead of rendering the page if user's not logged in
  onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next(); // basically means proceed
        } else {
            this.render("login");
        }
    }
});
