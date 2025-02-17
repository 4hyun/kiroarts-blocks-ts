/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/aria-hidden/dist/es2015/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/aria-hidden/dist/es2015/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hideOthers: () => (/* binding */ hideOthers),
/* harmony export */   inertOthers: () => (/* binding */ inertOthers),
/* harmony export */   supportsInert: () => (/* binding */ supportsInert),
/* harmony export */   suppressOthers: () => (/* binding */ suppressOthers)
/* harmony export */ });
var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function (parent, targets) {
    return targets
        .map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    })
        .filter(function (x) { return Boolean(x); });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */
var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                try {
                    var attr = node.getAttribute(controlAttribute);
                    var alreadyHidden = attr !== null && attr !== 'false';
                    var counterValue = (counterMap.get(node) || 0) + 1;
                    var markerValue = (markerCounter.get(node) || 0) + 1;
                    counterMap.set(node, counterValue);
                    markerCounter.set(node, markerValue);
                    hiddenNodes.push(node);
                    if (counterValue === 1 && alreadyHidden) {
                        uncontrolledNodes.set(node, true);
                    }
                    if (markerValue === 1) {
                        node.setAttribute(markerName, 'true');
                    }
                    if (!alreadyHidden) {
                        node.setAttribute(controlAttribute, 'true');
                    }
                }
                catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-aria-hidden'; }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    // we should not hide ariaLive elements - https://github.com/theKashey/aria-hidden/issues/10
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live]')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};
/**
 * Marks everything except given node(or nodes) as inert
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var inertOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-inert-ed'; }
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    return applyAttributeToOthers(originalTarget, activeParentNode, markerName, 'inert');
};
/**
 * @returns if current browser supports inert
 */
var supportsInert = function () {
    return typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('inert');
};
/**
 * Automatic function to "suppress" DOM elements - _hide_ or _inert_ in the best possible way
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var suppressOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-suppressed'; }
    return (supportsInert() ? inertOthers : hideOthers)(originalTarget, parentNode, markerName);
};


/***/ }),

/***/ "./components/ui/button.tsx":
/*!**********************************!*\
  !*** ./components/ui/button.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   buttonVariants: () => (/* binding */ buttonVariants)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! class-variance-authority */ "./node_modules/class-variance-authority/dist/index.mjs");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





const buttonVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_1__.cva)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const Button = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_4__.Slot : "button";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Comp, {
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)(buttonVariants({
      variant,
      size,
      className
    })),
    ref: ref,
    ...props
  });
});
Button.displayName = "Button";


/***/ }),

/***/ "./components/ui/collapsible.tsx":
/*!***************************************!*\
  !*** ./components/ui/collapsible.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collapsible: () => (/* binding */ Collapsible),
/* harmony export */   CollapsibleContent: () => (/* binding */ CollapsibleContent),
/* harmony export */   CollapsibleTrigger: () => (/* binding */ CollapsibleTrigger)
/* harmony export */ });
/* harmony import */ var _radix_ui_react_collapsible__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @radix-ui/react-collapsible */ "./node_modules/@radix-ui/react-collapsible/dist/index.mjs");

const Collapsible = _radix_ui_react_collapsible__WEBPACK_IMPORTED_MODULE_0__.Root;
const CollapsibleTrigger = _radix_ui_react_collapsible__WEBPACK_IMPORTED_MODULE_0__.CollapsibleTrigger;
const CollapsibleContent = _radix_ui_react_collapsible__WEBPACK_IMPORTED_MODULE_0__.CollapsibleContent;


/***/ }),

/***/ "./components/ui/input.tsx":
/*!*********************************!*\
  !*** ./components/ui/input.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Input: () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const Input = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  type,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
    type: type,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
    ref: ref,
    ...props
  });
});
Input.displayName = "Input";


/***/ }),

/***/ "./components/ui/navigation-menu-content-list-item.tsx":
/*!*************************************************************!*\
  !*** ./components/ui/navigation-menu-content-list-item.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationContentListItem: () => (/* binding */ NavigationContentListItem)
/* harmony export */ });
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/utils */ "./lib/utils.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _navigation_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation-menu */ "./components/ui/navigation-menu.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const NavigationContentListItem = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({
  className,
  title,
  children,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_navigation_menu__WEBPACK_IMPORTED_MODULE_2__.NavigationMenuLink, {
      asChild: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("a", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_0__.cn)("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer", className),
        ...props,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "text-sm font-medium leading-none",
          children: title
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "line-clamp-2 text-sm leading-snug text-muted-foreground",
          children: children
        })]
      })
    })
  });
});
NavigationContentListItem.displayName = "NavigationContentListItem";

/***/ }),

/***/ "./components/ui/navigation-menu.tsx":
/*!*******************************************!*\
  !*** ./components/ui/navigation-menu.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationMenu: () => (/* binding */ NavigationMenu),
/* harmony export */   NavigationMenuContent: () => (/* binding */ NavigationMenuContent),
/* harmony export */   NavigationMenuIndicator: () => (/* binding */ NavigationMenuIndicator),
/* harmony export */   NavigationMenuItem: () => (/* binding */ NavigationMenuItem),
/* harmony export */   NavigationMenuLink: () => (/* binding */ NavigationMenuLink),
/* harmony export */   NavigationMenuList: () => (/* binding */ NavigationMenuList),
/* harmony export */   NavigationMenuTrigger: () => (/* binding */ NavigationMenuTrigger),
/* harmony export */   NavigationMenuViewport: () => (/* binding */ NavigationMenuViewport),
/* harmony export */   navigationMenuTriggerStyle: () => (/* binding */ navigationMenuTriggerStyle)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-navigation-menu */ "./node_modules/@radix-ui/react-navigation-menu/dist/index.mjs");
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! class-variance-authority */ "./node_modules/class-variance-authority/dist/index.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-down.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);






const NavigationMenu = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  children,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Root, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
  ...props,
  children: [children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(NavigationMenuViewport, {
    viewportWrapper: props.viewportWrapper || null
  })]
}));
NavigationMenu.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Root.displayName;
const NavigationMenuList = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.List, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("group flex flex-1 list-none items-center justify-center space-x-1", className),
  ...props
}));
NavigationMenuList.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.List.displayName;
const NavigationMenuItem = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Item;
const navigationMenuTriggerStyle = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_1__.cva)("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50");
const NavigationMenuTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  children,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Trigger, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)(navigationMenuTriggerStyle(), "group", className),
  ...props,
  children: [children, " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
    "aria-hidden": "true"
  })]
}));
NavigationMenuTrigger.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Trigger.displayName;
const NavigationMenuContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Content, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("right-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ", className),
  ...props
}));
NavigationMenuContent.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Content.displayName;
const NavigationMenuLink = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Link;
const NavigationMenuViewport = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("absolute", props.viewportWrapper?.side === "right" ? "right-0" : "left-0", "top-full flex justify-center", props.viewportWrapper?.className || ""),
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Viewport, {
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]", className),
    ref: ref,
    ...props
  })
}));
NavigationMenuViewport.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Viewport.displayName;
const NavigationMenuIndicator = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Indicator, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", className),
  ...props,
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"
  })
}));
NavigationMenuIndicator.displayName = _radix_ui_react_navigation_menu__WEBPACK_IMPORTED_MODULE_4__.Indicator.displayName;


/***/ }),

/***/ "./components/ui/separator.tsx":
/*!*************************************!*\
  !*** ./components/ui/separator.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Separator: () => (/* binding */ Separator)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_separator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-separator */ "./node_modules/@radix-ui/react-separator/dist/index.mjs");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
"use client";





const Separator = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_separator__WEBPACK_IMPORTED_MODULE_3__.Root, {
  ref: ref,
  decorative: decorative,
  orientation: orientation,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
  ...props
}));
Separator.displayName = _radix_ui_react_separator__WEBPACK_IMPORTED_MODULE_3__.Root.displayName;


/***/ }),

/***/ "./components/ui/sheet.tsx":
/*!*********************************!*\
  !*** ./components/ui/sheet.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sheet: () => (/* binding */ Sheet),
/* harmony export */   SheetClose: () => (/* binding */ SheetClose),
/* harmony export */   SheetContent: () => (/* binding */ SheetContent),
/* harmony export */   SheetDescription: () => (/* binding */ SheetDescription),
/* harmony export */   SheetFooter: () => (/* binding */ SheetFooter),
/* harmony export */   SheetHeader: () => (/* binding */ SheetHeader),
/* harmony export */   SheetOverlay: () => (/* binding */ SheetOverlay),
/* harmony export */   SheetPortal: () => (/* binding */ SheetPortal),
/* harmony export */   SheetTitle: () => (/* binding */ SheetTitle),
/* harmony export */   SheetTrigger: () => (/* binding */ SheetTrigger)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-dialog */ "./node_modules/@radix-ui/react-dialog/dist/index.mjs");
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! class-variance-authority */ "./node_modules/class-variance-authority/dist/index.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);






const Sheet = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Root;
const SheetTrigger = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Trigger;
const SheetClose = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Close;
const SheetPortal = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Portal;
const SheetOverlay = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Overlay, {
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
  ...props,
  ref: ref
}));
SheetOverlay.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Overlay.displayName;
const sheetVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_1__.cva)("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
    }
  },
  defaultVariants: {
    side: "right"
  }
});
const SheetContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  side = "right",
  className,
  children,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(SheetPortal, {
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(SheetOverlay, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Content, {
    ref: ref,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)(sheetVariants({
      side
    }), className),
    ...props,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Close, {
      className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
        className: "h-4 w-4"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "sr-only",
        children: "Close"
      })]
    }), children]
  })]
}));
SheetContent.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Content.displayName;
const SheetHeader = ({
  className,
  ...props
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex flex-col space-y-2 text-center sm:text-left", className),
  ...props
});
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({
  className,
  ...props
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
  ...props
});
SheetFooter.displayName = "SheetFooter";
const SheetTitle = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Title, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-lg font-semibold text-foreground", className),
  ...props
}));
SheetTitle.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Title.displayName;
const SheetDescription = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Description, {
  ref: ref,
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-sm text-muted-foreground", className),
  ...props
}));
SheetDescription.displayName = _radix_ui_react_dialog__WEBPACK_IMPORTED_MODULE_4__.Description.displayName;


/***/ }),

/***/ "./components/ui/sidebar.tsx":
/*!***********************************!*\
  !*** ./components/ui/sidebar.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sidebar: () => (/* binding */ Sidebar),
/* harmony export */   SidebarContent: () => (/* binding */ SidebarContent),
/* harmony export */   SidebarFooter: () => (/* binding */ SidebarFooter),
/* harmony export */   SidebarGroup: () => (/* binding */ SidebarGroup),
/* harmony export */   SidebarGroupAction: () => (/* binding */ SidebarGroupAction),
/* harmony export */   SidebarGroupContent: () => (/* binding */ SidebarGroupContent),
/* harmony export */   SidebarGroupLabel: () => (/* binding */ SidebarGroupLabel),
/* harmony export */   SidebarHeader: () => (/* binding */ SidebarHeader),
/* harmony export */   SidebarInput: () => (/* binding */ SidebarInput),
/* harmony export */   SidebarInset: () => (/* binding */ SidebarInset),
/* harmony export */   SidebarMenu: () => (/* binding */ SidebarMenu),
/* harmony export */   SidebarMenuAction: () => (/* binding */ SidebarMenuAction),
/* harmony export */   SidebarMenuBadge: () => (/* binding */ SidebarMenuBadge),
/* harmony export */   SidebarMenuButton: () => (/* binding */ SidebarMenuButton),
/* harmony export */   SidebarMenuItem: () => (/* binding */ SidebarMenuItem),
/* harmony export */   SidebarMenuSkeleton: () => (/* binding */ SidebarMenuSkeleton),
/* harmony export */   SidebarMenuSub: () => (/* binding */ SidebarMenuSub),
/* harmony export */   SidebarMenuSubButton: () => (/* binding */ SidebarMenuSubButton),
/* harmony export */   SidebarMenuSubItem: () => (/* binding */ SidebarMenuSubItem),
/* harmony export */   SidebarProvider: () => (/* binding */ SidebarProvider),
/* harmony export */   SidebarRail: () => (/* binding */ SidebarRail),
/* harmony export */   SidebarSeparator: () => (/* binding */ SidebarSeparator),
/* harmony export */   SidebarTrigger: () => (/* binding */ SidebarTrigger),
/* harmony export */   useSidebar: () => (/* binding */ useSidebar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! class-variance-authority */ "./node_modules/class-variance-authority/dist/index.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/panel-left.js");
/* harmony import */ var _hooks_use_mobile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/use-mobile */ "./hooks/use-mobile.tsx");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../lib/utils */ "./lib/utils.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./button */ "./components/ui/button.tsx");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./input */ "./components/ui/input.tsx");
/* harmony import */ var _separator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./separator */ "./components/ui/separator.tsx");
/* harmony import */ var _sheet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sheet */ "./components/ui/sheet.tsx");
/* harmony import */ var _skeleton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./skeleton */ "./components/ui/skeleton.tsx");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tooltip */ "./components/ui/tooltip.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);













