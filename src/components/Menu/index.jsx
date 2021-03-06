import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.styl'

export const Item = ({ children, onClick }) => (
  <div onClick={onClick} className={styles['coz-menu-item']}>
    {children}
  </div>
)

export default class Menu extends Component {
  state = { opened: false }

  toggle = () => (this.state.opened ? this.close() : this.open())

  handleClickOutside = e => {
    if (!this.container.contains(e.target)) {
      e.stopPropagation()
      this.close()
    }
  }

  handleSelect = (item, e) => {
    this.close()
  }

  open() {
    this.setState({ opened: true })
    document.addEventListener('click', this.handleClickOutside, true)
  }

  close() {
    this.setState({ opened: false })
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  renderItems() {
    return React.Children.map(this.props.children, item => {
      if (!item) return item
      // ideally here, we should rely on React's type property and verify that
      // type === Item, but for some reason, preact vnodes don't have this property
      if (item.nodeName !== 'hr') {
        return React.cloneElement(item, {
          onClick: this.handleSelect.bind(this, item)
        })
      }
      return React.cloneElement(item)
    })
  }

  render() {
    const {
      title,
      disabled,
      className,
      innerClassName,
      button,
      buttonClassName
    } = this.props
    const { opened } = this.state
    return (
      <div
        className={classNames(styles['coz-menu'], className)}
        ref={ref => {
          this.container = ref
        }}
      >
        {button &&
          React.cloneElement(button, { disabled, onClick: this.toggle })}
        {!button && (
          <button
            role="button"
            className={buttonClassName || styles['c-btn']}
            disabled={disabled}
            onClick={this.toggle}
          >
            {title}
          </button>
        )}
        <div
          className={classNames(styles['coz-menu-inner'], innerClassName, {
            [styles['coz-menu-inner--opened']]: opened
          })}
        >
          {this.renderItems()}
        </div>
      </div>
    )
  }
}
