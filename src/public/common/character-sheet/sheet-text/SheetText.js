import React from 'react';
import PropTypes from 'prop-types';

class SheetText extends React.Component {
    createForm() {
        if(this.props.label !== undefined) {
            return (
                <span className = 'labelText'>
                    {this.props.label}
                </span>
            )
        }

    }
    createText() {
        if(this.props.text !== undefined) {
            return (
                <span className = 'textText'>
                    :&nbsp;{this.props.text}
                </span>
            )
        }

    }

  createTextField() {
      if(this.props.textField) {
          return (
             <span className = 'inputText'>:&nbsp;<input type="text" name={this.props.label} /></span>
          )
      }
  }

  render() {
    return (
     <div className = 'text-field'>
     <form>
        <label>
            {this.createForm()}
            {this.createTextField()}
            {this.createText()}
        </label>
    </form>
    </div>
    );
  }
}

SheetText.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
  textField: PropTypes.bool,
};

export default SheetText;