const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
function useSidebar() {
  const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}, ref) => {
  const isMobile = (0,_hooks_use_mobile__WEBPACK_IMPORTED_MODULE_2__.useIsMobile)();
  const [openMobile, setOpenMobile] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = react__WEBPACK_IMPORTED_MODULE_0__.useState(defaultOpen);
  const open = openProp !== null && openProp !== void 0 ? openProp : _open;
  const setOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(value => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) {
      setOpenProp(openState);
    } else {
      _setOpen(openState);
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [setOpenProp, open]);

  // Helper to toggle the sidebar.
  const toggleSidebar = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";
  const contextValue = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(SidebarContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_tooltip__WEBPACK_IMPORTED_MODULE_9__.TooltipProvider, {
      delayDuration: 0,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
        ref: ref,
        ...props,
        children: children
      })
    })
  });
});
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}, ref) => {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  if (collapsible === "none") {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className),
      ref: ref,
      ...props,
      children: children
    });
  }
  if (isMobile) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_sheet__WEBPACK_IMPORTED_MODULE_7__.Sheet, {
      open: openMobile,
      onOpenChange: setOpenMobile,
      ...props,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_sheet__WEBPACK_IMPORTED_MODULE_7__.SheetContent, {
        "data-sidebar": "sidebar",
        "data-mobile": "true",
        className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side: side,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          className: "flex h-full w-full flex-col",
          children: children
        })
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    ref: ref,
    className: "group peer hidden text-sidebar-foreground md:block",
    "data-state": state,
    "data-collapsible": state === "collapsed" ? collapsible : "",
    "data-variant": variant,
    "data-side": side,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
      // Adjust the padding for floating and inset variants.
      variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
      ...props,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
        "data-sidebar": "sidebar",
        className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
        children: children
      })
    })]
  });
});
Sidebar.displayName = "Sidebar";
const SidebarTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  onClick,
  iconProps,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_button__WEBPACK_IMPORTED_MODULE_4__.Button, {
    ref: ref,
    "data-sidebar": "trigger",
    variant: "ghost",
    size: "icon",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("h-7 w-7", className),
    onClick: event => {
      onClick?.(event);
      toggleSidebar();
    },
    ...props,
    children: [props.icon ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(props.icon, {
      ...(iconProps || {})
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
      className: "sr-only",
      children: "Toggle Sidebar"
    })]
  });
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("button", {
    ref: ref,
    "data-sidebar": "rail",
    "aria-label": "Toggle Sidebar",
    tabIndex: -1,
    onClick: toggleSidebar,
    title: "Toggle Sidebar",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
    ...props
  });
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("main", {
    ref: ref,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("relative flex min-h-svh flex-1 flex-col bg-background", "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
    ...props
  });
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_input__WEBPACK_IMPORTED_MODULE_5__.Input, {
    ref: ref,
    "data-sidebar": "input",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
    ...props
  });
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    ref: ref,
    "data-sidebar": "header",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex flex-col gap-2 p-2", className),
    ...props
  });
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    ref: ref,
    "data-sidebar": "footer",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex flex-col gap-2 p-2", className),
    ...props
  });
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_separator__WEBPACK_IMPORTED_MODULE_6__.Separator, {
    ref: ref,
    "data-sidebar": "separator",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("mx-2 w-auto bg-sidebar-border", className),
    ...props
  });
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    ref: ref,
    "data-sidebar": "content",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
    ...props
  });
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    ref: ref,
    "data-sidebar": "group",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("relative flex w-full min-w-0 flex-col p-2", className),
    ...props
  });
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slot : "div";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Comp, {
    ref: ref,
    "data-sidebar": "group-label",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
    ...props
  });
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slot : "button";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Comp, {
    ref: ref,
    "data-sidebar": "group-action",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
    ...props
  });
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
  ref: ref,
  "data-sidebar": "group-content",
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("w-full text-sm", className),
  ...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("ul", {
  ref: ref,
  "data-sidebar": "menu",
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex w-full min-w-0 flex-col gap-1", className),
  ...props
}));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
  ref: ref,
  "data-sidebar": "menu-item",
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("group/menu-item relative", className),
  ...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_1__.cva)("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const SidebarMenuButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slot : "button";
  const {
    isMobile,
    state
  } = useSidebar();
  const button = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Comp, {
    ref: ref,
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(sidebarMenuButtonVariants({
      variant,
      size
    }), className),
    ...props
  });
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_tooltip__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_tooltip__WEBPACK_IMPORTED_MODULE_9__.TooltipTrigger, {
      asChild: true,
      children: button
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_tooltip__WEBPACK_IMPORTED_MODULE_9__.TooltipContent, {
      side: "right",
      align: "center",
      hidden: state !== "collapsed" || isMobile,
      ...tooltip
    })]
  });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slot : "button";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Comp, {
    ref: ref,
    "data-sidebar": "menu-action",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
    ...props
  });
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
  ref: ref,
  "data-sidebar": "menu-badge",
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
  ...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  showIcon = false,
  ...props
}, ref) => {
  // Random width between 50 to 90%.
  const width = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    ref: ref,
    "data-sidebar": "menu-skeleton",
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex h-8 items-center gap-2 rounded-md px-2", className),
    ...props,
    children: [showIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_skeleton__WEBPACK_IMPORTED_MODULE_8__.Skeleton, {
      className: "size-4 rounded-md",
      "data-sidebar": "menu-skeleton-icon"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_skeleton__WEBPACK_IMPORTED_MODULE_8__.Skeleton, {
      className: "h-4 max-w-[--skeleton-width] flex-1",
      "data-sidebar": "menu-skeleton-text",
      style: {
        "--skeleton-width": width
      }
    })]
  });
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("ul", {
  ref: ref,
  "data-sidebar": "menu-sub",
  className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
  ...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
  ref: ref,
  ...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  asChild = false,
  size = "md",
  isActive,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slot : "a";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Comp, {
    ref: ref,
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
    ...props
  });
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";


/***/ }),

/***/ "./components/ui/skeleton.tsx":
/*!************************************!*\
  !*** ./components/ui/skeleton.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Skeleton: () => (/* binding */ Skeleton)
/* harmony export */ });
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Skeleton({
  className,
  ...props
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_0__.cn)("animate-pulse rounded-md bg-primary/10", className),
    ...props
  });
}


/***/ }),

/***/ "./components/ui/tooltip.tsx":
/*!***********************************!*\
  !*** ./components/ui/tooltip.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tooltip: () => (/* binding */ Tooltip),
/* harmony export */   TooltipContent: () => (/* binding */ TooltipContent),
/* harmony export */   TooltipProvider: () => (/* binding */ TooltipProvider),
/* harmony export */   TooltipTrigger: () => (/* binding */ TooltipTrigger)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-tooltip */ "./node_modules/@radix-ui/react-tooltip/dist/index.mjs");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/utils */ "./lib/utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
"use client";





const TooltipProvider = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Provider;
const Tooltip = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Root;
const TooltipTrigger = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Trigger;
const TooltipContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({
  className,
  sideOffset = 4,
  ...props
}, ref) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Portal, {
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Content, {
    ref: ref,
    sideOffset: sideOffset,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
    ...props
  })
}));
TooltipContent.displayName = _radix_ui_react_tooltip__WEBPACK_IMPORTED_MODULE_3__.Content.displayName;


/***/ }),

/***/ "./hooks/use-mobile.tsx":
/*!******************************!*\
  !*** ./hooks/use-mobile.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsMobile: () => (/* binding */ useIsMobile)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = react__WEBPACK_IMPORTED_MODULE_0__.useState(undefined);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

/***/ }),

/***/ "./lib/menu/v1/utils.ts":
/*!******************************!*\
  !*** ./lib/menu/v1/utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHref: () => (/* binding */ getHref)
/* harmony export */ });
const getHref = pageTitle => pageTitle.split(" ").join("-");

/***/ }),

/***/ "./lib/utils.ts":
/*!**********************!*\
  !*** ./lib/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tailwind-merge */ "./node_modules/tailwind-merge/dist/bundle-mjs.mjs");


function cn(...inputs) {
  return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_1__.twMerge)((0,clsx__WEBPACK_IMPORTED_MODULE_0__.clsx)(inputs));
}

/***/ }),

/***/ "./src/navigation/Navigation.tsx":
/*!***************************************!*\
  !*** ./src/navigation/Navigation.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Navigation: () => (/* binding */ Navigation)
/* harmony export */ });
/* harmony import */ var _components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/ui/navigation-menu */ "./components/ui/navigation-menu.tsx");
/* harmony import */ var _components_ui_navigation_menu_content_list_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ui/navigation-menu-content-list-item */ "./components/ui/navigation-menu-content-list-item.tsx");
/* harmony import */ var _NavigationMobileSidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NavigationMobileSidebar */ "./src/navigation/NavigationMobileSidebar.tsx");
/* harmony import */ var _components_ui_sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/sidebar */ "./components/ui/sidebar.tsx");
/* harmony import */ var _lib_menu_v1_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/menu/v1/utils */ "./lib/menu/v1/utils.ts");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/menu.js");
/* harmony import */ var _constants_menu_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/menu-data */ "./src/navigation/constants/menu-data.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);








// type MenuItem = {}
// type MenuLabel = string
// type MenuLinkTitle = string
// type MenuLinkUrl = string
// type MenuProps = []
// const createMenuItem = (props: MenuItem) => props

const Navigation = () => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "hjarts-navigation-group",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__.NavigationMenu, {
      viewportWrapper: {
        side: "right"
      },
      className: "hjarts-navigation__desktop-root hidden md:flex",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__.NavigationMenuList, {
        children: _constants_menu_data__WEBPACK_IMPORTED_MODULE_5__.menuData.map((menuItem, indexId) => {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__.NavigationMenuItem, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__.NavigationMenuTrigger, {
              className: "has-noto-sans-kr-font-family font-semibold !bg-transparent text-base",
              children: menuItem[0][0]
            }), menuItem.length > 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_navigation_menu__WEBPACK_IMPORTED_MODULE_0__.NavigationMenuContent, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
                className: "grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ",
                children: menuItem.map(menuLink => {
                  return (
                    /*#__PURE__*/
                    // <NavigationMenuLink
                    //   className={cn(navigationMenuTriggerStyle())}
                    // >
                    //   {menuLink[0]}
                    // </NavigationMenuLink>
                    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_navigation_menu_content_list_item__WEBPACK_IMPORTED_MODULE_1__.NavigationContentListItem, {
                      title: menuLink[0],
                      href: (0,_lib_menu_v1_utils__WEBPACK_IMPORTED_MODULE_4__.getHref)(menuLink[0])
                    })
                  );
                })
              })
            }) : null]
          }, indexId);
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "hjarts-navigation__mobile-root md:hidden",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_3__.SidebarProvider, {
        className: "!min-h-[initial]",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_NavigationMobileSidebar__WEBPACK_IMPORTED_MODULE_2__.NavigationMobileSidebar, {
          menuData: _constants_menu_data__WEBPACK_IMPORTED_MODULE_5__.menuData
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_3__.SidebarTrigger, {
          icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
          className: "max-md:[&_svg]:size-6"
        })]
      })
    })]
  });
};

/***/ }),

/***/ "./src/navigation/NavigationMobileSidebar.tsx":
/*!****************************************************!*\
  !*** ./src/navigation/NavigationMobileSidebar.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationMobileSidebar: () => (/* binding */ NavigationMobileSidebar)
/* harmony export */ });
/* harmony import */ var _components_ui_collapsible__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/ui/collapsible */ "./components/ui/collapsible.tsx");
/* harmony import */ var _components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ui/sidebar */ "./components/ui/sidebar.tsx");
/* harmony import */ var _lib_menu_v1_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/menu/v1/utils */ "./lib/menu/v1/utils.ts");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-right.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);





function NavigationMobileSidebar({
  menuData
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.Sidebar, {
    side: "right",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarHeader, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarContent, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarGroup, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarGroupContent, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenu, {
            children: menuData.map(menuGroup => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_collapsible__WEBPACK_IMPORTED_MODULE_0__.Collapsible, {
              defaultOpen: true,
              asChild: true,
              className: "group/collapsible",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenuItem, {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_collapsible__WEBPACK_IMPORTED_MODULE_0__.CollapsibleTrigger, {
                  asChild: true,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenuButton, {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                      className: "font-bold text-lg has-noto-sans-kr-font-family",
                      children: menuGroup[0][0]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
                      className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    })]
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_collapsible__WEBPACK_IMPORTED_MODULE_0__.CollapsibleContent, {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenuSub, {
                    children: menuGroup.map(menuItem => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenuSubItem, {
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarMenuSubButton, {
                        asChild: true,
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
                          href: (0,_lib_menu_v1_utils__WEBPACK_IMPORTED_MODULE_2__.getHref)(menuItem[0]),
                          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
                            className: "has-noto-sans-kr-font-family",
                            children: menuItem[0]
                          })
                        })
                      })
                    }, menuItem[0]))
                  })
                })]
              })
            }, menuGroup[0][0]))
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_sidebar__WEBPACK_IMPORTED_MODULE_1__.SidebarFooter, {})]
  });
}

/***/ }),

/***/ "./src/navigation/constants/menu-data.ts":
/*!***********************************************!*\
  !*** ./src/navigation/constants/menu-data.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   menuData: () => (/* binding */ menuData)
/* harmony export */ });
const menuData = [[["협회소개", "53"], ["인사말", "56"], ["연혁", "61"], ["조직도", "64"], ["찾아오시는 길", "70"]], [["협회행사", "44"], ["협회전시행사", "50"], ["기타행사", "232"], ["언론", "244"]], [["커뮤니티", "30"], ["공지사항", "35"], ["중국전시관 안내", "38"], ["중국협력기관 및 소개", "41"]], [["사이버갤러리", "21"], ["협회전시영상", "24"], ["협회원 개인전 소개", "27"]]];

/***/ }),

/***/ "./node_modules/get-nonce/dist/es2015/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/get-nonce/dist/es2015/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNonce: () => (/* binding */ getNonce),
/* harmony export */   setNonce: () => (/* binding */ setNonce)
/* harmony export */ });
var currentNonce;
var setNonce = function (nonce) {
    currentNonce = nonce;
};
var getNonce = function () {
    if (currentNonce) {
        return currentNonce;
    }
    if (true) {
        return __webpack_require__.nc;
    }
    return undefined;
};


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/react-remove-scroll-bar/dist/es2015/component.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-remove-scroll-bar/dist/es2015/component.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveScrollBar: () => (/* binding */ RemoveScrollBar),
/* harmony export */   lockAttribute: () => (/* binding */ lockAttribute),
/* harmony export */   useLockAttribute: () => (/* binding */ useLockAttribute)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_style_singleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-style-singleton */ "./node_modules/react-style-singleton/dist/es2015/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./node_modules/react-remove-scroll-bar/dist/es2015/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/react-remove-scroll-bar/dist/es2015/utils.js");




var Style = (0,react_style_singleton__WEBPACK_IMPORTED_MODULE_1__.styleSingleton)();
var lockAttribute = 'data-scroll-locked';
// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getStyles = function (_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) { gapMode = 'margin'; }
    return "\n  .".concat(_constants__WEBPACK_IMPORTED_MODULE_2__.noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowRelative && "position: relative ".concat(important, ";"),
        gapMode === 'margin' &&
            "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";"),
    ]
        .filter(Boolean)
        .join(''), "\n  }\n  \n  .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.zeroRightClassName, " .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.fullWidthClassName, " .").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(_constants__WEBPACK_IMPORTED_MODULE_2__.removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function () {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);
    return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function () {
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
        return function () {
            var newCounter = getCurrentUseCounter() - 1;
            if (newCounter <= 0) {
                document.body.removeAttribute(lockAttribute);
            }
            else {
                document.body.setAttribute(lockAttribute, newCounter.toString());
            }
        };
    }, []);
};
/**
 * Removes page scrollbar and blocks page scroll when mounted
 */
var RemoveScrollBar = function (_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    useLockAttribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */
    var gap = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getGapWidth)(gapMode); }, [gapMode]);
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '') });
};


/***/ }),

/***/ "./node_modules/react-remove-scroll-bar/dist/es2015/constants.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-remove-scroll-bar/dist/es2015/constants.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fullWidthClassName: () => (/* binding */ fullWidthClassName),
/* harmony export */   noScrollbarsClassName: () => (/* binding */ noScrollbarsClassName),
/* harmony export */   removedBarSizeVariable: () => (/* binding */ removedBarSizeVariable),
/* harmony export */   zeroRightClassName: () => (/* binding */ zeroRightClassName)
/* harmony export */ });
var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
/**
 * Name of a CSS variable containing the amount of "hidden" scrollbar
 * ! might be undefined ! use will fallback!
 */
var removedBarSizeVariable = '--removed-body-scroll-bar-size';


/***/ }),

/***/ "./node_modules/react-remove-scroll-bar/dist/es2015/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-remove-scroll-bar/dist/es2015/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveScrollBar: () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.RemoveScrollBar),
/* harmony export */   fullWidthClassName: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_1__.fullWidthClassName),
/* harmony export */   getGapWidth: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_2__.getGapWidth),
/* harmony export */   noScrollbarsClassName: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_1__.noScrollbarsClassName),
/* harmony export */   removedBarSizeVariable: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_1__.removedBarSizeVariable),
/* harmony export */   zeroRightClassName: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_1__.zeroRightClassName)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./node_modules/react-remove-scroll-bar/dist/es2015/component.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./node_modules/react-remove-scroll-bar/dist/es2015/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/react-remove-scroll-bar/dist/es2015/utils.js");






