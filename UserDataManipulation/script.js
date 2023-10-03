const API_KEY =
  'pateaTuhmU2F3i9LF.882f874e6161d187b234b7a315efc3adc33ac9239bd234365d57d5f2820e9d19';

const usersSection = document.querySelector('.users-section');
const updateUserForm = document.querySelector('.update-user-form');
const updateUserBtn = document.querySelector('.edit-userInfo-btn');
const cancelBtn = document.querySelector('.cancel-btn');

//for getting all users ---------

async function getAllUsers() {
  try {
    const response = await fetch(
      'https://api.airtable.com/v0/appfFcJuvAren1iVT/Users',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const data = await response.json();

    const users = data.records.reduce((users, record) => {
      users[record.id] = record.fields;
      return users;
    }, {});

    showUsersInUI(users);
  } catch (error) {
    console.log('Error: ', error);
  }
}

getAllUsers();

//creating each user details  ----------
function createUserContent(userData) {
  const user = `
    <section class="user-info-section">
    <section class="username">
        <span>Name: </span>${userData.Firstname + ' ' + userData.Lastname}
      </section>
      <section class="email">
        <span>Email: </span>${userData.Email}
      </section>
      <section class="gender">
        <span>Gender: </span>${userData.Gender}
      </section>
 </section>
 <section class="operations-section">
    <button class="update-user-btn" >Update User</button>
    <button class="delete-user-btn">Delete User</button>
 </section>
    `;
  return user;
}

// for showing user in UI ----------

function showUsersInUI(users) {
  usersSection.innerHTML = '';

  if (Object.keys(users).length === 0) {
    usersSection.innerHTML = 'No Users found !';
    return;
  }

  for (let user in users) {
    const userElement = document.createElement('section');
    userElement.classList.add('user');
    userElement.id = user;
    userElement.innerHTML = createUserContent(users[user]);

    // adding eventListener on update user button to show update popup from -----
    const updateButton = userElement.querySelector('.update-user-btn');
    updateButton.addEventListener('click', () => updateUser(user, users[user]));

    //adding eventListener on delete user button to delete user from airtable ------
    const deleteButton = userElement.querySelector('.delete-user-btn');
    deleteButton.addEventListener('click', () => deleteUser(user, users[user]));

    usersSection.appendChild(userElement);
  }
}

// genrate popup form for updating user information -------

function updateUser(userId, user) {
  updateUserForm.classList.remove('hide');
  updateUserForm.classList.add('active');

  updateUserForm.querySelector('#firstname').value = user.Firstname;
  updateUserForm.querySelector('#lastname').value = user.Lastname;
  updateUserForm.querySelector('#email').value = user.Email;
  updateUserForm.querySelector(`#${user.Gender}`).checked = true;

  updateUserBtn.addEventListener('click', () =>
    updateUserInfoInAirtable(userId)
  );
}

async function updateUserInfoInAirtable(userId) {
  try {
    const firstName = updateUserForm.querySelector('#firstname').value.trim();
    const lastName = updateUserForm.querySelector('#lastname').value.trim();
    const email = updateUserForm.querySelector('#email').value.trim();
    const gender = updateUserForm
      .querySelector('input[name=gender]:checked')
      .value.trim();

    //we will check if  any input field is empty or not ------
    if (!firstName || !lastName || !email || !gender) {
      console.error('Please Fill all The Fields');
      alert('Please Fill all The Fields !');
      return;
    }

    const record = {
      records: [],
    };

    const field = {
      id: userId,
      fields: {
        Firstname: firstName,
        Lastname: lastName,
        Email: email,
        Gender: gender,
      },
    };

    record.records.push(field);

    const response = await fetch(
      'https://api.airtable.com/v0/appfFcJuvAren1iVT/Users',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(record),
      }
    );
    console.log('update user -', userId);
    const data = await response.json();
    console.log(data);
    alert('User Information has updated !');

    getAllUsers();
  } catch (error) {
    console.error('Error: ', error);
  }
}

//adding eventListener on close button  to close the popup form ------

cancelBtn.addEventListener('click', closeUserForm);
function closeUserForm() {
  updateUserForm.classList.remove('active');
  updateUserForm.classList.add('hide');
}

//deleting user -------

async function deleteUser(userId, user) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/appfFcJuvAren1iVT/Users/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    const data = await response.json();
    console.log('Deleted UserId: ', data);
    console.log('Deleted User: ', user);

    alert(`User with the email address ${user.Email} has been deleted !`);
    getAllUsers();
  } catch (error) {
    console.error('Error: ', error);
  }
}
