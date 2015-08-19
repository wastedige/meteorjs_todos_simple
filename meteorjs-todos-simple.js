if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
      'todo': function(){
        return Todos.find({listId: this._id, createdBy: Meteor.userId()},
                          {sort: {createdAt: -1}});
      }
    });

    Template.todoCount.helpers({
      'totalCount': function(){
        return Todos.find({listId: this._id}).count();
      },
      'activeCount': function(){
        return Todos.find({ listId: this._id, completed: true }).count()
      }
    });

    Template.addList.events({
      'submit form': function(){
        event.preventDefault();
        var listName = $('[name="listName"]').val();
        Lists.insert({
          name: listName,
          createdBy: Meteor.userId()
        }, function(error, results){
            Router.go('listPage', { _id: results });
        });
        $('[name="listName"]').val('');
      }
    });

    Template.lists.helpers({
      'list': function(){
        return Lists.find({ createdBy: Meteor.userId() }, {sort: {name: 1}});
      }
    });

    Template.addTodo.events({
      'submit form': function(){
        event.preventDefault(); // prevents whatever default form behavior
        var todoName = $('[name="todoName"]').val();
        Todos.insert({
          name: todoName,
          completed: false,
          createdAt: new Date(),
          createdBy: Meteor.userId(),
          listId: this._id
        });
        $('[name="todoName"]').val('');
      }
    });

    Template.todoItem.helpers({
      'checked': function() {
        if (this.completed)
          return "checked";
        else {
          return "";
        }
      }
    })

    Template.todoItem.events({

      // keyup [name=todoItem] in the book, but it seems unnecessary since it's an event inside todoItem already
      'keyup': function(event){
        if(event.which == 13 || event.which == 27){
          $(event.target).blur();
        } else {
          var documentId = this._id;
          //the event itself is attached to a specific element, we only have to extract the value of event.target itself
          var todoItem = $(event.target).val();
          // var todoItem = $('[name=todoItem]').val();  // jQuery, another approach
          Todos.update({_id:documentId}, {$set:{
            name: todoItem
          }});
          console.log("Task changed to: " + todoItem);
        }
      },

      'click .delete-todo': function(event){ // click has to be mentioned first!
        event.preventDefault();
        var removeId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm){
          Todos.remove({
            _id: removeId
          });
        }
      },

      'change [type=checkbox]': function(){
        var documentId = this._id;
        var isCompleted = this.completed;
        if(isCompleted){
            Todos.update({ _id: documentId }, {$set: { completed: false }});
            console.log("Task marked as incomplete.");
        } else {
            Todos.update({ _id: documentId }, {$set: { completed: true }});
            console.log("Task marked as complete.");
        }
      }
    })

  Template.register.events({
    'submit form': function(event){
        event.preventDefault();
      }
  });

  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
    }
});

// define a default set of rules and error messages for our validate functions
$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

// onRendered, onCreated, onDestroyed -- similar to Router hooks
Template.login.onRendered(function(){
   var validator = $('.login').validate({
    submitHandler: function(event){
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error){
        if(error){
            if(error.reason == "User not found"){
                validator.showErrors({
                    email: error.reason
                });
            }
            if(error.reason == "Incorrect password"){
                validator.showErrors({
                    password: error.reason
                });
            }
        } else {
          Router.go("home");
      }
    });
    }
  });
});

Template.register.onRendered(function(){
  var validator = $('.register').validate({
    submitHandler: function(event){
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
          email: email,
          password: password
      }, function(error) {
          if(error){
            if(error.reason == "Email already exists."){
                validator.showErrors({
                    email: "That email already belongs to a registered user."
                });
            }
          } else {
              Router.go("home"); // Redirect user if registration succeeds
          }
      });
    }
  });
});

  Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
  });

}

if(Meteor.isServer){
    // server code goes here
}

Todos = new Meteor.Collection('todosdb');
Lists = new Meteor.Collection('lists');
