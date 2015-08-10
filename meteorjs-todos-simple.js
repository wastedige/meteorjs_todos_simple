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
      // keyup [name=todoItem] in the book, but it seems unnecessary since it's an event inside todoItem already
      'keyup': function(event){
        var documentId = this._id;
        //the event itself is attached to a specific element, we only have to extract the value of event.target itself
        var todoItem = $(event.target).val();
        // var todoItem = $('[name=todoItem]').val();  // jQuery, another approach
        Todos.update({_id:documentId}, {$set:{
          name: todoItem
        }});
        console.log("Task changed to: " + todoItem);

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
      }
    })
}

if(Meteor.isServer){
    // server code goes here
}

Todos = new Meteor.Collection('todosdb');
