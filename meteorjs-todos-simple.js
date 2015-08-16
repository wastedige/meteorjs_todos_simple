if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
      'todo': function(){
        return Todos.find({listId: this._id});
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
          name: listName
        }, function(error, results){
            Router.go('listPage', { _id: results });
        });
        $('[name="listName"]').val('');
      }
    });

    Template.lists.helpers({
      'list': function(){
        return Lists.find();
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
            Router.go("home");
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
}

Todos = new Meteor.Collection('todosdb');
Lists = new Meteor.Collection('lists');
