import React, { Component } from 'react';
import './Task.css';

import TextareaAutosize from 'react-autosize-textarea';

function TaskCheckBox({ isDone, onClick }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}
      onClick={onClick}
    >
      <div
        className="TaskCheckBox"
        style={{
          background: isDone ? 'rgba(255, 0, 0, 1)' : 'transparent',
        }}
      />
    </div>
  );
}

function NumericInput({ value, onChange, placeholder, onKeyDown, isDone }) {
  return (
    <input
      type="text"
      maxLength="2"
      value={value}
      onChange={onChange}
      className="DayBlock-tasks-inputTime"
      placeholder={placeholder}
      style={{
        background: isDone ? 'rgba(255, 214, 214, 1)' : '#fff',
      }}
      onKeyDown={onKeyDown}
    />
  );
}

class Task extends Component {
  handleChange = (id, evt, type) => {
    const { task } = this.props;
    if (!task) return;
    if (type === 'text') {
      const newTask = { ...task, text: evt.target.value };

      this.props.onUpdateTask(id, newTask);
    } else if (type === 'hours') {
      const newTask = { ...task, timeH: evt.target.value };
      this.props.onUpdateTask(id, newTask);
    } else if (type === 'minutes') {
      const newTask = { ...task, timeMin: evt.target.value };
      this.props.onUpdateTask(id, newTask);
    }
  };

  markTaskAsDone = id => {
    const { task } = this.props;
    if (!task) return;
    const newTask = { ...task, isDone: !task.isDone };
    this.props.onUpdateTask(id, newTask);
  };

  render() {
    const { task } = this.props;
    const isValid = text => /^\d+$/.test(text) || text === '';

    return (
      <li
        key={task.id}
        style={{
          background: task.isDone ? 'rgba(255, 214, 214, 1)' : '#fff',
        }}
      >
        <TaskCheckBox
          onClick={task.text != '' ? () => this.markTaskAsDone(task.id) : null}
          isDone={task.isDone}
        />
        <TextareaAutosize
          type="text"
          maxRows={5}
          rows={1}
          onChange={evt =>
            !task.isDone ? this.handleChange(task.id, evt, 'text') : null
          }
          value={task.text}
          className="DayBlock-tasks-inputText"
          placeholder="Task"
          style={{
            background: task.isDone ? 'rgba(255, 214, 214, 1)' : '#fff',
          }}
          innerRef={element => {
            if (element) {
              this.props.inputs[task.id] = element;
            } else {
              delete this.props.inputs[task.id];
            }
          }}
          onKeyDown={evt =>
            evt.keyCode === 8 && task.text === ''
              ? this.props.deleteTask(task.id)
              : null
          }
        />
        <NumericInput
          value={task.timeH}
          onChange={evt =>
            isValid(evt.target.value)
              ? this.handleChange(task.id, evt, 'hours')
              : null
          }
          isDone={task.isDone}
          placeholder="h"
          onKeyDown={() => {}}
        />
        :
        <NumericInput
          value={task.timeMin}
          onChange={evt =>
            isValid(evt.target.value)
              ? this.handleChange(task.id, evt, 'minutes')
              : null
          }
          isDone={task.isDone}
          placeholder="m"
          onKeyDown={evt =>
            evt.keyCode === 13 ? this.props.addNewTask() : null
          }
        />
      </li>
    );
  }
}

export default Task;