/***/ }),

/***/ "./node_modules/react-remove-scroll-bar/dist/es2015/utils.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-remove-scroll-bar/dist/es2015/utils.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGapWidth: () => (/* binding */ getGapWidth),
/* harmony export */   zeroGap: () => (/* binding */ zeroGap)
/* harmony export */ });
var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
};
var parse = function (x) { return parseInt(x || '', 10) || 0; };
var getOffset = function (gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [parse(left), parse(top), parse(right)];
};
var getGapWidth = function (gapMode) {
    if (gapMode === void 0) { gapMode = 'margin'; }
    if (typeof window === 'undefined') {
        return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0]),
    };
};


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/Combination.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/Combination.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UI */ "./node_modules/react-remove-scroll/dist/es2015/UI.js");
/* harmony import */ var _sidecar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidecar */ "./node_modules/react-remove-scroll/dist/es2015/sidecar.js");




var ReactRemoveScroll = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function (props, ref) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_UI__WEBPACK_IMPORTED_MODULE_2__.RemoveScroll, (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, props, { ref: ref, sideCar: _sidecar__WEBPACK_IMPORTED_MODULE_1__["default"] }))); });
ReactRemoveScroll.classNames = _UI__WEBPACK_IMPORTED_MODULE_2__.RemoveScroll.classNames;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReactRemoveScroll);


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/SideEffect.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/SideEffect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveScrollSideCar: () => (/* binding */ RemoveScrollSideCar),
/* harmony export */   getDeltaXY: () => (/* binding */ getDeltaXY),
/* harmony export */   getTouchXY: () => (/* binding */ getTouchXY)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_remove_scroll_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-remove-scroll-bar */ "./node_modules/react-remove-scroll-bar/dist/es2015/index.js");
/* harmony import */ var react_style_singleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-style-singleton */ "./node_modules/react-style-singleton/dist/es2015/index.js");
/* harmony import */ var _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./aggresiveCapture */ "./node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js");
/* harmony import */ var _handleScroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handleScroll */ "./node_modules/react-remove-scroll/dist/es2015/handleScroll.js");






var getTouchXY = function (event) {
    return 'changedTouches' in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function (event) { return [event.deltaX, event.deltaY]; };
var extractRef = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function (x, y) { return x[0] === y[0] && x[1] === y[1]; };
var generateStyle = function (id) { return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n"); };
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = react__WEBPACK_IMPORTED_MODULE_0__.useRef([]);
    var touchStartRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef([0, 0]);
    var activeAxis = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
    var id = react__WEBPACK_IMPORTED_MODULE_0__.useState(idCounter++)[0];
    var Style = react__WEBPACK_IMPORTED_MODULE_0__.useState(react_style_singleton__WEBPACK_IMPORTED_MODULE_2__.styleSingleton)[0];
    var lastProps = react__WEBPACK_IMPORTED_MODULE_0__.useRef(props);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        lastProps.current = props;
    }, [props]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        if (props.inert) {
            document.body.classList.add("block-interactivity-".concat(id));
            var allow_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__spreadArray)([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
            allow_1.forEach(function (el) { return el.classList.add("allow-interactivity-".concat(id)); });
            return function () {
                document.body.classList.remove("block-interactivity-".concat(id));
                allow_1.forEach(function (el) { return el.classList.remove("allow-interactivity-".concat(id)); });
            };
        }
        return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (event, parent) {
        if (('touches' in event && event.touches.length === 2) || (event.type === 'wheel' && event.ctrlKey)) {
            return !lastProps.current.allowPinchZoom;
        }
        var touch = getTouchXY(event);
        var touchStart = touchStartRef.current;
        var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
        var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
        var currentAxis;
        var target = event.target;
        var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
        // allow horizontal touch move on Range inputs. They will not cause any scroll
        if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
            return false;
        }
        var canBeScrolledInMainDirection = (0,_handleScroll__WEBPACK_IMPORTED_MODULE_4__.locationCouldBeScrolled)(moveDirection, target);
        if (!canBeScrolledInMainDirection) {
            return true;
        }
        if (canBeScrolledInMainDirection) {
            currentAxis = moveDirection;
        }
        else {
            currentAxis = moveDirection === 'v' ? 'h' : 'v';
            canBeScrolledInMainDirection = (0,_handleScroll__WEBPACK_IMPORTED_MODULE_4__.locationCouldBeScrolled)(moveDirection, target);
            // other axis might be not scrollable
        }
        if (!canBeScrolledInMainDirection) {
            return false;
        }
        if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
            activeAxis.current = currentAxis;
        }
        if (!currentAxis) {
            return true;
        }
        var cancelingAxis = activeAxis.current || currentAxis;
        return (0,_handleScroll__WEBPACK_IMPORTED_MODULE_4__.handleScroll)(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (_event) {
        var event = _event;
        if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
            // not the last active
            return;
        }
        var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
        var sourceEvent = shouldPreventQueue.current.filter(function (e) { return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta); })[0];
        // self event, and should be canceled
        if (sourceEvent && sourceEvent.should) {
            if (event.cancelable) {
                event.preventDefault();
            }
            return;
        }
        // outside or shard event
        if (!sourceEvent) {
            var shardNodes = (lastProps.current.shards || [])
                .map(extractRef)
                .filter(Boolean)
                .filter(function (node) { return node.contains(event.target); });
            var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
            if (shouldStop) {
                if (event.cancelable) {
                    event.preventDefault();
                }
            }
        }
    }, []);
    var shouldCancel = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (name, delta, target, should) {
        var event = { name: name, delta: delta, target: target, should: should, shadowParent: getOutermostShadowParent(target) };
        shouldPreventQueue.current.push(event);
        setTimeout(function () {
            shouldPreventQueue.current = shouldPreventQueue.current.filter(function (e) { return e !== event; });
        }, 1);
    }, []);
    var scrollTouchStart = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (event) {
        touchStartRef.current = getTouchXY(event);
        activeAxis.current = undefined;
    }, []);
    var scrollWheel = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (event) {
        shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (event) {
        shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        lockStack.push(Style);
        props.setCallbacks({
            onScrollCapture: scrollWheel,
            onWheelCapture: scrollWheel,
            onTouchMoveCapture: scrollTouchMove,
        });
        document.addEventListener('wheel', shouldPrevent, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
        document.addEventListener('touchmove', shouldPrevent, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
        document.addEventListener('touchstart', scrollTouchStart, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
        return function () {
            lockStack = lockStack.filter(function (inst) { return inst !== Style; });
            document.removeEventListener('wheel', shouldPrevent, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
            document.removeEventListener('touchmove', shouldPrevent, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
            document.removeEventListener('touchstart', scrollTouchStart, _aggresiveCapture__WEBPACK_IMPORTED_MODULE_5__.nonPassive);
        };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        inert ? react__WEBPACK_IMPORTED_MODULE_0__.createElement(Style, { styles: generateStyle(id) }) : null,
        removeScrollBar ? react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_remove_scroll_bar__WEBPACK_IMPORTED_MODULE_1__.RemoveScrollBar, { gapMode: props.gapMode }) : null));
}
function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
        if (node instanceof ShadowRoot) {
            shadowParent = node.host;
            node = node.host;
        }
        node = node.parentNode;
    }
    return shadowParent;
}


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/UI.js":
/*!************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/UI.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveScroll: () => (/* binding */ RemoveScroll)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_remove_scroll_bar_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-remove-scroll-bar/constants */ "./node_modules/react-remove-scroll-bar/dist/es2015/constants.js");
/* harmony import */ var use_callback_ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! use-callback-ref */ "./node_modules/use-callback-ref/dist/es2015/useMergeRef.js");
/* harmony import */ var _medium__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./medium */ "./node_modules/react-remove-scroll/dist/es2015/medium.js");





var nothing = function () {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */
var RemoveScroll = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function (props, parentRef) {
    var ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    var _a = react__WEBPACK_IMPORTED_MODULE_0__.useState({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing,
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, gapMode = props.gapMode, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__rest)(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar = sideCar;
    var containerRef = (0,use_callback_ref__WEBPACK_IMPORTED_MODULE_3__.useMergeRefs)([ref, parentRef]);
    var containerProps = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, rest), callbacks);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        enabled && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(SideCar, { sideCar: _medium__WEBPACK_IMPORTED_MODULE_4__.effectCar, removeScrollBar: removeScrollBar, shards: shards, noIsolation: noIsolation, inert: inert, setCallbacks: setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode: gapMode })),
        forwardProps ? (react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children), (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, containerProps), { ref: containerRef }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(Container, (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, containerProps, { className: className, ref: containerRef }), children))));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false,
};
RemoveScroll.classNames = {
    fullWidth: react_remove_scroll_bar_constants__WEBPACK_IMPORTED_MODULE_1__.fullWidthClassName,
    zeroRight: react_remove_scroll_bar_constants__WEBPACK_IMPORTED_MODULE_1__.zeroRightClassName,
};



/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js":
/*!**************************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nonPassive: () => (/* binding */ nonPassive)
/* harmony export */ });
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
                return true;
            },
        });
        // @ts-ignore
        window.addEventListener('test', options, options);
        // @ts-ignore
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
var nonPassive = passiveSupported ? { passive: false } : false;


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/handleScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/handleScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleScroll: () => (/* binding */ handleScroll),
/* harmony export */   locationCouldBeScrolled: () => (/* binding */ locationCouldBeScrolled)
/* harmony export */ });
var alwaysContainsScroll = function (node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
};
var elementCanBeScrolled = function (node, overflow) {
    if (!(node instanceof Element)) {
        return false;
    }
    var styles = window.getComputedStyle(node);
    return (
    // not-not-scrollable
    styles[overflow] !== 'hidden' &&
        // contains scroll inside self
        !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible'));
};
var elementCouldBeVScrolled = function (node) { return elementCanBeScrolled(node, 'overflowY'); };
var elementCouldBeHScrolled = function (node) { return elementCanBeScrolled(node, 'overflowX'); };
var locationCouldBeScrolled = function (axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
        // Skip over shadow root
        if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
            current = current.host;
        }
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
            if (scrollHeight > clientHeight) {
                return true;
            }
        }
        current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
};
var getVScrollVariables = function (_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
        scrollTop,
        scrollHeight,
        clientHeight,
    ];
};
var getHScrollVariables = function (_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
        scrollLeft,
        scrollWidth,
        clientWidth,
    ];
};
var elementCouldBeScrolled = function (axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function (axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function (axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */
    return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handleScroll = function (axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - directionFactor * position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        if (target instanceof ShadowRoot) {
            target = target.host;
        }
        else {
            target = target.parentNode;
        }
    } while (
    // portaled content
    (!targetInLock && target !== document.body) ||
        // self content
        (targetInLock && (endTarget.contains(target) || endTarget === target)));
    // handle epsilon around 0 (non standard zoom levels)
    if (isDeltaPositive &&
        ((noOverscroll && Math.abs(availableScroll) < 1) || (!noOverscroll && delta > availableScroll))) {
        shouldCancelScroll = true;
    }
    else if (!isDeltaPositive &&
        ((noOverscroll && Math.abs(availableScrollTop) < 1) || (!noOverscroll && -delta > availableScrollTop))) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/medium.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/medium.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   effectCar: () => (/* binding */ effectCar)
/* harmony export */ });
/* harmony import */ var use_sidecar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! use-sidecar */ "./node_modules/use-sidecar/dist/es2015/medium.js");

var effectCar = (0,use_sidecar__WEBPACK_IMPORTED_MODULE_0__.createSidecarMedium)();


/***/ }),

/***/ "./node_modules/react-remove-scroll/dist/es2015/sidecar.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-remove-scroll/dist/es2015/sidecar.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var use_sidecar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! use-sidecar */ "./node_modules/use-sidecar/dist/es2015/exports.js");
/* harmony import */ var _SideEffect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SideEffect */ "./node_modules/react-remove-scroll/dist/es2015/SideEffect.js");
/* harmony import */ var _medium__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./medium */ "./node_modules/react-remove-scroll/dist/es2015/medium.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,use_sidecar__WEBPACK_IMPORTED_MODULE_0__.exportSidecar)(_medium__WEBPACK_IMPORTED_MODULE_1__.effectCar, _SideEffect__WEBPACK_IMPORTED_MODULE_2__.RemoveScrollSideCar));


/***/ }),

/***/ "./node_modules/react-style-singleton/dist/es2015/component.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-style-singleton/dist/es2015/component.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   styleSingleton: () => (/* binding */ styleSingleton)
/* harmony export */ });
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hook */ "./node_modules/react-style-singleton/dist/es2015/hook.js");

/**
 * create a Component to add styles on demand
 * - styles are added when first instance is mounted
 * - styles are removed when the last instance is unmounted
 * - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
 */
var styleSingleton = function () {
    var useStyle = (0,_hook__WEBPACK_IMPORTED_MODULE_0__.styleHookSingleton)();
    var Sheet = function (_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        useStyle(styles, dynamic);
        return null;
    };
    return Sheet;
};


/***/ }),

/***/ "./node_modules/react-style-singleton/dist/es2015/hook.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-style-singleton/dist/es2015/hook.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   styleHookSingleton: () => (/* binding */ styleHookSingleton)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./singleton */ "./node_modules/react-style-singleton/dist/es2015/singleton.js");


/**
 * creates a hook to control style singleton
 * @see {@link styleSingleton} for a safer component version
 * @example
 * ```tsx
 * const useStyle = styleHookSingleton();
 * ///
 * useStyle('body { overflow: hidden}');
 */
var styleHookSingleton = function () {
    var sheet = (0,_singleton__WEBPACK_IMPORTED_MODULE_1__.stylesheetSingleton)();
    return function (styles, isDynamic) {
        react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
            sheet.add(styles);
            return function () {
                sheet.remove();
            };
        }, [styles && isDynamic]);
    };
};


/***/ }),

/***/ "./node_modules/react-style-singleton/dist/es2015/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-style-singleton/dist/es2015/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   styleHookSingleton: () => (/* reexport safe */ _hook__WEBPACK_IMPORTED_MODULE_2__.styleHookSingleton),
/* harmony export */   styleSingleton: () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.styleSingleton),
/* harmony export */   stylesheetSingleton: () => (/* reexport safe */ _singleton__WEBPACK_IMPORTED_MODULE_1__.stylesheetSingleton)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./node_modules/react-style-singleton/dist/es2015/component.js");
/* harmony import */ var _singleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./singleton */ "./node_modules/react-style-singleton/dist/es2015/singleton.js");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hook */ "./node_modules/react-style-singleton/dist/es2015/hook.js");





/***/ }),

/***/ "./node_modules/react-style-singleton/dist/es2015/singleton.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-style-singleton/dist/es2015/singleton.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stylesheetSingleton: () => (/* binding */ stylesheetSingleton)
/* harmony export */ });
/* harmony import */ var get_nonce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! get-nonce */ "./node_modules/get-nonce/dist/es2015/index.js");

