module.export({CLAMP_MIN_MAX:()=>CLAMP_MIN_MAX,ALERT_WARN_CANCEL_PROPS:()=>ALERT_WARN_CANCEL_PROPS,ALERT_WARN_CANCEL_ESCAPE_KEY:()=>ALERT_WARN_CANCEL_ESCAPE_KEY,ALERT_WARN_CANCEL_OUTSIDE_CLICK:()=>ALERT_WARN_CANCEL_OUTSIDE_CLICK,COLLAPSIBLE_LIST_INVALID_CHILD:()=>COLLAPSIBLE_LIST_INVALID_CHILD,CONTEXTMENU_WARN_DECORATOR_NO_METHOD:()=>CONTEXTMENU_WARN_DECORATOR_NO_METHOD,CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT:()=>CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT,HOTKEYS_HOTKEY_CHILDREN:()=>HOTKEYS_HOTKEY_CHILDREN,HOTKEYS_WARN_DECORATOR_NO_METHOD:()=>HOTKEYS_WARN_DECORATOR_NO_METHOD,HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT:()=>HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT,NUMERIC_INPUT_MIN_MAX:()=>NUMERIC_INPUT_MIN_MAX,NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND:()=>NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND,NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND:()=>NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND,NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_STEP_SIZE_NULL:()=>NUMERIC_INPUT_STEP_SIZE_NULL,OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED:()=>OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED,POPOVER_REQUIRES_TARGET:()=>POPOVER_REQUIRES_TARGET,POPOVER_HAS_BACKDROP_INTERACTION:()=>POPOVER_HAS_BACKDROP_INTERACTION,POPOVER_WARN_TOO_MANY_CHILDREN:()=>POPOVER_WARN_TOO_MANY_CHILDREN,POPOVER_WARN_DOUBLE_CONTENT:()=>POPOVER_WARN_DOUBLE_CONTENT,POPOVER_WARN_DOUBLE_TARGET:()=>POPOVER_WARN_DOUBLE_TARGET,POPOVER_WARN_EMPTY_CONTENT:()=>POPOVER_WARN_EMPTY_CONTENT,POPOVER_WARN_HAS_BACKDROP_INLINE:()=>POPOVER_WARN_HAS_BACKDROP_INLINE,POPOVER_WARN_UNCONTROLLED_ONINTERACTION:()=>POPOVER_WARN_UNCONTROLLED_ONINTERACTION,PORTAL_CONTEXT_CLASS_NAME_STRING:()=>PORTAL_CONTEXT_CLASS_NAME_STRING,RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX:()=>RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX,SLIDER_ZERO_STEP:()=>SLIDER_ZERO_STEP,SLIDER_ZERO_LABEL_STEP:()=>SLIDER_ZERO_LABEL_STEP,RANGESLIDER_NULL_VALUE:()=>RANGESLIDER_NULL_VALUE,MULTISLIDER_INVALID_CHILD:()=>MULTISLIDER_INVALID_CHILD,SPINNER_WARN_CLASSES_SIZE:()=>SPINNER_WARN_CLASSES_SIZE,TOASTER_CREATE_NULL:()=>TOASTER_CREATE_NULL,TOASTER_WARN_INLINE:()=>TOASTER_WARN_INLINE,DIALOG_WARN_NO_HEADER_ICON:()=>DIALOG_WARN_NO_HEADER_ICON,DIALOG_WARN_NO_HEADER_CLOSE_BUTTON:()=>DIALOG_WARN_NO_HEADER_CLOSE_BUTTON});/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
var ns = "[Blueprint]";
var CLAMP_MIN_MAX = ns + " clamp: max cannot be less than min";
var ALERT_WARN_CANCEL_PROPS = ns + " <Alert> cancelButtonText and onCancel should be set together.";
var ALERT_WARN_CANCEL_ESCAPE_KEY = ns + " <Alert> canEscapeKeyCancel enabled without onCancel or onClose handler.";
var ALERT_WARN_CANCEL_OUTSIDE_CLICK = ns + " <Alert> canOutsideClickCancel enbaled without onCancel or onClose handler.";
var COLLAPSIBLE_LIST_INVALID_CHILD = ns + " <CollapsibleList> children must be <MenuItem>s";
var CONTEXTMENU_WARN_DECORATOR_NO_METHOD = ns + " @ContextMenuTarget-decorated class should implement renderContextMenu.";
var CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT = ns + " \"@ContextMenuTarget-decorated components must return a single JSX.Element or an empty render.";
var HOTKEYS_HOTKEY_CHILDREN = ns + " <Hotkeys> only accepts <Hotkey> children.";
var HOTKEYS_WARN_DECORATOR_NO_METHOD = ns + " @HotkeysTarget-decorated class should implement renderHotkeys.";
var HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT = ns + " \"@HotkeysTarget-decorated components must return a single JSX.Element or an empty render.";
var NUMERIC_INPUT_MIN_MAX = ns + " <NumericInput> requires min to be strictly less than max if both are defined.";
var NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND = ns + " <NumericInput> requires minorStepSize to be strictly less than stepSize.";
var NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND = ns + " <NumericInput> requires majorStepSize to be strictly greater than stepSize.";
var NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires minorStepSize to be strictly greater than zero.";
var NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires majorStepSize to be strictly greater than zero.";
var NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires stepSize to be strictly greater than zero.";
var NUMERIC_INPUT_STEP_SIZE_NULL = ns + " <NumericInput> requires stepSize to be defined.";
var OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED = ns + " <OverflowList> does not support changing observeParents after mounting.";
// TODO (clewis): Migrate old Popover validation errors to the component formerly known as Popover2.
// See: https://github.com/palantir/blueprint/issues/1940
var POPOVER_REQUIRES_TARGET = ns + " <Popover> requires target prop or at least one child element.";
var POPOVER_HAS_BACKDROP_INTERACTION = ns + " <Popover hasBackdrop={true}> requires interactionKind={PopoverInteractionKind.CLICK}.";
var POPOVER_WARN_TOO_MANY_CHILDREN = ns +
    " <Popover> supports one or two children; additional children are ignored." +
    " First child is the target, second child is the content. You may instead supply these two as props.";
