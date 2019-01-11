import React, { Component } from 'react';
import './DayBlock.css';

import { FaPlusCircle } from 'react-icons/fa';

import Task from './Task';

function formatMinutesAsHoursAndMinutes(totalMinutes) {
  const shownHoursAmount = Math.floor(totalMinutes / 60);
  const shownMinutesAmount = totalMinutes % 60;

  return `${shownHoursAmount}:${
    shownMinutesAmount < 10 ? `0${shownMinutesAmount}` : shownMinutesAmount
  }`;
}

function BlockHeader({ title, isOpen, onClick, totalDayMinutes }) {
  return (
    <div
      className="blockHeader"
      onClick={onClick}
      style={{
        borderBottomLeftRadius: isOpen ? 0 : 5,
        borderBottomRightRadius: isOpen ? 0 : 5,
      }}
    >
      {title}
      <div className="blockHeader-totalDayTime">
        {formatMinutesAsHoursAndMinutes(totalDayMinutes)} h
      </div>
    </div>
  );
}

function AddButton({ onClick }) {
  return (
    <div className="addButton" onClick={onClick}>
      <FaPlusCircle color="rgba(255, 0, 0, 1)" />
    </div>
  );
}

class DayBlock extends Component {
  inputs = {};

  handleToggle = () => {
    this.props.toggle();
  };

  deleteTask = id => {
    const { tasks } = this.props;
    if (tasks.length === 1) return;
    this.props.onDelete(id);
    const currentTask = tasks.find(task => task.id === id);
    const currentTaskIndex = tasks.indexOf(currentTask);
    const previousTask = tasks[currentTaskIndex - 1];
    if (previousTask) {
      const element = this.inputs[previousTask.id];
      if (element) {
        setTimeout(() => element.focus(), 0);
      }
    }
  };

  addNewTask = () => {
    const _id = this.props.onCreate();
    setTimeout(() => {
      const element = this.inputs[_id];
      if (element) {
        element.focus();
      }
    }, 100);
  };

  updateTask = (id, newTask) => {
    this.props.onUpdate(id, newTask);
  };

  render() {
    const { isOpen, tasks, day } = this.props;

    const totalMinutes = tasks.reduce((acc, item) => acc + item.time, 0);

    return (
      <div className="dayBlock">
        <BlockHeader
          title={day}
          onClick={this.handleToggle}
          isOpen={isOpen}
          totalDayMinutes={totalMinutes}
        />
        {isOpen ? (
          <React.Fragment>
            <ul className="dayBlock-tasks">
              {tasks.map(task => (
                <Task
                  key={task.id}
                  task={task}
                  onUpdateTask={newTask => this.updateTask(task.id, newTask)}
                  addNewTask={this.addNewTask}
                  deleteTask={() => this.deleteTask(task.id)}
                  innerRef={element => {
                    if (element) {
                      this.inputs[task.id] = element;
                    } else {
                      delete this.inputs[task.id];
                    }
                  }}
                />
              ))}
            </ul>
            <AddButton onClick={this.addNewTask} />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default DayBlock;