function makeStyleTag() {
    if (!document)
        return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = (0,get_nonce__WEBPACK_IMPORTED_MODULE_0__.getNonce)();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
        // @ts-ignore
        tag.styleSheet.cssText = css;
    }
    else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function (style) {
            if (counter == 0) {
                if ((stylesheet = makeStyleTag())) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function () {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        },
    };
};


/***/ }),

/***/ "./node_modules/use-callback-ref/dist/es2015/assignRef.js":
/*!****************************************************************!*\
  !*** ./node_modules/use-callback-ref/dist/es2015/assignRef.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignRef: () => (/* binding */ assignRef)
/* harmony export */ });
/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref) {
        ref.current = value;
    }
    return ref;
}


/***/ }),

/***/ "./node_modules/use-callback-ref/dist/es2015/useMergeRef.js":
/*!******************************************************************!*\
  !*** ./node_modules/use-callback-ref/dist/es2015/useMergeRef.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMergeRefs: () => (/* binding */ useMergeRefs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assignRef__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assignRef */ "./node_modules/use-callback-ref/dist/es2015/assignRef.js");
/* harmony import */ var _useRef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useRef */ "./node_modules/use-callback-ref/dist/es2015/useRef.js");



var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;
var currentValues = new WeakMap();
/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergeRefs} a version without buit-in memoization
 * @see https://github.com/theKashey/use-callback-ref#usemergerefs
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
function useMergeRefs(refs, defaultValue) {
    var callbackRef = (0,_useRef__WEBPACK_IMPORTED_MODULE_1__.useCallbackRef)(defaultValue || null, function (newValue) {
        return refs.forEach(function (ref) { return (0,_assignRef__WEBPACK_IMPORTED_MODULE_2__.assignRef)(ref, newValue); });
    });
    // handle refs changes - added or removed
    useIsomorphicLayoutEffect(function () {
        var oldValue = currentValues.get(callbackRef);
        if (oldValue) {
            var prevRefs_1 = new Set(oldValue);
            var nextRefs_1 = new Set(refs);
            var current_1 = callbackRef.current;
            prevRefs_1.forEach(function (ref) {
                if (!nextRefs_1.has(ref)) {
                    (0,_assignRef__WEBPACK_IMPORTED_MODULE_2__.assignRef)(ref, null);
                }
            });
            nextRefs_1.forEach(function (ref) {
                if (!prevRefs_1.has(ref)) {
                    (0,_assignRef__WEBPACK_IMPORTED_MODULE_2__.assignRef)(ref, current_1);
                }
            });
        }
        currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
}


/***/ }),

/***/ "./node_modules/use-callback-ref/dist/es2015/useRef.js":
/*!*************************************************************!*\
  !*** ./node_modules/use-callback-ref/dist/es2015/useRef.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCallbackRef: () => (/* binding */ useCallbackRef)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/**
 * creates a MutableRef with ref change callback
 * @param initialValue - initial ref value
 * @param {Function} callback - a callback to run when value changes
 *
 * @example
 * const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
 * ref.current = 1;
 * // prints 0 -> 1
 *
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 * @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
 * @returns {MutableRefObject}
 */
function useCallbackRef(initialValue, callback) {
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(function () { return ({
        // value
        value: initialValue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            },
        },
    }); })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}


/***/ }),

/***/ "./node_modules/use-sidecar/dist/es2015/exports.js":
/*!*********************************************************!*\
  !*** ./node_modules/use-sidecar/dist/es2015/exports.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportSidecar: () => (/* binding */ exportSidecar)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var SideCar = function (_a) {
    var sideCar = _a.sideCar, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__rest)(_a, ["sideCar"]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Target, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
}


/***/ }),

/***/ "./node_modules/use-sidecar/dist/es2015/medium.js":
/*!********************************************************!*\
  !*** ./node_modules/use-sidecar/dist/es2015/medium.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMedium: () => (/* binding */ createMedium),
/* harmony export */   createSidecarMedium: () => (/* binding */ createSidecarMedium)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");

function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function () {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function (data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function () {
                buffer = buffer.filter(function (x) { return x !== item; });
            };
        },
        assignSyncMedium: function (cb) {
            assigned = true;
            while (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function (x) { return cb(x); },
                filter: function () { return buffer; },
            };
        },
        assignMedium: function (cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function () {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function () { return Promise.resolve().then(executeQueue); };
            cycle();
            buffer = {
                push: function (x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function (filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                },
            };
        },
    };
    return medium;
}
function createMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    return innerCreateMedium(defaults, middleware);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function createSidecarMedium(options) {
    if (options === void 0) { options = {}; }
    var medium = innerCreateMedium(null);
    medium.options = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({ async: true, ssr: false }, options);
    return medium;
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = ['top', 'left'].includes((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ }),

/***/ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
  // RTL <body> scrollbar.
  getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, accRect.top);
    accRect.right = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
      // Firefox with layout.scrollbar.side = 3 in about:config to test this.
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(referenceEl) : []), ...(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ "./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoUpdate),
/* harmony export */   computePosition: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_1__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* reexport safe */ _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size),
/* harmony export */   useFloating: () => (/* binding */ useFloating)
/* harmony export */ });
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "react-dom");






var index = typeof document !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_2__.useEffect;

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}

function getDPR(element) {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

function useLatestRef(value) {
  const ref = react__WEBPACK_IMPORTED_MODULE_2__.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = react__WEBPACK_IMPORTED_MODULE_2__.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = react__WEBPACK_IMPORTED_MODULE_2__.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = react__WEBPACK_IMPORTED_MODULE_2__.useState(null);
  const [_floating, _setFloating] = react__WEBPACK_IMPORTED_MODULE_2__.useState(null);
  const setReference = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(node => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(node => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
  const floatingRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
  const dataRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);
  const openRef = useLatestRef(open);
  const update = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.computePosition)(referenceRef.current, floatingRef.current, config).then(data => {
      const fullData = {
        ...data,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        react_dom__WEBPACK_IMPORTED_MODULE_3__.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData(data => ({
        ...data,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...(getDPR(elements.floating) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, 'current');
  }
  return {
    name: 'arrow',
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === 'function' ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.arrow)({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.arrow)({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.offset)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.shift)(options),
  options: [options, deps]
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.limitShift)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.flip)(options),
  options: [options, deps]
});

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.size)(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.autoPlacement)(options),
  options: [options, deps]
});

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.hide)(options),
  options: [options, deps]
});

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = (options, deps) => ({
  ...(0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_0__.inline)(options),
  options: [options, deps]
});

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
});




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [':popover-open', ':modal'].some(selector => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return ['transform', 'translate', 'scale', 'rotate', 'perspective'].some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ }),

/***/ "./node_modules/@radix-ui/primitive/dist/index.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@radix-ui/primitive/dist/index.mjs ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   composeEventHandlers: () => (/* binding */ composeEventHandlers)
/* harmony export */ });
// packages/core/primitive/src/primitive.tsx
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-arrow/dist/index.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@radix-ui/react-arrow/dist/index.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arrow: () => (/* binding */ Arrow),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-arrow/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/arrow/src/arrow.tsx



var NAME = "Arrow";
var Arrow = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__.Primitive.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow.displayName = NAME;
var Root = Arrow;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-arrow/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-arrow/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-collapsible/dist/index.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@radix-ui/react-collapsible/dist/index.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collapsible: () => (/* binding */ Collapsible),
/* harmony export */   CollapsibleContent: () => (/* binding */ CollapsibleContent),
/* harmony export */   CollapsibleTrigger: () => (/* binding */ CollapsibleTrigger),
/* harmony export */   Content: () => (/* binding */ Content),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Trigger: () => (/* binding */ Trigger),
/* harmony export */   createCollapsibleScope: () => (/* binding */ createCollapsibleScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-controllable-state */ "./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-collapsible/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @radix-ui/react-presence */ "./node_modules/@radix-ui/react-presence/dist/index.mjs");
/* harmony import */ var _radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-id */ "./node_modules/@radix-ui/react-id/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/collapsible/src/collapsible.tsx










var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open = false, setOpen] = (0,_radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_3__.useControllableState)({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange
    });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__.useId)(),
        open,
        onOpenToggle: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
          _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_5__.Primitive.div,
          {
            "data-state": getState(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME = "CollapsibleTrigger";
var CollapsibleTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_5__.Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_6__.composeEventHandlers)(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "CollapsibleContent";
var CollapsibleContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_7__.Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent.displayName = CONTENT_NAME;
var CollapsibleContentImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
  const [isPresent, setIsPresent] = react__WEBPACK_IMPORTED_MODULE_0__.useState(present);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_8__.useComposedRefs)(forwardedRef, ref);
  const heightRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
  const height = heightRef.current;
  const widthRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(isOpen);
  const originalStylesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(void 0);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__.useLayoutEffect)(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_5__.Primitive.div,
    {
      "data-state": getState(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState(open) {
  return open ? "open" : "closed";
}
var Root = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-collapsible/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!********************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-collapsible/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-collection/dist/index.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@radix-ui/react-collection/dist/index.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCollection: () => (/* binding */ createCollection)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-collection/node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/collection/src/Collection.tsx





function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const itemMap = react__WEBPACK_IMPORTED_MODULE_0__.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__.useComposedRefs)(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_4__.Slot, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
      const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__.useComposedRefs)(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_4__.Slot, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope
  ];
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-collection/node_modules/@radix-ui/react-slot/dist/index.mjs":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-collection/node_modules/@radix-ui/react-slot/dist/index.mjs ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Slot: () => (/* binding */ Slot),
/* harmony export */   Slottable: () => (/* binding */ Slottable)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/slot/src/Slot.tsx



var Slot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement) > 1) return react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null);
        return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? newElement.props.children : null;
      } else {
        return child;
      }
    });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, void 0, newChildren) : null });
  }
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
});
Slot.displayName = "Slot";
var SlotClone = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      // @ts-ignore
      ref: forwardedRef ? (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(forwardedRef, childrenRef) : childrenRef
    });
  }
  return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children) > 1 ? react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null) : null;
});
SlotClone.displayName = "SlotClone";
var Slottable = ({ children }) => {
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children });
};
function isSlottable(child) {
  return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child) && child.type === Slottable;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var Root = Slot;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@radix-ui/react-compose-refs/dist/index.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   composeRefs: () => (/* binding */ composeRefs),
/* harmony export */   useComposedRefs: () => (/* binding */ useComposedRefs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
// packages/react/compose-refs/src/composeRefs.tsx

function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(composeRefs(...refs), refs);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-context/dist/index.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/@radix-ui/react-context/dist/index.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createContext: () => (/* binding */ createContext2),
/* harmony export */   createContextScope: () => (/* binding */ createContextScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/context/src/createContext.tsx


function createContext2(rootComponentName, defaultContext) {
  const Context = react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-dialog/dist/index.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@radix-ui/react-dialog/dist/index.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Close: () => (/* binding */ Close),
/* harmony export */   Content: () => (/* binding */ Content),
/* harmony export */   Description: () => (/* binding */ Description),
/* harmony export */   Dialog: () => (/* binding */ Dialog),
/* harmony export */   DialogClose: () => (/* binding */ DialogClose),
/* harmony export */   DialogContent: () => (/* binding */ DialogContent),
/* harmony export */   DialogDescription: () => (/* binding */ DialogDescription),
/* harmony export */   DialogOverlay: () => (/* binding */ DialogOverlay),
/* harmony export */   DialogPortal: () => (/* binding */ DialogPortal),
/* harmony export */   DialogTitle: () => (/* binding */ DialogTitle),
/* harmony export */   DialogTrigger: () => (/* binding */ DialogTrigger),
/* harmony export */   Overlay: () => (/* binding */ Overlay),
/* harmony export */   Portal: () => (/* binding */ Portal),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Title: () => (/* binding */ Title),
/* harmony export */   Trigger: () => (/* binding */ Trigger),
/* harmony export */   WarningProvider: () => (/* binding */ WarningProvider),
/* harmony export */   createDialogScope: () => (/* binding */ createDialogScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-id */ "./node_modules/@radix-ui/react-id/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-controllable-state */ "./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs");
/* harmony import */ var _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @radix-ui/react-dismissable-layer */ "./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs");
/* harmony import */ var _radix_ui_react_focus_scope__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @radix-ui/react-focus-scope */ "./node_modules/@radix-ui/react-focus-scope/dist/index.mjs");
/* harmony import */ var _radix_ui_react_portal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-portal */ "./node_modules/@radix-ui/react-portal/dist/index.mjs");
/* harmony import */ var _radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/react-presence */ "./node_modules/@radix-ui/react-presence/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_focus_guards__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @radix-ui/react-focus-guards */ "./node_modules/@radix-ui/react-focus-guards/dist/index.mjs");
/* harmony import */ var react_remove_scroll__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-remove-scroll */ "./node_modules/react-remove-scroll/dist/es2015/Combination.js");
/* harmony import */ var aria_hidden__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! aria-hidden */ "./node_modules/aria-hidden/dist/es2015/index.js");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/dialog/src/dialog.tsx
















var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const contentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const [open = false, setOpen] = (0,_radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_3__.useControllableState)({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange
  });
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__.useId)(),
      titleId: (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__.useId)(),
      descriptionId: (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__.useId)(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__.Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__.composeEventHandlers)(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PortalProvider, { scope: __scopeDialog, forceMount, children: react__WEBPACK_IMPORTED_MODULE_0__.Children.map(children, (child) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_8__.Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_portal__WEBPACK_IMPORTED_MODULE_9__.Portal, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_8__.Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var DialogOverlayImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_remove_scroll__WEBPACK_IMPORTED_MODULE_10__["default"], { as: _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_11__.Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
        _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__.Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_8__.Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME;
var DialogContentModal = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(forwardedRef, context.contentRef, contentRef);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const content = contentRef.current;
      if (content) return (0,aria_hidden__WEBPACK_IMPORTED_MODULE_12__.hideOthers)(content);
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__.composeEventHandlers)(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__.composeEventHandlers)(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__.composeEventHandlers)(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
    const hasPointerDownOutsideRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(forwardedRef, contentRef);
    (0,_radix_ui_react_focus_guards__WEBPACK_IMPORTED_MODULE_13__.useFocusGuards)();
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children: [
      /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
        _radix_ui_react_focus_scope__WEBPACK_IMPORTED_MODULE_14__.FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
            _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_15__.DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children: [
        /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__.Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__.Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_6__.Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_7__.composeEventHandlers)(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContext)(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog;
var Trigger = DialogTrigger;
var Portal = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Branch: () => (/* binding */ Branch),
/* harmony export */   DismissableLayer: () => (/* binding */ DismissableLayer),
/* harmony export */   DismissableLayerBranch: () => (/* binding */ DismissableLayerBranch),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-escape-keydown */ "./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/dismissable-layer/src/dismissable-layer.tsx







var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = react__WEBPACK_IMPORTED_MODULE_0__.useState({});
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    (0,_radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__.useEscapeKeydown)((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, ref);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onPointerDownOutside);
  const isPointerInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const handleClickRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onFocusOutside);
  const isFocusInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    (0,_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.dispatchDiscreteCustomEvent)(target, event);
  } else {
    target.dispatchEvent(event);
  }
}
var Root = DismissableLayer;
var Branch = DismissableLayerBranch;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-direction/dist/index.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@radix-ui/react-direction/dist/index.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DirectionProvider: () => (/* binding */ DirectionProvider),
/* harmony export */   Provider: () => (/* binding */ Provider),
/* harmony export */   useDirection: () => (/* binding */ useDirection)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/direction/src/Direction.tsx


var DirectionContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(void 0);
var DirectionProvider = (props) => {
  const { dir, children } = props;
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DirectionContext.Provider, { value: dir, children });
};
function useDirection(localDir) {
  const globalDir = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
var Provider = DirectionProvider;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Branch: () => (/* binding */ Branch),
/* harmony export */   DismissableLayer: () => (/* binding */ DismissableLayer),
/* harmony export */   DismissableLayerBranch: () => (/* binding */ DismissableLayerBranch),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-escape-keydown */ "./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/dismissable-layer/src/DismissableLayer.tsx







var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = react__WEBPACK_IMPORTED_MODULE_0__.useState({});
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    (0,_radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__.useEscapeKeydown)((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, ref);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onPointerDownOutside);
  const isPointerInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const handleClickRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onFocusOutside);
  const isFocusInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    (0,_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.dispatchDiscreteCustomEvent)(target, event);
  } else {
    target.dispatchEvent(event);
  }
}
var Root = DismissableLayer;
var Branch = DismissableLayerBranch;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-focus-guards/dist/index.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@radix-ui/react-focus-guards/dist/index.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FocusGuards: () => (/* binding */ FocusGuards),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   useFocusGuards: () => (/* binding */ useFocusGuards)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
"use client";

