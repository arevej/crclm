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
        padding: 5,
      }}
      onClick={onClick}
    >
      <div
        className="taskCheckBox"
        style={{
          background: isDone ? 'rgba(255, 0, 0, 1)' : 'transparent',
        }}
      />
    </div>
  );
}

// value = number
// onChange = (number) => {}
function NumericInput({ innerRef, value, onChange, ...rest }) {
  return (
    <input
      ref={innerRef}
      type="text"
      value={value == 0 ? '' : value.toString()}
      onChange={evt => {
        const newValue = evt.target.value.replace(/\D/, '');
        if (newValue === '') {
          onChange(0);
        } else {
          onChange(parseInt(newValue));
        }
      }}
      className="numericInput"
      style={{
        background: 'transparent',
      }}
      {...rest}
    />
  );
}

function TimeInput({ innerRef, minutes, onChangeMinutes, onEnterPress }) {
  const wholeHours = Math.floor(minutes / 60);
  const wholeMinutes = minutes % 60;
  return (
    <React.Fragment>
      <NumericInput
        innerRef={innerRef}
        value={wholeHours}
        onChange={newHours => onChangeMinutes(newHours * 60 + wholeMinutes)}
        placeholder="h"
        maxLength="2"
        onKeyDown={() => {}}
      />
      :
      <NumericInput
        value={wholeMinutes}
        onChange={newMinutes => onChangeMinutes(wholeHours * 60 + newMinutes)}
        placeholder="m"
        maxLength="2"
        onKeyDown={evt => (evt.keyCode === 13 ? onEnterPress() : null)}
      />
    </React.Fragment>
  );
}

class Task extends Component {
  _timeInputRef = null;

  handleTextChange = evt => {
    const { task } = this.props;
    const newTask = { ...task, text: evt.target.value };
    this.props.onUpdateTask(newTask);
  };

  handleTimeChange = num => {
    const { task } = this.props;
    const newTask = { ...task, time: num };
    this.props.onUpdateTask(newTask);
  };

  markTaskAsDone = () => {
    const { task } = this.props;
    const newTask = { ...task, isDone: !task.isDone };
    this.props.onUpdateTask(newTask);
  };

  render() {
    const { task } = this.props;

    return (
      <li
        key={task.id}
        style={{
          background: task.isDone ? 'rgba(255, 214, 214, 1)' : '#fff',
        }}
        className="task"
      >
        <TaskCheckBox
          onClick={task.text != '' ? () => this.markTaskAsDone() : null}
          isDone={task.isDone}
        />
        <TextareaAutosize
          type="text"
          maxRows={5}
          rows={1}
          onChange={evt => (!task.isDone ? this.handleTextChange(evt) : null)}
          value={task.text}
          className="inputText"
          placeholder="Task"
          style={{
            background: 'transparent',
          }}
          innerRef={this.props.innerRef}
          onKeyDown={evt => {
            if (evt.keyCode === 8 && task.text === '') {
              this.props.deleteTask();
            } else if (evt.keyCode === 13) {
              if (evt.shiftKey) {
                // noop
              } else if (evt.metaKey) {
                this.markTaskAsDone();
              } else {
                evt.preventDefault();
                this._timeInputRef.focus();
              }
            }
          }}
        />
        <TimeInput
          innerRef={ref => (this._timeInputRef = ref)}
          minutes={task.time}
          onChangeMinutes={this.handleTimeChange}
          onEnterPress={this.props.addNewTask}
        />
      </li>
    );
  }
}

export default Task;
