import { Component } from 'react';
import { createPortal } from 'react-dom';

class DOMPortal extends Component {
  render() {
    return createPortal(
      this.props.children,
      this.props.container,
    );
  }
}

export default DOMPortal