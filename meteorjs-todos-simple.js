if(Meteor.isClient){
    // client code goes here
    Template.todos.helpers({
      'todo': function(){
        return Todos.find();
      }
    });
}

if(Meteor.isServer){
    // server code goes here
}

Todos = new Meteor.Collection('todosdb');