// packages/react/focus-guards/src/FocusGuards.tsx

var count = 0;
function FocusGuards(props) {
  useFocusGuards();
  return props.children;
}
function useFocusGuards() {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
    count++;
    return () => {
      if (count === 1) {
        document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}
var Root = FocusGuards;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-focus-scope/dist/index.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@radix-ui/react-focus-scope/dist/index.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FocusScope: () => (/* binding */ FocusScope),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-focus-scope/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/focus-scope/src/focus-scope.tsx





var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const onMountAutoFocus = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_2__.useCallbackRef)(onMountAutoFocusProp);
  const onUnmountAutoFocus = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_2__.useCallbackRef)(onUnmountAutoFocusProp);
  const lastFocusedElementRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__.useComposedRefs)(forwardedRef, (node) => setContainer(node));
  const focusScope = react__WEBPACK_IMPORTED_MODULE_0__.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleFocusOut2 = function(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleMutations2 = function(mutations) {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      };
      var handleFocusIn = handleFocusIn2, handleFocusOut = handleFocusOut2, handleMutations = handleMutations2;
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused]
  );
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}
var Root = FocusScope;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-focus-scope/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!********************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-focus-scope/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-id/dist/index.mjs":
/*!********************************************************!*\
  !*** ./node_modules/@radix-ui/react-id/dist/index.mjs ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useId: () => (/* binding */ useId)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
// packages/react/id/src/id.tsx


var useReactId = /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))["useId".toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = react__WEBPACK_IMPORTED_MODULE_0__.useState(useReactId());
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-navigation-menu/dist/index.mjs":
/*!*********************************************************************!*\
  !*** ./node_modules/@radix-ui/react-navigation-menu/dist/index.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Content: () => (/* binding */ Content),
/* harmony export */   Indicator: () => (/* binding */ Indicator),
/* harmony export */   Item: () => (/* binding */ Item),
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   List: () => (/* binding */ List),
/* harmony export */   NavigationMenu: () => (/* binding */ NavigationMenu),
/* harmony export */   NavigationMenuContent: () => (/* binding */ NavigationMenuContent),
/* harmony export */   NavigationMenuIndicator: () => (/* binding */ NavigationMenuIndicator),
/* harmony export */   NavigationMenuItem: () => (/* binding */ NavigationMenuItem),
/* harmony export */   NavigationMenuLink: () => (/* binding */ NavigationMenuLink),
/* harmony export */   NavigationMenuList: () => (/* binding */ NavigationMenuList),
/* harmony export */   NavigationMenuSub: () => (/* binding */ NavigationMenuSub),
/* harmony export */   NavigationMenuTrigger: () => (/* binding */ NavigationMenuTrigger),
/* harmony export */   NavigationMenuViewport: () => (/* binding */ NavigationMenuViewport),
/* harmony export */   Root: () => (/* binding */ Root2),
/* harmony export */   Sub: () => (/* binding */ Sub),
/* harmony export */   Trigger: () => (/* binding */ Trigger),
/* harmony export */   Viewport: () => (/* binding */ Viewport),
/* harmony export */   createNavigationMenuScope: () => (/* binding */ createNavigationMenuScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @radix-ui/react-use-controllable-state */ "./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_direction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-direction */ "./node_modules/@radix-ui/react-direction/dist/index.mjs");
/* harmony import */ var _radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @radix-ui/react-presence */ "./node_modules/@radix-ui/react-presence/dist/index.mjs");
/* harmony import */ var _radix_ui_react_id__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @radix-ui/react-id */ "./node_modules/@radix-ui/react-id/dist/index.mjs");
/* harmony import */ var _radix_ui_react_collection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-collection */ "./node_modules/@radix-ui/react-collection/dist/index.mjs");
/* harmony import */ var _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @radix-ui/react-dismissable-layer */ "./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_previous__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-use-previous */ "./node_modules/@radix-ui/react-use-previous/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var _radix_ui_react_visually_hidden__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @radix-ui/react-visually-hidden */ "./node_modules/@radix-ui/react-visually-hidden/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/navigation-menu/src/NavigationMenu.tsx

















