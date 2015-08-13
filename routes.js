Router.configure({
    layoutTemplate: 'main'
});


Router.route('/', {
    name: 'home',
    template: 'home'
});

// the colon is telling Iron Router that this part of the URL is a dynamic parameter.
Router.route('/list/:_id', {
  template: 'listPage',
  //By using the “data” option, we’re able to pass data into a route from within the associated function
  data: function() {
    //console.log(this.params.someParameter);
    var currentList = this.params._id;
    return Lists.findOne({ _id: currentList });
  }
});
