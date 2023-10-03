const API_KEY =
  'pateaTuhmU2F3i9LF.882f874e6161d187b234b7a315efc3adc33ac9239bd234365d57d5f2820e9d19';

const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstname').value.trim();
  const lastName = document.getElementById('lastname').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const gender = document
    .querySelector('input[name=gender]:checked')
    .value.trim();

  if (!firstName || !lastName || !email || !address || !gender) {
    console.error('Please Fill all The Fields');
    alert('Please Fill all The Fields !');
    return;
  }

  const record = {
    records: [],
  };

  const field = {
    fields: {
      Firstname: firstName,
      Lastname: lastName,
      Email: email,
      Address: address,
      Gender: gender,
    },
  };

  record.records.push(field);
  //calling the createRecords for creating records in Users table --------

  createRecords(email, record);
});

async function createRecords(email, record) {
  try {
    const isExist = await checkIfEmailExist(email);
    if (isExist.length > 0) {
      alert('Email already exist !');
      throw new Error('Email Exist');
    }
    const response = await fetch(
      'https://api.airtable.com/v0/appfFcJuvAren1iVT/Users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(record),
      }
    );
    const data = await response.json();
    console.log(data);
    alert(`User with the email address ${email} has been created !`);

    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('input[name=gender]:checked').checked = false;
  } catch (error) {
    console.error('Error: ', error);
  }
}

//for checking  while creating user if email exist in database or not ---------

async function checkIfEmailExist(email) {
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

    const { records } = await response.json();
    console.log('Records: ', records);

    const isExist = records.filter((user) => {
      return user?.fields?.Email?.includes(email);
    });
    return isExist;
  } catch (error) {
    console.log('Error: ', error);
  }
}
