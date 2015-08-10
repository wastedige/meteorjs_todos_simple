if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
      'todo': function(){
        return Todos.find();
      }
    });

    Template.addTodo.events({
      'submit form': function(){
        event.preventDefault(); // prevents whatever default form behavior
        var todoName = $('[name="todoName"]').val();
        Todos.insert({
          name: todoName,
          completed: false,
          createdAt: new Date()
        });
      }
    });

    Template.todoItem.events({
      'click .delete-todo': function(event){ // click has to be mentioned first!
        event.preventDefault();
        var removeId = this._id;
        Todos.remove({
          _id: removeId
        });
      }
    })
}

if(Meteor.isServer){
    // server code goes here
}

Todos = new Meteor.Collection('todosdb');
