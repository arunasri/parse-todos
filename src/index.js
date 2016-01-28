import React, { Component } from 'react';
import Parse from 'parse';
import { render } from 'react-dom';
Parse.initialize('YMg0IjOSRw7FupnNTBZXs2LoiGxjcP4B5ruqOhYt','yfJ32G79PwYL0S1rjj8GsrjUCy0U7rQggAj742SA')
var Todo = Parse.Object.extend('Todo');

class App extends Component {
  constructor(props){
    super(props)
    this.state = { todos: [] }
    this.loadTodos()
  }
  deleteTodo(todo) {
    todo.destroy({}).then((results) => { this.loadTodos() })
  }
  loadTodos() {
    var query = new Parse.Query(Todo);
    query.find({}).then((results) => {
      this.setState({ todos: results })
    });
  }
  addTodo(evt) {
    evt.stopPropagation()
    var todo = new Todo()
    todo.save({ content: this.refs.todo.value }).then(() => {
      this.loadTodos()
    })
    this.refs.todo.value = ''
  }
  render() {
    var index = 0
    return (
      <div>
        <h1> Welcome to todo app</h1>
        <TodoList todos={this.state.todos} onDelete={this.deleteTodo.bind(this)}/>
        <input type="text" ref="todo"/>
        <button onClick={this.addTodo.bind(this)}>Add</button>
      </div>
    );
  }
}

class TodoList extends Component {
  render() {
    var index = 0
    return (
      <div>
        {this.props.todos.map( (todo) => {
          index = index + 1
          return (
            <TodoItem todo={todo} onDelete={this.props.onDelete} key={index+1}/>
          )
        })}
      </div>
    );
  }
}
class TodoItem extends Component {
  constructor(props){
    super(props)
    this.state = { edit: false }
  }
   deleteTodo(evt) {
    evt.stopPropagation()
    this.props.onDelete(this.props.todo)
  }
   onEdit(evt) {
    evt.stopPropagation()
    this.setState({ edit: !this.state.edit })
  }
  showContent() {
    if (this.state.edit) {
      return (
        <input type="text" value={this.props.todo.attributes.content} ref='t'/>
      )


    } else {
      return (
        <h5 >{this.props.todo.attributes.content}</h5>
      )
    }


  }
  render() {
    return (
      <div>
          {this.showContent()}
        <button onClick={this.deleteTodo.bind(this)}>Delete</button>
        <button onClick={this.onEdit.bind(this)}>Edit</button>
      </div>
    );
  }
}
render(<App />, document.getElementById('root'));
