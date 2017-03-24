import React, { PropTypes } from 'react';


const { number, string, func } = PropTypes;
const propTypes = {
  className: string.isRequired,
  boundFunction: func.isRequired,
  activeClass: string,
  delay: number,
  defaultValue: string,
  placeholder: string,
};

const defaultProps = {
  defaultValue: "",
  placeholder: "",
  activeClass: "",
  delay: 500,
};

class DebouncedInput extends React.Component {
  constructor(props) {
    super(props);
    const {
      boundFunction,
      delay,
    } = props;

    this.state = {
      active: false,
    };

    this.debouncedKeyPressHandler = this.debouncer(boundFunction, delay);
    this.keyPressHandler = this.keyPressHandler.bind(this);
  }

  debouncer(F, context = null, delay = 200) {
    let id;

    return function debounced() {
      clearTimeout(id);
      id = setTimeout(() => {
        this.setState({ active: false });
        F(this.input.value);
      }, delay);
    };
  }

  getInputClass() {
    const {
      className,
      activeClass,
    } = this.props;
    const {
      active,
    } = this.state;

    if (active) {
      return `${className} ${activeClass}`;
    }
    return className;
  }

  keyPressHandler() {
    const {
      active,
    } = this.state;

    if (!active) {
      this.setState({ active: true });
    }
    this.debouncedKeyPressHandler();
  }

  render() {
    const {
      defaultValue,
      placeholder,
    } = this.props;

    return (
      <input
        className={ this.getInputClass() }
        onChange={ this.keyPressHandler }
        defaultValue={ defaultValue }
        ref={ ref => this.input = ref }
        placeholder={ placeholder }/>
    );
  }
}

DebouncedInput.propTypes = propTypes;
export default DebouncedInput;