var POPOVER_WARN_DOUBLE_CONTENT = ns + " <Popover> with two children ignores content prop; use either prop or children.";
var POPOVER_WARN_DOUBLE_TARGET = ns + " <Popover> with children ignores target prop; use either prop or children.";
var POPOVER_WARN_EMPTY_CONTENT = ns + " Disabling <Popover> with empty/whitespace content...";
var POPOVER_WARN_HAS_BACKDROP_INLINE = ns + " <Popover usePortal={false}> ignores hasBackdrop";
var POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + " <Popover> onInteraction is ignored when uncontrolled.";
var PORTAL_CONTEXT_CLASS_NAME_STRING = ns + " <Portal> context blueprintPortalClassName must be string";
var RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX = ns + " <RadioGroup> children and options prop are mutually exclusive, with options taking priority.";
var SLIDER_ZERO_STEP = ns + " <Slider> stepSize must be greater than zero.";
var SLIDER_ZERO_LABEL_STEP = ns + " <Slider> labelStepSize must be greater than zero.";
var RANGESLIDER_NULL_VALUE = ns + " <RangeSlider> value prop must be an array of two non-null numbers.";
var MULTISLIDER_INVALID_CHILD = ns + " <MultiSlider> children must be <SliderHandle>s or <SliderTrackStop>s";
var SPINNER_WARN_CLASSES_SIZE = ns + " <Spinner> Classes.SMALL/LARGE are ignored if size prop is set.";
var TOASTER_CREATE_NULL = ns +
    " Toaster.create() is not supported inside React lifecycle methods in React 16." +
    " See usage example on the docs site.";
var TOASTER_WARN_INLINE = ns + " Toaster.create() ignores inline prop as it always creates a new element.";
var DIALOG_WARN_NO_HEADER_ICON = ns + " <Dialog> iconName is ignored if title is omitted.";
var DIALOG_WARN_NO_HEADER_CLOSE_BUTTON = ns + " <Dialog> isCloseButtonShown prop is ignored if title is omitted.";
//# sourceMappingURL=errors.js.map