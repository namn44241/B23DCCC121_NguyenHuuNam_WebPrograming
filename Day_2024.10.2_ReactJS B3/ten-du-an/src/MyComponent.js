import React from 'react';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 3 };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}

export default Counter;
