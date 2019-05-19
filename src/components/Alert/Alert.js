
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tappable from '../Tappable/Tappable';
import PopoutWrapper from '../PopoutWrapper/PopoutWrapper';
import getClassName from '../../helpers/getClassName';
import classNames from '../../lib/classNames';
import transitionEvents from '../../lib/transitionEvents';
import { IS_PLATFORM_ANDROID } from '../../lib/platform';

const baseClassNames = getClassName('Alert');

const Alert = props => {
  const [closing, setClosing] = useState(false);
  const element = React.createRef();

  const onItemClick = item => () => {
    const { action, autoclose } = item;

    if (autoclose) {
      setClosing(true);
      waitTransitionFinish(() => {
        autoclose && props.onClose();
        action && action();
      });
    } else {
      action && action();
    }
  };

  const onClose = () => {
    setClosing(true);
    waitTransitionFinish(() => {
      props.onClose();
    });
  };

  const stopPropagation = e => e.stopPropagation();

  const waitTransitionFinish = eventHandler => {
    if (transitionEvents.supported) {
      const eventName = transitionEvents.prefix ? transitionEvents.prefix + 'TransitionEnd' : 'transitionend';

      element.current.removeEventListener(eventName, eventHandler);
      element.current.addEventListener(eventName, eventHandler);
    } else {
      setTimeout(eventHandler.bind(this), IS_PLATFORM_ANDROID ? 200 : 300);
    }
  };

  const { actions, actionsLayout, children, className, style, ...restProps } = props;

  return (
    <PopoutWrapper
      closing={closing}
      style={style}
      onClick={onClose}
    >
      <div {...restProps} ref={element} onClick={stopPropagation} className={classNames(baseClassNames, {
        'Alert--v': actionsLayout === 'vertical',
        'Alert--h': actionsLayout === 'horizontal',
        'Alert--closing': closing
      })}>
        <div className="Alert__content">{children}</div>
        <footer className="Alert__footer">
          {actions.map((button, i) => (
            <Tappable
              component="button"
              className={classNames('Alert__btn', { [`Alert__btn--${button.style}`]: button.style })}
              onClick={onItemClick(button)}
              key={`alert-action-${i}`}
            >
              <span dangerouslySetInnerHTML={{ __html: button.title }} />
            </Tappable>
          ))}
        </footer>
      </div>
    </PopoutWrapper>
  );
};

Alert.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  actionsLayout: PropTypes.oneOf(['vertical', 'horizontal']),
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    action: PropTypes.func,
    /**
     * 'cancel' - iOS only
     */
    style: PropTypes.oneOf(['cancel', 'destructive', 'default'])
  })),
  onClose: PropTypes.func.isRequired
};

Alert.defaultProps = {
  actionsLayout: 'horizontal',
  actions: []
};

export default Alert;
