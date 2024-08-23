document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://127.0.0.1:3000'; // Update this to your backend URL

  const tableBody = document.getElementById('student-table-body');
  const loader = document.getElementById('loader');
  const studentTableContainer = document.getElementById('student-table-container');
  const form = document.getElementById('add-student-form');
  const modal = document.getElementById('modal');
  const addButton = document.getElementById('add-btn');
  const closeButton = document.querySelector('.close-btn');
  const errorMessage = document.getElementById('error-message'); // Add an element for error messages

  const nameField = document.getElementById('name');
  const subjectField = document.getElementById('subject');
  const marksField = document.getElementById('mark');

  const logoutLink = document.getElementById('logout-link'); // Add logout link element

  const populateTable = (data) => {
    console.log(data)
    tableBody.innerHTML = '';
    data.forEach((student) => {
      console.log(student)
      const row = document.createElement('div');
      row.className = 'student-row';

      const nameContainer = document.createElement('span');
      nameContainer.className = 'name-container';

      const firstChar = document.createElement('div');
      firstChar.textContent = (student.name.charAt(0)).toUpperCase();
      firstChar.className = 'circle';

      const nameCell = document.createElement('span');
      nameCell.textContent = student.name.charAt(0).toUpperCase() + student.name.slice(1).toLowerCase();

      nameContainer.appendChild(firstChar);
      nameContainer.appendChild(nameCell);
      nameContainer.className = 'nameCont';

      row.appendChild(nameContainer);

      const subjectCell = document.createElement('span');
      subjectCell.textContent = student.subject.charAt(0).toUpperCase() + student.subject.slice(1).toLowerCase();
      row.appendChild(subjectCell);

      const markCell = document.createElement('span');
      markCell.textContent = student.marks;
      row.appendChild(markCell);

      const actionCell = document.createElement('span');
      const dropdown = document.createElement('div');
      dropdown.className = 'dropdown';
      const dropbtn = document.createElement('button');
      dropbtn.className = 'dropbtn';
      dropbtn.textContent = '▼';
      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'dropdown-content';
      const editLink = document.createElement('a');
      editLink.href = '#';
      editLink.textContent = 'Edit';
      editLink.onclick = () => editStudent(student.id);
      const deleteLink = document.createElement('a');
      deleteLink.href = '#';
      deleteLink.textContent = 'Delete';
      deleteLink.onclick = () => deleteStudent(student.id);
      dropdownContent.appendChild(editLink);
      dropdownContent.appendChild(deleteLink);
      dropdown.appendChild(dropbtn);
      dropdown.appendChild(dropdownContent);
      actionCell.appendChild(dropdown);
      row.appendChild(actionCell);

      tableBody.appendChild(row);
      tableBody.appendChild(document.createElement('hr'));
    });
  };

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`${url}/api/v1/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          alert('Token not found!');
        } else if (response.status === 422) {
          alert('Token Expired');
        } else if (response.status === 401) {
          alert('Invalid Token');
        } else if (response.status === 500) {
          alert('Server Error. Please try again later.');
        } else {
          alert('An unexpected error occurred.');
        }
        
        localStorage.removeItem('authToken'); 
        window.location.href = '/';
        return;
      }
  
      const studentList = await response.json();
      
      loader.style.display = 'none';
      studentTableContainer.style.display = 'block';
      populateTable(studentList);
  
    } catch (error) {
      alert('An error occurred while fetching data. Please try again later.');
    }
  };
  

  const editStudent = (id) => {
    fetch(`${url}/api/v1/students/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(student => {
      nameField.value = student.name;
      subjectField.value = student.subject;
      marksField.value = student.marks;
      modal.dataset.id = id; // Store the ID in the modal
      modal.dataset.previousMarks = student.marks; // Store previous marks
      modal.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching student data:', error);
      errorMessage.textContent = 'Error fetching student data. Please try again.';
    });
  };

  const deleteStudent = (id) => {
    fetch(`${url}/api/v1/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchStudentData(); // Refresh the table
    })
    .catch(error => {
      console.error('Error deleting student:', error);
      errorMessage.textContent = 'Error deleting student. Please try again.';
    });
  };

  addButton.addEventListener('click', () => {
    nameField.value = '';
    subjectField.value = '';
    marksField.value = '';
    modal.dataset.id = ''; // Clear the ID
    modal.dataset.previousMarks = ''; // Clear previous marks
    modal.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    errorMessage.textContent = ''; // Clear error message
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
      errorMessage.textContent = ''; // Clear error message
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameField.value;
    const subject = subjectField.value;
    const marks = parseInt(marksField.value);
    const id = modal.dataset.id;
    const previousMarks = parseInt(modal.dataset.previousMarks) || 0;

    // Client-side validation
    if (marks < 0 || marks > 100) {
      errorMessage.textContent = 'Marks must be between 0 and 100.';
      return;
    }

    if (!id && (marks + previousMarks > 100)) {
      errorMessage.textContent = 'Total marks cannot exceed 100.';
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${url}/api/v1/students/${id}` : `${url}/api/v1/students`;

    fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        student: {
          name: name,
          subject: subject,
          marks: marks
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.errors.marks || 'Error submitting form.');
        });
      }
      return response.json();
    })
    .then(data => {
      loader.style.display = 'none';
      studentTableContainer.style.display = 'block';
      fetchStudentData(); // Refresh the table
      form.reset();
      modal.style.display = 'none';
      errorMessage.textContent = ''; // Clear error message
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      errorMessage.textContent = error.message;
    });
  });

  // Add event listener for logout
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('authToken'); // Remove the token from local storage
    window.location.href = '/'; // Redirect to login page
  });

  fetchStudentData();
});
