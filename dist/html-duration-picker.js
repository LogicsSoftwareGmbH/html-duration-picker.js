(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HtmlDurationPicker"] = factory();
	else
		root["HtmlDurationPicker"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* global PICKER_STYLES_CSS_CONTENTS */

/**
 * @preserve
 * html-duration-picker.js
 *
 * @description Turn an html input box to a duration picker, without jQuery
 * @version 2.4.0
 * @author Chif <nadchif@gmail.com>
 * @license Apache-2.0
 *
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function () {
  // IE9+ support forEach:
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  /*
  DO NOT CHANGE THE LINE BELOW. IT IS REQUIRED TO INSERT STYLES FROM 'style.css'
  */
  var pickerStyles = "input {\tfont-family: monospace;}.html-duration-picker-input-controls-wrapper .html-duration-picker {  padding-right: 20px;  box-sizing: border-box;  width: 100%;  margin: 0;  cursor: pointer;}.html-duration-picker-input-controls-wrapper .scroll-btn {  text-align: center;  width: 16px;  padding: 0 4px;  border: none;  cursor: default;  position: absolute;  height: 10.5px !important;}.html-duration-picker-input-controls-wrapper .scroll-btn.scrollUpBtn {\ttop: 1px;}.html-duration-picker-input-controls-wrapper .scroll-btn.scrollDownBtn {\ttop: 10.5px;}.html-duration-picker-input-controls-wrapper .caret {  width: 0;  height: 0;  border-style: solid;}.html-duration-picker-input-controls-wrapper .caret.caret-up {  border-width: 0 4px 5px 4px;  border-color: transparent transparent #000 transparent;}.html-duration-picker-input-controls-wrapper .caret.caret-down {  border-width: 5px 4px 0 4px;  border-color: #000 transparent transparent transparent;}.html-duration-picker-input-controls-wrapper .controls {  display: inline-block;  position: absolute;  top: 1px;  padding: 2px 0;  right: 37px;  height: 23px;}.clearButton {\tposition:absolute;\tright:12px;\tborder:none;\ttop:50%;\ttransform:translateY(-50%);}.html-duration-picker-input-controls-wrapper {  display: inline-block;  position: relative;  background: transparent;  padding: 0;  box-sizing: border-box;}input.html-duration-picker::placeholder {\tcolor: #2A95D2;}";
  /*
  DO NOT CHANGE THE LINE ABOVE. IT IS REQUIRED TO INSERT STYLES FROM 'style.css'
  */

  /**
   * Get current cursor selection
   * @param {Event} event
   * @param {Boolean} hideSeconds - should this picker show seconds or not
   * @return {{cursorSelection: 'hours' | 'minutes' | 'seconds',
   *  hideSeconds: Boolean, hourMarker: Number, minuteMarker: Number, content: String}}
   */

  var getCursorSelection = function getCursorSelection(event, hideSeconds) {
    var _event$target = event.target,
      selectionStart = _event$target.selectionStart,
      selectionEnd = _event$target.selectionEnd,
      value = _event$target.value;
    var hourMarker = value.indexOf(':');
    var minuteMarker = value.lastIndexOf(':');
    var cursorSelection;
    // The cursor selection is: hours
    if (selectionStart <= hourMarker) {
      cursorSelection = 'hours';
    } else if (hideSeconds || selectionStart <= minuteMarker) {
      // The cursor selection is: minutes
      cursorSelection = 'minutes';
    } else if (!hideSeconds && selectionStart > minuteMarker) {
      // The cursor selection is: seconds
      cursorSelection = 'seconds';
    }
    var content = value.slice(selectionStart, selectionEnd);
    return {
      cursorSelection: cursorSelection,
      hideSeconds: hideSeconds,
      hourMarker: hourMarker,
      minuteMarker: minuteMarker,
      content: content
    };
  };

  /**
   * Set the 'data-adjustment-factor' attribute for a picker
   * @param {*} inputBox
   * @param {3600 | 60 | 1} adjustmentFactor
   */
  var updateActiveAdjustmentFactor = function updateActiveAdjustmentFactor(inputBox, adjustmentFactor) {
    inputBox.setAttribute('data-adjustment-factor', adjustmentFactor);
  };
  var handleInputFocus = function handleInputFocus(event) {
    // get input selection
    var inputBox = event.target;
    var _getMinMaxConstraints = getMinMaxConstraints(inputBox),
      maxDuration = _getMinMaxConstraints.maxDuration;
    var maxHourInput = Math.floor(maxDuration / 3600);
    var charsForHours = maxHourInput < 1 ? 0 : maxHourInput.toString().length;

    /* this is for firefox and safari, when you focus using tab key, both selectionStart
    and selectionEnd are 0, so manually trigger hour seleciton. */
    if (event.target.selectionEnd === 0 && event.target.selectionStart === 0 || event.target.selectionEnd - event.target.selectionStart > charsForHours || charsForHours === 0) {
      setTimeout(function () {
        inputBox.focus();
        inputBox.select();
        highlightTimeUnitArea(inputBox, 3600);
      }, 1);
    }
  };
  /**
   * Gets the position of the cursor after a click event, then matches to
   * time interval (hh or mm or ss) and selects (highlights) the entire block
   * @param {Event} event - focus/click event
   * @return {void}
   */
  var handleClickFocus = function handleClickFocus(event) {
    var inputBox = event.target;
    var hideSeconds = shouldHideSeconds(inputBox);
    // Gets the cursor position and select the nearest time interval
    var _getCursorSelection = getCursorSelection(event, hideSeconds),
      cursorSelection = _getCursorSelection.cursorSelection,
      hourMarker = _getCursorSelection.hourMarker,
      minuteMarker = _getCursorSelection.minuteMarker;

    // Something is wrong with the duration format.
    if (!cursorSelection) {
      return;
    }
    var cursorAdjustmentFactor = hideSeconds ? 3 : 0;
    switch (cursorSelection) {
      case 'hours':
        updateActiveAdjustmentFactor(inputBox, 3600);
        event.target.setSelectionRange(0, hourMarker);
        return;
      case 'minutes':
        updateActiveAdjustmentFactor(inputBox, 60);
        event.target.setSelectionRange(hourMarker + 1, minuteMarker + cursorAdjustmentFactor);
        return;
      case 'seconds':
        updateActiveAdjustmentFactor(inputBox, 1);
        event.target.setSelectionRange(minuteMarker + 1, minuteMarker + 3);
        return;
      default:
        updateActiveAdjustmentFactor(inputBox, 1);
        event.target.setSelectionRange(minuteMarker + 1, minuteMarker + 3);
        return;
    }
  };
  var handleClearInput = function handleClearInput(inputBox) {
    inputBox.value = "";
    inputBox.placeholder = shouldHideSeconds(inputBox) ? "--:--" : "--:--:--";
  };

  /**
   * Get whether the picker passed must hide seconds
   * @param {*} inputBox
   * @return {Boolean}
   */
  var shouldHideSeconds = function shouldHideSeconds(inputBox) {
    return inputBox.dataset.hideSeconds !== undefined && inputBox.dataset.hideSeconds !== 'false';
  };

  /**
   * Manually creates and fires an Event
   * @param {*} type
   * @param {*} option - event options
   * @return {Event}
   */
  var createEvent = function createEvent(type) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      bubbles: false,
      cancelable: false
    };
    // if (typeof Event === 'function') {
    //   return new Event(type, option);
    // } else {
    var event = document.createEvent('Event');
    event.initEvent(type, option.bubbles, option.cancelable);
    return event;
    // }
  };

  /**
   *
   * @param {*} inputBox
   * @param {Number} secondsValue value in seconds
   * @param {Boolean} dispatchSyntheticEvents whether to manually fire 'input' and 'change' event for other event listeners to get it
   * @param {Number} adjustmentFactor the adjustment factor in seconds
   */
  var insertFormatted = function insertFormatted(inputBox, secondsValue, dispatchSyntheticEvents) {
    var adjustmentFactor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var hideSeconds = shouldHideSeconds(inputBox);
    var formattedValue;
    if (secondsValue === "") {
      formattedValue = "";
      inputBox.placeholder = shouldHideSeconds(inputBox) ? "--:--" : "--:--:--";
    } else {
      formattedValue = secondsToDuration(secondsValue, hideSeconds);
    }
    var existingValue = inputBox.value;
    // Don't use setValue method here because
    // it breaks the arrow keys and arrow buttons control over the input
    inputBox.value = formattedValue;
    // save current cursor location for automatic increase

    // manually trigger an "input" event for other event listeners
    if (dispatchSyntheticEvents !== false) {
      if (existingValue != formattedValue) {
        inputBox.dispatchEvent(createEvent('change', {
          bubbles: true,
          cancelable: true
        }));
      }
      inputBox.dispatchEvent(createEvent('input'));
    }
    inputBox.setAttribute('data-adjustment-factor', adjustmentFactor);
    console.log({
      adjustmentFactor: adjustmentFactor
    });
    if (inputBox.value === "") {
      return;
    }
    highlightTimeUnitArea(inputBox, adjustmentFactor);
  };

  /**
   * Highlights/selects the time unit area hh, mm or ss of a picker
   * @param {*} inputBox
   * @param {3600 |60 | 1} adjustmentFactor
   * @param {Boolean} forceInputFocus
   */
  var highlightTimeUnitArea = function highlightTimeUnitArea(inputBox, adjustmentFactor) {
    if (inputBox.value === "") {
      return;
    }
    var hourMarker = inputBox.value.indexOf(':');
    var minuteMarker = inputBox.value.lastIndexOf(':');
    var hideSeconds = shouldHideSeconds(inputBox);
    var sectioned = inputBox.value.split(':');
    if (adjustmentFactor >= 60 * 60) {
      inputBox.selectionStart = 0; // hours mode
      inputBox.selectionEnd = hourMarker;
    } else if (!hideSeconds && adjustmentFactor < 60 && sectioned[2]) {
      inputBox.selectionStart = minuteMarker + 1; // seconds mode
      inputBox.selectionEnd = minuteMarker + 1 + sectioned[2].length;
      // inputBox.selectionEnd = minuteMarker + 3;
    } else if (sectioned[1]) {
      inputBox.selectionStart = hourMarker + 1; // minutes mode
      inputBox.selectionEnd = hourMarker + 1 + sectioned[1].length;
      // inputBox.selectionEnd = hourMarker + 3;
      adjustmentFactor = 60;
    }
    if (adjustmentFactor >= 1 && adjustmentFactor <= 3600) {
      inputBox.setAttribute('data-adjustment-factor', adjustmentFactor);
    }
  };
  // gets the adjustment factor for a picker
  var getAdjustmentFactor = function getAdjustmentFactor(inputBox) {
    var adjustmentFactor = 1;
    if (Number(inputBox.getAttribute('data-adjustment-factor')) > 0) {
      adjustmentFactor = Number(inputBox.getAttribute('data-adjustment-factor'));
    }
    return adjustmentFactor;
  };

  /**
   * set value for a picker
   * @param {*} inputBox
   * @param {*} value
   */
  // eslint-disable-next-line no-unused-vars
  var setValue = function setValue(inputBox, value) {
    // This is a "cross-browser" way to set the input value
    // that doesn't cause the cursor jumping to the end of the input on Safari
    // inputBox.value = value;
    inputBox.setAttribute('value', value);
  };

  /**
   * Increases or decreases duration value by up and down arrow keys
   * @param {*} inputBox
   * @param {'up' | 'down'} direction
   */
  var changeValueByArrowKeys = function changeValueByArrowKeys(inputBox, direction) {
    var adjustmentFactor = getAdjustmentFactor(inputBox);
    var secondsValue = durationToSeconds(inputBox.value);
    switch (direction) {
      case 'up':
        secondsValue += adjustmentFactor;
        break;
      case 'down':
        secondsValue -= adjustmentFactor;
        if (secondsValue < 0) {
          secondsValue = 0;
        }
        break;
    }
    var constrainedValue = applyMinMaxConstraints(inputBox, secondsValue);
    // Updating with arrow keys does not fire the change event, so we must fire it synthetically
    insertFormatted(inputBox, constrainedValue, true, adjustmentFactor);
  };

  /**
   * shift focus (text selection) between hh, mm, and ss with left and right arrow keys;
   * @param {*} inputBox
   * @param {'left' | 'right'} direction
   */
  var shiftTimeUnitAreaFocus = function shiftTimeUnitAreaFocus(inputBox, direction) {
    var adjustmentFactor = getAdjustmentFactor(inputBox);
    switch (direction) {
      case 'left':
        highlightTimeUnitArea(inputBox, adjustmentFactor < 3600 ? adjustmentFactor * 60 : 3600);
        break;
      case 'right':
        highlightTimeUnitArea(inputBox, adjustmentFactor > 60 ? adjustmentFactor / 60 : 1);
        break;
      default:
    }
  };

  /**
   * Checks if a given string value is in valid duration format
   * @param {String} value
   * @param {Boolean} hideSeconds
   * @param {Boolean} strictMode if set to false, time like 3:3:59 will be considered valid
   * @return {Boolean}
   */
  var isValidDurationFormat = function isValidDurationFormat(value, hideSeconds, strictMode) {
    var pattern;
    if (strictMode === false) {
      pattern = hideSeconds ? '^[0-9]{1,9}:(([0-5][0-9]|[0-5]))$' : '^[0-9]{1,9}:(([0-5][0-9]|[0-5])):(([0-5][0-9]|[0-5]))$';
    } else {
      pattern = hideSeconds ? '^[0-9]{1,9}:[0-5][0-9]$' : '^[0-9]{1,9}:[0-5][0-9]:[0-5][0-9]$';
    }
    var regex = RegExp(pattern);
    return regex.test(value);
  };

  /**
   *  Applies a picker's min and max duration constraints to a given value
   * @param {*} inputBox
   * @param {Number} value in seconds
   * @param {{minDuration: string, maxDuration: string}} constraints
   * @return {Number} number withing the min and max data attributes
   */
  var applyMinMaxConstraints = function applyMinMaxConstraints(inputBox, value) {
    var _getMinMaxConstraints2 = getMinMaxConstraints(inputBox),
      maxDuration = _getMinMaxConstraints2.maxDuration,
      minDuration = _getMinMaxConstraints2.minDuration;
    return Math.min(Math.max(value, minDuration), maxDuration);
  };

  /**
   * Converts seconds to a duration string
   * @param {value} value
   * @param {Boolean} hideSeconds
   * @return {String}
   */
  var secondsToDuration = function secondsToDuration(value, hideSeconds) {
    var secondsValue = value;
    var hours = Math.floor(secondsValue / 3600);
    secondsValue %= 3600;
    var minutes = Math.floor(secondsValue / 60);
    var seconds = secondsValue % 60;
    var formattedHours = String(hours).padStart(2, '0');
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(seconds).padStart(2, '0');
    return hideSeconds ? "".concat(formattedHours, ":").concat(formattedMinutes) : "".concat(formattedHours, ":").concat(formattedMinutes, ":").concat(formattedSeconds);
  };
  /**
   * Converts a given duration string to seconds
   * @param {String} value
   * @return {Number}
   */
  var durationToSeconds = function durationToSeconds(value) {
    if (!/:/.test(value)) {
      return 0;
    }
    var sectioned = value.split(':');
    if (sectioned.length < 2) {
      return 0;
    } else {
      return Number(sectioned[2] ? sectioned[2] > 59 ? 59 : sectioned[2] : 0) + Number((sectioned[1] > 59 ? 59 : sectioned[1]) * 60) + Number(sectioned[0] * 60 * 60);
    }
  };

  /**
   *
   * @param {String} value
   * @param {Boolean} hideSeconds
   * @param {{minDuration: string, maxDuration: string}} constraints
   * @return {false | String} return false if theres no need to validate, and a string of a modified value if the string neeeded validation
   */
  var validateValue = function validateValue(value, hideSeconds, constraints) {
    var sectioned = value.split(':');
    if (sectioned.length < 2) {
      return hideSeconds ? '00:00' : '00:00:00';
    }
    var mustUpdateValue;
    if (hideSeconds) {
      // if the input does not have a single ":" or is like "01:02:03:04:05", then reset the input
      if (!hideSeconds && sectioned.length !== 2) {
        return '00:00'; // fallback to default
      }
      // if hour (hh) input is not a number or negative set it to 0
      if (isNaN(sectioned[0])) {
        sectioned[0] = '00';
        mustUpdateValue = true;
      }
      // if hour (mm) input is not a number or negative set it to 0
      if (isNaN(sectioned[1]) || sectioned[1] < 0) {
        sectioned[1] = '00';
        mustUpdateValue = true;
      }
      // if minutes (mm) more than 59, set it to 59
      if (sectioned[1] > 59 || sectioned[1].length > 2) {
        sectioned[1] = '59';
        mustUpdateValue = true;
      }
      if (mustUpdateValue) {
        return sectioned.join(':');
      }
    } else {
      // if the input does not have 2 ":" or is like "01:02:03:04:05", then reset the input
      if (!hideSeconds && sectioned.length !== 3) {
        return '00:00:00'; // fallback to default
      }
      // if hour (hh) input is not a number or negative set it to 0
      if (isNaN(sectioned[0])) {
        sectioned[0] = '00';
        mustUpdateValue = true;
      }
      // if minutes (mm) input is not a number or negative set it to 0
      if (isNaN(sectioned[1]) || sectioned[1] < 0) {
        sectioned[1] = '00';
        mustUpdateValue = true;
      }
      // if minutes (mm) more than 59, set it to 59
      if (sectioned[1] > 59 || sectioned[1].length > 2) {
        sectioned[1] = '59';
        mustUpdateValue = true;
      }
      // if seconds(ss) input is not a number or negative set it to 0
      if (isNaN(sectioned[2]) || sectioned[2] < 0) {
        sectioned[2] = '00';
        mustUpdateValue = true;
      }
      // if seconds (ss) more than 59, set it to 59
      if (sectioned[2] > 59 || sectioned[2].length > 2) {
        sectioned[2] = '59';
        mustUpdateValue = true;
      }
      if (mustUpdateValue) {
        return sectioned.join(':');
      }
    }
    return false;
  };
  /**
   * Handles blur events on pickers, and applies validation only if necessary.
   * @param {Event} event
   * @return {void}
   */
  var handleInputBlur = function handleInputBlur(event) {
    var hideSeconds = shouldHideSeconds(event.target);
    var mustUpdateValue = validateValue(event.target.value, hideSeconds);
    if (mustUpdateValue !== false) {
      var _constrainedValue = applyMinMaxConstraints(event.target, durationToSeconds(mustUpdateValue));
      event.target.value = secondsToDuration(_constrainedValue, hideSeconds);
      return;
    }
    var constrainedValue = applyMinMaxConstraints(event.target, durationToSeconds(event.target.value));
    if (event.target.value != secondsToDuration(constrainedValue, hideSeconds)) {
      event.target.value = secondsToDuration(constrainedValue, hideSeconds);
    }
  };

  /**
   * Handles any user input attempts into a picker
   * @param {Event} event
   * @return {void}
   */

  var handleUserInput = function handleUserInput(event) {
    var inputBox = event.target;
    var sectioned = inputBox.value.split(':');
    var hideSeconds = shouldHideSeconds(inputBox);
    var _getCursorSelection2 = getCursorSelection(event, hideSeconds),
      cursorSelection = _getCursorSelection2.cursorSelection;
    if (sectioned.length < 2) {
      var constrainedValue = applyMinMaxConstraints(inputBox, getInitialDuration(inputBox));
      insertFormatted(inputBox, constrainedValue, false);
      return;
    }
    var _getMinMaxConstraints3 = getMinMaxConstraints(inputBox),
      maxDuration = _getMinMaxConstraints3.maxDuration;
    var maxHourInput = Math.floor(maxDuration / 3600);
    var charsForHours = maxHourInput < 1 ? 0 : maxHourInput.toString().length;

    // MODE :  seconds hidden
    if (hideSeconds) {
      var mustUpdateValue = validateValue(event.target.value, true);
      if (mustUpdateValue !== false) {
        var _constrainedValue2 = applyMinMaxConstraints(event.target, durationToSeconds(mustUpdateValue));
        insertFormatted(event.target, _constrainedValue2, false);
      }
      // done entering hours, so shift highlight to minutes
      if (charsForHours < 1 && cursorSelection === 'hours' || sectioned[0] && sectioned[0].length >= charsForHours && cursorSelection === 'hours') {
        if (charsForHours < 1 && sectioned[0]) {
          sectioned[0] = '00';
        }
        shiftTimeUnitAreaFocus(inputBox, 'right');
      }
      // done entering minutes, so just highlight minutes
      if (sectioned[1] && sectioned[1].length >= 2 && cursorSelection === 'minutes') {
        highlightTimeUnitArea(inputBox, 60);
      }

      // MODE :  Default (seconds not hidden)
    } else {
      var _mustUpdateValue = validateValue(event.target.value, false);
      if (_mustUpdateValue !== false) {
        var _constrainedValue3 = applyMinMaxConstraints(event.target, durationToSeconds(_mustUpdateValue));
        insertFormatted(event.target, _constrainedValue3, false);
      }
      // done entering hours, so shift highlight to minutes
      if (charsForHours < 1 && cursorSelection === 'hours' || sectioned[0] && sectioned[0].length >= charsForHours && cursorSelection === 'hours') {
        if (charsForHours < 1 && sectioned[0]) {
          sectioned[0] = '00';
        }
        shiftTimeUnitAreaFocus(inputBox, 'right');
      }

      // done entering minutes, so shift highlight to seconds
      if (sectioned[1] && sectioned[1].length >= 2 && cursorSelection === 'minutes') {
        shiftTimeUnitAreaFocus(inputBox, 'right');
      }
      // done entering seconds, just highlight seconds
      if (sectioned[2] && sectioned[2].length >= 2 && cursorSelection === 'seconds') {
        highlightTimeUnitArea(inputBox, 1);
      }
    }
  };
  var insertAndApplyValidations = function insertAndApplyValidations(event) {
    var inputBox = event.target;
    var duration = inputBox.value || inputBox.dataset.duration;
    var secondsValue = durationToSeconds(duration);
    insertFormatted(inputBox, applyMinMaxConstraints(inputBox, secondsValue));
  };

  /**
   * Handles all key down event in the picker. It will also apply validation
   * and block unsupported keys like alphabetic characters
   * @param {*} event
   * @return {void}
   */
  var handleKeydown = function handleKeydown(event) {
    var changeValueKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', "Backspace", "Delete"];
    var adjustmentFactor = getAdjustmentFactor(event.target);
    if (changeValueKeys.includes(event.key)) {
      switch (event.key) {
        // use up and down arrow keys to increase value;
        case 'ArrowDown':
          changeValueByArrowKeys(event.target, 'down');
          highlightTimeUnitArea(event.target, adjustmentFactor);
          break;
        case 'ArrowUp':
          changeValueByArrowKeys(event.target, 'up');
          highlightTimeUnitArea(event.target, adjustmentFactor);
          break;
        // use left and right arrow keys to shift focus;
        case 'ArrowLeft':
          shiftTimeUnitAreaFocus(event.target, 'left');
          break;
        case 'ArrowRight':
          shiftTimeUnitAreaFocus(event.target, 'right');
          break;
        case 'Enter':
          insertAndApplyValidations(event);
          event.target.blur();
          break;
        /* 		case "Backspace":
        		case "Delete":
        			console.log(event.key) */
        default:
      }
      event.preventDefault();
    }

    // Allow tab to change selection and escape the input
    if (event.key === 'Tab') {
      var _adjustmentFactor = getAdjustmentFactor(event.target);
      var rightAdjustValue = shouldHideSeconds(event.target) ? 60 : 1;
      var direction = event.shiftKey ? 'left' : 'right';
      if (direction === 'left' && _adjustmentFactor < 3600 || direction === 'right' && _adjustmentFactor > rightAdjustValue) {
        /* while the adjustment factor is less than 3600, prevent default shift+tab behavior,
        and move within the inputbox from mm to hh */
        event.preventDefault();
        shiftTimeUnitAreaFocus(event.target, direction);
      }
    }

    // The following keys will be accepted when the input field is selected
    var acceptedKeys = ['Backspace', 'ArrowDown', 'ArrowUp', 'Tab'];
    if (isNaN(event.key) && !acceptedKeys.includes(event.key)) {
      event.preventDefault();
      return false;
    }
    // additional validations:
    var inputBox = event.target;
    var hideSeconds = shouldHideSeconds(inputBox);
    // Gets the cursor position and select the nearest time interval
    var _getCursorSelection3 = getCursorSelection(event, hideSeconds),
      cursorSelection = _getCursorSelection3.cursorSelection,
      content = _getCursorSelection3.content;
    var sectioned = event.target.value.split(':');
    var _getMinMaxConstraints4 = getMinMaxConstraints(inputBox),
      maxDuration = _getMinMaxConstraints4.maxDuration;
    var maxHourInput = Math.floor(maxDuration / 3600);
    var charsForHours = maxHourInput < 1 ? 0 : maxHourInput.toString().length;

    // Handle empty value case (when input is "" or has fewer sections than expected)
    if (event.target.value === "" || sectioned.length < 2) {
      // Allow numeric input to start entering time
      if (!isNaN(event.key)) {
        return;
      }
      event.preventDefault();
      return;
    }
    if (cursorSelection === 'hours' && content.length >= charsForHours || sectioned[0] && sectioned[0].length < charsForHours) {
      if (content.length > charsForHours && charsForHours > 0) {
        event.preventDefault();
      }
    } else if (cursorSelection === 'minutes' && content.length === 2 || sectioned[1] && sectioned[1].length < 2) {
      if (content.length >= 2 && ['6', '7', '8', '9'].includes(event.key)) {
        event.preventDefault();
      }
    } else if (!hideSeconds && (cursorSelection === 'seconds' && content.length === 2 || sectioned[2] && sectioned[2].length < 2)) {
      if (content.length >= 2 && ['6', '7', '8', '9'].includes(event.key)) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  };
  var getDurationAttributeValue = function getDurationAttributeValue(inputBox, name, defaultValue) {
    var value = inputBox.dataset[name];
    if (value && isValidDurationFormat(value, shouldHideSeconds(inputBox))) {
      return durationToSeconds(value);
    } else {
      return defaultValue;
    }
  };
  var cancelDefaultEvent = function cancelDefaultEvent(event) {
    return event.preventDefault();
  };

  /**
   * Gets the min and max constraints of a picker
   * @param {*} inputBox
   * @return {{minDuration: string, maxDuration: string}} constraints
   */
  var getMinMaxConstraints = function getMinMaxConstraints(inputBox) {
    var minDuration = getDurationAttributeValue(inputBox, 'durationMin', 0);
    var maxDuration = getDurationAttributeValue(inputBox, 'durationMax', 99 * 3600 + 59 * 60 + 59); // by default 99:99:99 is now new max
    return {
      minDuration: minDuration,
      maxDuration: maxDuration
    };
  };
  var getInitialDuration = function getInitialDuration(inputBox) {
    if (inputBox.value === "") {
      return "";
    }
    var duration = getDurationAttributeValue(inputBox, 'duration', 0);
    var secondsValue = durationToSeconds(duration);
    return applyMinMaxConstraints(inputBox, secondsValue);
  };
  /**
   * Initialize all the pickers
   * @param {Boolean} addCSStoHead  add CSS style sheet to document body
   * @return {void}
   */
  var _init = function _init(addCSStoHead) {
    // append styles to DOM
    if (addCSStoHead) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      head.appendChild(style);
      style.styleSheet ? style.styleSheet.cssText = pickerStyles // IE8 and below.
      : style.appendChild(document.createTextNode(pickerStyles));
    }

    // Select all of the input fields with the attribute "html-duration-picker"
    var getInputFields = document.querySelectorAll('input.html-duration-picker');
    getInputFields.forEach(function (inputBox, ix) {
      // Set the default text and apply some basic styling to the duration picker
      if (!(inputBox.getAttribute('data-upgraded') == 'true')) {
        inputBox.setAttribute('data-upgraded', true);
        inputBox.setAttribute('data-adjustment-factor', 3600);
        var hideSeconds = shouldHideSeconds(inputBox);
        inputBox.setAttribute('pattern', hideSeconds ? '^[0-9]{1,9}:[0-5][0-9]$' : '^[0-9]{1,9}:[0-5][0-9]:[0-5][0-9]$');
        if (!inputBox.value || !isValidDurationFormat(inputBox.value, shouldHideSeconds(inputBox))) {
          insertFormatted(inputBox, getInitialDuration(inputBox));
        }
        inputBox.setAttribute('aria-label', 'Duration Picker');
        inputBox.addEventListener('keydown', handleKeydown);
        // selects a block of hours, minutes etc (useful when focused by keyboard: Tab)
        inputBox.addEventListener('focus', handleInputFocus);
        // selects a block of hours, minutes etc (useful when clicked on PC or tapped on mobile)
        inputBox.addEventListener('mouseup', handleClickFocus);
        inputBox.addEventListener('change', insertAndApplyValidations);
        // prefer 'input' event over 'keyup' for soft keyboards on mobile
        inputBox.addEventListener('input', handleUserInput);
        inputBox.addEventListener('blur', handleInputBlur);
        inputBox.addEventListener('drop', cancelDefaultEvent);

        // Create the up and down buttons
        var scrollUpBtn = document.createElement('button');
        var scrollDownBtn = document.createElement('button');
        var scrollButtons = [scrollUpBtn, scrollDownBtn];

        // set css classes
        scrollUpBtn.setAttribute('class', 'scroll-btn scrollUpBtn');
        scrollDownBtn.setAttribute('class', 'scroll-btn scrollDownBtn');

        // set button to 'button' to prevent 'submit' action in forms
        scrollUpBtn.setAttribute('type', 'button');
        scrollDownBtn.setAttribute('type', 'button');

        // set aria-labels for accessibility
        scrollUpBtn.setAttribute('aria-label', 'Increase duration');
        scrollDownBtn.setAttribute('aria-label', 'Decrease duration');

        // Create the carets in the buttons. These can be replaced by images, font icons, or text.
        var caretUp = document.createElement('div');
        var caretDown = document.createElement('div');

        // set css classes
        caretUp.setAttribute('class', 'caret caret-up');
        caretDown.setAttribute('class', 'caret caret-down ');

        // Insert the carets into the up and down buttons
        scrollDownBtn.appendChild(caretDown);
        scrollUpBtn.appendChild(caretUp);
        scrollButtons.forEach(function (btn) {
          var intervalId;
          btn.addEventListener('mousedown', function (event) {
            event.target.style.transform = 'translateY(1px)';
            event.preventDefault();
            if (btn == scrollUpBtn) {
              changeValueByArrowKeys(inputBox, 'up');
              intervalId = setInterval(changeValueByArrowKeys, 200, inputBox, 'up');
            } else {
              changeValueByArrowKeys(inputBox, 'down');
              intervalId = setInterval(changeValueByArrowKeys, 200, inputBox, 'down');
            }
          });
          // handle enter key to increase value, for better accessibility ux
          btn.addEventListener('keypress', function (event) {
            event.target.style.transform = 'translateY(1px)';
            if (event.key == 'Enter') {
              event.preventDefault();
              if (btn == scrollUpBtn) {
                changeValueByArrowKeys(inputBox, 'up');
              } else {
                changeValueByArrowKeys(inputBox, 'down');
              }
            }
          });
          if (btn === scrollUpBtn) {
            btn.addEventListener('keydown', function (event) {
              if (event.key === 'Tab' && event.shiftKey) {
                inputBox.focus();
                inputBox.select();
                highlightTimeUnitArea(inputBox, 1);
                event.preventDefault();
              }
            });
          }
          btn.addEventListener('keyup', function (event) {
            if (event.key == 'Enter') {
              var adjustmentFactor = getAdjustmentFactor(inputBox);
              highlightTimeUnitArea(inputBox, adjustmentFactor);
            }
          });
          btn.addEventListener('mouseup', function (event) {
            var adjustmentFactor = getAdjustmentFactor(inputBox);
            highlightTimeUnitArea(inputBox, adjustmentFactor);
            clearInterval(intervalId);
          });
          btn.addEventListener('mouseleave', function (event) {
            if (intervalId) {
              clearInterval(intervalId);
              var adjustmentFactor = getAdjustmentFactor(inputBox);
              highlightTimeUnitArea(inputBox, adjustmentFactor);
            }
          });
        });

        // this div houses the increase/decrease buttons
        var controlsDiv = document.createElement('div');
        // set css classes
        controlsDiv.setAttribute('class', 'controls');

        // Add buttons to controls div
        controlsDiv.appendChild(scrollUpBtn);
        controlsDiv.appendChild(scrollDownBtn);

        // this div wraps around existing input, then appends control div
        var controlWrapper = document.createElement('div');
        // set css classes
        controlWrapper.setAttribute('class', 'html-duration-picker-input-controls-wrapper');
        // add the div just before the picker
        inputBox.parentNode.insertBefore(controlWrapper, inputBox);
        // move the picker into the wrapper div
        controlWrapper.appendChild(inputBox);
        // add the scrolling control buttons into the wrapper div
        controlWrapper.appendChild(controlsDiv);
        var clearButton = document.createElement('button');
        clearButton.innerText = 'X';
        clearButton.setAttribute('class', 'clearButton');
        clearButton.addEventListener('click', function () {
          return handleClearInput(inputBox);
        });
        controlWrapper.appendChild(clearButton);
      }
    });
    return true;
  };
  window.addEventListener('DOMContentLoaded', function () {
    return _init(true);
  });
  return {
    init: function init() {
      return _init(true);
    },
    refresh: function refresh() {
      return _init(false);
    }
  };
})());
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});