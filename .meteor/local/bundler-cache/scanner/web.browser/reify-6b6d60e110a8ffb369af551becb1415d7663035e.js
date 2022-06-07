module.export({CLAMP_MIN_MAX:()=>CLAMP_MIN_MAX,ALERT_WARN_CANCEL_PROPS:()=>ALERT_WARN_CANCEL_PROPS,ALERT_WARN_CANCEL_ESCAPE_KEY:()=>ALERT_WARN_CANCEL_ESCAPE_KEY,ALERT_WARN_CANCEL_OUTSIDE_CLICK:()=>ALERT_WARN_CANCEL_OUTSIDE_CLICK,COLLAPSIBLE_LIST_INVALID_CHILD:()=>COLLAPSIBLE_LIST_INVALID_CHILD,CONTEXTMENU_WARN_DECORATOR_NO_METHOD:()=>CONTEXTMENU_WARN_DECORATOR_NO_METHOD,CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT:()=>CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT,HOTKEYS_HOTKEY_CHILDREN:()=>HOTKEYS_HOTKEY_CHILDREN,HOTKEYS_WARN_DECORATOR_NO_METHOD:()=>HOTKEYS_WARN_DECORATOR_NO_METHOD,HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT:()=>HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT,HOTKEYS_TARGET2_CHILDREN_LOCAL_HOTKEYS:()=>HOTKEYS_TARGET2_CHILDREN_LOCAL_HOTKEYS,INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX:()=>INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX,NUMERIC_INPUT_MIN_MAX:()=>NUMERIC_INPUT_MIN_MAX,NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND:()=>NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND,NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND:()=>NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND,NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE:()=>NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE,NUMERIC_INPUT_CONTROLLED_VALUE_INVALID:()=>NUMERIC_INPUT_CONTROLLED_VALUE_INVALID,PANEL_STACK_INITIAL_PANEL_STACK_MUTEX:()=>PANEL_STACK_INITIAL_PANEL_STACK_MUTEX,PANEL_STACK_REQUIRES_PANEL:()=>PANEL_STACK_REQUIRES_PANEL,OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED:()=>OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED,POPOVER_REQUIRES_TARGET:()=>POPOVER_REQUIRES_TARGET,POPOVER_HAS_BACKDROP_INTERACTION:()=>POPOVER_HAS_BACKDROP_INTERACTION,POPOVER_WARN_TOO_MANY_CHILDREN:()=>POPOVER_WARN_TOO_MANY_CHILDREN,POPOVER_WARN_DOUBLE_CONTENT:()=>POPOVER_WARN_DOUBLE_CONTENT,POPOVER_WARN_DOUBLE_TARGET:()=>POPOVER_WARN_DOUBLE_TARGET,POPOVER_WARN_EMPTY_CONTENT:()=>POPOVER_WARN_EMPTY_CONTENT,POPOVER_WARN_HAS_BACKDROP_INLINE:()=>POPOVER_WARN_HAS_BACKDROP_INLINE,POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX:()=>POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX,POPOVER_WARN_UNCONTROLLED_ONINTERACTION:()=>POPOVER_WARN_UNCONTROLLED_ONINTERACTION,PORTAL_CONTEXT_CLASS_NAME_STRING:()=>PORTAL_CONTEXT_CLASS_NAME_STRING,RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX:()=>RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX,SLIDER_ZERO_STEP:()=>SLIDER_ZERO_STEP,SLIDER_ZERO_LABEL_STEP:()=>SLIDER_ZERO_LABEL_STEP,RANGESLIDER_NULL_VALUE:()=>RANGESLIDER_NULL_VALUE,MULTISLIDER_INVALID_CHILD:()=>MULTISLIDER_INVALID_CHILD,MULTISLIDER_WARN_LABEL_STEP_SIZE_LABEL_VALUES_MUTEX:()=>MULTISLIDER_WARN_LABEL_STEP_SIZE_LABEL_VALUES_MUTEX,SPINNER_WARN_CLASSES_SIZE:()=>SPINNER_WARN_CLASSES_SIZE,TOASTER_CREATE_NULL:()=>TOASTER_CREATE_NULL,TOASTER_WARN_INLINE:()=>TOASTER_WARN_INLINE,DIALOG_WARN_NO_HEADER_ICON:()=>DIALOG_WARN_NO_HEADER_ICON,DIALOG_WARN_NO_HEADER_CLOSE_BUTTON:()=>DIALOG_WARN_NO_HEADER_CLOSE_BUTTON,DRAWER_ANGLE_POSITIONS_ARE_CASTED:()=>DRAWER_ANGLE_POSITIONS_ARE_CASTED,TOASTER_MAX_TOASTS_INVALID:()=>TOASTER_MAX_TOASTS_INVALID});/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ns = "[Blueprint]";
var CLAMP_MIN_MAX = ns + " clamp: max cannot be less than min";
var ALERT_WARN_CANCEL_PROPS = ns + " <Alert> cancelButtonText and onCancel should be set together.";
var ALERT_WARN_CANCEL_ESCAPE_KEY = ns + " <Alert> canEscapeKeyCancel enabled without onCancel or onClose handler.";
var ALERT_WARN_CANCEL_OUTSIDE_CLICK = ns + " <Alert> canOutsideClickCancel enabled without onCancel or onClose handler.";
var COLLAPSIBLE_LIST_INVALID_CHILD = ns + " <CollapsibleList> children must be <MenuItem>s";
var CONTEXTMENU_WARN_DECORATOR_NO_METHOD = ns + " @ContextMenuTarget-decorated class should implement renderContextMenu.";
var CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT = ns + " \"@ContextMenuTarget-decorated components must return a single JSX.Element or an empty render.";
var HOTKEYS_HOTKEY_CHILDREN = ns + " <Hotkeys> only accepts <Hotkey> children.";
var HOTKEYS_WARN_DECORATOR_NO_METHOD = ns + " @HotkeysTarget-decorated class should implement renderHotkeys.";
var HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT = ns + " \"@HotkeysTarget-decorated components must return a single JSX.Element or an empty render.";
var HOTKEYS_TARGET2_CHILDREN_LOCAL_HOTKEYS = ns +
    " <HotkeysTarget2> was configured with local hotkeys, but you did not use the generated event handlers to bind their event handlers. Try using a render function as the child of this component.";
var INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX = ns + " <InputGroup> leftElement and leftIcon prop are mutually exclusive, with leftElement taking priority.";
var NUMERIC_INPUT_MIN_MAX = ns + " <NumericInput> requires min to be no greater than max if both are defined.";
var NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND = ns + " <NumericInput> requires minorStepSize to be no greater than stepSize.";
var NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND = ns + " <NumericInput> requires stepSize to be no greater than majorStepSize.";
var NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires minorStepSize to be strictly greater than zero.";
var NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires majorStepSize to be strictly greater than zero.";
var NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE = ns + " <NumericInput> requires stepSize to be strictly greater than zero.";
var NUMERIC_INPUT_CONTROLLED_VALUE_INVALID = ns + " <NumericInput> controlled value prop does not adhere to stepSize, min, and/or max constraints.";
var PANEL_STACK_INITIAL_PANEL_STACK_MUTEX = ns + " <PanelStack> requires exactly one of initialPanel and stack prop";
var PANEL_STACK_REQUIRES_PANEL = ns + " <PanelStack> requires at least one panel in the stack";
var OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED = ns + " <OverflowList> does not support changing observeParents after mounting.";
var POPOVER_REQUIRES_TARGET = ns + " <Popover> requires target prop or at least one child element.";
var POPOVER_HAS_BACKDROP_INTERACTION = ns + " <Popover hasBackdrop={true}> requires interactionKind={PopoverInteractionKind.CLICK}.";
var POPOVER_WARN_TOO_MANY_CHILDREN = ns +
    " <Popover> supports one or two children; additional children are ignored." +
    " First child is the target, second child is the content. You may instead supply these two as props.";
var POPOVER_WARN_DOUBLE_CONTENT = ns + " <Popover> with two children ignores content prop; use either prop or children.";
var POPOVER_WARN_DOUBLE_TARGET = ns + " <Popover> with children ignores target prop; use either prop or children.";
var POPOVER_WARN_EMPTY_CONTENT = ns + " Disabling <Popover> with empty/whitespace content...";
var POPOVER_WARN_HAS_BACKDROP_INLINE = ns + " <Popover usePortal={false}> ignores hasBackdrop";
var POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX = ns + " <Popover> supports either placement or position prop, not both.";
var POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + " <Popover> onInteraction is ignored when uncontrolled.";
var PORTAL_CONTEXT_CLASS_NAME_STRING = ns + " <Portal> context blueprintPortalClassName must be string";
var RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX = ns + " <RadioGroup> children and options prop are mutually exclusive, with options taking priority.";
var SLIDER_ZERO_STEP = ns + " <Slider> stepSize must be greater than zero.";
var SLIDER_ZERO_LABEL_STEP = ns + " <Slider> labelStepSize must be greater than zero.";
var RANGESLIDER_NULL_VALUE = ns + " <RangeSlider> value prop must be an array of two non-null numbers.";
var MULTISLIDER_INVALID_CHILD = ns + " <MultiSlider> children must be <SliderHandle>s or <SliderTrackStop>s";
var MULTISLIDER_WARN_LABEL_STEP_SIZE_LABEL_VALUES_MUTEX = ns +
    " <MultiSlider> labelStepSize and labelValues prop are mutually exclusive, with labelStepSize taking priority.";
var SPINNER_WARN_CLASSES_SIZE = ns + " <Spinner> Classes.SMALL/LARGE are ignored if size prop is set.";
var TOASTER_CREATE_NULL = ns +
    " Toaster.create() is not supported inside React lifecycle methods in React 16." +
    " See usage example on the docs site.";
var TOASTER_WARN_INLINE = ns + " Toaster.create() ignores inline prop as it always creates a new element.";
var DIALOG_WARN_NO_HEADER_ICON = ns + " <Dialog> iconName is ignored if title is omitted.";
var DIALOG_WARN_NO_HEADER_CLOSE_BUTTON = ns + " <Dialog> isCloseButtonShown prop is ignored if title is omitted.";
var DRAWER_ANGLE_POSITIONS_ARE_CASTED = ns + " <Drawer> all angle positions are casted into pure position (TOP, BOTTOM, LEFT or RIGHT)";
var TOASTER_MAX_TOASTS_INVALID = ns + " <Toaster> maxToasts is set to an invalid number, must be greater than 0";
//# sourceMappingURL=errors.js.map