var NAVIGATION_MENU_NAME = "NavigationMenu";
var [Collection, useCollection, createCollectionScope] = (0,_radix_ui_react_collection__WEBPACK_IMPORTED_MODULE_3__.createCollection)(NAVIGATION_MENU_NAME);
var [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] = (0,_radix_ui_react_collection__WEBPACK_IMPORTED_MODULE_3__.createCollection)(NAVIGATION_MENU_NAME);
var [createNavigationMenuContext, createNavigationMenuScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_4__.createContextScope)(
  NAVIGATION_MENU_NAME,
  [createCollectionScope, createFocusGroupCollectionScope]
);
var [NavigationMenuProviderImpl, useNavigationMenuContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext(NAVIGATION_MENU_NAME);
var NavigationMenu = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = "horizontal",
      dir,
      ...NavigationMenuProps
    } = props;
    const [navigationMenu, setNavigationMenu] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const composedRef = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(forwardedRef, (node) => setNavigationMenu(node));
    const direction = (0,_radix_ui_react_direction__WEBPACK_IMPORTED_MODULE_6__.useDirection)(dir);
    const openTimerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
    const closeTimerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
    const skipDelayTimerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
    const [isOpenDelayed, setIsOpenDelayed] = react__WEBPACK_IMPORTED_MODULE_0__.useState(true);
    const [value = "", setValue] = (0,_radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_7__.useControllableState)({
      prop: valueProp,
      onChange: (value2) => {
        const isOpen = value2 !== "";
        const hasSkipDelayDuration = skipDelayDuration > 0;
        if (isOpen) {
          window.clearTimeout(skipDelayTimerRef.current);
          if (hasSkipDelayDuration) setIsOpenDelayed(false);
        } else {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => setIsOpenDelayed(true),
            skipDelayDuration
          );
        }
        onValueChange?.(value2);
      },
      defaultProp: defaultValue
    });
    const startCloseTimer = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => setValue(""), 150);
    }, [setValue]);
    const handleOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
      (itemValue) => {
        window.clearTimeout(closeTimerRef.current);
        setValue(itemValue);
      },
      [setValue]
    );
    const handleDelayedOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
      (itemValue) => {
        const isOpenItem = value === itemValue;
        if (isOpenItem) {
          window.clearTimeout(closeTimerRef.current);
        } else {
          openTimerRef.current = window.setTimeout(() => {
            window.clearTimeout(closeTimerRef.current);
            setValue(itemValue);
          }, delayDuration);
        }
      },
      [value, setValue, delayDuration]
    );
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return () => {
        window.clearTimeout(openTimerRef.current);
        window.clearTimeout(closeTimerRef.current);
        window.clearTimeout(skipDelayTimerRef.current);
      };
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: true,
        value,
        dir: direction,
        orientation,
        rootNavigationMenu: navigationMenu,
        onTriggerEnter: (itemValue) => {
          window.clearTimeout(openTimerRef.current);
          if (isOpenDelayed) handleDelayedOpen(itemValue);
          else handleOpen(itemValue);
        },
        onTriggerLeave: () => {
          window.clearTimeout(openTimerRef.current);
          startCloseTimer();
        },
        onContentEnter: () => window.clearTimeout(closeTimerRef.current),
        onContentLeave: startCloseTimer,
        onItemSelect: (itemValue) => {
          setValue((prevValue) => prevValue === itemValue ? "" : itemValue);
        },
        onItemDismiss: () => setValue(""),
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
          _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.nav,
          {
            "aria-label": "Main",
            "data-orientation": orientation,
            dir: direction,
            ...NavigationMenuProps,
            ref: composedRef
          }
        )
      }
    );
  }
);
NavigationMenu.displayName = NAVIGATION_MENU_NAME;
var SUB_NAME = "NavigationMenuSub";
var NavigationMenuSub = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      ...subProps
    } = props;
    const context = useNavigationMenuContext(SUB_NAME, __scopeNavigationMenu);
    const [value = "", setValue] = (0,_radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_7__.useControllableState)({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue
    });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      NavigationMenuProvider,
      {
        scope: __scopeNavigationMenu,
        isRootMenu: false,
        value,
        dir: context.dir,
        orientation,
        rootNavigationMenu: context.rootNavigationMenu,
        onTriggerEnter: (itemValue) => setValue(itemValue),
        onItemSelect: (itemValue) => setValue(itemValue),
        onItemDismiss: () => setValue(""),
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.div, { "data-orientation": orientation, ...subProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuSub.displayName = SUB_NAME;
var NavigationMenuProvider = (props) => {
  const {
    scope,
    isRootMenu,
    rootNavigationMenu,
    dir,
    orientation,
    children,
    value,
    onItemSelect,
    onItemDismiss,
    onTriggerEnter,
    onTriggerLeave,
    onContentEnter,
    onContentLeave
  } = props;
  const [viewport, setViewport] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const [viewportContent, setViewportContent] = react__WEBPACK_IMPORTED_MODULE_0__.useState(/* @__PURE__ */ new Map());
  const [indicatorTrack, setIndicatorTrack] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
    NavigationMenuProviderImpl,
    {
      scope,
      isRootMenu,
      rootNavigationMenu,
      value,
      previousValue: (0,_radix_ui_react_use_previous__WEBPACK_IMPORTED_MODULE_9__.usePrevious)(value),
      baseId: (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_10__.useId)(),
      dir,
      orientation,
      viewport,
      onViewportChange: setViewport,
      indicatorTrack,
      onIndicatorTrackChange: setIndicatorTrack,
      onTriggerEnter: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onTriggerEnter),
      onTriggerLeave: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onTriggerLeave),
      onContentEnter: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onContentEnter),
      onContentLeave: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onContentLeave),
      onItemSelect: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onItemSelect),
      onItemDismiss: (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onItemDismiss),
      onViewportContentChange: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((contentValue, contentData) => {
        setViewportContent((prevContent) => {
          prevContent.set(contentValue, contentData);
          return new Map(prevContent);
        });
      }, []),
      onViewportContentRemove: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((contentValue) => {
        setViewportContent((prevContent) => {
          if (!prevContent.has(contentValue)) return prevContent;
          prevContent.delete(contentValue);
          return new Map(prevContent);
        });
      }, []),
      children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Collection.Provider, { scope, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ViewportContentProvider, { scope, items: viewportContent, children }) })
    }
  );
};
var LIST_NAME = "NavigationMenuList";
var NavigationMenuList = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...listProps } = props;
    const context = useNavigationMenuContext(LIST_NAME, __scopeNavigationMenu);
    const list = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.ul, { "data-orientation": context.orientation, ...listProps, ref: forwardedRef });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.div, { style: { position: "relative" }, ref: context.onIndicatorTrackChange, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Collection.Slot, { scope: __scopeNavigationMenu, children: context.isRootMenu ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroup, { asChild: true, children: list }) : list }) });
  }
);
NavigationMenuList.displayName = LIST_NAME;
var ITEM_NAME = "NavigationMenuItem";
var [NavigationMenuItemContextProvider, useNavigationMenuItemContext] = createNavigationMenuContext(ITEM_NAME);
var NavigationMenuItem = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, value: valueProp, ...itemProps } = props;
    const autoValue = (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_10__.useId)();
    const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
    const contentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const triggerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const focusProxyRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const restoreContentTabOrderRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {
    });
    const wasEscapeCloseRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
    const handleContentEntry = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((side = "start") => {
      if (contentRef.current) {
        restoreContentTabOrderRef.current();
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
      }
    }, []);
    const handleContentExit = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
      if (contentRef.current) {
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) restoreContentTabOrderRef.current = removeFromTabOrder(candidates);
      }
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      NavigationMenuItemContextProvider,
      {
        scope: __scopeNavigationMenu,
        value,
        triggerRef,
        contentRef,
        focusProxyRef,
        wasEscapeCloseRef,
        onEntryKeyDown: handleContentEntry,
        onFocusProxyEnter: handleContentEntry,
        onRootContentClose: handleContentExit,
        onContentFocusOutside: handleContentExit,
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.li, { ...itemProps, ref: forwardedRef })
      }
    );
  }
);
NavigationMenuItem.displayName = ITEM_NAME;
var TRIGGER_NAME = "NavigationMenuTrigger";
var NavigationMenuTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, disabled, ...triggerProps } = props;
  const context = useNavigationMenuContext(TRIGGER_NAME, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(TRIGGER_NAME, props.__scopeNavigationMenu);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(ref, itemContext.triggerRef, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, itemContext.value);
  const contentId = makeContentId(context.baseId, itemContext.value);
  const hasPointerMoveOpenedRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const wasClickCloseRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const open = itemContext.value === context.value;
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, { children: [
    /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Collection.ItemSlot, { scope: __scopeNavigationMenu, value: itemContext.value, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroupItem, { asChild: true, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.button,
      {
        id: triggerId,
        disabled,
        "data-disabled": disabled ? "" : void 0,
        "data-state": getOpenState(open),
        "aria-expanded": open,
        "aria-controls": contentId,
        ...triggerProps,
        ref: composedRefs,
        onPointerEnter: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onPointerEnter, () => {
          wasClickCloseRef.current = false;
          itemContext.wasEscapeCloseRef.current = false;
        }),
        onPointerMove: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(
          props.onPointerMove,
          whenMouse(() => {
            if (disabled || wasClickCloseRef.current || itemContext.wasEscapeCloseRef.current || hasPointerMoveOpenedRef.current)
              return;
            context.onTriggerEnter(itemContext.value);
            hasPointerMoveOpenedRef.current = true;
          })
        ),
        onPointerLeave: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(
          props.onPointerLeave,
          whenMouse(() => {
            if (disabled) return;
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          })
        ),
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onClick, () => {
          context.onItemSelect(itemContext.value);
          wasClickCloseRef.current = open;
        }),
        onKeyDown: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onKeyDown, (event) => {
          const verticalEntryKey = context.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
          const entryKey = { horizontal: "ArrowDown", vertical: verticalEntryKey }[context.orientation];
          if (open && event.key === entryKey) {
            itemContext.onEntryKeyDown();
            event.preventDefault();
          }
        })
      }
    ) }) }),
    open && /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, { children: [
      /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
        _radix_ui_react_visually_hidden__WEBPACK_IMPORTED_MODULE_13__.Root,
        {
          "aria-hidden": true,
          tabIndex: 0,
          ref: itemContext.focusProxyRef,
          onFocus: (event) => {
            const content = itemContext.contentRef.current;
            const prevFocusedElement = event.relatedTarget;
            const wasTriggerFocused = prevFocusedElement === ref.current;
            const wasFocusFromContent = content?.contains(prevFocusedElement);
            if (wasTriggerFocused || !wasFocusFromContent) {
              itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
            }
          }
        }
      ),
      context.viewport && /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", { "aria-owns": contentId })
    ] })
  ] });
});
NavigationMenuTrigger.displayName = TRIGGER_NAME;
var LINK_NAME = "NavigationMenuLink";
var LINK_SELECT = "navigationMenu.linkSelect";
var NavigationMenuLink = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props;
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroupItem, { asChild: true, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.a,
      {
        "data-active": active ? "" : void 0,
        "aria-current": active ? "page" : void 0,
        ...linkProps,
        ref: forwardedRef,
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(
          props.onClick,
          (event) => {
            const target = event.target;
            const linkSelectEvent = new CustomEvent(LINK_SELECT, {
              bubbles: true,
              cancelable: true
            });
            target.addEventListener(LINK_SELECT, (event2) => onSelect?.(event2), { once: true });
            (0,_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.dispatchDiscreteCustomEvent)(target, linkSelectEvent);
            if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
              const rootContentDismissEvent = new CustomEvent(ROOT_CONTENT_DISMISS, {
                bubbles: true,
                cancelable: true
              });
              (0,_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.dispatchDiscreteCustomEvent)(target, rootContentDismissEvent);
            }
          },
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
NavigationMenuLink.displayName = LINK_NAME;
var INDICATOR_NAME = "NavigationMenuIndicator";
var NavigationMenuIndicator = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { forceMount, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, props.__scopeNavigationMenu);
  const isVisible = Boolean(context.value);
  return context.indicatorTrack ? react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal(
    /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_14__.Presence, { present: forceMount || isVisible, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(NavigationMenuIndicatorImpl, { ...indicatorProps, ref: forwardedRef }) }),
    context.indicatorTrack
  ) : null;
});
NavigationMenuIndicator.displayName = INDICATOR_NAME;
var NavigationMenuIndicatorImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, __scopeNavigationMenu);
  const getItems = useCollection(__scopeNavigationMenu);
  const [activeTrigger, setActiveTrigger] = react__WEBPACK_IMPORTED_MODULE_0__.useState(
    null
  );
  const [position, setPosition] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const isHorizontal = context.orientation === "horizontal";
  const isVisible = Boolean(context.value);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const items = getItems();
    const triggerNode = items.find((item) => item.value === context.value)?.ref.current;
    if (triggerNode) setActiveTrigger(triggerNode);
  }, [getItems, context.value]);
  const handlePositionChange = () => {
    if (activeTrigger) {
      setPosition({
        size: isHorizontal ? activeTrigger.offsetWidth : activeTrigger.offsetHeight,
        offset: isHorizontal ? activeTrigger.offsetLeft : activeTrigger.offsetTop
      });
    }
  };
  useResizeObserver(activeTrigger, handlePositionChange);
  useResizeObserver(context.indicatorTrack, handlePositionChange);
  return position ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
    _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.div,
    {
      "aria-hidden": true,
      "data-state": isVisible ? "visible" : "hidden",
      "data-orientation": context.orientation,
      ...indicatorProps,
      ref: forwardedRef,
      style: {
        position: "absolute",
        ...isHorizontal ? {
          left: 0,
          width: position.size + "px",
          transform: `translateX(${position.offset}px)`
        } : {
          top: 0,
          height: position.size + "px",
          transform: `translateY(${position.offset}px)`
        },
        ...indicatorProps.style
      }
    }
  ) : null;
});
var CONTENT_NAME = "NavigationMenuContent";
var NavigationMenuContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(itemContext.contentRef, forwardedRef);
  const open = itemContext.value === context.value;
  const commonProps = {
    value: itemContext.value,
    triggerRef: itemContext.triggerRef,
    focusProxyRef: itemContext.focusProxyRef,
    wasEscapeCloseRef: itemContext.wasEscapeCloseRef,
    onContentFocusOutside: itemContext.onContentFocusOutside,
    onRootContentClose: itemContext.onRootContentClose,
    ...contentProps
  };
  return !context.viewport ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_14__.Presence, { present: forceMount || open, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
    NavigationMenuContentImpl,
    {
      "data-state": getOpenState(open),
      ...commonProps,
      ref: composedRefs,
      onPointerEnter: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(
        props.onPointerLeave,
        whenMouse(context.onContentLeave)
      ),
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ...commonProps.style
      }
    }
  ) }) : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ViewportContentMounter, { forceMount, ...commonProps, ref: composedRefs });
});
NavigationMenuContent.displayName = CONTENT_NAME;
var ViewportContentMounter = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const { onViewportContentChange, onViewportContentRemove } = context;
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_15__.useLayoutEffect)(() => {
    onViewportContentChange(props.value, {
      ref: forwardedRef,
      ...props
    });
  }, [props, forwardedRef, onViewportContentChange]);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_15__.useLayoutEffect)(() => {
    return () => onViewportContentRemove(props.value);
  }, [props.value, onViewportContentRemove]);
  return null;
});
var ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";
var NavigationMenuContentImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    value,
    triggerRef,
    focusProxyRef,
    wasEscapeCloseRef,
    onRootContentClose,
    onContentFocusOutside,
    ...contentProps
  } = props;
  const context = useNavigationMenuContext(CONTENT_NAME, __scopeNavigationMenu);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(ref, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, value);
  const contentId = makeContentId(context.baseId, value);
  const getItems = useCollection(__scopeNavigationMenu);
  const prevMotionAttributeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const { onItemDismiss } = context;
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const content = ref.current;
    if (context.isRootMenu && content) {
      const handleClose = () => {
        onItemDismiss();
        onRootContentClose();
        if (content.contains(document.activeElement)) triggerRef.current?.focus();
      };
      content.addEventListener(ROOT_CONTENT_DISMISS, handleClose);
      return () => content.removeEventListener(ROOT_CONTENT_DISMISS, handleClose);
    }
  }, [context.isRootMenu, props.value, triggerRef, onItemDismiss, onRootContentClose]);
  const motionAttribute = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const items = getItems();
    const values = items.map((item) => item.value);
    if (context.dir === "rtl") values.reverse();
    const index = values.indexOf(context.value);
    const prevIndex = values.indexOf(context.previousValue);
    const isSelected = value === context.value;
    const wasSelected = prevIndex === values.indexOf(value);
    if (!isSelected && !wasSelected) return prevMotionAttributeRef.current;
    const attribute = (() => {
      if (index !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index > prevIndex ? "from-end" : "from-start";
        if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
      }
      return null;
    })();
    prevMotionAttributeRef.current = attribute;
    return attribute;
  }, [context.previousValue, context.value, context.dir, getItems, value]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroup, { asChild: true, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
    _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_16__.DismissableLayer,
    {
      id: contentId,
      "aria-labelledby": triggerId,
      "data-motion": motionAttribute,
      "data-orientation": context.orientation,
      ...contentProps,
      ref: composedRefs,
      disableOutsidePointerEvents: false,
      onDismiss: () => {
        const rootContentDismissEvent = new Event(ROOT_CONTENT_DISMISS, {
          bubbles: true,
          cancelable: true
        });
        ref.current?.dispatchEvent(rootContentDismissEvent);
      },
      onFocusOutside: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onFocusOutside, (event) => {
        onContentFocusOutside();
        const target = event.target;
        if (context.rootNavigationMenu?.contains(target)) event.preventDefault();
      }),
      onPointerDownOutside: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onPointerDownOutside, (event) => {
        const target = event.target;
        const isTrigger = getItems().some((item) => item.ref.current?.contains(target));
        const isRootViewport = context.isRootMenu && context.viewport?.contains(target);
        if (isTrigger || isRootViewport || !context.isRootMenu) event.preventDefault();
      }),
      onKeyDown: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onKeyDown, (event) => {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
        const isTabKey = event.key === "Tab" && !isMetaKey;
        if (isTabKey) {
          const candidates = getTabbableCandidates(event.currentTarget);
          const focusedElement = document.activeElement;
          const index = candidates.findIndex((candidate) => candidate === focusedElement);
          const isMovingBackwards = event.shiftKey;
          const nextCandidates = isMovingBackwards ? candidates.slice(0, index).reverse() : candidates.slice(index + 1, candidates.length);
          if (focusFirst(nextCandidates)) {
            event.preventDefault();
          } else {
            focusProxyRef.current?.focus();
          }
        }
      }),
      onEscapeKeyDown: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onEscapeKeyDown, (event) => {
        wasEscapeCloseRef.current = true;
      })
    }
  ) });
});
var VIEWPORT_NAME = "NavigationMenuViewport";
var NavigationMenuViewport = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { forceMount, ...viewportProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu);
  const open = Boolean(context.value);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_14__.Presence, { present: forceMount || open, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(NavigationMenuViewportImpl, { ...viewportProps, ref: forwardedRef }) });
});
NavigationMenuViewport.displayName = VIEWPORT_NAME;
var NavigationMenuViewportImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.useComposedRefs)(forwardedRef, context.onViewportChange);
  const viewportContentContext = useViewportContentContext(
    CONTENT_NAME,
    props.__scopeNavigationMenu
  );
  const [size, setSize] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const [content, setContent] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const viewportWidth = size ? size?.width + "px" : void 0;
  const viewportHeight = size ? size?.height + "px" : void 0;
  const open = Boolean(context.value);
  const activeContentValue = open ? context.value : context.previousValue;
  const handleSizeChange = () => {
    if (content) setSize({ width: content.offsetWidth, height: content.offsetHeight });
  };
  useResizeObserver(content, handleSizeChange);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
    _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.div,
    {
      "data-state": getOpenState(open),
      "data-orientation": context.orientation,
      ...viewportImplProps,
      ref: composedRefs,
      style: {
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? "none" : void 0,
        ["--radix-navigation-menu-viewport-width"]: viewportWidth,
        ["--radix-navigation-menu-viewport-height"]: viewportHeight,
        ...viewportImplProps.style
      },
      onPointerEnter: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onPointerEnter, context.onContentEnter),
      onPointerLeave: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onPointerLeave, whenMouse(context.onContentLeave)),
      children: Array.from(viewportContentContext.items).map(([value, { ref, forceMount, ...props2 }]) => {
        const isActive = activeContentValue === value;
        return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_14__.Presence, { present: forceMount || isActive, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
          NavigationMenuContentImpl,
          {
            ...props2,
            ref: (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_5__.composeRefs)(ref, (node) => {
              if (isActive && node) setContent(node);
            })
          }
        ) }, value);
      })
    }
  );
});
var FOCUS_GROUP_NAME = "FocusGroup";
var FocusGroup = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const context = useNavigationMenuContext(FOCUS_GROUP_NAME, __scopeNavigationMenu);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroupCollection.Provider, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroupCollection.Slot, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.div, { dir: context.dir, ...groupProps, ref: forwardedRef }) }) });
  }
);
var ARROW_KEYS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
var FOCUS_GROUP_ITEM_NAME = "FocusGroupItem";
var FocusGroupItem = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const getItems = useFocusGroupCollection(__scopeNavigationMenu);
    const context = useNavigationMenuContext(FOCUS_GROUP_ITEM_NAME, __scopeNavigationMenu);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FocusGroupCollection.ItemSlot, { scope: __scopeNavigationMenu, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_8__.Primitive.button,
      {
        ...groupProps,
        ref: forwardedRef,
        onKeyDown: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_12__.composeEventHandlers)(props.onKeyDown, (event) => {
          const isFocusNavigationKey = ["Home", "End", ...ARROW_KEYS].includes(event.key);
          if (isFocusNavigationKey) {
            let candidateNodes = getItems().map((item) => item.ref.current);
            const prevItemKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
            const prevKeys = [prevItemKey, "ArrowUp", "End"];
            if (prevKeys.includes(event.key)) candidateNodes.reverse();
            if (ARROW_KEYS.includes(event.key)) {
              const currentIndex = candidateNodes.indexOf(event.currentTarget);
              candidateNodes = candidateNodes.slice(currentIndex + 1);
            }
            setTimeout(() => focusFirst(candidateNodes));
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst(candidates) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}
function removeFromTabOrder(candidates) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
    candidate.setAttribute("tabindex", "-1");
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex;
      candidate.setAttribute("tabindex", prevTabIndex);
    });
  };
}
function useResizeObserver(element, onResize) {
  const handleResize = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_11__.useCallbackRef)(onResize);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_15__.useLayoutEffect)(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
function getOpenState(open) {
  return open ? "open" : "closed";
}
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root2 = NavigationMenu;
var Sub = NavigationMenuSub;
var List = NavigationMenuList;
var Item = NavigationMenuItem;
var Trigger = NavigationMenuTrigger;
var Link = NavigationMenuLink;
var Indicator = NavigationMenuIndicator;
var Content = NavigationMenuContent;
var Viewport = NavigationMenuViewport;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-popper/dist/index.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@radix-ui/react-popper/dist/index.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALIGN_OPTIONS: () => (/* binding */ ALIGN_OPTIONS),
/* harmony export */   Anchor: () => (/* binding */ Anchor),
/* harmony export */   Arrow: () => (/* binding */ Arrow),
/* harmony export */   Content: () => (/* binding */ Content),
/* harmony export */   Popper: () => (/* binding */ Popper),
/* harmony export */   PopperAnchor: () => (/* binding */ PopperAnchor),
/* harmony export */   PopperArrow: () => (/* binding */ PopperArrow),
/* harmony export */   PopperContent: () => (/* binding */ PopperContent),
/* harmony export */   Root: () => (/* binding */ Root2),
/* harmony export */   SIDE_OPTIONS: () => (/* binding */ SIDE_OPTIONS),
/* harmony export */   createPopperScope: () => (/* binding */ createPopperScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @floating-ui/react-dom */ "./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs");
/* harmony import */ var _floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @floating-ui/react-dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
/* harmony import */ var _radix_ui_react_arrow__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @radix-ui/react-arrow */ "./node_modules/@radix-ui/react-arrow/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-popper/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_size__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-use-size */ "./node_modules/@radix-ui/react-use-size/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/popper/src/popper.tsx










var SIDE_OPTIONS = ["top", "right", "bottom", "left"];
var ALIGN_OPTIONS = ["start", "center", "end"];
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME, __scopePopper);
    const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__.useComposedRefs)(forwardedRef, ref);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      context.onAnchorChange(virtualRef?.current || ref.current);
    });
    return virtualRef ? null : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME;
