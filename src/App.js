import React, { Component } from 'react';
import './App.css';

import logo from './img/logo.png';
import { defaultData } from './data';
import DayBlock from './components/DayBlock';

let id = 7;

function Header() {
  return (
    <h1 className="header">
      <span style={{ cursor: 'pointer' }}>Crclm</span>
    </h1>
  );
}

const defaultStartWeekDay = 1;
const defaultWasUpdatedForNewWeek = false;

function loadData() {
  const _id = localStorage.getItem('lastId');
  if (_id) {
    id = parseInt(_id);
  }
  const data = localStorage.getItem('data');
  if (data) {
    return JSON.parse(data);
  } else {
    return defaultData;
  }
}

function loadStartWeekDay() {
  const startWeekDay = localStorage.getItem('startWeekDay');
  if (startWeekDay) {
    return parseInt(startWeekDay);
  } else {
    return defaultStartWeekDay;
  }
}

function loadWasUpdatedForNewWeek() {
  const wasUpdatedForNewWeek = localStorage.getItem('wasUpdatedForNewWeek');
  if (wasUpdatedForNewWeek) {
    return wasUpdatedForNewWeek === 'true';
  } else {
    return defaultWasUpdatedForNewWeek;
  }
}

class App extends Component {
  state = {
    data: loadData(),
    startWeekDay: loadStartWeekDay(),
    wasUpdatedForNewWeek: loadWasUpdatedForNewWeek(),
  };

  componentDidMount() {
    const today = new Date();
    const day = today.getDay();
    if (day === this.state.startWeekDay && !this.state.wasUpdatedForNewWeek) {
      const newData = this.state.data.map(item => ({
        ...item,
        tasks: item.tasks.map(task => ({ ...task, isDone: false })),
      }));
      this.setState({ data: newData, wasUpdatedForNewWeek: true });
    } else if (day != this.state.startWeekDay) {
      this.setState({ wasUpdatedForNewWeek: false });
    }
  }

  componentDidUpdate() {
    localStorage.setItem('data', JSON.stringify(this.state.data));
    localStorage.setItem('lastId', id.toString());
    localStorage.setItem('startWeekDay', this.state.startWeekDay.toString());
    localStorage.setItem(
      'wasUpdatedForNewWeek',
      this.state.wasUpdatedForNewWeek.toString(),
    );
  }

  toggleDay = day => {
    this.setState(state => {
      return {
        data: state.data.map(
          item => (item.day === day ? { ...item, isOpen: !item.isOpen } : item),
        ),
      };
    });
  };

  updateData = (tasks, day) => {
    const newData = this.state.data.map(
      item => (item.day === day ? { ...item, tasks } : item),
    );
    this.setState({ data: newData });
  };

  updateTask = (day, id, newTask) => {
    const newData = this.state.data.map(item => {
      if (item.day === day) {
        return {
          ...item,
          tasks: item.tasks.map(task => (task.id === id ? newTask : task)),
        };
      } else {
        return item;
      }
    });
    this.setState({ data: newData });
  };

  createTask = day => {
    const newTask = {
      id: id++,
      text: '',
      timeH: '',
      timeMin: '',
      isDone: false,
    };
    const newData = this.state.data.map(item => {
      if (item.day === day) {
        return {
          ...item,
          tasks: [...item.tasks, newTask],
        };
      } else {
        return item;
      }
    });
    this.setState({ data: newData });
    return newTask.id;
  };

  deleteTask = (day, id) => {
    const newData = this.state.data.map(item => {
      if (item.day === day) {
        return {
          ...item,
          tasks: item.tasks.filter(task => task.id != id),
        };
      } else {
        return item;
      }
    });
    this.setState({ data: newData });
  };

  closeBlocks = () => {
    const newData = this.state.data.map(item => ({
      ...item,
      isOpen: false,
    }));
    this.setState({ data: newData });
  };

  render() {
    const firstColumnList = this.state.data.slice(0, 3);
    const secondColumnList = this.state.data.slice(3, 6);
    const lists = [firstColumnList, secondColumnList];

    return (
      <div
        className="App"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: 'center',
          backgroundSize: '500px 500px',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
        }}
      >
        <Header />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={this.closeBlocks}
        />
        <div className="curriculum">
          {lists.map((list, idx) => (
            <div key={idx} className="curriculum-column">
              {list.map(item => (
                <DayBlock
                  key={item.day}
                  day={item.day}
                  tasks={item.tasks}
                  updateTasks={tasks => this.updateData(tasks, item.day)}
                  isOpen={item.isOpen}
                  toggle={() => this.toggleDay(item.day)}
                  onCreate={() => this.createTask(item.day)}
                  onUpdate={(id, newTask) =>
                    this.updateTask(item.day, id, newTask)
                  }
                  onDelete={id => this.deleteTask(item.day, id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
