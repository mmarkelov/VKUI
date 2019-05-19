import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopoutWrapper from '../PopoutWrapper/PopoutWrapper';
import getClassName from '../../helpers/getClassName';
import classNames from '../../lib/classNames';
import { IS_PLATFORM_IOS, IS_PLATFORM_ANDROID } from '../../lib/platform';
import transitionEvents from '../../lib/transitionEvents';
import withInsets from '../../hoc/withInsets';

const baseClassNames = getClassName('ActionSheet');

const ActionSheet = props => {
  const el = React.createRef();
  const [closing, setClosing] = useState(false);

  const onClose = () => {
    setClosing(true);
    waitTransitionFinish(props.onClose);
  };

  const onItemClick = (action, autoclose) => event => {
    event.persist();

    if (autoclose) {
      setClosing(true);
      waitTransitionFinish(() => {
        autoclose && props.onClose();
        action && action(event);
      });
    } else {
      action && action(event);
    }
  };

  const stopPropagation = e => e.stopPropagation();

  const waitTransitionFinish = eventHandler => {
    if (transitionEvents.supported) {
      const eventName = transitionEvents.prefix ? transitionEvents.prefix + 'TransitionEnd' : 'transitionend';

      el.current.removeEventListener(eventName, eventHandler);
      el.current.addEventListener(eventName, eventHandler);
    } else {
      setTimeout(eventHandler.bind(this), IS_PLATFORM_ANDROID ? 200 : 300);
    }
  };

  const { children, className, title, text, style, insets, ...restProps } = props;

  return (
    <PopoutWrapper
      closing={closing}
      v={IS_PLATFORM_IOS ? 'bottom' : 'center'}
      h="center"
      className={className}
      style={style}
      onClick={onClose}
    >
      <div {...restProps} ref={el} onClick={stopPropagation} className={classNames(baseClassNames, {
        'ActionSheet--closing': closing
      })}>
        {IS_PLATFORM_IOS &&
          <header className="ActionSheet__header">
            {title && <div className="ActionSheet__title">{title}</div>}
            {text && <div className="ActionSheet__text">{text}</div>}
          </header>
        }
        {React.Children.toArray(children).map((Child, index, arr) => (
          Child && React.cloneElement(Child, {
            onClick: onItemClick(Child.props.onClick, Child.props.autoclose),
            style: index === arr.length - 1 && insets.bottom ? { marginBottom: insets.bottom } : null
          })
        ))}
      </div>
    </PopoutWrapper>
  );
};

ActionSheet.propTypes = {
  /**
   * iOS only
   */
  title: PropTypes.node,
  /**
   * iOS only
   */
  text: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * @ignore
   */
  insets: PropTypes.object
};

export default withInsets(ActionSheet);