var CONTENT_NAME = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME);
var PopperContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME, __scopePopper);
    const [content, setContent] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_3__.useComposedRefs)(forwardedRef, (node) => setContent(node));
    const [arrow, setArrow] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const arrowSize = (0,_radix_ui_react_use_size__WEBPACK_IMPORTED_MODULE_5__.useSize)(arrow);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.useFloating)({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_7__.autoUpdate)(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.offset)({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.shift)({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.limitShift)() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.flip)({ ...detectOverflowOptions }),
        (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.size)({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.arrow)({ element: arrow, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && (0,_floating_ui_react_dom__WEBPACK_IMPORTED_MODULE_6__.hide)({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_8__.useCallbackRef)(onPlaced);
    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__.useLayoutEffect)(() => {
      if (isPositioned) {
        handlePlaced?.();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const [contentZIndex, setContentZIndex] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__.useLayoutEffect)(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...middlewareData.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
              _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME;
var ARROW_NAME = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
          _radix_ui_react_arrow__WEBPACK_IMPORTED_MODULE_10__.Root,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root2 = Popper;
var Anchor = PopperAnchor;
var Content = PopperContent;
var Arrow = PopperArrow;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-popper/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-popper/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-portal/dist/index.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@radix-ui/react-portal/dist/index.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Portal: () => (/* binding */ Portal),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-portal/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/portal/src/portal.tsx





var PORTAL_NAME = "Portal";
var Portal = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__.useLayoutEffect)(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal(/* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;
var Root = Portal;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-portal/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-portal/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-presence/dist/index.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/@radix-ui/react-presence/dist/index.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Presence: () => (/* binding */ Presence)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
"use client";

// packages/react/presence/src/Presence.tsx




// packages/react/presence/src/useStateMachine.tsx

function useStateMachine(initialState, machine) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// packages/react/presence/src/Presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children);
  const ref = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__.useComposedRefs)(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  const stylesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef({});
  const prevPresentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(present);
  const prevAnimationNameRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(event.animationName);
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((node2) => {
      if (node2) stylesRef.current = getComputedStyle(node2);
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/Primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs":
/*!*************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Slot: () => (/* binding */ Slot),
/* harmony export */   Slottable: () => (/* binding */ Slottable)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/slot/src/Slot.tsx



var Slot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement) > 1) return react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null);
        return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? newElement.props.children : null;
      } else {
        return child;
      }
    });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, void 0, newChildren) : null });
  }
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
});
Slot.displayName = "Slot";
var SlotClone = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      // @ts-ignore
      ref: forwardedRef ? (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(forwardedRef, childrenRef) : childrenRef
    });
  }
  return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children) > 1 ? react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null) : null;
});
SlotClone.displayName = "SlotClone";
var Slottable = ({ children }) => {
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children });
};
function isSlottable(child) {
  return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child) && child.type === Slottable;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var Root = Slot;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-separator/dist/index.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@radix-ui/react-separator/dist/index.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Separator: () => (/* binding */ Separator)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-separator/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/separator/src/separator.tsx



var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__.Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-separator/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!******************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-separator/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-slot/dist/index.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/@radix-ui/react-slot/dist/index.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   Slot: () => (/* binding */ Slot),
/* harmony export */   Slottable: () => (/* binding */ Slottable)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/slot/src/slot.tsx



var Slot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement) > 1) return react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null);
        return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? newElement.props.children : null;
      } else {
        return child;
      }
    });
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, void 0, newChildren) : null });
  }
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
});
Slot.displayName = "Slot";
var SlotClone = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    const props2 = mergeProps(slotProps, children.props);
    if (children.type !== react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
      props2.ref = forwardedRef ? (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(forwardedRef, childrenRef) : childrenRef;
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, props2);
  }
  return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children) > 1 ? react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null) : null;
});
SlotClone.displayName = "SlotClone";
var Slottable = ({ children }) => {
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children });
};
function isSlottable(child) {
  return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child) && child.type === Slottable;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var Root = Slot;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-tooltip/dist/index.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/@radix-ui/react-tooltip/dist/index.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arrow: () => (/* binding */ Arrow2),
/* harmony export */   Content: () => (/* binding */ Content2),
/* harmony export */   Portal: () => (/* binding */ Portal),
/* harmony export */   Provider: () => (/* binding */ Provider),
/* harmony export */   Root: () => (/* binding */ Root3),
/* harmony export */   Tooltip: () => (/* binding */ Tooltip),
/* harmony export */   TooltipArrow: () => (/* binding */ TooltipArrow),
/* harmony export */   TooltipContent: () => (/* binding */ TooltipContent),
/* harmony export */   TooltipPortal: () => (/* binding */ TooltipPortal),
/* harmony export */   TooltipProvider: () => (/* binding */ TooltipProvider),
/* harmony export */   TooltipTrigger: () => (/* binding */ TooltipTrigger),
/* harmony export */   Trigger: () => (/* binding */ Trigger),
/* harmony export */   createTooltipScope: () => (/* binding */ createTooltipScope)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-context */ "./node_modules/@radix-ui/react-context/dist/index.mjs");
/* harmony import */ var _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @radix-ui/react-dismissable-layer */ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs");
/* harmony import */ var _radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-id */ "./node_modules/@radix-ui/react-id/dist/index.mjs");
/* harmony import */ var _radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-popper */ "./node_modules/@radix-ui/react-popper/dist/index.mjs");
/* harmony import */ var _radix_ui_react_portal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @radix-ui/react-portal */ "./node_modules/@radix-ui/react-portal/dist/index.mjs");
/* harmony import */ var _radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @radix-ui/react-presence */ "./node_modules/@radix-ui/react-presence/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/react-use-controllable-state */ "./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs");
/* harmony import */ var _radix_ui_react_visually_hidden__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @radix-ui/react-visually-hidden */ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/tooltip/src/tooltip.tsx















var [createTooltipContext, createTooltipScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__.createContextScope)("Tooltip", [
  _radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.createPopperScope
]);
var usePopperScope = (0,_radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.createPopperScope)();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const [isOpenDelayed, setIsOpenDelayed] = react__WEBPACK_IMPORTED_MODULE_0__.useState(true);
  const isPointerInTransitRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const skipDelayTimerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayed,
      delayDuration,
      onOpen: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        setIsOpenDelayed(false);
      }, []),
      onClose: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => setIsOpenDelayed(true),
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const contentId = (0,_radix_ui_react_id__WEBPACK_IMPORTED_MODULE_4__.useId)();
  const openTimerRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const [open = false, setOpen] = (0,_radix_ui_react_use_controllable_state__WEBPACK_IMPORTED_MODULE_5__.useControllableState)({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange?.(open2);
    }
  });
  const stateAttribute = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.Root, { ...popperScope, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
        if (providerContext.isOpenDelayed) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayed, handleDelayedOpen, handleOpen]),
      onTriggerLeave: react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip.displayName = TOOLTIP_NAME;
var TRIGGER_NAME = "TooltipTrigger";
var TooltipTrigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_6__.useComposedRefs)(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
    const hasPointerMoveOpenedRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
    const handlePointerUp = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => isPointerDownRef.current = false, []);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_7__.Primitive.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onPointerDown, () => {
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onBlur, context.onClose),
        onClick: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_8__.composeEventHandlers)(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "TooltipPortal";
var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_9__.Presence, { present: forceMount || context.open, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_portal__WEBPACK_IMPORTED_MODULE_10__.Portal, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "TooltipContent";
var TooltipContent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_presence__WEBPACK_IMPORTED_MODULE_9__.Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_6__.useComposedRefs)(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var TooltipContentImpl = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event) => {
          const target = event.target;
          if (target?.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_dismissable_layer__WEBPACK_IMPORTED_MODULE_11__.DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(
          _radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.Content,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_12__.Slottable, { children }),
              /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_visually_hidden__WEBPACK_IMPORTED_MODULE_13__.Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent.displayName = CONTENT_NAME;
var ARROW_NAME = "TooltipArrow";
var TooltipArrow = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_popper__WEBPACK_IMPORTED_MODULE_3__.Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}
var Provider = TooltipProvider;
var Root3 = Tooltip;
var Trigger = TooltipTrigger;
var Portal = TooltipPortal;
var Content2 = TooltipContent;
var Arrow2 = TooltipArrow;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs":
/*!************************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Branch: () => (/* binding */ Branch),
/* harmony export */   DismissableLayer: () => (/* binding */ DismissableLayer),
/* harmony export */   DismissableLayerBranch: () => (/* binding */ DismissableLayerBranch),
/* harmony export */   Root: () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @radix-ui/primitive */ "./node_modules/@radix-ui/primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ "./node_modules/@radix-ui/react-compose-refs/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
/* harmony import */ var _radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-use-escape-keydown */ "./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";

// packages/react/dismissable-layer/src/dismissable-layer.tsx







var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = react__WEBPACK_IMPORTED_MODULE_0__.useState({});
    const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    (0,_radix_ui_react_use_escape_keydown__WEBPACK_IMPORTED_MODULE_3__.useEscapeKeydown)((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: (0,_radix_ui_primitive__WEBPACK_IMPORTED_MODULE_5__.composeEventHandlers)(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DismissableLayerContext);
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__.useComposedRefs)(forwardedRef, ref);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.Primitive.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onPointerDownOutside);
  const isPointerInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  const handleClickRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(() => {
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_6__.useCallbackRef)(onFocusOutside);
  const isFocusInsideReactTreeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    (0,_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__.dispatchDiscreteCustomEvent)(target, event);
  } else {
    target.dispatchEvent(event);
  }
}
var Root = DismissableLayer;
var Branch = DismissableLayerBranch;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-primitive/dist/index.mjs":
/*!****************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-primitive/dist/index.mjs ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   dispatchDiscreteCustomEvent: () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @radix-ui/react-slot */ "./node_modules/@radix-ui/react-slot/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/primitive/src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__.Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = Primitive;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   VisuallyHidden: () => (/* binding */ VisuallyHidden)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/visually-hidden/src/visually-hidden.tsx



var NAME = "VisuallyHidden";
var VisuallyHidden = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__.Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: {
          // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          ...props.style
        }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var Root = VisuallyHidden;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCallbackRef: () => (/* binding */ useCallbackRef)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
// packages/react/use-callback-ref/src/useCallbackRef.tsx

function useCallbackRef(callback) {
  const callbackRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(callback);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    callbackRef.current = callback;
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useControllableState: () => (/* binding */ useControllableState)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
// packages/react/use-controllable-state/src/useControllableState.tsx


function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  }
}) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__.useCallbackRef)(onChange);
  const setValue = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue;
        const value2 = typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value2 !== prop) handleChange(value2);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const uncontrolledState = react__WEBPACK_IMPORTED_MODULE_0__.useState(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(value);
  const handleChange = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__.useCallbackRef)(onChange);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);
  return uncontrolledState;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEscapeKeydown: () => (/* binding */ useEscapeKeydown)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-callback-ref */ "./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs");
// packages/react/use-escape-keydown/src/useEscapeKeydown.tsx


function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
  const onEscapeKeyDown = (0,_radix_ui_react_use_callback_ref__WEBPACK_IMPORTED_MODULE_1__.useCallbackRef)(onEscapeKeyDownProp);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLayoutEffect: () => (/* binding */ useLayoutEffect2)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
// packages/react/use-layout-effect/src/useLayoutEffect.tsx

var useLayoutEffect2 = Boolean(globalThis?.document) ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : () => {
};

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-previous/dist/index.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-previous/dist/index.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePrevious: () => (/* binding */ usePrevious)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
// packages/react/use-previous/src/usePrevious.tsx

function usePrevious(value) {
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef({ value, previous: value });
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-use-size/dist/index.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/@radix-ui/react-use-size/dist/index.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSize: () => (/* binding */ useSize)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ "./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs");
// packages/react/use-size/src/useSize.tsx


function useSize(element) {
  const [size, setSize] = react__WEBPACK_IMPORTED_MODULE_0__.useState(void 0);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@radix-ui/react-visually-hidden/dist/index.mjs":
/*!*********************************************************************!*\
  !*** ./node_modules/@radix-ui/react-visually-hidden/dist/index.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Root: () => (/* binding */ Root),
/* harmony export */   VisuallyHidden: () => (/* binding */ VisuallyHidden)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-primitive */ "./node_modules/@radix-ui/react-primitive/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/react/visually-hidden/src/VisuallyHidden.tsx



var NAME = "VisuallyHidden";
var VisuallyHidden = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
      _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_2__.Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: {
          // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          ...props.style
        }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var Root = VisuallyHidden;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/class-variance-authority/dist/index.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/class-variance-authority/dist/index.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cva: () => (/* binding */ cva),
/* harmony export */   cx: () => (/* binding */ cx)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */ 
const falsyToString = (value)=>typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx__WEBPACK_IMPORTED_MODULE_0__.clsx;
const cva = (base, config)=>(props)=>{
        var _config_compoundVariants;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants, defaultVariants } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
            let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };



/***/ }),

