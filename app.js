document.addEventListener('DOMContentLoaded', () => {
  const {h, app} = window.hyperapp;

  const state = {};

  fetch('./data.json')
  .then((response) => {
    return response.json();
  })
  .then((todos) => {
    state.todos = todos;
    const actions = {
      // return the updated state object
      toggle: (id) => state => ({
        todos: state.todos.map(
          t => (id === t.id ? Object.assign({}, t, {
            checked: !t.checked
          }) : t)
        )
      }),
      // return the editied state object
      edit: (id) => state => ({
        todos: state.todos.map(
          t => (id === t.id ? Object.assign({}, t, {
            editing: !t.editing
          }) : t)
        )
      }),
      // return a new state with an additional todo
      new: () => state => ({
        todos: state.todos.concat({
          id: state.todos.length + 1,
          label: `new todo ${state.todos.length + 1}`,
          checked: false,
          editing: false
        })
      }),
      save: ({todo, e}) => state => ({
        todos: state.todos.map(
          t => (todo.id === t.id ? Object.assign({}, t, {
            label: e.target.value,
            editing: false
          }) : t)
        )
      })
    };

    const TodoInputOrLabel = (todo) => {
      if (todo.editing) {
        return h('input', {
          type: 'text',
          value: todo.label,
          oncreate: (e) => e.select(),
          onkeyup: (e) => {
            if (e.keyCode === 13) {
              todo.save({todo, e});
            }
          },
          style: {
            display: todo.editing ? 'initial' : 'none'
          }
        });
      }

      return h('a', {
        href: '#',
        style: {
          display: todo.editing ? 'none' : 'initial'
        }
      }, [
      h('input', {
        type: 'checkbox',
        checked: todo.checked,
        onclick: () => todo.toggle(todo.id)
      }),
      h('span', {}, todo.label),
      h('span', {
          onclick: () => todo.edit(todo.id)
        }, '✏️')
      ]);
    };

    const TodoItem = (todo) => (
      h('li', {
        id: todo.id,
        className: todo.checked ? 'checked' : ''
      }, [
        TodoInputOrLabel(todo)
      ])
    );

    const view = (state, actions) => (
      h('div', {}, [
        h('h1', {}, 'Todo'),
        h('ul', {}, state.todos.map((todo, index) => {
          todo.toggle = actions.toggle;
          todo.edit = actions.edit;
          todo.save = actions.save;
          return TodoItem(todo)
        })),
        h('button', {
            type: 'button',
            onclick: actions.new
          }, 'Add')
        ])
      );

    app(state, actions, view, document.body);
  })
  .catch((err) => {
    console.log(err);
  });
});
