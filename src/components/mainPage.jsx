import React, { Component } from "react";
import WorkoutsContainer from "./workoutsContainter";

class MainPage extends Component {
  state = {
    workoutsObj: {},
    groupNames: []
  };

  deleteWorkout(obj) {
    // Update state array
    let workoutsObj = this.state.workoutsObj;
    const workoutGroupArr = this.state.workoutsObj[obj.group].filter(
      workout => workout.id !== obj.id
    );

    workoutsObj[obj.group] = workoutGroupArr;
    this.setState({ workoutsObj });
  }

  handleDelete = obj => {
    // Delete from database
    fetch(`/api/deleteWorkout/?id=${obj.id}`)
      .then(res => {
        if (res.status >= 400) {
          return { error: res.status };
        }
        return res.json();
      })
      .then(res => {
        // If status error, alert, else delete workout from state
        res.error ? alert("Error deleting") : this.deleteWorkout(obj);
      });
  };

  handleEdit = obj => {
   const {name, link, group, id} = obj

    // /post DB, update(name, group, link), refresh?
    fetch(`/api/updateWorkout/?id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        link,
        group,
        id
      })
    },)
      .then(res => {
        if (res.status !== 200) {
          alert("An error has occured");
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        if (res.error) {
          alert("An error has occured");
          return;
        }
      });
  };

  handleAdd = obj => {
    const { group, link, name } = obj;

    fetch(`/api/addWorkout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group,
        link,
        name
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          alert("An error has occured");
        } else if (res.duplicate) {
          alert("Error, this workout already exists");
        } else {
          this.addWorkout(obj, res.newID);
        }
      });
  };

  // Returns array of strings with workout container group names
  // Eg. ["Back", "Chest", "Arms"]
  getAllWorkoutGroups = () => {
    return Object.keys(this.state.workoutsObj).map(workout => {
      return workout;
    });
  };

  addWorkout = (obj, id) => {
    let { group, link, name } = obj;

    const newWorkout = {
      id,
      group,
      link,
      name
    };

    let workoutsObj = this.state.workoutsObj;
    workoutsObj[group] = [...workoutsObj[group], newWorkout];
    this.setState({ workoutsObj });
  };

  // TODO: REFACTOR BOTH OF THESE INTO ONE FUNCTION
  // Update state with all workouts from sql query
  createWorkoutList(query) {
    let workoutsObj = {};

    // Create array for each workout group, add workout to array
    // if it falls under that group
    query.forEach(q => {
      // Initialize array for workout group
      if (!workoutsObj[q.WorkoutGroup]) workoutsObj[q.WorkoutGroup] = [];

      // Add workout to array based on its WorkoutGroup
      workoutsObj[q.WorkoutGroup].push({
        id: q.WorkoutID,
        name: q.WorkoutName,
        link: q.WikipediaLink,
        group: q.WorkoutGroup
      });
    });

    // Update state with object of workout arrays
    this.setState({ workoutsObj });

    return workoutsObj;
  }

  createWorkoutContainers() {
    let { workoutsObj } = this.state;

    // For every workout array in state, map through and create
    // a workout container to display
    return Object.keys(workoutsObj).map(arr => {
      return (
        <WorkoutsContainer
          key={arr}
          workouts={workoutsObj[arr]}
          group={arr}
          onDelete={this.handleDelete}
          onAdd={this.handleAdd}
          onEdit={this.handleEdit}
          allGroups={this.state.groupNames}
        ></WorkoutsContainer>
      );
    });
  }

  // query database for list of all workouts on page mount
  componentDidMount() {
    fetch("http://localhost:8080/api/getList")
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          alert("Error Loading Workouts");
        } else {
          const workoutsObj = this.createWorkoutList(res.row); // Object of all workout groups with their workouts
          const groupNames = this.getAllWorkoutGroups(); // Array of workout group names as strings
          this.setState({ workoutsObj, groupNames });
        }
      });
  }

  render() {
    return (
      <div className="mainPage">
        <div className="workouts">{this.createWorkoutContainers()}</div>
      </div>
    );
  }
}

export default MainPage;
