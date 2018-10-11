import React, { Component } from 'react';
import './DayBlock.css';

import { FaPlusCircle } from 'react-icons/fa';

import Task from './Task';

function BlockHeader({
  title,
  isOpen,
  onClick,
  totalDayHours,
  totalDayMinutes,
}) {
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
        {totalDayHours}:
        {totalDayMinutes < 10 ? `0${totalDayMinutes}` : totalDayMinutes} h
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
    if (this.props.tasks.length > 1) {
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
    const { isOpen, tasks } = this.props;

    const hoursAmount = tasks.reduce(
      (acc, item) => acc + parseFloat(item.timeH === '' ? 0 : item.timeH),
      0,
    );
    const minutesAmount = tasks.reduce(
      (acc, item) => acc + parseFloat(item.timeMin === '' ? 0 : item.timeMin),
      0,
    );
    const totalMinutesAmount = hoursAmount * 60 + minutesAmount;
    const showedHoursAmount = Math.trunc(totalMinutesAmount / 60);
    const showedMinutesAmount = totalMinutesAmount % 60;

    return (
      <div className="dayBlock">
        <BlockHeader
          title={this.props.day}
          onClick={this.handleToggle}
          isOpen={isOpen}
          totalDayHours={showedHoursAmount}
          totalDayMinutes={showedMinutesAmount}
        />
        {isOpen ? (
          <React.Fragment>
            <ul className="dayBlock-tasks">
              {tasks.map(task => (
                <Task
                  key={task.id}
                  task={task}
                  onUpdateTask={(id, newTask) => this.updateTask(id, newTask)}
                  addNewTask={this.addNewTask}
                  deleteTask={id => this.deleteTask(id)}
                  inputs={this.inputs}
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
