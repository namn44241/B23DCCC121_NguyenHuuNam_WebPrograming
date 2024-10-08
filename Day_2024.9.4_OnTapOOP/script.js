class Student {
    constructor(id, name, gender, birthDate, hometown) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.hometown = hometown;
    }
}

class StudentManager {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
    }

    addStudent(student) {
        const index = this.students.findIndex(s => s.id === student.id);
        if (index !== -1) {
            this.students[index] = student;
        } else {
            this.students.push(student);
        }
        this.updateLocalStorage();
    }

    removeStudent(id) {
        this.students = this.students.filter(student => student.id !== id);
        this.updateLocalStorage();
    }

    getStudent(id) {
        return this.students.find(student => student.id === id);
    }

    updateLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    displayStudents() {
        const tbody = document.querySelector('#student-table tbody');
        tbody.innerHTML = '';
        this.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${student.birthDate}</td>
                <td>${student.hometown}</td>
                <td>
                    <button class="action-btn" onclick="editStudent('${student.id}')">Sửa</button>
                    <button class="action-btn" onclick="deleteStudent('${student.id}')">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

const studentManager = new StudentManager();
studentManager.displayStudents();

document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value.trim();
    const name = document.getElementById('name').value.trim();
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const hometown = document.getElementById('hometown').value.trim();

    if (id && name && birthDate && hometown) {
        const student = new Student(id, name, gender, birthDate, hometown);
        studentManager.addStudent(student);
        studentManager.displayStudents();
        this.reset();
    }
});

function editStudent(id) {
    const student = studentManager.getStudent(id);
    if (student) {
        document.getElementById('studentId').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('gender').value = student.gender;
        document.getElementById('birthDate').value = student.birthDate;
        document.getElementById('hometown').value = student.hometown;
    }
}

function deleteStudent(id) {
    if (confirm('Bạn có chắc chắn muốn xoá sinh viên này?')) {
        studentManager.removeStudent(id);
        studentManager.displayStudents();
    }
}
