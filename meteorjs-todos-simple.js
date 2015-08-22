if(Meteor.isClient){
    // client code goes here


    Meteor.subscribe('lists');

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
        // The code that allows the insert, update, and remove functions
        // to work from the isClient conditional is contained within a
        // default package that’s known as “insecure”. Once removed:
        // Users will no longer be able to use the insert, update, and
        // remove functions from their web browser (including Console).
        Meteor.call('createNewList', listName, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                Router.go('listPage', { _id: results });
                $('[name=listName]').val('');
            }
        });
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
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        }, function(error) {
            if(error){
                console.log(error.reason); // Output error if registration fails
            } else {
                Router.go("home"); // Redirect user if registration succeeds
            }
        });
      }
  });

  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
        if(error){
            console.log(error.reason);
        } else {
            var currentRoute = Router.current().route.getName();
            if(currentRoute == "login"){
              Router.go("home");
            }
        }
      });
    }
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
    Meteor.publish('lists', function(){
        var currentUser = this.userId;
        return Lists.find({ createdBy: currentUser });
    });

    Meteor.publish('todos', function(){
        var currentUser = this.userId;
        return Todos.find({ createdBy: currentUser })
    });

    Meteor.methods({
      'createNewList': function(listName){
          var currentUser = Meteor.userId();
          check(listName, String); // makes sure a string type is used, not a bool etc
          var data = {
              name: listName,
              createdBy: currentUser
          }
          // unregistered users can insert data into the “Lists” collection by
          // calling createNewList in console, to block it:
          if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
          } else {
            Lists.insert(data);
          }
      }
    });

}

Todos = new Meteor.Collection('todosdb');
Lists = new Meteor.Collection('lists');
