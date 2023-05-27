import React, { useState, useEffect } from "react";

interface Course {
  id: string;
  name: string;
  teacherName: string;
  isMandatory: boolean;
  lessonsCount: number;
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/Courses")
      .then((res) => res.json())
      .then((courses: Course[]) => setCourses(courses));
  }, []);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const [enrollmentStatus, setEnrollmentStatus] = useState("");

  const [showButton, setShowButton] = useState(false);

  // add course to cart
  const handleAddCourse = (course: Course) => {
    // check duplicate values - in case course is already added to student's cart
    const exists = selectedCourses.find((p) => p.name === course.name);

    if (exists) return;
    setSelectedCourses([...selectedCourses, course]);

    fetch("http://localhost:5000/api/v1/Courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedCourses.concat(course)),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) setEnrollmentStatus("Completed");
      });
  };

  const handleStartEnrollment = () => {
    setShowButton(true);
    setEnrollmentStatus("InProgress");
  };

  const handleFinishEnrollment = () => {
    setEnrollmentStatus("Completed");
  };

  const handleDeleteAllCourses = () => {
    setSelectedCourses([]);
    setEnrollmentStatus("");
  };

  const handleCancelEnrollment = () => {
    setSelectedCourses([]);
    setShowButton(false);
    setEnrollmentStatus("Cancelled");
  };

  const handlePayment = () => {
    setShowButton(false);
    setEnrollmentStatus("Payed");
  };

  return (
    <div>
      <h1>List of Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {"Course name: "}
            {course.name}
            {", Teacher name: "}
            {course.teacherName}
            {", Lessons: "}
            {course.lessonsCount}
            {", Mandatory: "}
            {String(course.isMandatory)}
            {""}
            {showButton && (
              <button
                style={{ margin: "20px" }}
                onClick={() => handleAddCourse(course)}
              >
                Add
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleStartEnrollment}>Start Enrollment</button>{" "}
      <button onClick={handleFinishEnrollment}>Finish Enrollment</button>{" "}
      <button onClick={handleDeleteAllCourses}>Delete All Courses</button>{" "}
      <button onClick={handleCancelEnrollment}>Cancel Enrollment</button>{" "}
      <button onClick={handlePayment}>Payment</button>
      {enrollmentStatus && (
        <p style={{ marginTop: "1rem" }}>{enrollmentStatus}</p>
      )}
      <h1>Selected Courses</h1>
      <ul>
        {selectedCourses.map((course) => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
