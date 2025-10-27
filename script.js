const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const todoHome = document.getElementById('todo-home');

  // HELPERS: show/hide
  function showForm()  { form.style.display = 'block';  todoHome.style.display = 'none'; }
  function showTodos() { form.style.display = 'none';   todoHome.style.display = 'block'; }

  // LOGIN → then load that user's todos
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) { alert('Enter username and password'); return; }

    try {
      // 1) Try login (DummyJSON)
      const loginRes = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) throw new Error('Bad login');

      const user = await loginRes.json(); // has id, firstName, etc.

      // 2) Fetch that user's todos
      const todosRes = await fetch(`https://dummyjson.com/todos/user/${user.id}`);
      if (!todosRes.ok) throw new Error('Could not load todos');

      const todosData = await todosRes.json();

      // 3) Render todos
      renderTodos(user, todosData.todos || []);

      // 4) Show the todos area, hide the form
      showTodos();

    } catch (err) {
      alert('Login failed. Try username "emilys" and password "emilyspass".');
      showForm();
    }
  });

  // Create elements, then format with innerHTML template strings
  function renderTodos(user, todos) {
    // clear the home container
    todoHome.innerHTML = '';

    // Title
    const title = document.createElement('h2');
    title.textContent = (user.firstName || 'User') + "'s To-Dos";
    todoHome.appendChild(title);

    // Quick open-tasks count
    const openCount = todos.filter(t => !t.completed).length;
    const summary = document.createElement('p');
    summary.textContent = `Open tasks: ${openCount}`;
    todoHome.appendChild(summary);

    // List container
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    // Each todo -> <li>, using innerHTML to format
    todos.forEach(t => {
      const li = document.createElement('li');
      li.style.margin = '6px 0';

      li.innerHTML = `
        <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid #ddd; border-radius:8px;">
          <input type="checkbox" ${t.completed ? 'checked' : ''} disabled>
          <span ${t.completed ? 'style="text-decoration:line-through; color:#666;"' : ''}>
            ${t.todo}
          </span>
        </label>
      `;

      list.appendChild(li);
    });

    todoHome.appendChild(list);
  }

  // start state
  showForm();