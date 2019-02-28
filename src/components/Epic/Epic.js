import React from 'react';
import PropTypes from 'prop-types';
import getClassName from '../../helpers/getClassName';
import classNames from '../../lib/classNames';

const baseClassName = getClassName('Epic');

const Epic = props => {
  const { className, activeStory, tabbar, children, ...restProps } = props;

  return (
    <div {...restProps} className={classNames(baseClassName, className)}>
      {React.Children.toArray(children).find(item => item.props.id === activeStory)}
      {tabbar}
    </div>
  );
};

Epic.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  tabbar: PropTypes.node.isRequired,
  activeStory: PropTypes.string.isRequired
};

export default Epic;