/***/ "./node_modules/clsx/dist/clsx.mjs":
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/Icon.js":
/*!****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.js */ "./node_modules/lucide-react/dist/esm/defaultAttributes.js");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      "svg",
      {
        ref,
        ..._defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/* harmony import */ var _Icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Icon.js */ "./node_modules/lucide-react/dist/esm/Icon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ className, ...props }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
      ref,
      iconNode,
      className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)(`lucide-${(0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.toKebabCase)(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/defaultAttributes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-down.js":
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-down.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ChevronDown)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ChevronDown", __iconNode);


//# sourceMappingURL=chevron-down.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-right.js":
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-right.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ChevronRight)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ChevronRight", __iconNode);


//# sourceMappingURL=chevron-right.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/menu.js":
/*!**********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/menu.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
];
const Menu = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Menu", __iconNode);


//# sourceMappingURL=menu.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/panel-left.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/panel-left.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ PanelLeft)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
];
const PanelLeft = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("PanelLeft", __iconNode);


//# sourceMappingURL=panel-left.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/x.js":
/*!*******************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/x.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ X)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("X", __iconNode);


//# sourceMappingURL=x.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();


//# sourceMappingURL=utils.js.map


/***/ }),

/***/ "./node_modules/tailwind-merge/dist/bundle-mjs.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/tailwind-merge/dist/bundle-mjs.mjs ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTailwindMerge: () => (/* binding */ createTailwindMerge),
/* harmony export */   extendTailwindMerge: () => (/* binding */ extendTailwindMerge),
/* harmony export */   fromTheme: () => (/* binding */ fromTheme),
/* harmony export */   getDefaultConfig: () => (/* binding */ getDefaultConfig),
/* harmony export */   mergeConfigs: () => (/* binding */ mergeConfigs),
/* harmony export */   twJoin: () => (/* binding */ twJoin),
/* harmony export */   twMerge: () => (/* binding */ twMerge),
/* harmony export */   validators: () => (/* binding */ validators)
/* harmony export */ });
const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = config => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = className => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
const getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return undefined;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = className => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
    if (property) {
      // I use two dots here because one dot is used as prefix for class groups in plugins
      return 'arbitrary..' + property;
    }
  }
};
/**
 * Exported for testing only
 */
const createClassMap = config => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach(classDefinition => {
    if (typeof classDefinition === 'string') {
      const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup]) => {
      processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
const getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(pathPart => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
const isThemeGetter = func => func.isThemeGetter;
const getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map(classDefinition => {
      if (typeof classDefinition === 'string') {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === 'object') {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};

// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = maxCacheSize => {
  if (maxCacheSize < 1) {
    return {
      get: () => undefined,
      set: () => {}
    };
  }
  let cacheSize = 0;
  let cache = new Map();
  let previousCache = new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== undefined) {
        return value;
      }
      if ((value = previousCache.get(key)) !== undefined) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
const IMPORTANT_MODIFIER = '!';
const createParseClassName = config => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  // parseClassName inspired by https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
  const parseClassName = className => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++;
      } else if (currentCharacter === ']') {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return className => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */
const sortModifiers = modifiers => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach(modifier => {
    const isArbitraryVariant = modifier[0] === '[';
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
const createConfigUtils = config => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = '';
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(':');
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      // Tailwind class omitted due to conflict
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    // Tailwind class not in conflict
    result = originalClassName + (result.length > 0 ? ' ' + result : result);
  }
  return result;
};

/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = '';
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}
const toValue = mix => {
  if (typeof mix === 'string') {
    return mix;
  }
  let resolvedValue;
  let string = '';
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
const fromTheme = key => {
  const themeGetter = theme => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
const fractionRegex = /^\d+\/\d+$/;
const stringLengths = /*#__PURE__*/new Set(['px', 'full', 'screen']);
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isLength = value => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
const isArbitraryLength = value => getIsArbitraryValue(value, 'length', isLengthOnly);
const isNumber = value => Boolean(value) && !Number.isNaN(Number(value));
const isArbitraryNumber = value => getIsArbitraryValue(value, 'number', isNumber);
const isInteger = value => Boolean(value) && Number.isInteger(Number(value));
const isPercent = value => value.endsWith('%') && isNumber(value.slice(0, -1));
const isArbitraryValue = value => arbitraryValueRegex.test(value);
const isTshirtSize = value => tshirtUnitRegex.test(value);
const sizeLabels = /*#__PURE__*/new Set(['length', 'size', 'percentage']);
const isArbitrarySize = value => getIsArbitraryValue(value, sizeLabels, isNever);
const isArbitraryPosition = value => getIsArbitraryValue(value, 'position', isNever);
const imageLabels = /*#__PURE__*/new Set(['image', 'url']);
const isArbitraryImage = value => getIsArbitraryValue(value, imageLabels, isImage);
const isArbitraryShadow = value => getIsArbitraryValue(value, '', isShadow);
const isAny = () => true;
const getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === 'string' ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
const isLengthOnly = value =>
// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
// For example, `hsl(0 0% 0%)` would be classified as a length without this check.
// I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = () => false;
const isShadow = value => shadowRegex.test(value);
const isImage = value => imageRegex.test(value);
const validators = /*#__PURE__*/Object.defineProperty({
  __proto__: null,
  isAny,
  isArbitraryImage,
  isArbitraryLength,
  isArbitraryNumber,
  isArbitraryPosition,
  isArbitraryShadow,
  isArbitrarySize,
  isArbitraryValue,
  isInteger,
  isLength,
  isNumber,
  isPercent,
  isTshirtSize
}, Symbol.toStringTag, {
  value: 'Module'
});
const getDefaultConfig = () => {
  const colors = fromTheme('colors');
  const spacing = fromTheme('spacing');
  const blur = fromTheme('blur');
  const brightness = fromTheme('brightness');
  const borderColor = fromTheme('borderColor');
  const borderRadius = fromTheme('borderRadius');
  const borderSpacing = fromTheme('borderSpacing');
  const borderWidth = fromTheme('borderWidth');
  const contrast = fromTheme('contrast');
  const grayscale = fromTheme('grayscale');
  const hueRotate = fromTheme('hueRotate');
  const invert = fromTheme('invert');
  const gap = fromTheme('gap');
  const gradientColorStops = fromTheme('gradientColorStops');
  const gradientColorStopPositions = fromTheme('gradientColorStopPositions');
  const inset = fromTheme('inset');
  const margin = fromTheme('margin');
  const opacity = fromTheme('opacity');
  const padding = fromTheme('padding');
  const saturate = fromTheme('saturate');
  const scale = fromTheme('scale');
  const sepia = fromTheme('sepia');
  const skew = fromTheme('skew');
  const space = fromTheme('space');
  const translate = fromTheme('translate');
  const getOverscroll = () => ['auto', 'contain', 'none'];
  const getOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'];
  const getSpacingWithAutoAndArbitrary = () => ['auto', isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ['', isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ['auto', isNumber, isArbitraryValue];
  const getPositions = () => ['bottom', 'center', 'left', 'left-bottom', 'left-top', 'right', 'right-bottom', 'right-top', 'top'];
  const getLineStyles = () => ['solid', 'dashed', 'dotted', 'double', 'none'];
  const getBlendModes = () => ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
  const getAlign = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'];
  const getZeroAndEmpty = () => ['', '0', isArbitraryValue];
  const getBreaks = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ':',
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ['none', '', isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ['none', '', 'full', isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ['auto', 'square', 'video', isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [{
        'break-after': getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [{
        'break-before': getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [{
        'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [{
        'box-decoration': ['slice', 'clone']
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ['border', 'content']
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ['right', 'left', 'none', 'start', 'end']
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ['left', 'right', 'both', 'none', 'start', 'end']
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [{
        object: ['contain', 'cover', 'fill', 'none', 'scale-down']
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [{
        'overflow-x': getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [{
        'overflow-y': getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [{
        'overscroll-x': getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [{
        'overscroll-y': getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [{
        'inset-x': [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [{
        'inset-y': [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ['auto', isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [{
        flex: ['row', 'row-reverse', 'col', 'col-reverse']
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [{
        flex: ['wrap', 'wrap-reverse', 'nowrap']
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ['1', 'auto', 'initial', 'none', isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ['first', 'last', 'none', isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [{
        'grid-cols': [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [{
        col: ['auto', {
          span: ['full', isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [{
        'col-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [{
        'col-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [{
        'grid-rows': [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [{
        row: ['auto', {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [{
        'row-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [{
        'row-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [{
        'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [{
        'auto-cols': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [{
        'auto-rows': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [{
        'gap-x': [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [{
        'gap-y': [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [{
        justify: ['normal', ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [{
        'justify-items': ['start', 'end', 'center', 'stretch']
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [{
        'justify-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [{
        content: ['normal', ...getAlign(), 'baseline']
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [{
        items: ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [{
        self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline']
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [{
        'place-content': [...getAlign(), 'baseline']
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [{
        'place-items': ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [{
        'place-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      'space-x': [{
        'space-x': [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      'space-y': [{
        'space-y': [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-y-reverse': ['space-y-reverse'],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ['auto', 'min', 'max', 'fit', 'svw', 'lvw', 'dvw', isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [{
        'min-w': [isArbitraryValue, spacing, 'min', 'max', 'fit']
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [{
        'max-w': [isArbitraryValue, spacing, 'none', 'full', 'min', 'max', 'fit', 'prose', {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [{
        'min-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [{
        'max-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit']
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [{
        text: ['base', isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [{
        font: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black', isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [{
        'line-clamp': ['none', isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [{
        'list-image': ['none', isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [{
        list: ['none', 'disc', 'decimal', isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [{
        list: ['inside', 'outside']
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      'placeholder-opacity': [{
        'placeholder-opacity': [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [{
        text: ['left', 'center', 'right', 'justify', 'start', 'end']
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      'text-opacity': [{
        'text-opacity': [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [{
        decoration: [...getLineStyles(), 'wavy']
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [{
        decoration: ['auto', 'from-font', isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [{
        'underline-offset': ['auto', isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      'text-wrap': [{
        text: ['wrap', 'nowrap', 'balance', 'pretty']
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [{
        align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ['normal', 'words', 'all', 'keep']
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ['none', 'manual', 'auto']
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ['none', isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [{
        bg: ['fixed', 'local', 'scroll']
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [{
        'bg-clip': ['border', 'padding', 'content', 'text']
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      'bg-opacity': [{
        'bg-opacity': [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [{
        'bg-origin': ['border', 'padding', 'content']
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [{
        bg: ['no-repeat', {
          repeat: ['', 'x', 'y', 'round', 'space']
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [{
        bg: ['auto', 'cover', 'contain', isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [{
        bg: ['none', {
          'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [{
        'rounded-s': [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [{
        'rounded-e': [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [{
        'rounded-t': [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [{
        'rounded-r': [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [{
        'rounded-b': [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [{
        'rounded-l': [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [{
        'rounded-ss': [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [{
        'rounded-se': [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [{
        'rounded-ee': [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [{
        'rounded-es': [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [{
        'rounded-tl': [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [{
        'rounded-tr': [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [{
        'rounded-br': [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [{
        'rounded-bl': [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [{
        'border-x': [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [{
        'border-y': [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [{
        'border-s': [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [{
        'border-e': [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [{
        'border-t': [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [{
        'border-r': [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [{
        'border-b': [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [{
        'border-l': [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      'border-opacity': [{
        'border-opacity': [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [{
        border: [...getLineStyles(), 'hidden']
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x': [{
        'divide-x': [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y': [{
        'divide-y': [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      'divide-opacity': [{
        'divide-opacity': [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      'divide-style': [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [{
        'border-x': [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [{
        'border-y': [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-s': [{
        'border-s': [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-e': [{
        'border-e': [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [{
        'border-t': [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [{
        'border-r': [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [{
        'border-b': [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [{
        'border-l': [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [{
        outline: ['', ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [{
        'outline-offset': [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w': [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      'ring-color': [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      'ring-opacity': [{
        'ring-opacity': [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      'ring-offset-w': [{
        'ring-offset': [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      'ring-offset-color': [{
        'ring-offset': [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ['', 'inner', 'none', isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      'shadow-color': [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [{
        'mix-blend': [...getBlendModes(), 'plus-lighter', 'plus-darker']
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [{
        'bg-blend': getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ['', 'none']
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [{
        'drop-shadow': ['', 'none', isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [{
        'hue-rotate': [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [{
        'backdrop-filter': ['', 'none']
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [{
        'backdrop-blur': [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [{
        'backdrop-brightness': [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [{
        'backdrop-contrast': [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [{
        'backdrop-grayscale': [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [{
        'backdrop-hue-rotate': [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [{
        'backdrop-invert': [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [{
        'backdrop-opacity': [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [{
        'backdrop-saturate': [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [{
        'backdrop-sepia': [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [{
        border: ['collapse', 'separate']
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [{
        'border-spacing': [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [{
        'border-spacing-x': [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [{
        'border-spacing-y': [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [{
        table: ['auto', 'fixed']
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ['top', 'bottom']
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ['linear', 'in', 'out', 'in-out', isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ['none', 'spin', 'ping', 'pulse', 'bounce', isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ['', 'gpu', 'none']
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [{
        'scale-x': [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [{
        'scale-y': [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [{
        'translate-x': [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [{
        'translate-y': [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [{
        'skew-x': [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [{
        'skew-y': [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [{
        origin: ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left', isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ['auto', colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ['none', 'auto']
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [{
        'pointer-events': ['none', 'auto']
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ['none', 'y', 'x', '']
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [{
        scroll: ['auto', 'smooth']
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [{
        'scroll-m': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [{
        'scroll-mx': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [{
        'scroll-my': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [{
        'scroll-ms': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [{
        'scroll-me': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [{
        'scroll-mt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [{
        'scroll-mr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [{
        'scroll-mb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [{
        'scroll-ml': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [{
        'scroll-p': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [{
        'scroll-px': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [{
        'scroll-py': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [{
        'scroll-ps': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [{
        'scroll-pe': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [{
        'scroll-pt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [{
        'scroll-pr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [{
        'scroll-pb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [{
        'scroll-pl': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [{
        snap: ['start', 'end', 'center', 'align-none']
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [{
        snap: ['normal', 'always']
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [{
        snap: ['none', 'x', 'y', 'both']
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [{
        snap: ['mandatory', 'proximity']
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ['auto', 'none', 'manipulation']
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-x': [{
        'touch-pan': ['x', 'left', 'right']
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-y': [{
        'touch-pan': ['y', 'up', 'down']
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-pz': ['touch-pinch-zoom'],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ['none', 'text', 'all', 'auto']
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [{
        'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, 'none']
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, 'none']
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ['sr-only', 'not-sr-only'],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      'forced-color-adjust': [{
        'forced-color-adjust': ['auto', 'none']
      }]
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-s', 'border-color-e', 'border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch']
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading']
    }
  };
};

/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */
const mergeConfigs = (baseConfig, {
  cacheSize,
  prefix,
  separator,
  experimentalParseClassName,
  extend = {},
  override = {}
}) => {
  overrideProperty(baseConfig, 'cacheSize', cacheSize);
  overrideProperty(baseConfig, 'prefix', prefix);
  overrideProperty(baseConfig, 'separator', separator);
  overrideProperty(baseConfig, 'experimentalParseClassName', experimentalParseClassName);
  for (const configKey in override) {
    overrideConfigProperties(baseConfig[configKey], override[configKey]);
  }
  for (const key in extend) {
    mergeConfigProperties(baseConfig[key], extend[key]);
  }
  return baseConfig;
};
const overrideProperty = (baseObject, overrideKey, overrideValue) => {
  if (overrideValue !== undefined) {
    baseObject[overrideKey] = overrideValue;
  }
};
const overrideConfigProperties = (baseObject, overrideObject) => {
  if (overrideObject) {
    for (const key in overrideObject) {
      overrideProperty(baseObject, key, overrideObject[key]);
    }
  }
};
const mergeConfigProperties = (baseObject, mergeObject) => {
  if (mergeObject) {
    for (const key in mergeObject) {
      const mergeValue = mergeObject[key];
      if (mergeValue !== undefined) {
        baseObject[key] = (baseObject[key] || []).concat(mergeValue);
      }
    }
  }
};
const extendTailwindMerge = (configExtension, ...createConfig) => typeof configExtension === 'function' ? createTailwindMerge(getDefaultConfig, configExtension, ...createConfig) : createTailwindMerge(() => mergeConfigs(getDefaultConfig(), configExtension), ...createConfig);
const twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);

//# sourceMappingURL=bundle-mjs.mjs.map


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.mjs":
/*!******************************************!*\
  !*** ./node_modules/tslib/tslib.es6.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __rewriteRelativeImportExtension: () => (/* binding */ __rewriteRelativeImportExtension),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./src/navigation/block-script.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _Navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Navigation */ "./src/navigation/Navigation.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



document.addEventListener("DOMContentLoaded", () => {
  const navigationRoot = document.querySelector(".hjarts-blocks-ts-navigation-root");
  const root = react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot(navigationRoot);
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Navigation__WEBPACK_IMPORTED_MODULE_1__.Navigation, {}));
});
})();

/******/ })()
;
//# sourceMappingURL=block-script.js.map