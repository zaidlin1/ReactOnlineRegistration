import React, { useState, useEffect } from "react";
import configData from "../config.json";

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
    fetch(configData.SERVER_URL)
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

    fetch(configData.SERVER_URL, {
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
    setEnrollmentStatus("InProgress");
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
      <button
        disabled={
          enrollmentStatus === "Payed" || enrollmentStatus === "Cancelled"
        }
        onClick={handleStartEnrollment}
      >
        Create Registration
      </button>{" "}
      <button
        disabled={
          enrollmentStatus === "Payed" ||
          enrollmentStatus === "Cancelled" ||
          enrollmentStatus === "Completed"
        }
        onClick={handleFinishEnrollment}
      >
        Complete
      </button>{" "}
      <button
        disabled={
          enrollmentStatus === "Payed" || enrollmentStatus === "Cancelled"
        }
        onClick={handleDeleteAllCourses}
      >
        Clear All Courses
      </button>{" "}
      <button
        disabled={
          enrollmentStatus === "Completed" || enrollmentStatus === "Payed"
        }
        onClick={handleCancelEnrollment}
      >
        Cancel{" "}
      </button>{" "}
      <button
        disabled={
          enrollmentStatus === "Payed" ||
          enrollmentStatus === "Cancelled" ||
          enrollmentStatus === "InProgress"
        }
        onClick={handlePayment}
      >
        Pay
      </button>
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
