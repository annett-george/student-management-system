const studentForm = document.getElementById("student-form");
const cancelbtn = document.getElementById("cancel-btn");
let students = [];
try {
    const saved = JSON.parse(
        localStorage.getItem("students") || "[]"
    );

    students = Array.isArray(saved) ? saved : [];
} catch (error) {
    console.error("Unable to load saved students:", error);
}
let editrno = null;
displayStudentList();

function saveStudents(){
    localStorage.setItem("students",JSON.stringify(students));
}

studentForm.addEventListener("submit", function(event){
    event.preventDefault();
    const stname= document.getElementById("stname").value.trim();
    const rno= document.getElementById("rno").value.trim();
    const course=document.getElementById("course").value.trim();
    if(!stname || !rno || !course){
        alert("Please fill all fields");
        return;
    }
    const exist = students.find(st => st.rollno===rno && st.rollno!==editrno);
    if(exist){
        alert("Student with this roll number already exists");
        return;
    }

    if(editrno!==null){
        const student = students.find(st => st.rollno===editrno);
        if(!student){
            alert("Student not found!");
            return;
        }
        student.name = stname;
        student.rollno= rno;
        student.course = course;
        editrno = null;
        document.getElementById("add-btn").textContent = "Add Student";
        cancelbtn.hidden=true;
    }
    else{
        students.push({"name": stname , "rollno": rno, "course":course});
    }
    displayStudentList();
    saveStudents();
    studentForm.reset();
});

function displayStudentList(){
    const n= students.length;
    const studentList = document.getElementById("student-list");
    studentList.innerHTML="";
    if (n === 0) {
        const message = document.createElement("p");
        message.textContent = "No students found. Add your first student!";
        studentList.appendChild(message);
        return;
    }
    for(let i=n-1; i>=0; i--){
        const student = students[i];
        const card = createCard(student);
        studentList.appendChild(card);
    }
}

cancelbtn.addEventListener("click",function(){
    editrno=null;
    studentForm.reset();
    document.getElementById("add-btn").textContent = "Add Student";
    cancelbtn.hidden =true;
});

function createCard(student){
    const card= document.createElement("div");
    card.className="student-card";

    const name = document.createElement("p");
    name.textContent=`Student Name : ${student.name}`;
    const rno = document.createElement("p");
    rno.textContent=`Roll Number: ${student.rollno}`;
    const course = document.createElement("p");
    course.textContent=`Course: ${student.course}`;

    const deletebtn = document.createElement("button");
    deletebtn.className="delete-btn";
    deletebtn.textContent="Delete";
    deletebtn.addEventListener("click",()=>deleteStudent(student));

    const editbtn=document.createElement("button");
    editbtn.className="edit-btn";
    editbtn.textContent="Edit";
    editbtn.addEventListener("click",()=>editStudent(student));

    card.append(name,rno,course,deletebtn, editbtn);
    return card;
}

function editStudent(student){
    editrno = student.rollno;
    document.getElementById("stname").value = student.name;
    document.getElementById("rno").value = student.rollno;
    document.getElementById("course").value = student.course;
    document.getElementById("add-btn").textContent = "Save changes";
    cancelbtn.hidden = false;
}

function deleteStudent(student){
    const confirmed = confirm("Are you sure you want to delete this student?");
    if(!confirmed) return;
    students=students.filter(st => st.rollno!==student.rollno);

    if(editrno===student.rollno){
        editrno=null;
        studentForm.reset();
        document.getElementById("add-btn").textContent= "Add Student";
        cancelbtn.hidden=true;
    }
    displayStudentList();
    saveStudents();
}

const searchbtn = document.getElementById("search-btn");
searchbtn.addEventListener("click", function(event){
    event.preventDefault();
    const studentrno = document.getElementById("search-rno").value.trim();
    if(studentrno===""){
        alert(`Enter Student id`);
        displayStudentList();
        return;
    }
    const student = students.find(st=> st.rollno===studentrno);
    if(!student){
        alert(`Enter valid Student Roll Number`);
        displayStudentList();
        return;
    }
    const studentList = document.getElementById("student-list");
    studentList.innerHTML="";
    const card = createCard(student);
    studentList.appendChild(card);
})