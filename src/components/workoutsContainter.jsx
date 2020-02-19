import React, { Component } from "react";
import NewWorkout from "./newWorkout";
import EditWorkout from "./editWorkout";

class WorkoutsContainer extends Component {
  handleDelete = id => {
    this.props.onDelete(id);
  };

  handleAdd = newWorkout => {
    this.props.onAdd(newWorkout);
  };

  handleEdit = updatedWorkout => {
    this.props.onEdit(updatedWorkout);
  };

  render() {
    return (
      <div className="main-container">
        <div className="container-header">
          <p>{this.props.group}</p>
        </div>
        <div className="workouts-container">
          <table className="table">
            <tbody>
              {this.props.workouts.map(workout => {
                return (
                  <tr key={workout.id}>
                    <td>
                      {workout.link ? (
                        <a
                          href={workout.link}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {workout.name}
                        </a>
                      ) : (
                        workout.name
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => this.props.onDelete(workout)}
                        className="round-btn btn btn-warning btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <EditWorkout
                        group={this.props.group}
                        handleEdit={this.handleEdit}
                        allGroups={this.props.allGroups}
                        workoutName={workout.name}
                        link={workout.link}
                        workoutId={workout.id}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="workoutContainerFooter">
          <NewWorkout onSubmit={this.handleAdd} group={this.props.group} />
        </div>
      </div>
    );
  }
}

export default WorkoutsContainer;
