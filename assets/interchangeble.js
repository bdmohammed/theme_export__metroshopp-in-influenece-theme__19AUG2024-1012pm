var parseJsonOrDefault = (jsonString, defaultString = '{}') => {
  return JSON.parse(jsonString || defaultString || '{}');
};

((global, factory) => {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS module (e.g., Node.js)
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD module (e.g., RequireJS)
    define(['exports'], factory);
  } else {
    // Browser global (globalThis or self)
    factory((global.FloatingUIT4sCore = {}));
  }
})(window, (floatingUIT4sCore) => {
  'use strict';
  const replacements = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  };
  const alignmentReplacements = { start: 'end', end: 'start' };
  const boundaries = ['top', 'right', 'bottom', 'left'];

  const defaultAllowedPlacements = boundaries.reduce(
    (acc, edge) => acc.concat(edge, `${edge}-start`, `${edge}-end`),
    []
  );
  const getPosition = (direction) => direction.split('-')[0];

  const getAlignment = (direction) => direction.split('-')[1];

  const getAxis = (direction) =>
    ['top', 'bottom'].includes(getPosition(direction)) ? 'x' : 'y';

  const getDimension = (axis) => (axis === 'y' ? 'height' : 'width');

  const calculatePosition = (elements, placement, rtl) => {
    const { reference: ref, floating: float } = elements;
    const centerX = ref.x + ref.width / 2 - float.width / 2;
    const centerY = ref.y + ref.height / 2 - float.height / 2;
    const axis = getAxis(placement);
    const dimension = getDimension(axis);
    const offset = ref[dimension] / 2 - float[dimension] / 2;
    const isXAxis = axis === 'x';

    let position;
    switch (getPosition(placement)) {
      case 'top':
        position = { x: centerX, y: ref.y - float.height };
        break;
      case 'bottom':
        position = { x: centerX, y: ref.y + ref.height };
        break;
      case 'right':
        position = { x: ref.x + ref.width, y: centerY };
        break;
      case 'left':
        position = { x: ref.x - float.width, y: centerY };
        break;
      default:
        position = { x: ref.x, y: ref.y };
    }

    switch (getAlignment(placement)) {
      case 'start':
        position[axis] -= offset * (rtl && isXAxis ? -1 : 1);
        break;
      case 'end':
        position[axis] += offset * (rtl && isXAxis ? -1 : 1);
    }

    return position;
  };

  const normalizePadding = (padding) =>
    typeof padding !== 'number'
      ? { top: 0, right: 0, bottom: 0, left: 0, ...padding }
      : { top: padding, right: padding, bottom: padding, left: padding };

  const getExtendedRect = (rect) => ({
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height,
  });

  const calculateOffsets = async (config, options = {}) => {
    const { x, y, platform, rects, elements, strategy } = config;
    const {
      boundary = 'clippingAncestors',
      rootBoundary = 'viewport',
      elementContext = 'floating',
      altBoundary = false,
      padding = 0,
    } = options;

    const paddingObject = normalizePadding(padding);
    const targetElement =
      elements[
        altBoundary
          ? elementContext === 'floating'
            ? 'reference'
            : 'floating'
          : elementContext
      ];
    const isElement = await platform.isElement(targetElement);
    const documentElement = await platform.getDocumentElement(
      elements.floating
    );
    const clippingRect = getExtendedRect(
      await platform.getClippingRect({
        element:
          null == isElement || isElement
            ? targetElement
            : targetElement.contextElement || documentElement,
        boundary,
        rootBoundary,
      })
    );

    const offsetParentRect = getExtendedRect(
      (await platform.convertOffsetParentRelativeRectToViewportRelativeRect)
        ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
            rect:
              elementContext === 'floating'
                ? { ...rects.floating, x, y }
                : rects.reference,
            offsetParent: await platform.getOffsetParent(elements.floating),
            strategy,
          })
        : rects[elementContext]
    );

    return {
      top: clippingRect.top - offsetParentRect.top + paddingObject.top,
      bottom:
        offsetParentRect.bottom - clippingRect.bottom + paddingObject.bottom,
      left: clippingRect.left - offsetParentRect.left + paddingObject.left,
      right: offsetParentRect.right - clippingRect.right + paddingObject.right,
    };
  };

  const clamp = (rect, offsets, padding) =>
    Math.max(rect, Math.min(offsets, padding));

  const replaceDirection = (str) =>
    str.replace(/left|right|bottom|top/g, (match) => replacements[match]);

  const computeAutoPlacement = (placement, rects, rtl = false) => {
    const alignment = getAlignment(placement);
    const axis = getAxis(placement);
    const dimension = getDimension(axis);

    let mainAxis =
      axis === 'x'
        ? alignment === (rtl ? 'end' : 'start')
          ? 'right'
          : 'left'
        : alignment === 'start'
        ? 'bottom'
        : 'top';

    if (rects.reference[dimension] > rects.floating[dimension]) {
      mainAxis = replaceDirection(mainAxis);
    }

    return {
      main: mainAxis,
      cross: replaceDirection(mainAxis),
    };
  };

  const flipAlignment = (placement) =>
    placement.replace(/start|end/g, (match) => alignmentReplacements[match]);

  const shrinkRect = (rect, size) => ({
    top: rect.top - size.height,
    right: rect.right - size.width,
    bottom: rect.bottom - size.height,
    left: rect.left - size.width,
  });

  const hasOverflow = (rect) =>
    boundaries.some((boundary) => rect[boundary] >= 0);

  const getOppositeAxis = (axis) => (axis === 'x' ? 'y' : 'x');

  // Helper function to filter and sort placements based on alignment and auto-alignment
  function filterAndSortPlacements(
    alignment,
    autoAlignment,
    allowedPlacements
  ) {
    // This function likely filters the allowed placements based on alignment and returns them in a sorted order
    return alignment
      ? [
          ...allowedPlacements.filter((p) => getAlignment(p) === alignment),
          ...allowedPlacements.filter((p) => getAlignment(p) !== alignment),
        ]
      : allowedPlacements
          .filter((p) => getPosition(p) === p)
          .filter(
            (p) =>
              !alignment ||
              getAlignment(p) === alignment ||
              (!!autoAlignment && flipAlignment(p) !== p)
          );
  }

  floatingUIT4sCore.arrow = (options = {}) => ({
    name: 'arrow',
    options: options,
    async fn(context) {
      // Destructure the relevant properties from the options and context
      const { element: arrowElement, padding = 0 } = options;
      const { x, y, placement, rects, platform } = context;

      // If the arrow element is not provided, return an empty object
      if (!arrowElement) {
        return {};
      }

      // Convert padding to an object, if it's a number
      const paddingObject = normalizePadding(padding);

      // Initialize position offsets
      const offsets = { x, y };

      // Get the main axis ("x" or "y") and side ("top", "left", etc.) from the placement
      const mainAxis = getAxis(placement);
      const crossAxis = getDimension(mainAxis);

      // Get the dimensions of the arrow element (using platform helper)
      const arrowDimensions = await platform.getDimensions(arrowElement);

      // Define the "start" and "end" properties for the current axis
      const start = mainAxis === 'y' ? 'top' : 'left';
      const end = mainAxis === 'y' ? 'bottom' : 'right';

      // Calculate the distances between the reference and floating elements
      const startDistance =
        rects.reference[crossAxis] +
        rects.reference[mainAxis] -
        offsets[mainAxis] -
        rects.floating[crossAxis];
      const endDistance = offsets[mainAxis] - rects.reference[mainAxis];

      // Get the offset parent of the arrow element, if available
      const offsetParent = await platform.getOffsetParent?.(arrowElement);
      const offsetParentSize = offsetParent
        ? mainAxis === 'y'
          ? offsetParent.clientHeight || 0
          : offsetParent.clientWidth || 0
        : 0;

      // Calculate the center offset for the arrow (distance between the center of the reference and floating element)
      const centerOffset = startDistance / 2 - endDistance / 2;

      // Apply padding and calculate the bounds
      const startPadding = paddingObject[start];
      const endPadding =
        offsetParentSize - arrowDimensions[crossAxis] - paddingObject[end];

      // Calculate the final arrow position by clamping it between the padded bounds
      const arrowOffset = clamp(
        startPadding,
        offsetParentSize / 2 - arrowDimensions[crossAxis] / 2 + centerOffset,
        endPadding
      );

      return {
        data: {
          [mainAxis]: arrowOffset,
          centerOffset: centerOffset - arrowOffset,
        },
      };
    },
  });

  floatingUIT4sCore.autoPlacement = (options = {}) => {
    return {
      name: 'autoPlacement',
      options: options,
      async fn(context) {
        const { x, y, rects, middlewareData, placement, platform, elements } =
          context;

        const {
          alignment = null,
          allowedPlacements = defaultAllowedPlacements,
          autoAlignment = true,
          ...restOptions
        } = options;

        // Filter and sort placements based on alignment and allowed placements
        const placements = filterAndSortPlacements(
          alignment,
          autoAlignment,
          allowedPlacements
        );

        // Run the function (probably to check space availability or detect overflows)
        const overflowData = await calculateOffsets(context, restOptions);

        // Get the current index for placement from the middleware data or default to 0
        const currentIndex = middlewareData.autoPlacement?.index ?? 0;
        const currentPlacement = placements[currentIndex];

        // Calculate the main and cross-axis offsets
        const { main, cross } = calculateOffsets(
          currentPlacement,
          rects,
          await platform.isRTL?.(elements.floating)
        );

        // If the current placement has changed, reset the placement
        if (placement !== currentPlacement) {
          return {
            x,
            y,
            reset: {
              skip: false,
              placement: placements[0], // Start with the first available placement
            },
          };
        }

        // Prepare the overflows array for the current placement
        const overflows = [
          overflowData[getPosition(currentPlacement)],
          overflowData[main],
          overflowData[cross],
        ];

        // Collect previous overflows and add the current one
        const allOverflows = [
          ...(middlewareData.autoPlacement?.overflows ?? []),
          {
            placement: currentPlacement,
            overflows: overflows,
          },
        ];

        // Try the next placement if available
        const nextPlacement = placements[currentIndex + 1];
        if (nextPlacement) {
          return {
            data: {
              index: currentIndex + 1,
              overflows: allOverflows,
            },
            reset: {
              skip: false,
              placement: nextPlacement,
            },
          };
        }

        // Sort placements by how well they avoid overflow (smallest overflows first)
        const sortedOverflows = allOverflows
          .slice()
          .sort((a, b) => a.overflows[0] - b.overflows[0]);

        // Find a placement with no overflow
        const bestPlacement = sortedOverflows.find((entry) =>
          entry.overflows.every((overflow) => overflow <= 0)
        )?.placement;

        // If a suitable placement is found, reset with it; otherwise, use the best available option
        return {
          reset: {
            placement: bestPlacement ?? sortedOverflows[0].placement,
          },
        };
      },
    };
  };

  floatingUIT4sCore.computePosition = async (reference, floating, options) => {
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform,
    } = options;
    const isRTL = await platform.isRTL(floating);

    let rects = await platform.getElementRects({
      reference,
      floating,
      strategy,
    });

    let { x, y } = calculatePosition(rects, placement, isRTL);
    let finalPlacement = placement;
    let middlewareData = {};
    const processedMiddleware = new Set();

    for (let i = 0; i < middleware.length; i++) {
      const { name, fn } = middleware[i];
      if (processedMiddleware.has(name)) continue;

      const result = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: finalPlacement,
        strategy,
        middlewareData,
        rects,
        platform,
        elements: { reference, floating },
      });

      x = result.x ?? x;
      y = result.y ?? y;
      middlewareData = {
        ...middlewareData,
        [name]: { ...middlewareData[name], ...result.data },
      };

      if (result.reset) {
        if (typeof result.reset === 'object') {
          if (result.reset.placement) finalPlacement = result.reset.placement;
          if (result.reset.rects) {
            rects =
              result.reset.rects === true
                ? await platform.getElementRects({
                    reference,
                    floating,
                    strategy,
                  })
                : result.reset.rects;
          }
          ({ x, y } = calculatePosition(rects, finalPlacement, isRTL));
        }
        if (result.reset.skip === false) processedMiddleware.clear();
        i = -1;
      }
    }

    return { x, y, placement: finalPlacement, strategy, middlewareData };
  };

  floatingUIT4sCore.detectOverflow = calculateOffsets;

  // Flip middleware
  floatingUIT4sCore.flip = (options = {}) => {
    return {
      name: 'flip',
      options,
      async fn(data) {
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform,
          elements,
        } = data;

        const {
          mainAxis = true,
          crossAxis = true,
          fallbackPlacements,
          fallbackStrategy = 'bestFit',
          canFlipAlignment = true,
          ...restOptions
        } = options;

        const basePlacement = getPosition(placement);
        const placements = [
          initialPlacement,
          ...(fallbackPlacements ||
          (basePlacement !== initialPlacement && canFlipAlignment)
            ? [
                flipAlignment(initialPlacement),
                replaceDirection(initialPlacement),
                flipAlignment(replaceDirection(initialPlacement)),
              ]
            : [replaceDirection(initialPlacement)]),
        ];

        const b = await calculateOffsets(data, restOptions);
        let overflowArray = middlewareData.flip?.overflows || [];
        const overflowChecks = [];

        if (mainAxis) overflowChecks.push(b[basePlacement]);
        if (crossAxis) {
          const { main, cross } = computeAutoPlacement(
            placement,
            rects,
            await platform?.isRTL?.(elements.floating)
          );
          overflowChecks.push(b[main], b[cross]);
        }

        overflowArray.push({ placement, overflows: overflowChecks });

        if (!overflowChecks.every((overflow) => overflow <= 0)) {
          let P = middlewareData.flip;
          let index = (P.index != null ? P.index : 0) + 1;
          const nextPlacement = placements[index];

          if (nextPlacement) {
            return {
              data: {
                index,
                overflows: overflowArray,
              },
              reset: {
                skip: false,
                placement: nextPlacement,
              },
            };
          }

          let finalPlacement = 'bottom';

          switch (fallbackStrategy) {
            case 'bestFit': {
              const bestPlacement = overflowArray.slice().sort((a, b) => {
                const aOverflowSum = a.overflows
                  .filter((o) => o > 0)
                  .reduce((sum, o) => sum + o, 0);
                const bOverflowSum = b.overflows
                  .filter((o) => o > 0)
                  .reduce((sum, o) => sum + o, 0);
                return aOverflowSum - bOverflowSum;
              })[0];

              if (bestPlacement && bestPlacement.placement) {
                finalPlacement = bestPlacement.placement;
              }
              break;
            }
            case 'initialPlacement':
              finalPlacement = initialPlacement;
              break;
          }

          return {
            reset: {
              placement: finalPlacement,
            },
          };
        }

        return {};
      },
    };
  };

  // Hide middleware
  floatingUIT4sCore.hide = (options = {}) => {
    const { strategy = 'referenceHidden', ...restOptions } = options;

    return {
      name: 'hide',
      async fn(data) {
        const { rects } = data;

        switch (strategy) {
          case 'referenceHidden':
            const referenceHiddenOffsets = shrinkRect(
              await calculateOffsets(
                data,
                {
                  ...restOptions,
                  elementContext: 'reference',
                },
                rects.reference
              )
            );
            return {
              data: {
                referenceHiddenOffsets,
                referenceHidden: hasOverflow(referenceHiddenOffsets),
              },
            };

          case 'escaped':
            const escapedOffsets = shrinkRect(
              await calculateOffsets(
                data,
                {
                  ...restOptions,
                  altBoundary: true,
                },
                rects.floating
              )
            );
            return {
              data: {
                escapedOffsets,
                escaped: hasOverflow(escapedOffsets),
              },
            };

          default:
            return {};
        }
      },
    };
  };

  // Inline middleware
  floatingUIT4sCore.inline = (options = {}) => {
    return {
      name: 'inline',
      options,
      async fn(data) {
        const { placement, elements, rects, platform, strategy } = data;

        const { padding = 2, x, y } = options;

        const referenceRect =
          platform.convertOffsetParentRelativeRectToViewportRelativeRect
            ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect(
                {
                  rect: rects.reference,
                  offsetParent: await platform.getOffsetParent?.(
                    elements.floating
                  ),
                  strategy,
                }
              )
            : rects.reference;

        const clientRects =
          (await platform.getClientRects?.(elements.reference)) ?? [];
        const paddingValues = getPaddingValues(padding);

        return {
          reset: {
            rects: await platform.getElementRects({
              reference: {
                getBoundingClientRect() {
                  // Handle the case when there are two client rects
                  if (
                    clientRects.length === 2 &&
                    clientRects[0].left > clientRects[1].right &&
                    x != null &&
                    y != null
                  ) {
                    const matchingRect = clientRects.find(
                      (rect) =>
                        x > rect.left - paddingValues.left &&
                        x < rect.right + paddingValues.right &&
                        y > rect.top - paddingValues.top &&
                        y < rect.bottom + paddingValues.bottom
                    );
                    return matchingRect ?? referenceRect;
                  }

                  // Handle the case when there are multiple rects
                  if (clientRects.length >= 2) {
                    if (getAxis(placement)) {
                      const firstRect = clientRects[0];
                      const lastRect = clientRects[clientRects.length - 1];
                      const isTop = getPosition(placement) === 'top';

                      const top = firstRect.top;
                      const bottom = lastRect.bottom;
                      const left = isTop ? firstRect.left : lastRect.left;
                      const right = isTop ? firstRect.right : lastRect.right;

                      return {
                        top,
                        bottom,
                        left,
                        right,
                        width: right - left,
                        height: bottom - top,
                        x: left,
                        y: top,
                      };
                    }

                    const isLeft = getPosition(placement) === 'left';
                    const rightMost = Math.max(
                      ...clientRects.map((rect) => rect.right)
                    );
                    const leftMost = Math.min(
                      ...clientRects.map((rect) => rect.left)
                    );

                    const alignedRects = clientRects.filter((rect) =>
                      isLeft ? rect.left === leftMost : rect.right === rightMost
                    );
                    const top = alignedRects[0].top;
                    const bottom = alignedRects[alignedRects.length - 1].bottom;

                    return {
                      top,
                      bottom,
                      left: leftMost,
                      right: rightMost,
                      width: rightMost - leftMost,
                      height: bottom - top,
                      x: leftMost,
                      y: top,
                    };
                  }

                  // Default to the reference rect if conditions don't match
                  return referenceRect;
                },
              },
              floating: elements.floating,
              strategy,
            }),
          },
        };
      },
    };
  };

  // Limit Shift middleware
  floatingUIT4sCore.limitShift = (options = {}) => ({
    options,
    fn(data) {
      const { x, y, placement, rects, middlewareData } = data;
      const { offset = 0, mainAxis = true, crossAxis = true } = options;

      // Initialize position coordinates
      const position = { x, y };
      const mainAxisDirection = getAxis(placement);
      const crossAxisDirection = getOppositeAxis(mainAxisDirection);

      let mainAxisValue = position[mainAxisDirection];
      let crossAxisValue = position[crossAxisDirection];

      // Determine the offset
      const offsetValue =
        typeof offset === 'function' ? offset({ ...rects, placement }) : offset;

      const offsetConfig =
        typeof offsetValue === 'number'
          ? { mainAxis: offsetValue, crossAxis: 0 }
          : { mainAxis: 0, crossAxis: 0, ...offsetValue };

      // Limit shifts in the main axis
      if (mainAxis) {
        const sizeKey = mainAxisDirection === 'y' ? 'height' : 'width';
        const minLimit =
          rects.reference[mainAxisDirection] -
          rects.floating[sizeKey] +
          offsetConfig.mainAxis;
        const maxLimit =
          rects.reference[mainAxisDirection] +
          rects.reference[sizeKey] -
          offsetConfig.mainAxis;

        if (mainAxisValue < minLimit) {
          mainAxisValue = minLimit;
        } else if (mainAxisValue > maxLimit) {
          mainAxisValue = maxLimit;
        }
      }

      // Limit shifts in the cross axis
      if (crossAxis) {
        const sizeKey = mainAxisDirection === 'y' ? 'width' : 'height';
        const isTopOrLeft = ['top', 'left'].includes(getPosition(placement));

        const minCrossLimit =
          rects.reference[crossAxisDirection] -
          rects.floating[sizeKey] +
          (isTopOrLeft ? middlewareData.offset?.[crossAxisDirection] || 0 : 0) +
          (isTopOrLeft ? 0 : offsetConfig.crossAxis);

        const maxCrossLimit =
          rects.reference[crossAxisDirection] +
          rects.reference[sizeKey] +
          (isTopOrLeft ? 0 : middlewareData.offset?.[crossAxisDirection] || 0) -
          (isTopOrLeft ? offsetConfig.crossAxis : 0);

        if (crossAxisValue < minCrossLimit) {
          crossAxisValue = minCrossLimit;
        } else if (crossAxisValue > maxCrossLimit) {
          crossAxisValue = maxCrossLimit;
        }
      }

      return {
        [mainAxisDirection]: mainAxisValue,
        [crossAxisDirection]: crossAxisValue,
      };
    },
  });

  // Offset middleware
  floatingUIT4sCore.offset = (offsetValue = 0) => {
    return {
      name: 'offset',
      options: offsetValue,
      async fn(context) {
        const { x, y, placement, rects, platform, elements } = context;

        // Helper function to calculate offsets based on placement, rects, and other parameters
        const calculateOffset = (
          placement,
          rects,
          offsetValue,
          isRTL = false
        ) => {
          const basePlacement = getPosition(placement);
          const variation = getAlignment(placement);
          const isHorizontal = getAxis(placement);
          const directionMultiplier = ['left', 'top'].includes(basePlacement)
            ? -1
            : 1;

          let variationMultiplier = 1;
          if (variation === 'end') {
            variationMultiplier = -1;
          }

          // Flip the direction for RTL (Right-To-Left) layout if necessary
          if (isRTL && isHorizontal) {
            variationMultiplier *= -1;
          }

          const offsetObj =
            typeof offsetValue === 'function'
              ? calculatePosition({ ...rects, placement })
              : offsetValue;
          const { mainAxis = 0, crossAxis = 0 } =
            typeof offsetObj === 'number'
              ? { mainAxis: offsetObj, crossAxis: 0 }
              : { ...offsetObj };

          return isHorizontal
            ? {
                x: crossAxis * variationMultiplier,
                y: mainAxis * directionMultiplier,
              }
            : {
                x: mainAxis * directionMultiplier,
                y: crossAxis * variationMultiplier,
              };
        };

        // Calculate the offsets
        const computedOffset = calculateOffset(
          placement,
          rects,
          offsetValue,
          await platform.isRTL?.(elements.floating) // Checking if layout is RTL
        );

        return {
          x: x + computedOffset.x,
          y: y + computedOffset.y,
          data: computedOffset,
        };
      },
    };
  };

  floatingUIT4sCore.rectToClientRect = getExtendedRect;

  // Shift middleware
  floatingUIT4sCore.shift = (options = {}) => ({
    name: 'shift',
    options,
    async fn(data) {
      const { x, y, placement } = data;
      const {
        mainAxis = true,
        crossAxis = false,
        limiter = { fn: (pos) => ({ x: pos.x, y: pos.y }) },
        ...restOptions
      } = options;

      let position = { x, y };
      const bounds = await calculateOffsets(data, restOptions);
      const axis = getAxis(getPosition(placement));
      const dimension = getOppositeAxis(axis);

      if (mainAxis) {
        position[axis] = clamp(
          position[axis] + bounds['y' === g ? 'top' : 'left'],
          position[axis],
          position[axis] - bounds['y' === axis ? 'bottom' : 'right']
        );
      }
      if (crossAxis) {
        position[dimension] = clamp(
          position[dimension] + bounds['y' === v ? 'top' : 'left'],
          position[dimension],
          position[dimension] - bounds[e]
        );
      }

      const limitedPosition = limiter.fn({ ...data, ...position });
      return {
        ...limitedPosition,
        data: { x: limitedPosition.x - x, y: limitedPosition.y - y },
      };
    },
  });

  // Size middleware
  floatingUIT4sCore.size = (options = {}) => {
    return {
      name: 'size',
      options,
      async fn(data) {
        const { placement, rects, platform, elements } = data;
        const { apply, ...restOptions } = options;

        // Get dimensions based on the current state
        const dimensions = await calculateOffsets(data, restOptions);
        const placementDirection = getPosition(placement);
        const alignment = getAlignment(placement);

        let mainAxis, crossAxis;
        if (placementDirection === 'top' || placementDirection === 'bottom') {
          mainAxis = placementDirection;
          crossAxis =
            alignment ===
            ((await (platform.isRTL?.(elements.floating) || false))
              ? 'start'
              : 'end')
              ? 'left'
              : 'right';
        } else {
          crossAxis = placementDirection;
          mainAxis = alignment === 'end' ? 'top' : 'bottom';
        }

        // Calculate the offsets for the floating element
        const offsetLeft = Math.max(dimensions.left, 0);
        const offsetRight = Math.max(dimensions.right, 0);
        const offsetTop = Math.max(dimensions.top, 0);
        const offsetBottom = Math.max(dimensions.bottom, 0);

        // Determine the new dimensions for the floating element
        const newSize = {
          height:
            rects.floating.height -
            (['left', 'right'].includes(placement)
              ? 2 *
                (offsetTop || offsetBottom
                  ? offsetTop + offsetBottom
                  : Math.max(dimensions.top, dimensions.bottom))
              : dimensions[mainAxis]),
          width:
            rects.floating.width -
            (['top', 'bottom'].includes(placement)
              ? 2 *
                (offsetLeft || offsetRight
                  ? offsetLeft + offsetRight
                  : Math.max(dimensions.left, dimensions.right))
              : dimensions[crossAxis]),
        };

        if (apply) {
          apply({ ...newSize, ...rects });
        }

        return { reset: { rects: true } };
      },
    };
  };

  Object.defineProperty(floatingUIT4sCore, '__esModule', {
    value: true,
  });
});

!((e, t) => {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports, require('@floating-ui/core'))
    : 'function' == typeof define && define.amd
    ? define(['exports', '@floating-ui/core'], t)
    : t(
        ((e =
          'undefined' != typeof globalThis
            ? globalThis
            : e || self).FloatingUIT4sDOM = {}),
        e.FloatingUIT4sCore
      );
})(window, (floatingUIT4sDOM, floatingUIT4sCore) => {
  function isWindow(obj) {
    return '[object Window]' === (null == obj ? undefined : obj.toString());
  }

  function getWindow(obj) {
    if (null == obj) return window;
    if (!isWindow(obj)) {
      const doc = obj.ownerDocument;
      return (doc && doc.defaultView) || window;
    }
    return obj;
  }

  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function getNodeName(element) {
    return isWindow(element)
      ? ''
      : element
      ? (element.nodeName || '').toLowerCase()
      : '';
  }

  function isHTMLElement(element) {
    return element instanceof getWindow(element).HTMLElement;
  }

  function isElement(element) {
    return element instanceof getWindow(element).Element;
  }

  function isShadowRoot(element) {
    return (
      element instanceof getWindow(element).ShadowRoot ||
      element instanceof ShadowRoot
    );
  }

  function hasOverflow(element) {
    const {
      overflow: overflowValue,
      overflowX: overflowXValue,
      overflowY: overflowYValue,
    } = getComputedStyle(element);
    return /auto|scroll|overlay|hidden/.test(
      overflowValue + overflowYValue + overflowXValue
    );
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].includes(getNodeName(element));
  }

  function isScrollable(element) {
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    const style = getComputedStyle(element);
    return (
      'none' !== style.transform ||
      'none' !== style.perspective ||
      'paint' === style.contain ||
      ['transform', 'perspective'].includes(style.willChange) ||
      (isFirefox && 'filter' === style.willChange) ||
      (isFirefox && !!style.filter && 'none' !== style.filter)
    );
  }

  function getBoundingClientRect(element, shouldAdjust = false) {
    const rect = element.getBoundingClientRect();
    let scaleX = 1;
    let scaleY = 1;
    if (shouldAdjust && isHTMLElement(element)) {
      scaleX =
        element.offsetWidth > 0
          ? Math.round(rect.width) / element.offsetWidth
          : 1;
      scaleY =
        element.offsetHeight > 0
          ? Math.round(rect.height) / element.offsetHeight
          : 1;
    }
    return {
      width: rect.width / scaleX,
      height: rect.height / scaleY,
      top: rect.top / scaleY,
      right: rect.right / scaleX,
      bottom: rect.bottom / scaleY,
      left: rect.left / scaleX,
      x: rect.left / scaleX,
      y: rect.top / scaleY,
    };
  }

  function getDocumentElement(element) {
    return (
      (element instanceof getWindow(element).Node
        ? element.ownerDocument || element.document
        : element.document) || window.document
    ).documentElement;
  }

  // Utility to get scroll positions
  function getScrollOffsets(element) {
    return isWindow(element)
      ? {
          scrollLeft: element.pageXOffset,
          scrollTop: element.pageYOffset,
        }
      : {
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop,
        };
  }

  // Calculates the left offset plus scroll left
  function calculateLeftOffset(element) {
    return (
      getBoundingClientRect(getDocumentElement(element)).left +
      getScrollOffsets(element).scrollLeft
    );
  }

  function isHTMLTag(element) {
    return getNodeName(element) === 'html';
  }

  function isBodyTag(element) {
    return getNodeName(element) === 'body';
  }
  // Gets the closest parent or fallback node
  function getClosestParent(element) {
    return isHTMLTag(element)
      ? element
      : element.assignedSlot ||
          element.parentNode ||
          (isShadowRoot(element) ? element.host : null) ||
          getDocumentElement(element);
  }

  // Gets offset parent for an element
  function getOffsetParent(element) {
    return isHTMLElement(element) &&
      getComputedStyle(element).position !== 'fixed'
      ? element.offsetParent
      : null;
  }

  function calculateOffsetParent(element) {
    const doc = getWindow(element);
    let offsetParent = getOffsetParent(element);

    // Loop through parents until we find one that isn't statically positioned
    while (
      offsetParent &&
      isTableElement(offsetParent) &&
      getComputedStyle(offsetParent).position === 'static'
    ) {
      offsetParent = getOffsetParent(offsetParent);
    }

    // Return the document if the offset parent is either <html> or a statically positioned <body>
    if (
      offsetParent &&
      ['html', 'body'].includes(
        getNodeName(offsetParent) &&
          getComputedStyle(offsetParent).position === 'static' &&
          !isScrollable(offsetParent)
      )
    ) {
      return doc;
    }

    // If no valid offset parent is found, use the custom offset-finding function
    return (
      offsetParent ||
      (function findFallbackOffsetParent(el) {
        let parent = getClosestParent(el);

        while (
          isShadowRoot(parent) &&
          !['html', 'body'].includes(getNodeName(parent))
        ) {
          if (isScrollable(parent)) return parent;
          parent = parent.parentNode;
        }

        return null;
      })(element) ||
      doc
    );
  }

  // Gets width and height of an element
  function getElementDimensions(element) {
    if (isHTMLElement(element)) {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
    }
    const rect = getBoundingClientRect(element);
    return {
      width: rect.width,
      height: rect.height,
    };
  }
  function getAncestorScrollElements(element, ancestors = []) {
    // Find the ancestor element of `element` that should be used for scrolling
    const scrollElement = (function findScrollAncestor(el) {
      // Base cases: If it's <html>, <body>, or the document root, return the document's body
      if (['html', 'body', '#document'].includes(getNodeName(el))) {
        return el.ownerDocument.body;
      }
      // Otherwise, check if it is a standard HTML element and scrollable
      return isHTMLElement(el) && hasOverflow(el)
        ? el
        : findScrollAncestor(getClosestParent(el));
    })(element);

    // Check if the `scrollElement` is the document's body
    const isDocumentBody =
      scrollElement === (element.ownerDocument?.body || null);

    // Retrieve the document and any visual viewport if available
    const documentElement = getWindow(scrollElement);
    const scrollElements = isDocumentBody
      ? [
          documentElement,
          documentElement.visualViewport || [],
          hasOverflow(scrollElement) ? scrollElement : [],
        ]
      : scrollElement;

    // Combine found elements with existing ancestors list
    const combinedAncestors = ancestors.concat(scrollElements);

    // Recursively add ancestors if `scrollElement` is not the body
    return isDocumentBody
      ? combinedAncestors
      : combinedAncestors.concat(
          getAncestorScrollElements(getClosestParent(scrollElements))
        );
  }

  // Calculates the clipping rect of an element
  function getClippingRect(element, referenceFrame) {
    // Check if the reference frame is the viewport
    return referenceFrame === 'viewport'
      ? floatingUIT4sCore.rectToClientRect(
          ((el) => {
            const globalWindow = getWindow(el);
            const documentElement = getDocumentElement(el);
            const visualViewport = globalWindow.visualViewport;

            let viewportWidth = documentElement.clientWidth;
            let viewportHeight = documentElement.clientHeight;
            let offsetX = 0;
            let offsetY = 0;

            // Adjust for visual viewport properties if available
            if (visualViewport) {
              viewportWidth = visualViewport.width;
              viewportHeight = visualViewport.height;

              // Handle cases where innerWidth matches the scaled width within a threshold
              if (
                Math.abs(
                  globalWindow.innerWidth / visualViewport.scale -
                    visualViewport.width
                ) < 0.01
              ) {
                offsetX = visualViewport.offsetLeft;
                offsetY = visualViewport.offsetTop;
              }
            }

            // Return calculated width, height, and position
            return {
              width: viewportWidth,
              height: viewportHeight,
              x: offsetX,
              y: offsetY,
            };
          })(element)
        )
      : // If referenceFrame is an element, calculate its bounding rectangle
      isElement(referenceFrame)
      ? (function (refEl) {
          const rect = getBoundingClientRect(refEl),
            topOffset = rect.top + refEl.clientTop,
            leftOffset = rect.left + refEl.clientLeft;

          return {
            top: topOffset,
            left: leftOffset,
            x: leftOffset,
            y: topOffset,
            right: leftOffset + refEl.clientWidth,
            bottom: topOffset + refEl.clientHeight,
            width: refEl.clientWidth,
            height: refEl.clientHeight,
          };
        })(referenceFrame)
      : // Fallback: calculate based on scrolling positions and dimensions of element's scroll context
        floatingUIT4sCore.rectToClientRect(
          (function (scrollElement) {
            var body;
            const documentElement = getDocumentElement(scrollElement),
              scrollContext = getScrollOffsets(scrollElement),
              bodyElement = (body = scrollElement.ownerDocument)
                ? body.body
                : null,
              maxWidth = Math.max(
                documentElement.scrollWidth,
                documentElement.clientWidth,
                bodyElement ? bodyElement.scrollWidth : 0,
                bodyElement ? bodyElement.clientWidth : 0
              ),
              maxHeight = Math.max(
                documentElement.scrollHeight,
                documentElement.clientHeight,
                bodyElement ? bodyElement.scrollHeight : 0,
                bodyElement ? bodyElement.clientHeight : 0
              );
            let scrollX =
              -scrollContext.scrollLeft + calculateLeftOffset(scrollElement);
            const scrollY = -scrollContext.scrollTop;

            // Adjust for RTL layouts
            if (
              getComputedStyle(bodyElement || documentElement).direction ===
              'rtl'
            ) {
              scrollX +=
                Math.max(
                  documentElement.clientWidth,
                  bodyElement ? bodyElement.clientWidth : 0
                ) - maxWidth;
            }

            return {
              width: maxWidth,
              height: maxHeight,
              x: scrollX,
              y: scrollY,
            };
          })(getDocumentElement(element))
        );
  }

  function isAncestorOf(element, targetElement) {
    const node = targetElement.getRootNode || targetElement.getRootNode();
    if (element.contains(targetElement)) return true;
    if (node && isShadowRoot(node)) {
      let node = targetElement;
      do {
        if (node && element === node) return true;
        node = node.parentNode || node.host;
      } while (node);
    }
    return false;
  }
  function getFilteredElements(element) {
    const allDescendants = getAncestorScrollElements(getClosestParent(element));
    const targetElement =
      ['absolute', 'fixed'].includes(getComputedStyle(element).position) &&
      isHTMLElement(element)
        ? calculateOffsetParent(element)
        : element;

    return isElement(targetElement)
      ? allDescendants.filter(
          (descendant) =>
            isElement(descendant) &&
            isAncestorOf(element, targetElement) &&
            'body' !== getNodeName(element)
        )
      : [];
  }

  function calculateElementBoundaries(config) {
    let {
      element: targetElement,
      boundary: boundaryType,
      rootBoundary: rootBoundary,
    } = config;

    // Determine boundaries based on boundary type and root boundary
    const boundaries = [
      ...('clippingAncestors' === boundaryType
        ? getFilteredElements(targetElement)
        : [].concat(boundaryType)),
      rootBoundary,
    ];

    const initialBoundary = boundaries[0];

    // Calculate combined boundaries using a reducer
    const calculatedBoundaries = boundaries.reduce(
      (accumulatedBoundary, currentBoundary) => {
        const boundaryRect = getClippingRect(targetElement, currentBoundary);

        accumulatedBoundary.top = Math.min(
          boundaryRect.top,
          accumulatedBoundary.top
        );
        accumulatedBoundary.right = Math.max(
          boundaryRect.right,
          accumulatedBoundary.right
        );
        accumulatedBoundary.bottom = Math.max(
          boundaryRect.bottom,
          accumulatedBoundary.bottom
        );
        accumulatedBoundary.left = Math.min(
          boundaryRect.left,
          accumulatedBoundary.left
        );

        return accumulatedBoundary;
      },
      getClippingRect(targetElement, initialBoundary)
    );

    // Return final boundary dimensions and position
    return {
      width: calculatedBoundaries.right - calculatedBoundaries.left,
      height: calculatedBoundaries.bottom - calculatedBoundaries.top,
      x: calculatedBoundaries.left,
      y: calculatedBoundaries.top,
    };
  }

  function calculateAdjustedRect(element, offsetParent, positioningStrategy) {
    const isOffsetParentScrollable = isHTMLElement(offsetParent);
    const rootDocument = getDocumentElement(offsetParent);

    // Calculate the element's rect, adjusted if necessary for scroll differences
    const elementRect = getBoundingClientRect(
      element,
      isOffsetParentScrollable &&
        (function (el) {
          const rect = getBoundingClientRect(el);
          return (
            Math.round(rect.width) !== el.offsetWidth ||
            Math.round(rect.height) !== el.offsetHeight
          );
        })(offsetParent)
    );

    // Initialize scroll offsets and position adjustments
    let scrollOffsets = { scrollLeft: 0, scrollTop: 0 };
    const positionAdjustments = { x: 0, y: 0 };

    // Calculate scroll offsets if necessary based on positioning and offset parent
    if (
      isOffsetParentScrollable ||
      (!isOffsetParentScrollable && positioningStrategy !== 'fixed')
    ) {
      if (getNodeName(offsetParent) !== 'body' || hasOverflow(rootDocument)) {
        scrollOffsets = getScrollOffsets(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        const offsetParentPosition = getBoundingClientRect(offsetParent, true);
        positionAdjustments.x =
          offsetParentPosition.x + offsetParent.clientLeft;
        positionAdjustments.y = offsetParentPosition.y + offsetParent.clientTop;
      } else if (rootDocument) {
        positionAdjustments.x = calculateLeftOffset(rootDocument);
      }
    }

    return {
      x: elementRect.left + scrollOffsets.scrollLeft - positionAdjustments.x,
      y: elementRect.top + scrollOffsets.scrollTop - positionAdjustments.y,
      width: elementRect.width,
      height: elementRect.height,
    };
  }

  // Platform specific functions
  const Platform = {
    getClippingRect: calculateElementBoundaries,
    convertOffsetParentRelativeRectToViewportRelativeRect: function (config) {
      let {
        rect: elementRect,
        offsetParent,
        strategy: positioningStrategy,
      } = config;

      const isOffsetParentScrollable = isHTMLElement(offsetParent);
      const rootDocument = getDocumentElement(offsetParent);

      // If the offset parent is the root document element, return the rect as is
      if (offsetParent === rootDocument) return elementRect;

      // Initialize scroll offsets and additional offset values
      let scrollOffsets = { scrollLeft: 0, scrollTop: 0 };
      const additionalOffsets = { x: 0, y: 0 };

      // Calculate scroll offsets if the element is not fixed or if the offset parent is scrollable
      if (
        (isOffsetParentScrollable ||
          (!isOffsetParentScrollable && positioningStrategy !== 'fixed')) &&
        ('body' !== getNodeName(offsetParent) || hasOverflow(rootDocument))
      ) {
        scrollOffsets = getScrollOffsets(offsetParent);
      }

      // Add client offsets if the offset parent is scrollable
      if (hasOverflow(offsetParent)) {
        const offsetParentPosition = getBoundingClientRect(offsetParent, true);
        additionalOffsets.x = offsetParentPosition.x + offsetParent.clientLeft;
        additionalOffsets.y = offsetParentPosition.y + offsetParent.clientTop;
      }

      // Return the adjusted rectangle position relative to the viewport
      return {
        ...elementRect,
        x: elementRect.x - scrollOffsets.scrollLeft + additionalOffsets.x,
        y: elementRect.y - scrollOffsets.scrollTop + additionalOffsets.y,
      };
    },
    isElement,
    getDimensions: getElementDimensions,
    getOffsetParent: calculateOffsetParent,
    getDocumentElement,
    getElementRects: (config) => {
      const { reference, floating, strategy } = config;
      return {
        reference: calculateAdjustedRect(
          reference,
          calculateOffsetParent(floating),
          strategy
        ),
        floating: { ...getElementDimensions(floating), x: 0, y: 0 },
      };
    },
    getClientRects: (element) => Array.from(element.getClientRects()),
    isRTL: (element) => getComputedStyle(element).direction === 'rtl',
  };

  // Utility to auto-update an element's position
  floatingUIT4sDOM.autoUpdate = (element, target, callback, options = {}) => {
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = true,
      animationFrame = false,
    } = options;
    let stopped = false;

    const shouldObserveScroll = ancestorScroll && !animationFrame;
    const shouldObserveResize = ancestorResize && !animationFrame;
    const shouldObserveElementResize = elementResize && !animationFrame;

    const observers =
      shouldObserveScroll || shouldObserveResize
        ? [
            ...(isElement(element) ? getAncestorScrollElements(element) : []),
            ...getAncestorScrollElements(target),
          ]
        : [];

    // Add scroll and resize event listeners
    observers.forEach((observer) => {
      if (shouldObserveScroll)
        observer.addEventListener('scroll', callback, { passive: true });
      if (shouldObserveResize) observer.addEventListener('resize', callback);
    });

    let resizeObserver = null;
    if (shouldObserveElementResize) {
      resizeObserver = new ResizeObserver(callback);
      if (isElement(element)) resizeObserver.observe(element);
      resizeObserver.observe(target);
    }

    let frameId = null;
    let previousRect = animationFrame ? getBoundingClientRect(element) : null;

    function onFrame() {
      if (stopped) return;
      const currentRect = getBoundingClientRect(element);
      if (
        !previousRect ||
        currentRect.x !== previousRect.x ||
        currentRect.y !== previousRect.y ||
        currentRect.width !== previousRect.width ||
        currentRect.height !== previousRect.height
      ) {
        callback();
        previousRect = currentRect;
      }
      frameId = requestAnimationFrame(onFrame);
    }

    if (animationFrame) frameId = requestAnimationFrame(onFrame);

    // Stop observing and remove listeners
    return () => {
      stopped = true;
      observers.forEach((observer) => {
        if (shouldObserveScroll)
          observer.removeEventListener('scroll', callback);
        if (shouldObserveResize)
          observer.removeEventListener('resize', callback);
      });
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (animationFrame) cancelAnimationFrame(frameId);
    };
  };

  Object.defineProperty(floatingUIT4sDOM, 'arrow', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.arrow;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'autoPlacement', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.autoPlacement;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'detectOverflow', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.detectOverflow;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'flip', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.flip;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'hide', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.hide;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'inline', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.inline;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'limitShift', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.limitShift;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'offset', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.offset;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'shift', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.shift;
    },
  });
  Object.defineProperty(floatingUIT4sDOM, 'size', {
    enumerable: true,
    get: function () {
      return floatingUIT4sCore.size;
    },
  });

  floatingUIT4sDOM.computePosition = (e, n, i) =>
    floatingUIT4sCore.computePosition(e, n, {
      platform: Platform,
      ...i,
    });
  floatingUIT4sDOM.getOverflowAncestors = getAncestorScrollElements;
  Object.defineProperty(floatingUIT4sDOM, '__esModule', { value: true });
});

!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jQuery_T4NT'], e)
    : 'object' == typeof module && module.exports
    ? (module.exports = window.jQuery(require('jQuery_T4NT')))
    : (window.$ || window.jQuery) &&
      !(window.$ || window.jQuery).fn.hoverIntent &&
      e(window.$ || window.jQuery);
})(function (jQuery) {
  'use strict';

  function handleMouseMove(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
  }

  function isFunction(fn) {
    return typeof fn === 'function';
  }

  let mouseX, mouseY;
  const defaultSettings = {
    interval: 100,
    sensitivity: 6,
    timeout: 0,
  };

  let instanceCounter = 0;

  const hoverIntentHandler = function (event, element, settings, instance) {
    if (
      Math.sqrt((instance.pX - mouseX) ** 2 + (instance.pY - mouseY) ** 2) <
      settings.sensitivity
    ) {
      element.off(instance.event, handleMouseMove);
      delete instance.timeoutId;
      instance.isActive = true;
      event.pageX = mouseX;
      event.pageY = mouseY;
      delete instance.pX;
      delete instance.pY;
      settings.over.apply(element[0], [event]);
    }
    instance.pX = mouseX;
    instance.pY = mouseY;
    instance.timeoutId = setTimeout(function () {
      hoverIntentHandler(event, element, settings, instance);
    }, settings.interval);
  };

  jQuery.fn.hoverIntent = (options, overCallback, outCallback) => {
    const instanceId = instanceCounter++;
    let settings = jQuery.extend({}, defaultSettings);

    if (jQuery.isPlainObject(options)) {
      settings = jQuery.extend(settings, options);
      if (!isFunction(settings.out)) {
        settings.out = settings.over;
      }
    } else {
      settings = isFunction(overCallback)
        ? jQuery.extend(settings, {
            over: options,
            out: outCallback,
            selector: undefined,
          })
        : jQuery.extend(settings, {
            over: options,
            out: options,
            selector: overCallback,
          });
    }

    const eventHandler = (event) => {
      const eventCopy = jQuery.extend({}, event);
      const $element = window.jQuery(event.currentTarget);
      const hoverData = $element.data('hoverIntent') || {};
      $element.data('hoverIntent', hoverData);

      const instance =
        hoverData[instanceId] || (hoverData[instanceId] = { id: instanceId });

      instance.timeoutId &&
        (instance.timeoutId = clearTimeout(instance.timeoutId));

      const hoverEvent = (instance.event =
        'mousemove.hoverIntent.hoverIntent' + instanceId);

      if (event.type === 'mouseenter') {
        if (instance.isActive) return;

        instance.pX = eventCopy.pageX;
        instance.pY = eventCopy.pageY;
        $element
          .off(hoverEvent, handleMouseMove)
          .on(hoverEvent, handleMouseMove);
        instance.timeoutId = setTimeout(function () {
          hoverIntentHandler(eventCopy, $element, instance, settings);
        }, settings.interval);
      } else {
        if (!instance.isActive) return;

        $element.off(hoverEvent, handleMouseMove);
        instance.timeoutId = setTimeout(function () {
          if (hoverData[instanceId]) {
            delete hoverData[instanceId];
            settings.out.apply($element[0], [event]);
          }
        }, settings.timeout);
      }
    };

    return options.instance.on(
      {
        'mouseenter.hoverIntent': eventHandler,
        'mouseleave.hoverIntent': eventHandler,
      },
      settings.selector
    );
  };
});

!(function (e, t) {
  'function' == typeof define && define.amd
    ? define(t)
    : 'object' == typeof exports
    ? (module.exports = t())
    : (e.PhotoSwipe = t());
})(window, function () {
  'use strict';
  return function (e, t, n, i) {
    var o = {
      features: null,
      bind: function (e, t, n, i) {
        var o = (i ? 'remove' : 'add') + 'EventListener';
        t = t.split(' ');
        for (var a = 0; a < t.length; a++) t[a] && e[o](t[a], n, !1);
      },
      isArray: function (e) {
        return e instanceof Array;
      },
      createEl: function (e, t) {
        var n = document.createElement(t || 'div');
        return e && (n.className = e), n;
      },
      getScrollY: function () {
        var e = window.pageYOffset;
        return void 0 !== e ? e : document.documentElement.scrollTop;
      },
      unbind: function (e, t, n) {
        o.bind(e, t, n, !0);
      },
      removeClass: function (e, t) {
        var n = new RegExp('(\\s|^)' + t + '(\\s|$)');
        e.className = e.className
          .replace(n, ' ')
          .replace(/^\s\s*/, '')
          .replace(/\s\s*$/, '');
      },
      addClass: function (e, t) {
        o.hasClass(e, t) || (e.className += (e.className ? ' ' : '') + t);
      },
      hasClass: function (e, t) {
        return (
          e.className && new RegExp('(^|\\s)' + t + '(\\s|$)').test(e.className)
        );
      },
      getChildByClass: function (e, t) {
        for (var n = e.firstChild; n; ) {
          if (o.hasClass(n, t)) return n;
          n = n.nextSibling;
        }
      },
      arraySearch: function (e, t, n) {
        for (var i = e.length; i--; ) if (e[i][n] === t) return i;
        return -1;
      },
      extend: function (e, t, n) {
        for (var i in t)
          if (t.hasOwnProperty(i)) {
            if (n && e.hasOwnProperty(i)) continue;
            e[i] = t[i];
          }
      },
      easing: {
        sine: {
          out: function (e) {
            return Math.sin(e * (Math.PI / 2));
          },
          inOut: function (e) {
            return -(Math.cos(Math.PI * e) - 1) / 2;
          },
        },
        cubic: {
          out: function (e) {
            return --e * e * e + 1;
          },
        },
      },
      detectFeatures: function () {
        if (o.features) return o.features;
        var e = o.createEl().style,
          t = '',
          n = {};
        if (
          ((n.oldIE = document.all && !document.addEventListener),
          (n.touch = 'ontouchstart' in window),
          window.requestAnimationFrame &&
            ((n.raf = window.requestAnimationFrame),
            (n.caf = window.cancelAnimationFrame)),
          (n.pointerEvent =
            !!window.PointerEvent || navigator.msPointerEnabled),
          !n.pointerEvent)
        ) {
          var i = navigator.userAgent;
          if (/iP(hone|od)/.test(navigator.platform)) {
            var a = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            a &&
              a.length > 0 &&
              (a = parseInt(a[1], 10)) >= 1 &&
              a < 8 &&
              (n.isOldIOSPhone = !0);
          }
          var s = i.match(/Android\s([0-9\.]*)/),
            r = s ? s[1] : 0;
          (r = parseFloat(r)) >= 1 &&
            (r < 4.4 && (n.isOldAndroid = !0), (n.androidVersion = r)),
            (n.isMobileOpera = /opera mini|opera mobi/i.test(i));
        }
        for (
          var l,
            c,
            d = ['transform', 'perspective', 'animationName'],
            u = ['', 'webkit', 'Moz', 'ms', 'O'],
            p = 0;
          p < 4;
          p++
        ) {
          t = u[p];
          for (var m = 0; m < 3; m++)
            (l = d[m]),
              (c = t + (t ? l.charAt(0).toUpperCase() + l.slice(1) : l)),
              !n[l] && c in e && (n[l] = c);
          t &&
            !n.raf &&
            ((t = t.toLowerCase()),
            (n.raf = window[t + 'RequestAnimationFrame']),
            n.raf &&
              (n.caf =
                window[t + 'CancelAnimationFrame'] ||
                window[t + 'CancelRequestAnimationFrame']));
        }
        if (!n.raf) {
          var f = 0;
          (n.raf = function (e) {
            var t = new Date().getTime(),
              n = Math.max(0, 16 - (t - f)),
              i = window.setTimeout(function () {
                (window.jQuery || window.$)(t + n);
              }, n);
            return (f = t + n), i;
          }),
            (n.caf = function (e) {
              clearTimeout(e);
            });
        }
        return (
          (n.svg =
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg')
              .createSVGRect),
          (o.features = n),
          n
        );
      },
    };
    o.detectFeatures(),
      o.features.oldIE &&
        (o.bind = function (e, t, n, i) {
          t = t.split(' ');
          for (
            var o,
              a = (i ? 'detach' : 'attach') + 'Event',
              s = function () {
                n.handleEvent.call(n);
              },
              r = 0;
            r < t.length;
            r++
          )
            if ((o = t[r]))
              if ('object' == typeof n && n.handleEvent) {
                if (i) {
                  if (!n['oldIE' + o]) return !1;
                } else n['oldIE' + o] = s;
                e[a]('on' + o, n['oldIE' + o]);
              } else e[a]('on' + o, n);
        });
    var a = this,
      s = {
        allowPanToNext: !0,
        spacing: 0.12,
        bgOpacity: 1,
        mouseUsed: !1,
        loop: !0,
        pinchToClose: !0,
        closeOnScroll: !0,
        closeOnVerticalDrag: !0,
        verticalDragRange: 0.75,
        hideAnimationDuration: 333,
        showAnimationDuration: 333,
        showHideOpacity: !1,
        focus: !0,
        escKey: !0,
        arrowKeys: !0,
        mainScrollEndFriction: 0.35,
        panEndFriction: 0.35,
        isClickableElement: function (e) {
          return 'A' === e.tagName;
        },
        getDoubleTapZoom: function (e, t) {
          return e ? 1 : t.initialZoomLevel < 0.7 ? 1 : 1.33;
        },
        maxSpreadZoom: 1.33,
        modal: !0,
        scaleMode: 'fit',
      };
    o.extend(s, i);
    var r,
      l,
      c,
      d,
      u,
      p,
      m,
      f,
      h,
      g,
      v,
      T,
      y,
      S,
      w,
      b,
      x,
      C,
      _,
      P,
      k,
      I,
      D,
      A,
      M,
      E,
      R,
      O,
      N,
      $,
      L,
      F,
      U,
      B,
      H,
      W,
      j,
      z,
      G,
      q,
      Z,
      K,
      V,
      Y,
      X,
      J,
      Q,
      ee,
      te,
      ne,
      ie,
      oe,
      ae,
      se,
      re,
      le,
      ce,
      de = {
        x: 0,
        y: 0,
      },
      ue = {
        x: 0,
        y: 0,
      },
      pe = {
        x: 0,
        y: 0,
      },
      me = {},
      fe = 0,
      he = {},
      ge = {
        x: 0,
        y: 0,
      },
      ve = 0,
      Te = !0,
      ye = [],
      Se = {},
      we = !1,
      be = function (e, t) {
        o.extend(a, t.publicMethods), ye.push(e);
      },
      xe = function (e) {
        var t = Wt();
        return e > t - 1 ? e - t : e < 0 ? t + e : e;
      },
      Ce = {},
      _e = function (e, t) {
        return Ce[e] || (Ce[e] = []), Ce[e].push(t);
      },
      Pe = function (e) {
        var t = Ce[e];
        if (t) {
          var n = Array.prototype.slice.call(arguments);
          n.shift();
          for (var i = 0; i < t.length; i++) t[i].apply(a, n);
        }
      },
      ke = function () {
        return new Date().getTime();
      },
      Ie = function (e) {
        (re = e), (a.bg.style.opacity = e * s.bgOpacity);
      },
      De = function (e, t, n, i, o) {
        (!we || (o && o !== a.currItem)) &&
          (i /= o ? o.fitRatio : a.currItem.fitRatio),
          (e[I] = T + t + 'px, ' + n + 'px' + y + ' scale(' + i + ')');
      },
      Ae = function (e) {
        ne &&
          (e &&
            (g > a.currItem.fitRatio
              ? we || (Jt(a.currItem, !1, !0), (we = !0))
              : we && (Jt(a.currItem), (we = !1))),
          De(ne, pe.x, pe.y, g));
      },
      Me = function (e) {
        e.container &&
          De(
            e.container.style,
            e.initialPosition.x,
            e.initialPosition.y,
            e.initialZoomLevel,
            e
          );
      },
      Ee = function (e, t) {
        t[I] = T + e + 'px, 0px' + y;
      },
      Re = function (e, t) {
        if (!s.loop && t) {
          var n = d + (ge.x * fe - e) / ge.x,
            i = Math.round(e - ut.x);
          ((n < 0 && i > 0) || (n >= Wt() - 1 && i < 0)) &&
            (e = ut.x + i * s.mainScrollEndFriction);
        }
        (ut.x = e), Ee(e, u);
      },
      Oe = function (e, t) {
        var n = pt[e] - he[e];
        return ue[e] + de[e] + n - n * (t / v);
      },
      Ne = function (e, t) {
        (e.x = t.x), (e.y = t.y), t.id && (e.id = t.id);
      },
      $e = function (e) {
        (e.x = Math.round(e.x)), (e.y = Math.round(e.y));
      },
      Le = null,
      Fe = function () {
        Le &&
          (o.unbind(document, 'mousemove', Fe),
          o.addClass(e, 'pswp--has_mouse'),
          (s.mouseUsed = !0),
          Pe('mouseUsed')),
          (Le = setTimeout(function () {
            Le = null;
          }, 100));
      },
      Ue = function (e, t) {
        var n = Kt(a.currItem, me, e);
        return t && (te = n), n;
      },
      Be = function (e) {
        return e || (e = a.currItem), e.initialZoomLevel;
      },
      He = function (e) {
        return e || (e = a.currItem), e.w > 0 ? s.maxSpreadZoom : 1;
      },
      We = function (e, t, n, i) {
        return i === a.currItem.initialZoomLevel
          ? ((n[e] = a.currItem.initialPosition[e]), !0)
          : ((n[e] = Oe(e, i)),
            n[e] > t.min[e]
              ? ((n[e] = t.min[e]), !0)
              : n[e] < t.max[e] && ((n[e] = t.max[e]), !0));
      },
      je = function (e) {
        var t = '';
        s.escKey && 27 === e.keyCode
          ? (t = 'close')
          : s.arrowKeys &&
            (37 === e.keyCode
              ? (t = 'prev')
              : 39 === e.keyCode && (t = 'next')),
          t &&
            (e.ctrlKey ||
              e.altKey ||
              e.shiftKey ||
              e.metaKey ||
              (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
              a[t]()));
      },
      ze = function (e) {
        e && (K || Z || ie || j) && (e.preventDefault(), e.stopPropagation());
      },
      Ge = function () {
        a.setScrollOffset(0, o.getScrollY());
      },
      qe = {},
      Ze = 0,
      Ke = function (e) {
        qe[e] && (qe[e].raf && E(qe[e].raf), Ze--, delete qe[e]);
      },
      Ve = function (e) {
        qe[e] && Ke(e), qe[e] || (Ze++, (qe[e] = {}));
      },
      Ye = function () {
        for (var e in qe) qe.hasOwnProperty(e) && Ke(e);
      },
      Xe = function (e, t, n, i, o, a, s) {
        var r,
          l = ke();
        Ve(e);
        var c = function () {
          if (qe[e]) {
            if ((r = ke() - l) >= i) return Ke(e), a(n), void (s && s());
            a((n - t) * o(r / i) + t), (qe[e].raf = M(c));
          }
        };
        c();
      },
      Je = {
        shout: Pe,
        listen: _e,
        viewportSize: me,
        options: s,
        isMainScrollAnimating: function () {
          return ie;
        },
        getZoomLevel: function () {
          return g;
        },
        getCurrentIndex: function () {
          return d;
        },
        isDragging: function () {
          return G;
        },
        isZooming: function () {
          return J;
        },
        setScrollOffset: function (e, t) {
          (he.x = e), ($ = he.y = t), Pe('updateScrollOffset', he);
        },
        applyZoomPan: function (e, t, n, i) {
          (pe.x = t), (pe.y = n), (g = e), Ae(i);
        },
        init: function () {
          if (!r && !l) {
            var n;
            (a.framework = o),
              (a.template = e),
              (a.bg = o.getChildByClass(e, 'pswp__bg')),
              (R = e.className),
              (r = !0),
              (L = o.detectFeatures()),
              (M = L.raf),
              (E = L.caf),
              (I = L.transform),
              (N = L.oldIE),
              (a.scrollWrap = o.getChildByClass(e, 'pswp__scroll-wrap')),
              (a.container = o.getChildByClass(
                a.scrollWrap,
                'pswp__container'
              )),
              (u = a.container.style),
              (a.itemHolders = b =
                [
                  {
                    el: a.container.children[0],
                    wrap: 0,
                    index: -1,
                  },
                  {
                    el: a.container.children[1],
                    wrap: 0,
                    index: -1,
                  },
                  {
                    el: a.container.children[2],
                    wrap: 0,
                    index: -1,
                  },
                ]),
              (b[0].el.style.display = b[2].el.style.display = 'none'),
              (function () {
                if (I) {
                  var t = L.perspective && !A;
                  return (
                    (T = 'translate' + (t ? '3d(' : '(')),
                    void (y = L.perspective ? ', 0px)' : ')')
                  );
                }
                (I = 'left'),
                  o.addClass(e, 'pswp--ie'),
                  (Ee = function (e, t) {
                    t.left = e + 'px';
                  }),
                  (Me = function (e) {
                    var t = e.fitRatio > 1 ? 1 : e.fitRatio,
                      n = e.container.style,
                      i = t * e.w,
                      o = t * e.h;
                    (n.width = i + 'px'),
                      (n.height = o + 'px'),
                      (n.left = e.initialPosition.x + 'px'),
                      (n.top = e.initialPosition.y + 'px');
                  }),
                  (Ae = function () {
                    if (ne) {
                      var e = ne,
                        t = a.currItem,
                        n = t.fitRatio > 1 ? 1 : t.fitRatio,
                        i = n * t.w,
                        o = n * t.h;
                      (e.width = i + 'px'),
                        (e.height = o + 'px'),
                        (e.left = pe.x + 'px'),
                        (e.top = pe.y + 'px');
                    }
                  });
              })(),
              (h = {
                resize: a.updateSize,
                orientationchange: function () {
                  clearTimeout(F),
                    (F = setTimeout(function () {
                      me.x !== a.scrollWrap.clientWidth && a.updateSize();
                    }, 500));
                },
                scroll: Ge,
                keydown: je,
                click: ze,
              });
            var i = L.isOldIOSPhone || L.isOldAndroid || L.isMobileOpera;
            for (
              (L.animationName && L.transform && !i) ||
                (s.showAnimationDuration = s.hideAnimationDuration = 0),
                n = 0;
              n < ye.length;
              n++
            )
              a['init' + ye[n]]();
            t && (a.ui = new t(a, o)).init(),
              Pe('firstUpdate'),
              (d = d || s.index || 0),
              (isNaN(d) || d < 0 || d >= Wt()) && (d = 0),
              (a.currItem = Ht(d)),
              (L.isOldIOSPhone || L.isOldAndroid) && (Te = !1),
              e.setAttribute('aria-hidden', 'false'),
              s.modal &&
                (Te
                  ? (e.style.position = 'fixed')
                  : ((e.style.position = 'absolute'),
                    (e.style.top = o.getScrollY() + 'px'))),
              void 0 === $ && (Pe('initialLayout'), ($ = O = o.getScrollY()));
            var c = 'pswp--open ';
            for (
              s.mainClass && (c += s.mainClass + ' '),
                s.showHideOpacity && (c += 'pswp--animate_opacity '),
                c += A ? 'pswp--touch' : 'pswp--notouch',
                c += L.animationName ? ' pswp--css_animation' : '',
                c += L.svg ? ' pswp--svg' : '',
                o.addClass(e, c),
                a.updateSize(),
                p = -1,
                ve = null,
                n = 0;
              n < 3;
              n++
            )
              Ee((n + p) * ge.x, b[n].el.style);
            N || o.bind(a.scrollWrap, f, a),
              _e('initialZoomInEnd', function () {
                a.setContent(b[0], d - 1),
                  a.setContent(b[2], d + 1),
                  (b[0].el.style.display = b[2].el.style.display = 'block'),
                  s.focus && e.focus(),
                  o.bind(document, 'keydown', a),
                  L.transform && o.bind(a.scrollWrap, 'click', a),
                  s.mouseUsed || o.bind(document, 'mousemove', Fe),
                  o.bind(window, 'resize scroll orientationchange', a),
                  Pe('bindEvents');
              }),
              a.setContent(b[1], d),
              a.updateCurrItem(),
              Pe('afterInit'),
              Te ||
                (S = setInterval(function () {
                  Ze ||
                    G ||
                    J ||
                    g !== a.currItem.initialZoomLevel ||
                    a.updateSize();
                }, 1e3)),
              o.addClass(e, 'pswp--visible');
          }
        },
        close: function () {
          r &&
            ((r = !1),
            (l = !0),
            Pe('close'),
            o.unbind(window, 'resize scroll orientationchange', a),
            o.unbind(window, 'scroll', h.scroll),
            o.unbind(document, 'keydown', a),
            o.unbind(document, 'mousemove', Fe),
            L.transform && o.unbind(a.scrollWrap, 'click', a),
            G && o.unbind(window, m, a),
            clearTimeout(F),
            Pe('unbindEvents'),
            zt(a.currItem, null, !0, a.destroy));
        },
        destroy: function () {
          Pe('destroy'),
            Lt && clearTimeout(Lt),
            e.setAttribute('aria-hidden', 'true'),
            (e.className = R),
            S && clearInterval(S),
            o.unbind(a.scrollWrap, f, a),
            o.unbind(window, 'scroll', a),
            ht(),
            Ye(),
            (Ce = null);
        },
        panTo: function (e, t, n) {
          n ||
            (e > te.min.x ? (e = te.min.x) : e < te.max.x && (e = te.max.x),
            t > te.min.y ? (t = te.min.y) : t < te.max.y && (t = te.max.y)),
            (pe.x = e),
            (pe.y = t),
            Ae();
        },
        handleEvent: function (e) {
          (e = e || window.event), h[e.type] && h[e.type](e);
        },
        goTo: function (e) {
          var t = (e = xe(e)) - d;
          (ve = t),
            (d = e),
            (a.currItem = Ht(d)),
            (fe -= t),
            Re(ge.x * fe),
            Ye(),
            (ie = !1),
            a.updateCurrItem();
        },
        next: function () {
          a.goTo(d + 1);
        },
        prev: function () {
          a.goTo(d - 1);
        },
        updateCurrZoomItem: function (e) {
          if ((e && Pe('beforeChange', 0), b[1].el.children.length)) {
            var t = b[1].el.children[0];
            ne = o.hasClass(t, 'pswp__zoom-wrap') ? t.style : null;
          } else ne = null;
          (te = a.currItem.bounds),
            (v = g = a.currItem.initialZoomLevel),
            (pe.x = te.center.x),
            (pe.y = te.center.y),
            e && Pe('afterChange');
        },
        invalidateCurrItems: function () {
          w = !0;
          for (var e = 0; e < 3; e++) b[e].item && (b[e].item.needsUpdate = !0);
        },
        updateCurrItem: function (e) {
          if (0 !== ve) {
            var t,
              n = Math.abs(ve);
            if (!(e && n < 2)) {
              (a.currItem = Ht(d)),
                (we = !1),
                Pe('beforeChange', ve),
                n >= 3 && ((p += ve + (ve > 0 ? -3 : 3)), (n = 3));
              for (var i = 0; i < n; i++)
                ve > 0
                  ? ((t = b.shift()),
                    (b[2] = t),
                    p++,
                    Ee((p + 2) * ge.x, t.el.style),
                    a.setContent(t, d - n + i + 1 + 1))
                  : ((t = b.pop()),
                    b.unshift(t),
                    p--,
                    Ee(p * ge.x, t.el.style),
                    a.setContent(t, d + n - i - 1 - 1));
              if (ne && 1 === Math.abs(ve)) {
                var o = Ht(x);
                o.initialZoomLevel !== g && (Kt(o, me), Jt(o), Me(o));
              }
              (ve = 0), a.updateCurrZoomItem(), (x = d), Pe('afterChange');
            }
          }
        },
        updateSize: function (t) {
          if (!Te && s.modal) {
            var n = o.getScrollY();
            if (
              ($ !== n && ((e.style.top = n + 'px'), ($ = n)),
              !t && Se.x === window.innerWidth && Se.y === window.innerHeight)
            )
              return;
            (Se.x = window.innerWidth),
              (Se.y = window.innerHeight),
              (e.style.height = Se.y + 'px');
          }
          if (
            ((me.x = a.scrollWrap.clientWidth),
            (me.y = a.scrollWrap.clientHeight),
            Ge(),
            (ge.x = me.x + Math.round(me.x * s.spacing)),
            (ge.y = me.y),
            Re(ge.x * fe),
            Pe('beforeResize'),
            void 0 !== p)
          ) {
            for (var i, r, l, c = 0; c < 3; c++)
              (i = b[c]),
                Ee((c + p) * ge.x, i.el.style),
                (l = d + c - 1),
                s.loop && Wt() > 2 && (l = xe(l)),
                (r = Ht(l)) && (w || r.needsUpdate || !r.bounds)
                  ? (a.cleanSlide(r),
                    a.setContent(i, l),
                    1 === c && ((a.currItem = r), a.updateCurrZoomItem(!0)),
                    (r.needsUpdate = !1))
                  : -1 === i.index && l >= 0 && a.setContent(i, l),
                r && r.container && (Kt(r, me), Jt(r), Me(r));
            w = !1;
          }
          (v = g = a.currItem.initialZoomLevel),
            (te = a.currItem.bounds) &&
              ((pe.x = te.center.x), (pe.y = te.center.y), Ae(!0)),
            Pe('resize');
        },
        zoomTo: function (e, t, n, i, a) {
          t &&
            ((v = g),
            (pt.x = Math.abs(t.x) - pe.x),
            (pt.y = Math.abs(t.y) - pe.y),
            Ne(ue, pe));
          var s = Ue(e, !1),
            r = {};
          We('x', s, r, e), We('y', s, r, e);
          var l = g,
            c = {
              x: pe.x,
              y: pe.y,
            };
          $(window.jQuery || window.$)(r);
          var d = function (t) {
            1 === t
              ? ((g = e), (pe.x = r.x), (pe.y = r.y))
              : ((g = (e - l) * t + l),
                (pe.x = (r.x - c.x) * t + c.x),
                (pe.y = (r.y - c.y) * t + c.y)),
              a && a(t),
              Ae(1 === t);
          };
          n ? Xe('customZoomTo', 0, 1, n, i || o.easing.sine.inOut, d) : d(1);
        },
      },
      Qe = {},
      et = {},
      tt = {},
      nt = {},
      it = {},
      ot = [],
      at = {},
      st = [],
      rt = {},
      lt = 0,
      ct = {
        x: 0,
        y: 0,
      },
      dt = 0,
      ut = {
        x: 0,
        y: 0,
      },
      pt = {
        x: 0,
        y: 0,
      },
      mt = {
        x: 0,
        y: 0,
      },
      ft = function (e, t) {
        return (
          (rt.x = Math.abs(e.x - t.x)),
          (rt.y = Math.abs(e.y - t.y)),
          Math.sqrt(rt.x * rt.x + rt.y * rt.y)
        );
      },
      ht = function () {
        V && (E(V), (V = null));
      },
      gt = function () {
        G && ((V = M(gt)), At());
      },
      vt = function (e, t) {
        return (
          !(!e || e === document) &&
          !(
            e.getAttribute('class') &&
            e.getAttribute('class').indexOf('pswp__scroll-wrap') > -1
          ) &&
          (t(e) ? e : vt(e.parentNode, t))
        );
      },
      Tt = {},
      yt = function (e, t) {
        return (
          (Tt.prevent = !vt(e.target, s.isClickableElement)),
          Pe('preventDragEvent', e, t, Tt),
          Tt.prevent
        );
      },
      St = function (e, t) {
        return (t.x = e.pageX), (t.y = e.pageY), (t.id = e.identifier), t;
      },
      wt = function (e, t, n) {
        (n.x = 0.5 * (e.x + t.x)), (n.y = 0.5 * (e.y + t.y));
      },
      bt = function () {
        var e = pe.y - a.currItem.initialPosition.y;
        return 1 - Math.abs(e / (me.y / 2));
      },
      xt = {},
      Ct = {},
      _t = [],
      Pt = function (e) {
        for (; _t.length > 0; ) _t.pop();
        return (
          D
            ? ((ce = 0),
              ot.forEach(function (e) {
                0 === ce ? (_t[0] = e) : 1 === ce && (_t[1] = e), ce++;
              }))
            : e.type.indexOf('touch') > -1
            ? e.touches &&
              e.touches.length > 0 &&
              ((_t[0] = St(e.touches[0], xt)),
              e.touches.length > 1 && (_t[1] = St(e.touches[1], Ct)))
            : ((xt.x = e.pageX), (xt.y = e.pageY), (xt.id = ''), (_t[0] = xt)),
          _t
        );
      },
      kt = function (e, t) {
        var n,
          i,
          o,
          r,
          l = pe[e] + t[e],
          c = t[e] > 0,
          d = ut.x + t.x,
          u = ut.x - at.x;
        return (
          (n = l > te.min[e] || l < te.max[e] ? s.panEndFriction : 1),
          (l = pe[e] + t[e] * n),
          (!s.allowPanToNext && g !== a.currItem.initialZoomLevel) ||
          (ne
            ? 'h' !== oe ||
              'x' !== e ||
              Z ||
              (c
                ? (l > te.min[e] &&
                    ((n = s.panEndFriction),
                    te.min[e],
                    (i = te.min[e] - ue[e])),
                  (i <= 0 || u < 0) && Wt() > 1
                    ? ((r = d), u < 0 && d > at.x && (r = at.x))
                    : te.min.x !== te.max.x && (o = l))
                : (l < te.max[e] &&
                    ((n = s.panEndFriction),
                    te.max[e],
                    (i = ue[e] - te.max[e])),
                  (i <= 0 || u > 0) && Wt() > 1
                    ? ((r = d), u > 0 && d < at.x && (r = at.x))
                    : te.min.x !== te.max.x && (o = l)))
            : (r = d),
          'x' !== e)
            ? void (ie || Y || (g > a.currItem.fitRatio && (pe[e] += t[e] * n)))
            : (void 0 !== r && (Re(r, !0), (Y = r !== at.x)),
              te.min.x !== te.max.x &&
                (void 0 !== o ? (pe.x = o) : Y || (pe.x += t.x * n)),
              void 0 !== r)
        );
      },
      It = function (e) {
        if (!('mousedown' === e.type && e.button > 0)) {
          if (Bt) return void e.preventDefault();
          if (!z || 'mousedown' !== e.type) {
            if ((yt(e, !0) && e.preventDefault(), Pe('pointerDown'), D)) {
              var t = o.arraySearch(ot, e.pointerId, 'id');
              t < 0 && (t = ot.length),
                (ot[t] = {
                  x: e.pageX,
                  y: e.pageY,
                  id: e.pointerId,
                });
            }
            var n = Pt(e),
              i = n.length;
            (X = null),
              Ye(),
              (G && 1 !== i) ||
                ((G = ae = !0),
                o.bind(window, m, a),
                (W = le = se = j = Y = K = q = Z = !1),
                (oe = null),
                Pe('firstTouchStart', n),
                Ne(ue, pe),
                (de.x = de.y = 0),
                Ne(nt, n[0]),
                Ne(it, nt),
                (at.x = ge.x * fe),
                (st = [
                  {
                    x: nt.x,
                    y: nt.y,
                  },
                ]),
                (B = U = ke()),
                Ue(g, !0),
                ht(),
                gt()),
              !J &&
                i > 1 &&
                !ie &&
                !Y &&
                ((v = g),
                (Z = !1),
                (J = q = !0),
                (de.y = de.x = 0),
                Ne(ue, pe),
                Ne(Qe, n[0]),
                Ne(et, n[1]),
                wt(Qe, et, mt),
                (pt.x = Math.abs(mt.x) - pe.x),
                (pt.y = Math.abs(mt.y) - pe.y),
                (Q = ee = ft(Qe, et)));
          }
        }
      },
      Dt = function (e) {
        if ((e.preventDefault(), D)) {
          var t = o.arraySearch(ot, e.pointerId, 'id');
          if (t > -1) {
            var n = ot[t];
            (n.x = e.pageX), (n.y = e.pageY);
          }
        }
        if (G) {
          var i = Pt(e);
          if (oe || K || J) X = i;
          else if (ut.x !== ge.x * fe) oe = 'h';
          else {
            var a = Math.abs(i[0].x - nt.x) - Math.abs(i[0].y - nt.y);
            Math.abs(a) >= 10 && ((oe = a > 0 ? 'h' : 'v'), (X = i));
          }
        }
      },
      At = function () {
        if (X) {
          var e = X.length;
          if (0 !== e)
            if (
              (Ne(Qe, X[0]),
              (tt.x = Qe.x - nt.x),
              (tt.y = Qe.y - nt.y),
              J && e > 1)
            ) {
              if (
                ((nt.x = Qe.x),
                (nt.y = Qe.y),
                !tt.x &&
                  !tt.y &&
                  (function (e, t) {
                    return e.x === t.x && e.y === t.y;
                  })(X[1], et))
              )
                return;
              Ne(et, X[1]), Z || ((Z = !0), Pe('zoomGestureStarted'));
              var t = ft(Qe, et),
                n = Nt(t);
              n >
                a.currItem.initialZoomLevel +
                  a.currItem.initialZoomLevel / 15 && (le = !0);
              var i = 1,
                o = Be(),
                r = He();
              if (n < o)
                if (s.pinchToClose && !le && v <= a.currItem.initialZoomLevel) {
                  var l = 1 - (o - n) / (o / 1.2);
                  Ie(l), Pe('onPinchClose', l), (se = !0);
                } else (i = (o - n) / o) > 1 && (i = 1), (n = o - i * (o / 3));
              else
                n > r &&
                  ((i = (n - r) / (6 * o)) > 1 && (i = 1), (n = r + i * o));
              i < 0 && (i = 0),
                (Q = t),
                wt(Qe, et, ct),
                (de.x += ct.x - mt.x),
                (de.y += ct.y - mt.y),
                Ne(mt, ct),
                (pe.x = Oe('x', n)),
                (pe.y = Oe('y', n)),
                (W = n > g),
                (g = n),
                Ae();
            } else {
              if (!oe) return;
              if (
                (ae &&
                  ((ae = !1),
                  Math.abs(tt.x) >= 10 && (tt.x -= X[0].x - it.x),
                  Math.abs(tt.y) >= 10 && (tt.y -= X[0].y - it.y)),
                (nt.x = Qe.x),
                (nt.y = Qe.y),
                0 === tt.x && 0 === tt.y)
              )
                return;
              if (
                'v' === oe &&
                s.closeOnVerticalDrag &&
                'fit' === s.scaleMode &&
                g === a.currItem.initialZoomLevel
              ) {
                (de.y += tt.y), (pe.y += tt.y);
                var c = bt();
                return (j = !0), Pe('onVerticalDrag', c), Ie(c), void Ae();
              }
              (function (e, t, n) {
                if (e - B > 50) {
                  var i = st.length > 2 ? st.shift() : {};
                  (i.x = t), (i.y = n), st.push(i), (B = e);
                }
              })(ke(), Qe.x, Qe.y),
                (K = !0),
                (te = a.currItem.bounds),
                kt('x', tt) ||
                  (kt('y', tt), $(window.jQuery || window.$)(pe), Ae());
            }
        }
      },
      Mt = function (e) {
        if (L.isOldAndroid) {
          if (z && 'mouseup' === e.type) return;
          e.type.indexOf('touch') > -1 &&
            (clearTimeout(z),
            (z = setTimeout(function () {
              z = 0;
            }, 600)));
        }
        Pe('pointerUp'), yt(e, !1) && e.preventDefault();
        var t;
        if (D) {
          var n = o.arraySearch(ot, e.pointerId, 'id');
          if (n > -1)
            if (((t = ot.splice(n, 1)[0]), navigator.msPointerEnabled)) {
              var i = {
                4: 'mouse',
                2: 'touch',
                3: 'pen',
              };
              (t.type = i[e.pointerType]),
                t.type || (t.type = e.pointerType || 'mouse');
            } else t.type = e.pointerType || 'mouse';
        }
        var r,
          l = Pt(e),
          c = l.length;
        if (('mouseup' === e.type && (c = 0), 2 === c)) return (X = null), !0;
        1 === c && Ne(it, l[0]),
          0 !== c ||
            oe ||
            ie ||
            (t ||
              ('mouseup' === e.type
                ? (t = {
                    x: e.pageX,
                    y: e.pageY,
                    type: 'mouse',
                  })
                : e.changedTouches &&
                  e.changedTouches[0] &&
                  (t = {
                    x: e.changedTouches[0].pageX,
                    y: e.changedTouches[0].pageY,
                    type: 'touch',
                  })),
            Pe('touchRelease', e, t));
        var d = -1;
        if (
          (0 === c &&
            ((G = !1),
            o.unbind(window, m, a),
            ht(),
            J ? (d = 0) : -1 !== dt && (d = ke() - dt)),
          (dt = 1 === c ? ke() : -1),
          (r = -1 !== d && d < 150 ? 'zoom' : 'swipe'),
          J &&
            c < 2 &&
            ((J = !1),
            1 === c && (r = 'zoomPointerUp'),
            Pe('zoomGestureEnded')),
          (X = null),
          K || Z || ie || j)
        )
          if ((Ye(), H || (H = Et()), H.calculateSwipeSpeed('x'), j))
            if (bt() < s.verticalDragRange) a.close();
            else {
              var u = pe.y,
                p = re;
              Xe('verticalDrag', 0, 1, 300, o.easing.cubic.out, function (e) {
                (pe.y = (a.currItem.initialPosition.y - u) * e + u),
                  Ie((1 - p) * e + p),
                  Ae();
              }),
                Pe('onVerticalDrag', 1);
            }
          else {
            if ((Y || ie) && 0 === c) {
              if (Ot(r, H)) return;
              r = 'zoomPointerUp';
            }
            if (!ie)
              return 'swipe' !== r
                ? void $t()
                : void (!Y && g > a.currItem.fitRatio && Rt(H));
          }
      },
      Et = function () {
        var e,
          t,
          n = {
            lastFlickOffset: {},
            lastFlickDist: {},
            lastFlickSpeed: {},
            slowDownRatio: {},
            slowDownRatioReverse: {},
            speedDecelerationRatio: {},
            speedDecelerationRatioAbs: {},
            distanceOffset: {},
            backAnimDestination: {},
            backAnimStarted: {},
            calculateSwipeSpeed: function (i) {
              st.length > 1
                ? ((e = ke() - B + 50), (t = st[st.length - 2][i]))
                : ((e = ke() - U), (t = it[i])),
                (n.lastFlickOffset[i] = nt[i] - t),
                (n.lastFlickDist[i] = Math.abs(n.lastFlickOffset[i])),
                n.lastFlickDist[i] > 20
                  ? (n.lastFlickSpeed[i] = n.lastFlickOffset[i] / e)
                  : (n.lastFlickSpeed[i] = 0),
                Math.abs(n.lastFlickSpeed[i]) < 0.1 &&
                  (n.lastFlickSpeed[i] = 0),
                (n.slowDownRatio[i] = 0.95),
                (n.slowDownRatioReverse[i] = 1 - n.slowDownRatio[i]),
                (n.speedDecelerationRatio[i] = 1);
            },
            calculateOverBoundsAnimOffset: function (e, t) {
              n.backAnimStarted[e] ||
                (pe[e] > te.min[e]
                  ? (n.backAnimDestination[e] = te.min[e])
                  : pe[e] < te.max[e] && (n.backAnimDestination[e] = te.max[e]),
                void 0 !== n.backAnimDestination[e] &&
                  ((n.slowDownRatio[e] = 0.7),
                  (n.slowDownRatioReverse[e] = 1 - n.slowDownRatio[e]),
                  n.speedDecelerationRatioAbs[e] < 0.05 &&
                    ((n.lastFlickSpeed[e] = 0),
                    (n.backAnimStarted[e] = !0),
                    Xe(
                      'bounceZoomPan' + e,
                      pe[e],
                      n.backAnimDestination[e],
                      t || 300,
                      o.easing.sine.out,
                      function (t) {
                        (pe[e] = t), Ae();
                      }
                    ))));
            },
            calculateAnimOffset: function (e) {
              n.backAnimStarted[e] ||
                ((n.speedDecelerationRatio[e] =
                  n.speedDecelerationRatio[e] *
                  (n.slowDownRatio[e] +
                    n.slowDownRatioReverse[e] -
                    (n.slowDownRatioReverse[e] * n.timeDiff) / 10)),
                (n.speedDecelerationRatioAbs[e] = Math.abs(
                  n.lastFlickSpeed[e] * n.speedDecelerationRatio[e]
                )),
                (n.distanceOffset[e] =
                  n.lastFlickSpeed[e] *
                  n.speedDecelerationRatio[e] *
                  n.timeDiff),
                (pe[e] += n.distanceOffset[e]));
            },
            panAnimLoop: function () {
              if (
                qe.zoomPan &&
                ((qe.zoomPan.raf = M(n.panAnimLoop)),
                (n.now = ke()),
                (n.timeDiff = n.now - n.lastNow),
                (n.lastNow = n.now),
                n.calculateAnimOffset('x'),
                n.calculateAnimOffset('y'),
                Ae(),
                n.calculateOverBoundsAnimOffset('x'),
                n.calculateOverBoundsAnimOffset('y'),
                n.speedDecelerationRatioAbs.x < 0.05 &&
                  n.speedDecelerationRatioAbs.y < 0.05)
              )
                return (
                  (pe.x = Math.round(pe.x)),
                  (pe.y = Math.round(pe.y)),
                  Ae(),
                  void Ke('zoomPan')
                );
            },
          };
        return n;
      },
      Rt = function (e) {
        return (
          e.calculateSwipeSpeed('y'),
          (te = a.currItem.bounds),
          (e.backAnimDestination = {}),
          (e.backAnimStarted = {}),
          Math.abs(e.lastFlickSpeed.x) <= 0.05 &&
          Math.abs(e.lastFlickSpeed.y) <= 0.05
            ? ((e.speedDecelerationRatioAbs.x = e.speedDecelerationRatioAbs.y =
                0),
              e.calculateOverBoundsAnimOffset('x'),
              e.calculateOverBoundsAnimOffset('y'),
              !0)
            : (Ve('zoomPan'), (e.lastNow = ke()), void e.panAnimLoop())
        );
      },
      Ot = function (e, t) {
        var n;
        ie || (lt = d);
        var i;
        if ('swipe' === e) {
          var r = nt.x - it.x,
            l = t.lastFlickDist.x < 10;
          r > 30 && (l || t.lastFlickOffset.x > 20)
            ? (i = -1)
            : r < -30 && (l || t.lastFlickOffset.x < -20) && (i = 1);
        }
        var c;
        i &&
          ((d += i) < 0
            ? ((d = s.loop ? Wt() - 1 : 0), (c = !0))
            : d >= Wt() && ((d = s.loop ? 0 : Wt() - 1), (c = !0)),
          (c && !s.loop) || ((ve += i), (fe -= i), (n = !0)));
        var u,
          p = ge.x * fe,
          m = Math.abs(p - ut.x);
        return (
          n || p > ut.x == t.lastFlickSpeed.x > 0
            ? ((u =
                Math.abs(t.lastFlickSpeed.x) > 0
                  ? m / Math.abs(t.lastFlickSpeed.x)
                  : 333),
              (u = Math.min(u, 400)),
              (u = Math.max(u, 250)))
            : (u = 333),
          lt === d && (n = !1),
          (ie = !0),
          Pe('mainScrollAnimStart'),
          Xe('mainScroll', ut.x, p, u, o.easing.cubic.out, Re, function () {
            Ye(),
              (ie = !1),
              (lt = -1),
              (n || lt !== d) && a.updateCurrItem(),
              Pe('mainScrollAnimComplete');
          }),
          n && a.updateCurrItem(!0),
          n
        );
      },
      Nt = function (e) {
        return (1 / ee) * e * v;
      },
      $t = function () {
        var e = g,
          t = Be(),
          n = He();
        g < t ? (e = t) : g > n && (e = n);
        var i,
          s = re;
        return se && !W && !le && g < t
          ? (a.close(), !0)
          : (se &&
              (i = function (e) {
                Ie((1 - s) * e + s);
              }),
            a.zoomTo(e, 0, 200, o.easing.cubic.out, i),
            !0);
      };
    be('Gestures', {
      publicMethods: {
        initGestures: function () {
          var e = function (e, t, n, i, o) {
            (C = e + t), (_ = e + n), (P = e + i), (k = o ? e + o : '');
          };
          (D = L.pointerEvent) && L.touch && (L.touch = !1),
            D
              ? navigator.msPointerEnabled
                ? (window.jQuery || window.$)(
                    'MSPointer',
                    'Down',
                    'Move',
                    'Up',
                    'Cancel'
                  )
                : (window.jQuery || window.$)(
                    'pointer',
                    'down',
                    'move',
                    'up',
                    'cancel'
                  )
              : L.touch
              ? ((window.jQuery || window.$)(
                  'touch',
                  'start',
                  'move',
                  'end',
                  'cancel'
                ),
                (A = !0))
              : (window.jQuery || window.$)('mouse', 'down', 'move', 'up'),
            (m = _ + ' ' + P + ' ' + k),
            (f = C),
            D &&
              !A &&
              (A =
                navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1),
            (a.likelyTouchDevice = A),
            (h[C] = It),
            (h[_] = Dt),
            (h[P] = Mt),
            k && (h[k] = h[P]),
            L.touch &&
              ((f += ' mousedown'),
              (m += ' mousemove mouseup'),
              (h.mousedown = h[C]),
              (h.mousemove = h[_]),
              (h.mouseup = h[P])),
            A || (s.allowPanToNext = !1);
        },
      },
    });
    var Lt,
      Ft,
      Ut,
      Bt,
      Ht,
      Wt,
      jt,
      zt = function (t, n, i, r) {
        Lt && clearTimeout(Lt), (Bt = !0), (Ut = !0);
        var l;
        t.initialLayout
          ? ((l = t.initialLayout), (t.initialLayout = null))
          : (l = s.getThumbBoundsFn && s.getThumbBoundsFn(d));
        var u = i ? s.hideAnimationDuration : s.showAnimationDuration,
          p = function () {
            Ke('initialZoom'),
              i
                ? (a.template.removeAttribute('style'),
                  a.bg.removeAttribute('style'))
                : (Ie(1),
                  n && (n.style.display = 'block'),
                  o.addClass(e, 'pswp--animated-in'),
                  Pe('initialZoom' + (i ? 'OutEnd' : 'InEnd'))),
              r && r(),
              (Bt = !1);
          };
        if (!u || !l || void 0 === l.x)
          return (
            Pe('initialZoom' + (i ? 'Out' : 'In')),
            (g = t.initialZoomLevel),
            Ne(pe, t.initialPosition),
            Ae(),
            (e.style.opacity = i ? 0 : 1),
            Ie(1),
            void (u
              ? setTimeout(function () {
                  p();
                }, u)
              : p())
          );
        !(function () {
          var n = c,
            r = !a.currItem.src || a.currItem.loadError || s.showHideOpacity;
          t.miniImg && (t.miniImg.style.webkitBackfaceVisibility = 'hidden'),
            i ||
              ((g = l.w / t.w),
              (pe.x = l.x),
              (pe.y = l.y - O),
              (a[r ? 'template' : 'bg'].style.opacity = 0.001),
              Ae()),
            Ve('initialZoom'),
            i && !n && o.removeClass(e, 'pswp--animated-in'),
            r &&
              (i
                ? o[(n ? 'remove' : 'add') + 'Class'](
                    e,
                    'pswp--animate_opacity'
                  )
                : setTimeout(function () {
                    o.addClass(e, 'pswp--animate_opacity');
                  }, 30)),
            (Lt = setTimeout(
              function () {
                if ((Pe('initialZoom' + (i ? 'Out' : 'In')), i)) {
                  var a = l.w / t.w,
                    s = {
                      x: pe.x,
                      y: pe.y,
                    },
                    c = g,
                    d = re,
                    m = function (t) {
                      1 === t
                        ? ((g = a), (pe.x = l.x), (pe.y = l.y - $))
                        : ((g = (a - c) * t + c),
                          (pe.x = (l.x - s.x) * t + s.x),
                          (pe.y = (l.y - $ - s.y) * t + s.y)),
                        Ae(),
                        r ? (e.style.opacity = 1 - t) : Ie(d - t * d);
                    };
                  n
                    ? Xe('initialZoom', 0, 1, u, o.easing.cubic.out, m, p)
                    : (m(1), (Lt = setTimeout(p, u + 20)));
                } else
                  (g = t.initialZoomLevel),
                    Ne(pe, t.initialPosition),
                    Ae(),
                    Ie(1),
                    r ? (e.style.opacity = 1) : Ie(1),
                    (Lt = setTimeout(p, u + 20));
              },
              i ? 25 : 90
            ));
        })();
      },
      Gt = {},
      qt = [],
      Zt = {
        index: 0,
        errorMsg:
          '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
        forceProgressiveLoading: !1,
        preload: [1, 1],
        getNumItemsFn: function () {
          return Ft.length;
        },
      },
      Kt = function (e, t, n) {
        if (e.src && !e.loadError) {
          var i = !n;
          if (
            (i &&
              (e.vGap ||
                (e.vGap = {
                  top: 0,
                  bottom: 0,
                }),
              Pe('parseVerticalMargin', e)),
            (Gt.x = t.x),
            (Gt.y = t.y - e.vGap.top - e.vGap.bottom),
            i)
          ) {
            var o = Gt.x / e.w,
              a = Gt.y / e.h;
            e.fitRatio = o < a ? o : a;
            var r = s.scaleMode;
            'orig' === r ? (n = 1) : 'fit' === r && (n = e.fitRatio),
              n > 1 && (n = 1),
              (e.initialZoomLevel = n),
              e.bounds ||
                (e.bounds = {
                  center: {
                    x: 0,
                    y: 0,
                  },
                  max: {
                    x: 0,
                    y: 0,
                  },
                  min: {
                    x: 0,
                    y: 0,
                  },
                });
          }
          if (!n) return;
          return (
            (function (e, t, n) {
              var i = e.bounds;
              (i.center.x = Math.round((Gt.x - t) / 2)),
                (i.center.y = Math.round((Gt.y - n) / 2) + e.vGap.top),
                (i.max.x = t > Gt.x ? Math.round(Gt.x - t) : i.center.x),
                (i.max.y =
                  n > Gt.y ? Math.round(Gt.y - n) + e.vGap.top : i.center.y),
                (i.min.x = t > Gt.x ? 0 : i.center.x),
                (i.min.y = n > Gt.y ? e.vGap.top : i.center.y);
            })(e, e.w * n, e.h * n),
            i &&
              n === e.initialZoomLevel &&
              (e.initialPosition = e.bounds.center),
            e.bounds
          );
        }
        return (
          (e.w = e.h = 0),
          (e.initialZoomLevel = e.fitRatio = 1),
          (e.bounds = {
            center: {
              x: 0,
              y: 0,
            },
            max: {
              x: 0,
              y: 0,
            },
            min: {
              x: 0,
              y: 0,
            },
          }),
          (e.initialPosition = e.bounds.center),
          e.bounds
        );
      },
      Vt = function (e, t, n, i, o, s) {
        t.loadError ||
          (i &&
            ((t.imageAppended = !0),
            Jt(t, i, t === a.currItem && we),
            n.appendChild(i),
            s &&
              setTimeout(function () {
                t &&
                  t.loaded &&
                  t.placeholder &&
                  ((t.placeholder.style.display = 'none'),
                  (t.placeholder = null));
              }, 500)));
      },
      Yt = function (e) {
        (e.loading = !0), (e.loaded = !1);
        var t = (e.img = o.createEl('pswp__img', 'img')),
          n = function () {
            (e.loading = !1),
              (e.loaded = !0),
              e.loadComplete ? e.loadComplete(e) : (e.img = null),
              (t.onload = t.onerror = null),
              (t = null);
          };
        return (
          (t.onload = n),
          (t.onerror = function () {
            (e.loadError = !0), n();
          }),
          (t.src = e.src),
          t
        );
      },
      Xt = function (e, t) {
        if (e.src && e.loadError && e.container)
          return (
            t && (e.container.innerHTML = ''),
            (e.container.innerHTML = s.errorMsg.replace('%url%', e.src)),
            !0
          );
      },
      Jt = function (e, t, n) {
        if (e.src) {
          t || (t = e.container.lastChild);
          var i = n ? e.w : Math.round(e.w * e.fitRatio),
            o = n ? e.h : Math.round(e.h * e.fitRatio);
          e.placeholder &&
            !e.loaded &&
            ((e.placeholder.style.width = i + 'px'),
            (e.placeholder.style.height = o + 'px')),
            (t.style.width = i + 'px'),
            (t.style.height = o + 'px');
        }
      },
      Qt = function () {
        if (qt.length) {
          for (var e, t = 0; t < qt.length; t++)
            (e = qt[t]).holder.index === e.index &&
              Vt(e.index, e.item, e.baseDiv, e.img, 0, e.clearPlaceholder);
          qt = [];
        }
      };
    be('Controller', {
      publicMethods: {
        lazyLoadItem: function (e) {
          e = xe(e);
          var t = Ht(e);
          t &&
            ((!t.loaded && !t.loading) || w) &&
            (Pe('gettingData', e, t), t.src && Yt(t));
        },
        initController: function () {
          o.extend(s, Zt, !0),
            (a.items = Ft = n),
            (Ht = a.getItemAt),
            (Wt = s.getNumItemsFn),
            (jt = s.loop),
            Wt() < 3 && (s.loop = !1),
            _e('beforeChange', function (e) {
              var t,
                n = s.preload,
                i = null === e || e >= 0,
                o = Math.min(n[0], Wt()),
                r = Math.min(n[1], Wt());
              for (t = 1; t <= (i ? r : o); t++) a.lazyLoadItem(d + t);
              for (t = 1; t <= (i ? o : r); t++) a.lazyLoadItem(d - t);
            }),
            _e('initialLayout', function () {
              a.currItem.initialLayout =
                s.getThumbBoundsFn && s.getThumbBoundsFn(d);
            }),
            _e('mainScrollAnimComplete', Qt),
            _e('initialZoomInEnd', Qt),
            _e('destroy', function () {
              for (var e, t = 0; t < Ft.length; t++)
                (e = Ft[t]).container && (e.container = null),
                  e.placeholder && (e.placeholder = null),
                  e.img && (e.img = null),
                  e.preloader && (e.preloader = null),
                  e.loadError && (e.loaded = e.loadError = !1);
              qt = null;
            });
        },
        getItemAt: function (e) {
          return e >= 0 && void 0 !== Ft[e] && Ft[e];
        },
        allowProgressiveImg: function () {
          return (
            s.forceProgressiveLoading ||
            !A ||
            s.mouseUsed ||
            screen.width > 1200
          );
        },
        setContent: function (e, t) {
          s.loop && (t = xe(t));
          var n = a.getItemAt(e.index);
          n && (n.container = null);
          var i,
            l = a.getItemAt(t);
          if (l) {
            Pe('gettingData', t, l), (e.index = t), (e.item = l);
            var c = (l.container = o.createEl('pswp__zoom-wrap'));
            if (
              (!l.src &&
                l.html &&
                (l.html.tagName
                  ? c.appendChild(l.html)
                  : (c.innerHTML = l.html)),
              Xt(l),
              Kt(l, me),
              !l.src || l.loadError || l.loaded)
            )
              l.src &&
                !l.loadError &&
                ((i = o.createEl('pswp__img', 'img')),
                (i.style.opacity = 1),
                (i.src = l.src),
                Jt(l, i),
                Vt(0, l, c, i));
            else {
              if (
                ((l.loadComplete = function (n) {
                  if (r) {
                    if (e && e.index === t) {
                      if (Xt(n, !0))
                        return (
                          (n.loadComplete = n.img = null),
                          Kt(n, me),
                          Me(n),
                          void (e.index === d && a.updateCurrZoomItem())
                        );
                      n.imageAppended
                        ? !Bt &&
                          n.placeholder &&
                          ((n.placeholder.style.display = 'none'),
                          (n.placeholder = null))
                        : L.transform && (ie || Bt)
                        ? qt.push({
                            item: n,
                            baseDiv: c,
                            img: n.img,
                            index: t,
                            holder: e,
                            clearPlaceholder: !0,
                          })
                        : Vt(0, n, c, n.img, 0, !0);
                    }
                    (n.loadComplete = null),
                      (n.img = null),
                      Pe('imageLoadComplete', t, n);
                  }
                }),
                o.features.transform)
              ) {
                var u = 'pswp__img pswp__img--placeholder';
                u += l.msrc ? '' : ' pswp__img--placeholder--blank';
                var p = o.createEl(u, l.msrc ? 'img' : '');
                l.msrc && (p.src = l.msrc),
                  Jt(l, p),
                  c.appendChild(p),
                  (l.placeholder = p);
              }
              l.loading || Yt(l),
                a.allowProgressiveImg() &&
                  (!Ut && L.transform
                    ? qt.push({
                        item: l,
                        baseDiv: c,
                        img: l.img,
                        index: t,
                        holder: e,
                      })
                    : Vt(0, l, c, l.img, 0, !0));
            }
            Ut || t !== d ? Me(l) : ((ne = c.style), zt(l, i || l.img)),
              (e.el.innerHTML = ''),
              e.el.appendChild(c);
          } else e.el.innerHTML = '';
        },
        cleanSlide: function (e) {
          e.img && (e.img.onload = e.img.onerror = null),
            (e.loaded = e.loading = e.img = e.imageAppended = !1);
        },
      },
    });
    var en,
      tn = {},
      nn = function (e, t, n) {
        var i = document.createEvent('CustomEvent'),
          o = {
            origEvent: e,
            target: e.target,
            releasePoint: t,
            pointerType: n || 'touch',
          };
        i.initCustomEvent('pswpTap', !0, !0, o), e.target.dispatchEvent(i);
      };
    be('Tap', {
      publicMethods: {
        initTap: function () {
          _e('firstTouchStart', a.onTapStart),
            _e('touchRelease', a.onTapRelease),
            _e('destroy', function () {
              (tn = {}), (en = null);
            });
        },
        onTapStart: function (e) {
          e.length > 1 && (clearTimeout(en), (en = null));
        },
        onTapRelease: function (e, t) {
          if (t && !K && !q && !Ze) {
            var n = t;
            if (
              en &&
              (clearTimeout(en),
              (en = null),
              (function (e, t) {
                return Math.abs(e.x - t.x) < 25 && Math.abs(e.y - t.y) < 25;
              })(n, tn))
            )
              return void Pe('doubleTap', n);
            if ('mouse' === t.type) return void nn(e, t, 'mouse');
            if (
              'BUTTON' === e.target.tagName.toUpperCase() ||
              o.hasClass(e.target, 'pswp__single-tap')
            )
              return void nn(e, t);
            Ne(tn, n),
              (en = setTimeout(function () {
                nn(e, t), (en = null);
              }, 300));
          }
        },
      },
    });
    var on;
    be('DesktopZoom', {
      publicMethods: {
        initDesktopZoom: function () {
          N ||
            (A
              ? _e('mouseUsed', function () {
                  a.setupDesktopZoom();
                })
              : a.setupDesktopZoom(!0));
        },
        setupDesktopZoom: function (t) {
          on = {};
          var n = 'wheel mousewheel DOMMouseScroll';
          _e('bindEvents', function () {
            o.bind(e, n, a.handleMouseWheel);
          }),
            _e('unbindEvents', function () {
              on && o.unbind(e, n, a.handleMouseWheel);
            }),
            (a.mouseZoomedIn = !1);
          var i,
            s = function () {
              a.mouseZoomedIn &&
                (o.removeClass(e, 'pswp--zoomed-in'), (a.mouseZoomedIn = !1)),
                g < 1
                  ? o.addClass(e, 'pswp--zoom-allowed')
                  : o.removeClass(e, 'pswp--zoom-allowed'),
                r();
            },
            r = function () {
              i && (o.removeClass(e, 'pswp--dragging'), (i = !1));
            };
          _e('resize', s),
            _e('afterChange', s),
            _e('pointerDown', function () {
              a.mouseZoomedIn && ((i = !0), o.addClass(e, 'pswp--dragging'));
            }),
            _e('pointerUp', r),
            t || s();
        },
        handleMouseWheel: function (e) {
          if (g <= a.currItem.fitRatio)
            return (
              s.modal &&
                (!s.closeOnScroll || Ze || G
                  ? e.preventDefault()
                  : I && Math.abs(e.deltaY) > 2 && ((c = !0), a.close())),
              !0
            );
          if ((e.stopPropagation(), (on.x = 0), 'deltaX' in e))
            1 === e.deltaMode
              ? ((on.x = 18 * e.deltaX), (on.y = 18 * e.deltaY))
              : ((on.x = e.deltaX), (on.y = e.deltaY));
          else if ('wheelDelta' in e)
            e.wheelDeltaX && (on.x = -0.16 * e.wheelDeltaX),
              e.wheelDeltaY
                ? (on.y = -0.16 * e.wheelDeltaY)
                : (on.y = -0.16 * e.wheelDelta);
          else {
            if (!('detail' in e)) return;
            on.y = e.detail;
          }
          Ue(g, !0);
          var t = pe.x - on.x,
            n = pe.y - on.y;
          (s.modal ||
            (t <= te.min.x &&
              t >= te.max.x &&
              n <= te.min.y &&
              n >= te.max.y)) &&
            e.preventDefault(),
            a.panTo(t, n);
        },
        toggleDesktopZoom: function (t) {
          t = t || {
            x: me.x / 2 + he.x,
            y: me.y / 2 + he.y,
          };
          var n = s.getDoubleTapZoom(!0, a.currItem),
            i = g === n;
          (a.mouseZoomedIn = !i),
            a.zoomTo(i ? a.currItem.initialZoomLevel : n, t, 333),
            o[(i ? 'remove' : 'add') + 'Class'](e, 'pswp--zoomed-in');
        },
      },
    });
    var an,
      sn,
      rn,
      ln,
      cn,
      dn,
      un,
      pn,
      mn,
      fn,
      hn,
      gn,
      vn = {
        history: !0,
        galleryUID: 1,
      },
      Tn = function () {
        return hn.hash.substring(1);
      },
      yn = function () {
        an && clearTimeout(an), rn && clearTimeout(rn);
      },
      Sn = function () {
        var e = Tn(),
          t = {};
        if (e.length < 5) return t;
        var n,
          i = e.split('&');
        for (n = 0; n < i.length; n++)
          if (i[n]) {
            var o = i[n].split('=');
            o.length < 2 || (t[o[0]] = o[1]);
          }
        if (s.galleryPIDs) {
          var a = t.pid;
          for (t.pid = 0, n = 0; n < Ft.length; n++)
            if (Ft[n].pid === a) {
              t.pid = n;
              break;
            }
        } else t.pid = parseInt(t.pid, 10) - 1;
        return t.pid < 0 && (t.pid = 0), t;
      },
      wn = function () {
        if ((rn && clearTimeout(rn), Ze || G)) rn = setTimeout(wn, 500);
        else {
          ln ? clearTimeout(sn) : (ln = !0);
          var e = d + 1,
            t = Ht(d);
          t.hasOwnProperty('pid') && (e = t.pid);
          var n = un + '&gid=' + s.galleryUID + '&pid=' + e;
          pn || (-1 === hn.hash.indexOf(n) && (fn = !0));
          var i = hn.href.split('#')[0] + '#' + n;
          gn
            ? '#' + n !== window.location.hash &&
              history[pn ? 'replaceState' : 'pushState']('', document.title, i)
            : pn
            ? hn.replace(i)
            : (hn.hash = n),
            (pn = !0),
            (sn = setTimeout(function () {
              ln = !1;
            }, 60));
        }
      };
    be('History', {
      publicMethods: {
        initHistory: function () {
          if ((o.extend(s, vn, !0), s.history)) {
            (hn = window.location),
              (fn = !1),
              (mn = !1),
              (pn = !1),
              (un = Tn()),
              (gn = 'pushState' in history),
              un.indexOf('gid=') > -1 &&
                ((un = un.split('&gid=')[0]), (un = un.split('?gid=')[0])),
              _e('afterChange', a.updateURL),
              _e('unbindEvents', function () {
                o.unbind(window, 'hashchange', a.onHashChange);
              });
            var e = function () {
              (dn = !0),
                mn ||
                  (fn
                    ? history.back()
                    : un
                    ? (hn.hash = un)
                    : gn
                    ? history.pushState(
                        '',
                        document.title,
                        hn.pathname + hn.search
                      )
                    : (hn.hash = '')),
                yn();
            };
            _e('unbindEvents', function () {
              c && (window.jQuery || window.$)();
            }),
              _e('destroy', function () {
                dn || (window.jQuery || window.$)();
              }),
              _e('firstUpdate', function () {
                d = Sn().pid;
              });
            var t = un.indexOf('pid=');
            t > -1 &&
              '&' === (un = un.substring(0, t)).slice(-1) &&
              (un = un.slice(0, -1)),
              setTimeout(function () {
                r && o.bind(window, 'hashchange', a.onHashChange);
              }, 40);
          }
        },
        onHashChange: function () {
          return Tn() === un
            ? ((mn = !0), void a.close())
            : void (ln || ((cn = !0), a.goTo(Sn().pid), (cn = !1)));
        },
        updateURL: function () {
          yn(), cn || (pn ? (an = setTimeout(wn, 800)) : wn());
        },
      },
    }),
      o.extend(a, Je);
  };
});
!(function (e, t) {
  'function' == typeof define && define.amd
    ? define(t)
    : 'object' == typeof exports
    ? (module.exports = t())
    : (e.PhotoSwipeUI_Default = t());
})(window, function () {
  'use strict';
  return function (e, t) {
    var n,
      i,
      o,
      a,
      s,
      r,
      l,
      c,
      d,
      u,
      p,
      m,
      f,
      h,
      g,
      v,
      T,
      y,
      S,
      w = this,
      b = !1,
      x = !0,
      C = !0,
      _ = {
        barsSize: {
          top: 44,
          bottom: 'auto',
        },
        closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
        timeToIdle: 4e3,
        timeToIdleOutside: 1e3,
        loadingIndicatorDelay: 1e3,
        addCaptionHTMLFn: function (e, t) {
          return e.title
            ? ((t.children[0].innerHTML = e.title), !0)
            : ((t.children[0].innerHTML = ''), !1);
        },
        closeEl: !0,
        captionEl: !0,
        fullscreenEl: !0,
        zoomEl: !0,
        shareEl: !0,
        counterEl: !0,
        arrowEl: !0,
        preloaderEl: !0,
        tapToClose: !1,
        tapToToggleControls: !0,
        clickToCloseNonZoomable: !0,
        shareButtons: [
          {
            id: 'facebook',
            label: 'Share on Facebook',
            url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}',
          },
          {
            id: 'twitter',
            label: 'Tweet',
            url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}',
          },
          {
            id: 'pinterest',
            label: 'Pin it',
            url: 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}',
          },
          {
            id: 'download',
            label: 'Download image',
            url: '{{raw_image_url}}',
            download: !0,
          },
        ],
        getImageURLForShare: function () {
          return e.currItem.src || '';
        },
        getPageURLForShare: function () {
          return window.location.href;
        },
        getTextForShare: function () {
          return e.currItem.title || '';
        },
        indexIndicatorSep: ' / ',
        fitControlsWidth: 1200,
      },
      P = function (e) {
        if (v) return !0;
        (e = e || window.event),
          g.timeToIdle && g.mouseUsed && !d && (window.jQuery || window.$)();
        for (
          var n,
            i,
            o = (e.target || e.srcElement).getAttribute('class') || '',
            a = 0;
          a < B.length;
          a++
        )
          (n = B[a]).onTap &&
            o.indexOf('pswp__' + n.name) > -1 &&
            (n.onTap(), (i = !0));
        if (i) {
          e.stopPropagation && e.stopPropagation(), (v = !0);
          var s = t.features.isOldAndroid ? 600 : 30;
          T = setTimeout(function () {
            v = !1;
          }, s);
        }
      },
      k = function () {
        return (
          !e.likelyTouchDevice ||
          g.mouseUsed ||
          screen.width > g.fitControlsWidth
        );
      },
      I = function (e, n, i) {
        t[(i ? 'add' : 'remove') + 'Class'](e, 'pswp__' + n);
      },
      D = function () {
        var e = 1 === g.getNumItemsFn();
        e !== h && (I(i, 'ui--one-slide', e), (h = e));
      },
      A = function () {
        I(l, 'share-modal--hidden', C);
      },
      M = function () {
        return (
          (C = !C)
            ? (t.removeClass(l, 'pswp__share-modal--fade-in'),
              setTimeout(function () {
                C && A();
              }, 300))
            : (A(),
              setTimeout(function () {
                C || t.addClass(l, 'pswp__share-modal--fade-in');
              }, 30)),
          C || R(),
          !1
        );
      },
      E = function (t) {
        var n = (t = t || window.event).target || t.srcElement;
        return (
          e.shout('shareLinkClick', t, n),
          !(
            !n.href ||
            (!n.hasAttribute('download') &&
              (window.open(
                n.href,
                'pswp_share',
                'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=' +
                  (window.screen ? Math.round(screen.width / 2 - 275) : 100)
              ),
              C || M(),
              1))
          )
        );
      },
      R = function () {
        for (var e, t, n, i, o, a = '', s = 0; s < g.shareButtons.length; s++)
          (e = g.shareButtons[s]),
            (n = g.getImageURLForShare(e)),
            (i = g.getPageURLForShare(e)),
            (o = g.getTextForShare(e)),
            (t = e.url
              .replace('{{url}}', encodeURIComponent(i))
              .replace('{{image_url}}', encodeURIComponent(n))
              .replace('{{raw_image_url}}', n)
              .replace('{{text}}', encodeURIComponent(o))),
            (a +=
              '<a href="' +
              t +
              '" target="_blank" class="pswp__share--' +
              e.id +
              '"' +
              (e.download ? 'download' : '') +
              '>' +
              e.label +
              '</a>'),
            g.parseShareButtonOut && (a = g.parseShareButtonOut(e, a));
        (l.children[0].innerHTML = a), (l.children[0].onclick = E);
      },
      O = function (e) {
        for (var n = 0; n < g.closeElClasses.length; n++)
          if (t.hasClass(e, 'pswp__' + g.closeElClasses[n])) return !0;
      },
      N = 0,
      $ = function () {
        clearTimeout(S), (N = 0), d && w.setIdle(!1);
      },
      L = function (e) {
        var t = (e = e || window.event).relatedTarget || e.toElement;
        (t && 'HTML' !== t.nodeName) ||
          (clearTimeout(S),
          (S = setTimeout(function () {
            w.setIdle(!0);
          }, g.timeToIdleOutside)));
      },
      F = function (e) {
        m !== e && (I(p, 'preloader--active', !e), (m = e));
      },
      U = function (e) {
        var n = e.vGap;
        if (k()) {
          var s = g.barsSize;
          if (g.captionEl && 'auto' === s.bottom)
            if (
              (a ||
                ((a = t.createEl(
                  'pswp__caption pswp__caption--fake'
                )).appendChild(t.createEl('pswp__caption__center')),
                i.insertBefore(a, o),
                t.addClass(i, 'pswp__ui--fit')),
              g.addCaptionHTMLFn(e, a, !0))
            ) {
              var r = a.clientHeight;
              n.bottom = parseInt(r, 10) || 44;
            } else n.bottom = s.top;
          else n.bottom = 'auto' === s.bottom ? 0 : s.bottom;
          n.top = s.top;
        } else n.top = n.bottom = 0;
      },
      B = [
        {
          name: 'caption',
          option: 'captionEl',
          onInit: function (e) {
            o = e;
          },
        },
        {
          name: 'share-modal',
          option: 'shareEl',
          onInit: function (e) {
            l = e;
          },
          onTap: function () {
            M();
          },
        },
        {
          name: 'button--share',
          option: 'shareEl',
          onInit: function (e) {
            r = e;
          },
          onTap: function () {
            M();
          },
        },
        {
          name: 'button--zoom',
          option: 'zoomEl',
          onTap: e.toggleDesktopZoom,
        },
        {
          name: 'counter',
          option: 'counterEl',
          onInit: function (e) {
            s = e;
          },
        },
        {
          name: 'button--close',
          option: 'closeEl',
          onTap: e.close,
        },
        {
          name: 'button--arrow--left',
          option: 'arrowEl',
          onTap: e.prev,
        },
        {
          name: 'button--arrow--right',
          option: 'arrowEl',
          onTap: e.next,
        },
        {
          name: 'button--fs',
          option: 'fullscreenEl',
          onTap: function () {
            n.isFullscreen() ? n.exit() : n.enter();
          },
        },
        {
          name: 'preloader',
          option: 'preloaderEl',
          onInit: function (e) {
            p = e;
          },
        },
      ];
    (w.init = function () {
      t.extend(e.options, _, !0),
        (g = e.options),
        (i = t.getChildByClass(e.scrollWrap, 'pswp__ui')),
        (u = e.listen),
        (function () {
          u('onVerticalDrag', function (e) {
            x && e < 0.95
              ? w.hideControls()
              : !x && e >= 0.95 && w.showControls();
          });
          var e;
          u('onPinchClose', function (t) {
            x && t < 0.9
              ? (w.hideControls(), (e = !0))
              : e && !x && t > 0.9 && w.showControls();
          }),
            u('zoomGestureEnded', function () {
              (e = !1) && !x && w.showControls();
            });
        })(),
        u('beforeChange', w.update),
        u('doubleTap', function (t) {
          var n = e.currItem.initialZoomLevel;
          e.getZoomLevel() !== n
            ? e.zoomTo(n, t, 333)
            : e.zoomTo(g.getDoubleTapZoom(!1, e.currItem), t, 333);
        }),
        u('preventDragEvent', function (e, t, n) {
          var i = e.target || e.srcElement;
          i &&
            i.getAttribute('class') &&
            e.type.indexOf('mouse') > -1 &&
            (i.getAttribute('class').indexOf('__caption') > 0 ||
              /(SMALL|STRONG|EM)/i.test(i.tagName)) &&
            (n.prevent = !1);
        }),
        u('bindEvents', function () {
          t.bind(i, 'pswpTap click', P),
            t.bind(e.scrollWrap, 'pswpTap', w.onGlobalTap),
            e.likelyTouchDevice ||
              t.bind(e.scrollWrap, 'mouseover', w.onMouseOver);
        }),
        u('unbindEvents', function () {
          C || M(),
            y && clearInterval(y),
            t.unbind(document, 'mouseout', L),
            t.unbind(document, 'mousemove', $),
            t.unbind(i, 'pswpTap click', P),
            t.unbind(e.scrollWrap, 'pswpTap', w.onGlobalTap),
            t.unbind(e.scrollWrap, 'mouseover', w.onMouseOver),
            n &&
              (t.unbind(document, n.eventK, w.updateFullscreen),
              n.isFullscreen() && ((g.hideAnimationDuration = 0), n.exit()),
              (n = null));
        }),
        u('destroy', function () {
          g.captionEl &&
            (a && i.removeChild(a), t.removeClass(o, 'pswp__caption--empty')),
            l && (l.children[0].onclick = null),
            t.removeClass(i, 'pswp__ui--over-close'),
            t.addClass(i, 'pswp__ui--hidden'),
            w.setIdle(!1);
        }),
        g.showAnimationDuration || t.removeClass(i, 'pswp__ui--hidden'),
        u('initialZoomIn', function () {
          g.showAnimationDuration && t.removeClass(i, 'pswp__ui--hidden');
        }),
        u('initialZoomOut', function () {
          t.addClass(i, 'pswp__ui--hidden');
        }),
        u('parseVerticalMargin', U),
        (function () {
          var e,
            n,
            o,
            a = function (i) {
              if (i)
                for (var a = i.length, s = 0; s < a; s++) {
                  (e = i[s]), (n = e.className);
                  for (var r = 0; r < B.length; r++)
                    (o = B[r]),
                      n.indexOf('pswp__' + o.name) > -1 &&
                        (g[o.option]
                          ? (t.removeClass(e, 'pswp__element--disabled'),
                            o.onInit && o.onInit(e))
                          : t.addClass(e, 'pswp__element--disabled'));
                }
            };
          a(i.children);
          var s = t.getChildByClass(i, 'pswp__top-bar');
          s && a(s.children);
        })(),
        g.shareEl && r && l && (C = !0),
        D(),
        g.timeToIdle &&
          u('mouseUsed', function () {
            t.bind(document, 'mousemove', $),
              t.bind(document, 'mouseout', L),
              (y = setInterval(function () {
                2 == ++N && w.setIdle(!0);
              }, g.timeToIdle / 2));
          }),
        g.fullscreenEl &&
          !t.features.isOldAndroid &&
          (n || (n = w.getFullscreenAPI()),
          n
            ? (t.bind(document, n.eventK, w.updateFullscreen),
              w.updateFullscreen(),
              t.addClass(e.template, 'pswp--supports-fs'))
            : t.removeClass(e.template, 'pswp--supports-fs')),
        g.preloaderEl &&
          (F(!0),
          u('beforeChange', function () {
            clearTimeout(f),
              (f = setTimeout(function () {
                e.currItem && e.currItem.loading
                  ? (!e.allowProgressiveImg() ||
                      (e.currItem.img && !e.currItem.img.naturalWidth)) &&
                    F(!1)
                  : F(!0);
              }, g.loadingIndicatorDelay));
          }),
          u('imageLoadComplete', function (t, n) {
            e.currItem === n && F(!0);
          }));
    }),
      (w.setIdle = function (e) {
        (d = e), I(i, 'ui--idle', e);
      }),
      (w.update = function () {
        x && e.currItem
          ? (w.updateIndexIndicator(),
            g.captionEl &&
              (g.addCaptionHTMLFn(e.currItem, o),
              I(o, 'caption--empty', !e.currItem.title)),
            (b = !0))
          : (b = !1),
          C || M(),
          D();
      }),
      (w.updateFullscreen = function (i) {
        i &&
          setTimeout(function () {
            e.setScrollOffset(0, t.getScrollY());
          }, 50),
          t[(n.isFullscreen() ? 'add' : 'remove') + 'Class'](
            e.template,
            'pswp--fs'
          );
      }),
      (w.updateIndexIndicator = function () {
        g.counterEl &&
          (s.innerHTML =
            e.getCurrentIndex() + 1 + g.indexIndicatorSep + g.getNumItemsFn());
      }),
      (w.onGlobalTap = function (n) {
        var i = (n = n || window.event).target || n.srcElement;
        if (!v)
          if (n.detail && 'mouse' === n.detail.pointerType) {
            if (O(i)) return void e.close();
            t.hasClass(i, 'pswp__img') &&
              (1 === e.getZoomLevel() && e.getZoomLevel() <= e.currItem.fitRatio
                ? g.clickToCloseNonZoomable && e.close()
                : e.toggleDesktopZoom(n.detail.releasePoint));
          } else if (
            (g.tapToToggleControls && (x ? w.hideControls() : w.showControls()),
            g.tapToClose && (t.hasClass(i, 'pswp__img') || O(i)))
          )
            return void e.close();
      }),
      (w.onMouseOver = function (e) {
        var t = (e = e || window.event).target || e.srcElement;
        I(i, 'ui--over-close', O(t));
      }),
      (w.hideControls = function () {
        t.addClass(i, 'pswp__ui--hidden'), (x = !1);
      }),
      (w.showControls = function () {
        (x = !0), b || w.update(), t.removeClass(i, 'pswp__ui--hidden');
      }),
      (w.supportsFullscreen = function () {
        var e = document;
        return !!(
          e.exitFullscreen ||
          e.mozCancelFullScreen ||
          e.webkitExitFullscreen ||
          e.msExitFullscreen
        );
      }),
      (w.getFullscreenAPI = function () {
        var t,
          n = document.documentElement,
          i = 'fullscreenchange';
        return (
          n.requestFullscreen
            ? (t = {
                enterK: 'requestFullscreen',
                exitK: 'exitFullscreen',
                elementK: 'fullscreenElement',
                eventK: i,
              })
            : n.mozRequestFullScreen
            ? (t = {
                enterK: 'mozRequestFullScreen',
                exitK: 'mozCancelFullScreen',
                elementK: 'mozFullScreenElement',
                eventK: 'moz' + i,
              })
            : n.webkitRequestFullscreen
            ? (t = {
                enterK: 'webkitRequestFullscreen',
                exitK: 'webkitExitFullscreen',
                elementK: 'webkitFullscreenElement',
                eventK: 'webkit' + i,
              })
            : n.msRequestFullscreen &&
              (t = {
                enterK: 'msRequestFullscreen',
                exitK: 'msExitFullscreen',
                elementK: 'msFullscreenElement',
                eventK: 'MSFullscreenChange',
              }),
          t &&
            ((t.enter = function () {
              return (
                (c = g.closeOnScroll),
                (g.closeOnScroll = !1),
                'webkitRequestFullscreen' !== this.enterK
                  ? e.template[this.enterK]()
                  : void e.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
              );
            }),
            (t.exit = function () {
              return (g.closeOnScroll = c), document[this.exitK]();
            }),
            (t.isFullscreen = function () {
              return document[this.elementK];
            })),
          t
        );
      });
  };
});

function parseJSON(e, t) {
  return JSON.parse(e || t || '{}');
}

var $window = window.jQuery(window);
var $document = window.jQuery(document);
var viewportWidth = $window.width();
var $html = window.jQuery('html');
var $body = window.jQuery('body');
var isMobileViewport = viewportWidth < 768;
var themeStrings = window.T4Sstrings;
var closeOverlayButton = window.jQuery('.close-overlay');
var lockScrollClass = 'lock-scroll';
var scrollableElementsSelector = '[data-ts-scroll-me]';
var pageType = window.T4Srequest.page_type;
var searchUrl = window.T4Sroutes.search_url;
var cart_url = window.T4SThemeSP.cart_url;
var platformEmail = window.T4Sconfigs.platform_email;
var isConfettiEnabled = window.T4Sconfigs.enableConfetti;
var cacheNameFirst = window.T4SThemeSP.cacheNameFirst;
var ajaxCartChangeEvent = 'change:ajaxCart';
var tooltipPositions =
  'top-start, top, top-end, left-start, left, left-end, right-start, right, right-end, bottom-start, bottom, bottom-end'.split(
    ', '
  );
var rtlDirectionMap = {
  left: 'right',
  'left-start': 'right-start',
  'left-end': 'right-end',
  right: 'left',
  'right-start': 'left-start',
  'right-end': 'left-end',
};
var getAdjustedPosition = function (e) {
  return isThemeRTL ? rtlDirectionMap[e] || e : e;
};
window.T4SThemeSP.Tooltip = () => {
  function showTooltip(triggerElement, tooltipId, tooltipContent) {
    var tooltipElement = (window.jQuery || window.$)(triggerElement),
      uniqueTooltipId = (function (prefix) {
        do {
          prefix += ~~(1e6 * Math.random());
        } while (document.getElementById(prefix));
        return prefix;
      })('tooltip');

    tooltipElement.attr('aria-describedby', uniqueTooltipId);

    function appendTooltip(content, id) {
      window.T4SThemeSP.$appendComponent.after(
        i.replace('nt_txt_tt', content).replace('id_nt_tt', id)
      );
    }

    appendTooltip(tooltipContent, uniqueTooltipId);

    var tooltipContainer = (window.jQuery || window.$)('#' + uniqueTooltipId);

    function positionTooltip(triggerEl, tooltipEl, arrowEl, position) {
      fastdomT4s.mutate(function () {
        FloatingUIT4sDOM.computePosition(triggerEl, tooltipEl, {
          placement: position,
          middleware: [
            FloatingUIT4sDOM.offset(6),
            FloatingUIT4sDOM.flip({ fallbackPlacements: ['top', 'bottom'] }),
            FloatingUIT4sDOM.shift({ padding: 5 }),
            FloatingUIT4sDOM.arrow({ element: arrowEl }),
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          Object.assign(tooltipEl.style, {
            top: '0',
            left: '0',
            transform: `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`,
          });

          const { x: arrowX, y: arrowY } = middlewareData.arrow,
            placementDirection = {
              top: 'bottom',
              right: 'left',
              bottom: 'top',
              left: 'right',
            }[placement.split('-')[0]];

          Object.assign(arrowEl.style, {
            left: arrowX !== null ? `${arrowX}px` : '',
            top: arrowY !== null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [placementDirection]: '-4px',
          });
        });
      });
    }

    positionTooltip(
      triggerElement,
      tooltipContainer[0],
      tooltipContainer.find('.tt-arrow')[0],
      tooltipId
    );
    tooltipContainer.addClass(tooltipVisibleClass);
  }

  function hideTooltip(triggerElement) {
    var tooltipContainer = (window.jQuery || window.$)(
      '#' + (window.jQuery || window.$)(triggerElement).attr('aria-describedby')
    );
    tooltipContainer.removeClass(tooltipVisibleClass);
    tooltipContainer.remove();
  }

  var i =
      '<div class="tooltip" id="id_nt_tt" role="tooltip"><div class="tt-arrow"></div><div class="tooltip-inner">nt_txt_tt</div></div>',
    tooltipVisibleClass = 'is--show',
    extractTooltipContent = function (element) {
      var content = element.find('.text-pr').text() || element.text();
      if (
        element.attr('title') &&
        typeof element.attr('data-original-title') !== 'string'
      ) {
        content = element.attr('title');
        element
          .attr('data-original-title', element.attr('title') || '')
          .attr('title', '');
      }
      if (element.attr('data-ts-tooltip')) {
        content = element.attr('data-ts-tooltip');
      } else if (element.attr('data-original-title')) {
        content = element.attr('data-original-title');
      }
      return content;
    };

  $body.on('ts:hideTooltip', function () {
    (window.jQuery || window.$)('.tooltip.is--show').remove();
  });

  if (!T4SThemeSP.isTouch) {
    const tooltipElements = (window.jQuery || window.$)(
      '[data-tooltip]:not(.tooltip-actived)'
    );
    if (tooltipElements.length !== 0) {
      tooltipElements
        .hoverIntent({
          instance: tooltipElements,
          sensitivity: 6,
          interval: 80,
          timeout: 100,
          over: (event) => {
            let element = (window.jQuery || window.$)(event.currentTarget),
              tooltipData = element.attr('data-tooltip') || 'nt94';
            if (T.indexOf(tooltipData) < 0) return;

            showTooltip(
              event.currentTarget,
              S(tooltipData),
              extractTooltipContent(element)
            );

            element.on('updateTooltip', (event) => {
              hideTooltip(event.currentTarget);
              showTooltip(
                event.currentTarget,
                S(tooltipData),
                extractTooltipContent(element)
              );
            });

            element.on('destroyTooltip', () => {
              hideTooltip(event.currentTarget);
            });
          },
          out: (event) => {
            var tooltipData =
              (window.jQuery || window.$)(event.currentTarget).attr(
                'data-tooltip'
              ) || 'nt94';
            if (T.indexOf(tooltipData) < 0) return;

            hideTooltip(event.currentTarget);
            (window.jQuery || window.$)(event.currentTarget)
              .off('updateTooltip')
              .off('destroyTooltip');
          },
        })
        .addClass('tooltip-actived');
    }
  }
};

// LookBook function
window.T4SThemeSP.LookBook = () => {
  const stateClasses = {
    loading: 'is--loading',
    loaded: 'is--loaded',
    clicked: 'is--clicked',
    selected: 'is--selected',
    opened: 'is--opened',
    preload: 'is--preLoaded',
    visible: 'is--visible is--pindop',
  };

  let sectionData = []; // Stores preloaded popup content
  let isPopupCached = false; // Cache control

  function loadPopupContent(element, sectionId, triggerAnimation = false) {
    // If the popup content is already loaded
    if (element.hasClass(stateClasses.loaded)) {
      if (triggerAnimation) openDropdown(element, sectionId);
    } else {
      // Fetches and inserts popup content dynamically if not preloaded
      const sectionKey = sectionData[sectionId + element.data('sid')];
      if (!element.is('[data-is-pr]')) {
        element.addClass(stateClasses.loaded);
        const templateHtml = window.$('#tem' + sectionId).html();
        window.T4SThemeSP.$appendComponent.after(
          templateHtml.replace('id=""', 'id="' + sectionId + '"')
        );
        if (triggerAnimation) openDropdown(element, sectionId);
        return;
      }

      if (sectionKey) {
        window.T4SThemeSP.$appendComponent.after(sectionKey);
        element.addClass(stateClasses.loaded);
        window.T4SThemeSP.ProductItem.init();
        window.T4SThemeSP.Tooltip();
        if (triggerAnimation) openDropdown(element, sectionId);
      } else {
        element.addClass(stateClasses.loading);
        fetch(element.data('href') + '/?section_id=' + sectionId)
          .then((response) => response.text())
          .then((content) => {
            content = content.split('[splitlz]')[1].replace('id_nt', sectionId);
            window.T4SThemeSP.$appendComponent.after(content);
            element
              .removeClass(stateClasses.loading)
              .addClass(stateClasses.loaded);
            window.T4SThemeSP.ProductItem.init();
            window.T4SThemeSP.Tooltip();
            if (triggerAnimation) openDropdown(element, sectionId);
            isPopupCached &&
              (sectionData[sectionId + element.data('sid')] = content);
          })
          .catch((error) => {
            element.removeClass(stateClasses.loading);
            console.log(error);
          });
      }
    }
  }

  function closeDropdown() {
    // Closes active popups and removes event listeners
    if (isMobileViewport) {
      $body.removeClass(lockScrollClass);
      window.T4SThemeSP.Helpers.disableBodyScroll(
        false,
        scrollableElementsSelector
      );
    }
    window
      .$(`[data-pin-close],[data-pin-popup].${stateClasses.clicked}`)
      .off('click.closePopup');
    $document.off('click.closePopup').off('keyup.closePopup');
    window
      .$(`[data-pin-wrapper].${stateClasses.opened}`)
      .removeClass(stateClasses.opened);
    window
      .$(`[data-pin-popup].${stateClasses.clicked}`)
      .removeClass(stateClasses.clicked);
    $body.hasClass('is--opend-drawer')
      ? closeOverlayButton.removeClass('is--pindop')
      : closeOverlayButton.removeClass(stateClasses.visible);
  }

  function closeLayout() {
    // Closes active popups and removes event listeners
    $body.removeClass(lockScrollClass);
    window.T4SThemeSP.Helpers.disableBodyScroll(
      false,
      scrollableElementsSelector
    );
    window
      .$(`[data-dropdown-close],[data-dropdown-open].${stateClasses.clicked}`)
      .off('click.closeDrop');
    $document.off('click.closeDrop').off('keyup.closeDrop');
    window
      .$(`[data-dropdown-wrapper].${stateClasses.opened}`)
      .removeClass(stateClasses.opened);
    window
      .$(`[data-dropdown-open].${stateClasses.clicked}`)
      .removeClass(stateClasses.clicked);
    $body.hasClass('is--opend-drawer')
      ? closeOverlayButton.removeClass('is--pindop')
      : closeOverlayButton.removeClass(stateClasses.visible);
  }

  function openDropdown(element, popupId, layoutType = 'lb') {
    // Opens a popup and positions it on screen

    if (isMobileViewport) {
      $body.addClass(lockScrollClass);
      window.T4SThemeSP.Helpers.disableBodyScroll(
        true,
        scrollableElementsSelector
      );
    }
    const popupElement = window.$(`#${popupId}`);
    popupElement.addClass(stateClasses.opened);
    popupElement.hasClass('is-style-mb--false') ||
      closeOverlayButton.addClass(stateClasses.visible);

    const popup = window.$(`#${popupId}`);
    const popupArrow = popup.find(`.${layoutType}-arrow`);
    const position = element.data('position') || 'top';

    if ($document.width() > 767 || popup.hasClass('is-style-mb--false')) {
      fastdom.mutate(() => {
        FloatingUIT4sDOM.computePosition(element[0], popup[0], {
          placement: getAdjustedPosition(position),
          middleware: [
            FloatingUIT4sDOM.offset(12),
            FloatingUIT4sDOM.flip({ fallbackPlacements: ['top', 'bottom'] }),
            FloatingUIT4sDOM.shift({ padding: 0 }),
            FloatingUIT4sDOM.arrow({ element: popupArrow[0] }),
          ],
        }).then(({ x, y, placement, middlewareData: arrowData }) => {
          Object.assign(popup[0].style, {
            top: '0',
            left: '0',
            transform: `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`,
          });
          const { x: arrowX, y: arrowY } = arrowData.arrow;
          const oppositePlacement = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
          }[placement.split('-')[0]];
          Object.assign(popupArrow[0].style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            [oppositePlacement]: '-6px',
          });
        });
      });
    }

    if (layoutType == 'lb') {
      $document.on('click.closelb', (event) => {
        const target = window.$(event.target);
        if (
          target.closest('[data-pin-wrapper]').length > 0 ||
          target.is('[data-pin-popup]')
        ) {
          closeLayout();
        }
      });
      window
        .$(
          `#${popupId} [data-pin-close], [data-pin-popup].${stateClasses.clicked}`
        )
        .on('click.closelb', function (event) {
          event.preventDefault(), event.stopPropagation(), closeLayout();
        });
      $document.on('keyup.closelb', function (event) {
        if (27 === event.keyCode) {
          closeLayout();
        }
      });
    } else {
      // Event listeners to close popup
      $document.on('click.closeDrop', (event) => {
        const target = window.$(event.target);
        if (
          target.closest('[data-pin-wrapper]').length > 0 ||
          target.is('[data-dropdown-open]') ||
          target.closest('[data-dropdown-open]').length > 0
        ) {
          closeLayout();
        }
      });
    }

    window
      .$(
        `#${popupId} [data-pin-close], [data-dropdown-open].${stateClasses.clicked}`
      )
      .on('click.closeDrop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeLayout();
      });

    $document.on('keyup.closePopup', (event) => {
      if (event.keyCode === 27) closeLayout(); // Close on "Escape" key
    });
  }

  function loadHoverEvents() {
    // Add a hover event for elements with data attributes that trigger popups
    $document.on(
      'click',
      `[data-pin-popup]:not(.${stateClasses.clicked})`,
      (event) => {
        event.preventDefault();
        const element = window.$(event.currentTarget);
        const sectionId = element.data('bid');

        closeDropdown();

        // Add a clicked class to show that the content is being prepared
        element.addClass(stateClasses.clicked);

        // Load popup content without opening it immediately
        loadPopupContent(element, sectionId, true);
      }
    );

    window
      .$(
        `[data-pin-popup][data-is-pr]:not(.${stateClasses.clicked}):not(.${stateClasses.opened})`
      )
      .on('mouseenter.pin', (event) => {
        const element = window.$(event.currentTarget);
        const sectionId = element.data('bid');
        element.addClass(stateClasses.preload);
        loadPopupContent(element, sectionId);
        element.off('touchstart.pin mouseenter.pin');
      });
  }

  function setupDropdownItemSelection(id) {
    window.$(`#${id}`).on('click.dopText', '[data-dropdown-item]', (event) => {
      event.preventDefault();
      const element = window.$(event.currentTarget);
      element
        .parents()
        .find(`.${stateClasses.selected}`)
        .removeClass(stateClasses.selected);
      element.addClass(stateClasses.selected);
      window
        .$(
          `[data-dropdown-open][data-id="${id}"]>span:not([data-not-change-txt])`
        )
        .text(element.text());
      window.$(`#${id}`).off('click.dopText');
      element.trigger('change:drop', [element, element.data('value')]);
      closeLayout();
    });
  }
  function loadDropdownEvents() {
    // Open dropdown on click
    $document.on(
      'click',
      `[data-dropdown-open]:not(.${stateClasses.clicked})`,
      (event) => {
        event.preventDefault();

        const dropdownTrigger = $(event.currentTarget);
        const dropdownId = dropdownTrigger.data('id');

        // Close any other open dropdowns
        closeLayout();

        // Mark the current dropdown as clicked
        dropdownTrigger.addClass(stateClasses.clicked);

        // Open and position the dropdown
        openDropdown(dropdownTrigger, dropdownId, 'drop');

        // Setup item selection within the dropdown
        setupDropdownItemSelection(dropdownId);
      }
    );

    // Close dropdown on outside click or escape key
    $document.on('click', '[data-dropdown-off]', (event) => {
      const element = window.$(event.currentTarget);
      window
        .$(event.currentTarget)
        .closest('[data-dropdown-wrapper]')
        .find('[data-dropdown-open]>span')
        .text(element.text());
      closeLayout();
    });

    // Custom event listener for programmatically closing the dropdown
    $document.on('dropdown:ts:close', function () {
      closeLayout();
    });
  }

  loadHoverEvents();
  loadDropdownEvents();
};

window.T4SThemeSP.Hover = () => {
  var hoverElements = (window.jQuery || window.$)('[data-hover-ts]'); // Changed from 't' to 'hoverElements'

  // Check if there are hover elements and if the viewport width is greater than or equal to 1025
  if (!(hoverElements.length === 0 || viewportWidth < 1025)) {
    hoverElements.each((_, element) => {
      // Changed 't' and 'n' to 'index' and 'element'
      var currentElement = element,
        $currentElement = (window.jQuery || window.$)(currentElement);

      currentElement.hasHoverGroup =
        currentElement.hasAttribute('data-has-group'); // Renamed 'i.ishasGroup' to 'currentElement.hasHoverGroup'

      // Initialize hoverIntent
      $currentElement.hoverIntent({
        instance: $currentElement,
        sensitivity: 3,
        interval: $currentElement.data('interval') || 35,
        timeout: $currentElement.data('timeout') || 150,
        over: function (event) {
          if (currentElement.hasHoverGroup) {
            // If it has a group, remove hover class from siblings
            $currentElement.siblings().removeClass('is--hover');
            $currentElement.addClass('is--hover');
          } else {
            // Otherwise, just add the hover class
            $currentElement.addClass('is--hover');
          }
        },
        out: function () {
          // Remove hover class if not part of a group
          if (!currentElement.hasHoverGroup) {
            $currentElement.removeClass('is--hover');
          }
        },
      });
    });
  }
};

window.T4SThemeSP.ProductAjax = (() => {
  const disATCerror = window.T4Sconfigs.disATCerror;
  const isLoadingClass = 'is--loading';
  const ariaDisabledAttr = 'aria-disabled';
  const validationErrorClass = 'is--field-emty is--animated ani-shake';
  const validationEvent = 'change.required keyup.required';
  const isCartDisabled = 'disable' === window.T4Sconfigs.cartType;
  const sectionsData =
    pageType !== 'cart'
      ? isCartDisabled
        ? 'cart_data'
        : 'cart_data,mini_cart'
      : `cart_data,${window.cartT4SectionID}`;
  const ajaxAddToCartEnabled = window.T4SThemeSP.enableAjaxATC;
  const ajaxCartEnabled = window.T4SThemeSP.enableAjaxCart;
  const cartChangeUrl = `${window.T4Sroutes.cart_change_url}.js`;
  const cartAddUrl = `${window.T4Sroutes.cart_add_url}.js`;

  // Helper for creating fetch options
  const createRequestOptions = (responseType = 'json') => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${responseType}`,
    },
  });

  // Handle notification
  const handleNotification = (message = false) => {
    if (message && !disATCerror) {
      window.T4SThemeSP.Notices(message);
    }
  };

  // Update cart item
  const updateCartItem = async (triggerElement, quantity) => {
    const cartItem = triggerElement.closest('[data-cart-item]');
    const cartWrapper = triggerElement.closest('[data-cart-wrapper]');
    const loaderBar = cartItem.find('.cart-ld__bar');
    const spinner = loaderBar.find('.cart-spinner');

    cartWrapper.addClass('is--contentUpdate');
    cartItem.addClass('is--update');
    loaderBar.removeAttr('hidden');
    spinner.removeAttr('hidden');

    $document.on('cart:updated', () => {
      cartWrapper.removeClass('is--contentUpdate');
      $document.off('cart:updated'), cartItem.removeClass('is--update');
      loaderBar.attr('hidden', '');
      spinner.attr('hidden', '');
    });

    const requestOptions = createRequestOptions('javascript');
    requestOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
    requestOptions.body = JSON.stringify({
      line: cartItem.indexOf() + 1,
      quantity,
      sections: sectionsData,
      sections_url: window.location.pathname,
    });

    try {
      const response = await fetch(cartChangeUrl, requestOptions);
      const data = await response.json();

      if (data.status) {
        handleNotification(data.description);
        $document.trigger('cart:updated', ['error']);
      } else {
        renderCartContents(data.sections);
      }
    } catch (error) {
      $document.trigger('cart:updated');
      console.error(error);
    }
  };

  // Render cart contents
  const renderCartContents = (sections) => {
    if (sections) {
      window.T4SThemeSP.Cart.renderContents(sections);
    } else {
      winodw.T4SThemeSP.Cart.getToFetch();
    }
  };

  const processAddToCart = async (element) => {
    element.addClass(isLoadingClass).attr('aria-disabled', true);
    element.find('.loading-overlay__spinner').removeAttr('hidden');
    element.find('.svg-spinner').removeAttr('hidden');
    $document.on('cart:updated', (event, type = 'success') => {
      element.removeClass(isLoadingClass).removeAttr(ariaDisabledAttr);
      element.find('.loading-overlay__spinner').attr('hidden', '');
      element.find('.svg-spinner').attr('hidden', '');
      $document.off('cart:updated');
      if ('success' == type) {
        $body.trigger('modal:closed');
      }
    });
    const requestOptions = createRequestOptions('javascript');
    (requestOptions.headers['X-Requested-With'] = 'XMLHttpRequest'),
      delete requestOptions.headers['Content-Type'];
    const formData = new FormData(element.closest('form')[0]);
    formData.append('sections', sectionsData.split(','));
    formData.append('sections_url', window.location.pathname);
    requestOptions.body = formData;
    try {
      const response = await fetch(cartAddUrl, requestOptions);
      const data = await response.json();
      if (data.status) {
        handleNotification(data.description);
        $document.trigger('cart:updated', ['error']);
      } else {
        if (
          window.T4SThemeSP.isEditCartReplace &&
          data.variant_id != window.T4SThemeSP.iDVariantEdit
        ) {
          const requestOptions = createRequestOptions('javascript');
          requestOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
          requestOptions.body = JSON.stringify({
            id: `${T4SThemeSP.keyVariantEdit}`,
            quantity: 0,
          });
          try {
            const response = await fetch(cartChangeUrl, requestOptions);
            const data = await response.json();
            if (data.status) {
              handleNotification(data.description);
            } else {
              $document.trigger('add:cart:success').trigger('add:cart:upsell');
              window.T4SThemeSP.isATCSuccess = true;
              renderCartContents(data.sections);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          $document.trigger('add:cart:success').trigger('add:cart:upsell');
          window.T4SThemeSP.isATCSuccess = true;
          renderCartContents(data.sections);
        }
      }
    } catch (err) {
      $document.trigger('cart:updated');
      console.log('error', err);
    }
  };

  // Add to cart form handling
  const setupAddToCartForm = (formContainer) => {
    const requiredFields = formContainer.find('[data-field-required]');
    const hasProperties =
      !!formContainer.hasClass('has--properties') && requiredFields.length > 0;
    let isFormInvalid = false;

    formContainer.on('click', async (event) => {
      event.preventDefault();
      const addToCartButton = event.currentTarget.attr(ariaDisabledAttr);

      if (addToCartButton) {
        window.T4SThemeSP.Notices(window.T4SProductStrings.pleaseChooseOptions);
        return;
      }

      if (hasProperties) {
        isFormInvalid = false;

        requiredFields.forEach((field) => {
          const propertyField = field.closest('[data-item-property-field]');
          const isEmpty =
            propertyField.hasClass('is--type-radio') ||
            propertyField.hasClass('is--type-checkbox')
              ? propertyField.find('input[name]').is(':checked')
              : !field.value.length;

          if (isEmpty) {
            propertyField.classList.add(validationErrorClass);
            isFormInvalid = true;
          }
        });

        if (isFormInvalid) {
          setTimeout(() => {
            formContainer
              .find('.is--animated.ani-shake')
              .removeClass('is--animated ani-shake');
          }, 999);

          requiredFields.off(validationEvent).on(validationEvent, (event) => {
            const propertyField = event.target.closest(
              '[data-item-property-field]'
            );
            if (
              propertyField.hasClass('is--type-radio') ||
              propertyField.hasClass('is--type-checkbox')
                ? propertyField.find('input[name]').is(':checked')
                : field.value.length > 0
            ) {
              propertyField.classList.remove(validationErrorClass);
            }
          });
          return;
        }
      }

      if (!ajaxAddToCartEnabled) return;
      requiredFields.off(validationEvent);

      // Prevent default submission and process via AJAX
      event.preventDefault();
      await processAddToCart(window.jQuery(event.currentTarget));
    });
  };

  const addToCart = async (element) => {
    element.addClass(isLoadingClass).attr(ariaDisabledAttr, true);
    const requestOptions = createRequestOptions('javascript');
    requestOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
    const variantId = element.attr('data-variant-id');
    const quantity =
      parseInt(
        element
          .prev('[data-quantity-wrapper]')
          .find('[data-quantity-value]')
          .val()
      ) ||
      element.data('qty') ||
      1;
    (variantId.body = JSON.stringify({
      items: [
        {
          id: variantId,
          quantity: quantity,
        },
      ],
      sections: sectionsData,
      sections_url: window.location.pathname,
    })),
      $document.on('cart:updated', () => {
        element.removeClass(isLoadingClass).removeAttr(ariaDisabledAttr);
        $document.off('cart:updated');
      });
    try {
      const response = await fetch(cartAddUrl, requestOptions);
      const data = await response.json();
      if (data.status) {
        handleNotification(data.description),
          $document.trigger('cart:updated', ['error']);
      } else {
        $document.trigger('add:cart:success').trigger('add:cart:upsell');
        window.T4SThemeSP.isATCSuccess = true;
        renderCartContents(data.sections);
      }
    } catch (err) {
      $document.trigger('cart:updated');
      console.error(err);
    }
  };

  // Handle add to cart action
  const handleAddToCartAction = () => {
    $body.on('click', '[data-action-atc]', async (event) => {
      if (ajaxAddToCartEnabled) {
        event.preventDefault();
        const button = window.jQuery(event.target);
        await addToCart(button);
      }
    });
  };

  // Initialize cart change listeners
  const initializeCartChangeListeners = () => {
    window
      .jQuery('[data-cart-items]')
      .off(ajaxCartChangeEvent)
      .on(ajaxCartChangeEvent, '[data-action-change]', (event) => {
        const targetElement = window.jQuery(event.target);
        const input = targetElement.val() || 1;

        if (ajaxCartEnabled) {
          updateCartItem(targetElement, input);
        }
      })
      .off('click.remove')
      .on('click.remove', '[data-cart-remove]', (event) => {
        if (ajaxCartEnabled) {
          event.preventDefault();
          const targetElement = window.jQuery(event.target);
          updateCartItem(targetElement, 0);
        }
      });
  };

  // Public methods
  return {
    init: function () {
      $document.on('submitAtc:ts', (event) => {
        setupAddToCartForm(
          event.$container.find('[data-type="add-to-cart-form"]')
        );
      });

      setupAddToCartForm(window.jQuery('[data-type="add-to-cart-form"]'));
      handleAddToCartAction();
      initializeCartChangeListeners();
    },
    change: initializeCartChangeListeners,
  };
})();

window.T4SThemeSP.T4sQuantityAdjust = () => {
  const stockNoticeMessage = themeStrings.notice_stock_msg;
  const isStockDisabled = T4Sconfigs.disOnlyStock;
  const currentQuantityAttr = 'data-current-qty';

  // Adds a method to String prototype to get the number of decimal places
  if (!String.prototype.getDecimals) {
    String.prototype.getDecimals = function () {
      const match = ('' + this).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?/);
      return match
        ? Math.max(
            0,
            (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
          )
        : 0;
    };
  }

  const adjustQuantity = () => {
    $body.on('change', '[data-quantity-value]', (event) => {
      const quantityInput = window.jQuery(event.currentTarget);
      const currentQuantity = quantityInput.val() || 1;
      const maxQuantity = quantityInput.attr('max') || 9999;
      const minQuantity = quantityInput.attr('min') || 1;
      const dataCurrentQty = quantityInput.attr(currentQuantityAttr) || 0.1;
      const formGroup = quantityInput.closest('.fgr_frm');

      if (formGroup.length > 0) {
        subtt_price_group(formGroup);
        $body.trigger('currency:update');
      }

      if (parseInt(currentQuantity) > parseInt(maxQuantity)) {
        quantityInput.val(maxQuantity);
        quantityInput.attr(currentQuantityAttr, maxQuantity);
        if (dataCurrentQty !== maxQuantity) {
          quantityInput.trigger(ajaxCartChangeEvent);
        }
        if (isStockDisabled) return;
        return window.T4SThemeSP.Notices(
          stockNoticeMessage.replace('[max]', maxQuantity)
        );
      }

      if (parseInt(currentQuantity) < parseInt(minQuantity)) {
        quantityInput.val(minQuantity);
        if (dataCurrentQty !== minQuantity) {
          quantityInput.attr(currentQuantityAttr, minQuantity).trigger(v);
        }
        return;
      }

      quantityInput.trigger(ajaxCartChangeEvent);
      quantityInput.attr(currentQuantityAttr, currentQuantity);
    });

    $body.on('click', '[data-quantity-selector]', (event) => {
      event.preventDefault();
      const button = window.jQuery(event.currentTarget);
      const quantityInput = button
        .closest('[data-quantity-wrapper]')
        .find('[data-quantity-value]');
      let quantityValue = parseFloat(quantityInput.val()) || 0;
      const maxValue = parseFloat(quantityInput.attr('max')) || Infinity;
      const minValue = parseFloat(quantityInput.attr('min')) || 0;
      const stepValue = quantityInput.attr('step') || 1;

      const incrementQuantity = () => {
        if (maxValue && quantityValue >= maxValue) {
          quantityInput.val(maxValue);
          if (isStockDisabled) return;
          return window.T4SThemeSP.Notices(
            stockNoticeMessage.replace('[max]', maxValue)
          );
        }
        quantityInput.val(
          (quantityValue + parseFloat(stepValue)).toFixed(
            stepValue.getDecimals()
          )
        );
      };

      const decrementQuantity = () => {
        if (quantityValue <= minValue) {
          quantityInput.val(minValue);
        } else {
          quantityInput.val(
            (quantityValue - parseFloat(stepValue)).toFixed(
              stepValue.getDecimals()
            )
          );
        }
      };

      if (button.is('[data-increase-qty]')) {
        incrementQuantity();
      } else {
        decrementQuantity();
      }

      quantityInput.trigger('change');
    });
  };

  adjustQuantity();
};

var ProductItem = class {
  constructor() {
    this.templateButtonsHTML = window.$('#btns_pr_temp').html();
    this.tooltipDataAttribute = 'data-tooltip';
    this.tooltipAttribute = `${this.tooltipDataAttribute}="`;
    this.productId = 'id_nt_94';
    this.handleId = 'handle_nt_94';
    this.config = window.T4Sconfigs;
    this.productStrings = window.T4SProductStrings;
    this.imgPath = this.config.img2;
    this.currentTimestamp = this.config.nowTimestamp;
    this.newDayInt = this.config.new_day_int;
    this.showImage = this.config.show_img;
    this.enableQuickShop = this.config.enable_quickshop;
    this.useSaleBadge = this.config.use_sale_badge;
    this.saleLabelStyle = this.config.label_sale_style;
    this.usePreorderBadge = this.config.use_preorder_badge;
    this.useNewBadge = this.config.use_new_badge;
    this.useSoldOutBadge = this.config.use_soldout_badge;
    this.useCustomBadge = this.config.use_custom_badge;
    this.swatchLimit = this.config.swatch_limit;
    this.swatchClick = this.config.swatch_click;
    this.swatchNum = this.config.swatch_num;
    this.maxSwatchCount = 2;
    this.preOrderText = this.productStrings.preOrder;
    this.readMoreText = this.productStrings.readMore;
    this.soldOutText = this.productStrings.soldOut;
    this.selectOptionText = this.productStrings.selectOption;
    this.quickShopText = this.productStrings.quickShop;
    this.previewText = this.productStrings.preView;
    this.productTextSelector = '.text-pr';
    this.svgIconSelector = '.svg-pr-icon use';
    this.colorOptionsDataAttribute = 'data-color-options';
    this.productSizeSelector = '.product-sizes';
    this.loadingClass = 'is--loading';
    this.openedClass = 'is--opended';
    this.calculatedClass = 'is--calced';
    this.limitClass = 'is--limit';
    this.resizeObserverSelector = '[data-ts-resizeobserver]';
    this.swatchStyle = this.config.sw_item_style;
    this.swatchLimitData = this.productStrings.swatch_limit;
    this.swatchLimitLessData = this.productStrings.swatch_limit_less;
    this.showQuantity = this.config.show_qty;
    this.colorItemSelector =
      '.pr-color__item:not(.is-swatch--current):not([data-img="none"]):not(.is--colors-more)';
    this.currentProduct = this.config.pr_curent;
    this.appReviewConfig = window.T4Sconfigs.app_review;

    this.badges = {
      sale: this.productStrings.badgeSale,
      new: this.productStrings.badgeNew,
      preOrder: this.productStrings.badgepreOrder,
      soldOut: this.productStrings.badgeSoldout,
      SavePercent: this.productStrings.badgeSavePercent,
    };
    this.enabledInitProductsClass = 'initProducts__enabled';

    // Configure swatch limit
    if (this.swatchLimit) {
      $html.addClass('pr-item-sw-limit');
      if (this.swatchNum && this.swatchNum > 0) {
        this.maxSwatchCount = this.swatchNum;
      }
    }

    this.collectionUrlDataAttribute = 'data-collection-url';
    this.collectionUrlSelector = '[data-collection-url]';
    this.hrefReplacedClass = 'is--href-replaced';
    this.productHrefSelector = '[data-pr-href]:not(.is--href-replaced)';
    this.productPath = '/products/';
    this.collectionData = [];
  }

  init() {
    this.updateCollection();
    this.productOptions = window.jQuery(
      '[data-product-options]:not(.is--pr-created)'
    );

    this.productOptions.each((_, product) => {
      const $product = window.jQuery(product);
      const productData = parseJsonOrDefault(
        $product.attr('data-product-options')
      );
      const imgLink = $product.find('[data-pr-href]').attr('href');
      if (typeof productData.unQuickShopInline != 'boolean') {
        productData.unQuickShopInline = true;
      }
      const image2 = productData.image2;
      const altText = productData.alt;

      this.createImageHtml($product, image2, altText);
      this.updateQuickViewButtons($product, productData, imgLink);
      this.updateProductBadges($product, productData);
      this.updateColorVariants($product, productData);
      this.recalculateSwatches();
      this.initializeQuickShopInline(product, $product, productData);
      $product.addClass('is--pr-created');
    });

    window.T4SThemeSP.Tooltip();
    window.T4SThemeSP.Compare.updateAll();
    window.T4SThemeSP.Wishlist.updateAll();
  }

  initializeQuickShopInline(element, productElement, productData) {
    // Return early if conditions are met to skip Quick Shop initialization
    if (
      productData.unQuickShopInline ||
      productElement.hasClass(te) ||
      productData.isGrouped ||
      productData.isExternal
    ) {
      return;
    }

    const quickShopIndicator = productElement.find('[data-qs-inl]');

    // Initialize Quick Shop if it's not already lazy-loaded
    if (quickShopIndicator.hasClass('lazyloaded')) {
      new window.T4SThemeSP.Product(element);
    } else {
      quickShopIndicator.one('lazyincluded', function () {
        new window.T4SThemeSP.Product(element);
      });
    }
  }

  recalculateSwatches(isUpdate) {
    if (this.swatchLimit) {
      const selector = isUpdate
        ? `[${this.colorOptionsDataAttribute}]`
        : `[${this.colorOptionsDataAttribute}]:not(.${this.calculatedClass})`;

      if (this.swatchNum) {
        fastdomT4s.measure(() => {
          window.jQuery(selector).each((_, item) => {
            const colorContainer = window.jQuery(item);
            const totalItems =
              colorContainer.find('.pr-color__item').length - 1;
            const excessItems = totalItems - this.swatchNum;

            fastdomT4s.mutate(() => {
              colorContainer
                .addClass(this.calculatedClass)
                .removeClass(this.limitClass);
              colorContainer
                .find('.is-color--limit')
                .removeClass('is-color--limit');

              if (excessItems > 0) {
                colorContainer.addClass(this.limitClass);
                colorContainer
                  .find('.pr-color__item')
                  .eq(this.swatchNum - 1)
                  .addClass('is-color--limit');
                colorContainer
                  .attr('data-limit', totalItems)
                  .attr(
                    'style',
                    `--text: "+${excessItems}"; --text2: "-${excessItems}"`
                  );
              }
            });
          });
        });
      } else {
        fastdomT4s.measure(() => {
          window.jQuery(selector).each((_, item) => {
            const colorContainer = window.jQuery(item);
            const items = colorContainer.find('.pr-color__item');
            const itemWidth = items.outerWidth(true);
            const totalItems = items.length - 1;
            const visibleItems = Math.floor(
              colorContainer.outerWidth() / itemWidth
            );
            const excessItems = totalItems - visibleItems;

            fastdomT4s.mutate(() => {
              colorContainer
                .addClass(this.calculatedClass)
                .removeClass(this.limitClass);
              colorContainer
                .find('.is-color--limit')
                .removeClass('is-color--limit');

              if (excessItems > 0 && excessItems !== totalItems) {
                const adjustedExcess = excessItems + 1;
                colorContainer.addClass(this.limitClass);
                colorContainer
                  .find('.pr-color__item')
                  .eq(visibleItems - 2)
                  .addClass('is-color--limit');
                colorContainer
                  .attr('data-limit', visibleItems)
                  .attr(
                    'style',
                    `--text: "+${adjustedExcess}"; --text2: "-${adjustedExcess}"`
                  );
              }
            });
          });
        });
      }
    }
  }

  updateColorVariants(productContainer, productUrl) {
    const colorVariantElements = productContainer.find(
      `[${this.colorOptionsDataAttribute}]`
    );

    if (colorVariantElements.length > 0) {
      const variantData = JSON.parse(
        colorVariantElements.attr(this.colorOptionsDataAttribute) || '{}'
      );
      const {
        color_variants: colorVariants,
        color_variants_avai: availableVariants,
        color_variants_handle: variantHandles,
        img_options: imgOptions,
        img_variants: imgVariants,
        id_variants: variantIds,
        id_images: imgIds = [],
        img_ratios: imgRatios,
      } = variantData;

      let colorHtml = '';
      const hasImgVariants = imgVariants.length > 0;
      const totalVariants = colorVariants.length;
      const isSomeSoldOut = totalVariants !== availableVariants.length;

      for (let index = 0; index < totalVariants; index++) {
        const colorName = colorVariants[index];
        const colorIndex = imgOptions.indexOf(colorName);
        const imgVariant = hasImgVariants ? imgVariants[colorIndex] : 'nt94';
        const lazyloadImage =
          imgVariant !== 'nt94'
            ? window.T4SThemeSP.Images.lazyloadImagePath(imgVariant)
            : 'none';
        const bgImageData =
          imgVariant !== 'nt94' && this.swatchStyle === '2'
            ? `data-bg="${T4SThemeSP.Images.getNewImageUrl(imgVariant, 100)}"`
            : '';
        const soldOutClass =
          isSomeSoldOut && availableVariants.indexOf(colorName) < 0
            ? ' pr-color--sold-out'
            : '';

        colorHtml += `
                <span data-imgid="${imgIds[colorIndex] || '0'}" 
                      class="pr-color__item${soldOutClass}" 
                      data-vid="${variantIds[colorIndex]}" 
                      data-tooltip="top" 
                      data-img="${lazyloadImage}" 
                      data-ratio="${imgRatios[colorIndex] || ''}">
                    <span class="pr-color__name">${colorName}</span>
                    <span class="pr-color__value bg_color_${
                      variantHandles[index]
                    } lazyload" ${bgImageData}></span>
                </span>`;
      }

      // Add 'more colors' option if necessary
      if (totalVariants > this.maxSwatchCount && this.swatchLimit) {
        colorHtml += `
                <span class="pr-color__item is--colors-more" data-tooltip="top-end">
                    <span class="pr-color__name">${this.swatchLimit}</span>
                    <a href="${productUrl}" class="pr-color__value bg_color_limi"></a>
                </span>`;
      }

      colorVariantElements.html(colorHtml);

      // Fetch product options if necessary
      if (productContainer.find(this.productSizeSelector).length > 0) {
        const productOptions = productContainer
          .closest('[data-product-options]')
          .data('product-options');

        if (T4sFunc.psjson_lib[productOptions.id] === undefined) {
          $.ajax({
            url: `${Shopify.routes.root}products/${productOptions.handle}.js`,
            type: 'GET',
            dataType: 'json',
          })
            .done((response) => {
              T4sFunc.psjson_lib[productOptions.id] = response;
            })
            .fail(() => {
              console.error('Failed to fetch product options.');
            })
            .always(() => {
              // Any additional cleanup can go here if necessary
            });
        }
      }
    }
  }

  initializeQuickShop() {
    const quickShopElement = window.jQuery(
      `.product-quick-shop:not(.${this.enabledInitProductsClass})`
    );
    quickShopElement.addClass(this.enabledInitProductsClass);

    new window.T4SThemeSP.Product(quickShopElement[0]);
    window.T4SThemeSP.PopupMFP();

    if (window.Shopify && window.Shopify.PaymentButton) {
      window.Shopify.PaymentButton.init();
    }

    window.T4SThemeSP.Wishlist.updateAll();
    window.T4SThemeSP.Compare.updateAll();
    window.T4SThemeSP.ProductItem.reloadReview();
    window.T4SThemeSP.Tooltip();
    $body.trigger('currency:update');
  }

  initializeQuickView() {
    const quickViewElement = window.jQuery('.product-quick-view');
    const featuredProducts = quickViewElement.find(
      `[data-product-featured]:not(.${this.enabledInitProductsClass})`
    );

    featuredProducts.addClass(this.enabledInitProductsClass);

    const mainMedia = quickViewElement.find('[data-main-media]');
    if (
      mainMedia.hasClass('flickity') &&
      !mainMedia.hasClass('flickity-enabled')
    ) {
      mainMedia[0].flickity = new window.T4SThemeSP.Carousel(mainMedia[0]);
    }

    new window.T4SThemeSP.Product(featuredProducts[0]);
    window.T4SThemeSP.PopupMFP();
    window.T4SThemeSP.initGroupsProduct();

    if (window.Shopify && window.Shopify.PaymentButton) {
      window.Shopify.PaymentButton.init();
    }

    window.T4SThemeSP.Wishlist.updateAll();
    window.T4SThemeSP.Compare.updateAll();
    window.T4SThemeSP.ProductItem.reloadReview();
    window.T4SThemeSP.Tooltip();
    $body.trigger('currency:update');
  }

  initQuickVS() {
    if (this.showQuantity) {
      $html.addClass('pr-item-has-qty');
    }

    $body.on(
      'click',
      '[data-action-quickview], [data-action-quickshop]',
      (event) => {
        event.preventDefault();
        const clickedElement = window.jQuery(event.currentTarget);

        if (!clickedElement.hasClass(this.loadingClass)) {
          const href = clickedElement.attr('href');
          const isQuickView = clickedElement.is('[data-action-quickview]');
          const actionType = isQuickView ? 'main-qv' : 'main-qs';
          const openEvent = isQuickView ? 'opening-qv' : 'opening-qs';
          const productId = clickedElement.data('id');
          const popupContent = this.collectionData[actionType + productId];

          window.T4SThemeSP.isEditCartReplace =
            '0' === clickedElement.data('edit');
          window.T4SThemeSP.iDVariantEdit = productId;
          window.T4SThemeSP.keyVariantEdit = clickedElement.data('key');

          if (popupContent) {
            window.T4SThemeSP.NTpopupInline(
              popupContent,
              actionType,
              isQuickView
                ? this.initializeQuickView.bind(this)
                : this.initializeQuickShop.bind(this),
              openEvent
            );
            $html.trigger('modal:opened');
          } else {
            this.handleCartUpdate(
              clickedElement,
              productId,
              href,
              actionType,
              openEvent,
              isQuickView
            );
          }
        }
      }
    );
  }

  handleCartUpdate(
    clickedElement,
    productId,
    href,
    actionType,
    openEvent,
    isQuickView
  ) {
    if (window.T4SThemeSP.isEditCartReplace) {
      const cartItem = clickedElement.closest('[data-cart-item]');
      const cartWrapper = clickedElement.closest('[data-cart-wrapper]');
      const loadingBar = cartItem.find('.cart-ld__bar');
      const spinner = loadingBar.find('.cart-spinner');

      cartWrapper.addClass('is--contentUpdate');
      cartItem.addClass('is--update');
      loadingBar.removeAttr('hidden');
      spinner.removeAttr('hidden');

      $document.on('cart:updated', (event, status = 'success') => {
        cartWrapper.removeClass('is--contentUpdate');
        $document.off('cart:updated');
        cartItem.removeClass('is--update');
        loadingBar.attr('hidden', '');
        spinner.attr('hidden', '');
        if (status === 'success') {
          $html.trigger('modal:closed');
        }
      });
    } else {
      clickedElement.addClass(this.loadingClass);
    }

    fetch(
      `${href}${
        href.includes('?') || href.includes('&') ? '&' : '/?'
      }section_id=${actionType}`
    )
      .then((response) => response.text())
      .then((content) => {
        clickedElement.removeClass(this.loadingClass);
        $document.trigger('cart:updated');

        const htmlContent = IsDesignMode
          ? window.jQuery(content).find('template').html()
          : window.jQuery(content).html();
        window.T4SThemeSP.NTpopupInline(
          htmlContent,
          actionType,
          isQuickView
            ? this.initializeQuickView.bind(this)
            : this.initializeQuickShop.bind(this),
          openEvent
        );
        $body.trigger('modal:opened');
        this.collectionData[actionType + productId] = htmlContent;
      })
      .catch((error) => {
        clickedElement.removeClass(this.loadingClass);
        $document.trigger('cart:updated');
        console.error(error);
      });
  }

  updateQuickViewButtons(productContainer, productInfo, productLink) {
    const quickViewElements = productContainer.find('[data-replace-quickview]');
    let tooltipDataAttr =
      quickViewElements.attr(this.tooltipDataAttribute) || '';
    const productHandle = productInfo.id;

    const compareElements = productContainer.find('[data-replace-compare]');
    let compareElementsAttr =
      compareElements.attr(this.tooltipDataAttribute) || '';
    const wishlistElements = productContainer.find('[data-replace-wishlist]');
    let wishlistElementsAttr =
      wishlistElements.attr(this.tooltipDataAttribute) || '';
    let addToCartElements = productContainer.find('[data-replace-atc]');

    const hasQuantity = addToCartElements.is('[data-has-qty]');
    let addToCartTooltip =
      addToCartElements.attr(this.tooltipDataAttribute) || '';
    const urlTemplate = this.templateButtonsHTML
      .replace(/#pr_url/g, productLink)
      .split('[split_nt]');

    // Update quick view buttons
    quickViewElements.each((_, element) => {
      tooltipDataAttr = window.$(element).attr(this.tooltipDataAttribute) || '';
      window
        .$(element)
        .replaceWith(
          urlTemplate[0]
            .replace(
              this.tooltipAttribute,
              `${this.tooltipAttribute}${tooltipDataAttr}`
            )
            .replace('id_nt_94', productHandle)
        );
    });

    // Update compare buttons
    compareElements.each((_, element) => {
      compareElementsAttr =
        window.$(element).attr(this.tooltipDataAttribute) || '';
      window
        .$(element)
        .replaceWith(
          urlTemplate[1]
            .replace(
              this.tooltipAttribute,
              `${this.tooltipAttribute}${compareElementsAttr}`
            )
            .replace('id_nt_94', productHandle)
            .replace('handle_nt_94', productInfo.handle)
        );
    });

    // Update wishlist buttons
    wishlistElements.each((_, element) => {
      wishlistElementsAttr =
        window.$(element).attr(this.tooltipDataAttribute) || '';
      window
        .$(element)
        .replaceWith(
          urlTemplate[2]
            .replace(
              this.tooltipAttribute,
              `${this.tooltipAttribute}${wishlistElementsAttr}`
            )
            .replace('id_nt_94', productHandle)
            .replace('handle_nt_94', productInfo.handle)
        );
    });

    // Update add to cart buttons
    addToCartElements.each((_, element) => {
      addToCartTooltip =
        addToCartElements.attr(this.tooltipDataAttribute) || '';
      window
        .$(element)
        .replaceWith(
          urlTemplate[3]
            .replace(
              this.tooltipAttribute,
              `${this.tooltipAttribute}${addToCartTooltip}`
            )
            .replace('id_nt_94', productHandle)
        );
    });

    addToCartElements = productContainer.find('[data-atc-selector]');
    const atcSelectorElements = addToCartElements.find(
      this.productTextSelector
    );
    const svgIconElements = atcSelectorElements.find(this.svgIconSelector);

    // Handling external links
    if (productInfo.isExternal) {
      addToCartElements
        .attr('href', productInfo.external_link)
        .attr('target', '_blank');
      atcSelectorElements.attr('href', '#icon-external');
      svgIconElements.text(productInfo.external_title);
    } else if (productInfo.available) {
      if (productInfo.isGrouped) {
        atcSelectorElements.text(this.previewText);
      } else if (productInfo.isDefault) {
        if (productInfo.isPreorder) {
          atcSelectorElements.text(this.preOrderText);
        }
        addToCartElements.attr({
          'data-action-atc': '',
          'data-variant-id': productInfo.VariantFirstID,
          'data-qty': productInfo.cusQty || 1,
        });

        if (this.showQuantity && hasQuantity && addToCartElements[0]) {
          const outerHTML = addToCartElements[0].outerHTML;
          const quantityTemplate = urlTemplate[4]
            .replace('max="9999"', `max="${productInfo.maxQuantity}"`)
            .replace('min="1"', `min="${productInfo.cusQty || 1}"`);
          addToCartElements.replaceWith(
            `<div class="product-atc-qty">${quantityTemplate}${outerHTML}</div>`
          );
        }
      } else if (this.enableQuickShop && productInfo.unQuickShopInline) {
        addToCartElements.attr('data-action-quickshop', '');
        atcSelectorElements.text(this.quickShopText);
      } else {
        atcSelectorElements.text(this.selectOptionText);
      }
    } else {
      atcSelectorElements.text(this.readMoreText);
      svgIconElements.attr('href', '#icon-link');
    }

    // Handling inline quick shop and button replacement
    if (!productInfo.unQuickShopInline) {
      productContainer.one('replace:btnAtc', () => {
        addToCartElements.attr({
          'data-action-atc': '',
          'data-variant-id': productInfo.VariantFirstID,
          'data-qty': productInfo.cusQty || 1,
        });

        if (this.showQuantity && hasQuantity && addToCartElements[0]) {
          const outerHTML = addToCartElements[0].outerHTML;
          const quantityTemplate = urlTemplate[4]
            .replace('max="9999"', `max="${productInfo.maxQuantity}"`)
            .replace('min="1"', `min="${productInfo.cusQty || 1}"`);
          addToCartElements.replaceWith(
            `<div class="product-atc-qty">${quantityTemplate}${outerHTML}</div>`
          );
        }
      });
    }
  }

  updateCollection() {
    if (
      window.T4Sconfigs.within_cat &&
      window.jQuery(this.productHrefSelector).length > 0
    ) {
      window.jQuery(this.collectionUrlSelector).each((_, item) => {
        this.itemUrl = window
          .jQuery(item)
          .attr(this.collectionUrlDataAttribute);
        if (this.itemUrl.trim().length < 1) return;

        window
          .jQuery(item)
          .find(this.productHrefSelector)
          .each((_, link) => {
            const href = window
              .jQuery(link)
              .attr('href')
              .split(this.productPath)[1];
            window
              .jQuery(link)
              .attr('href', this.itemUrl + this.productPath + href)
              .addClass(this.hrefReplacedClass);
          });
      });
    }
  }

  shouldShowImage2(image2) {
    return image2 && T4Sconfigs.img2 === '2';
  }

  createImageHtml($product, image2, altText) {
    let imageTemplate = '';
    if (this.showImage == '2' && $product) {
      imageTemplate = image2
        .replace('image_src', image2)
        .replace('image_alt', altText);
      $product.find('.product-img').addClass('is-show-img2');
    }
    $product.find('[data-replace-img2]').replaceWith(imageTemplate);
  }

  updateProductBadges(productContainer, productData) {
    const badgeElements = productContainer.find('[data-product-badge]');
    const badgeSortOrder = (badgeElements.attr('data-sort') || '')
      .replace(/ /g, '')
      .split(',');
    let badgeHtml = '';
    const shouldShowBadges = !productData.unQuickShopInline;

    if (badgeSortOrder.length > 0 && badgeElements.length > 0) {
      for (const badgeType of badgeSortOrder) {
        switch (badgeType) {
          case 'sale': {
            const compareAtPrice = productData.compare_at_price;
            const currentPrice = productData.price;

            if (compareAtPrice <= currentPrice || !this.useSaleBadge) {
              if (shouldShowBadges) {
                badgeHtml +=
                  '<span data-badge-sale class="badge-item badge-sale" hidden></span>';
              }
              break;
            }

            let saleAmount;
            if (this.saleLabelStyle === '2') {
              const discountPercentage =
                (100 * (compareAtPrice - currentPrice)) / compareAtPrice;
              saleAmount = this.badges.SavePercent.replace(
                '[sale]',
                Math.round(discountPercentage)
              );
            } else if (this.saleLabelStyle === '3') {
              const discountAmount = compareAtPrice - currentPrice;
              saleAmount =
                window.T4SThemeSP.Currency.formatMoney(discountAmount);
            } else {
              saleAmount = this.badges[badgeType];
            }
            badgeHtml += `<span data-badge-sale class="badge-item badge-sale">${saleAmount}</span>`;
            break;
          }
          case 'preOrder': {
            if (!productData.isPreoder || !_) {
              if (shouldShowBadges) {
                badgeHtml += `<span data-badge-preorder class="badge-item badge-preorder" hidden>${this.badges[badgeType]}</span>`;
              }
              break;
            }
            badgeHtml += `<span data-badge-preorder class="badge-item badge-preorder">${this.badges[badgeType]}</span>`;
            break;
          }
          case 'new': {
            const timeSinceLaunch =
              this.currentTimestamp - productData.dateStart;
            const daysSinceLaunch = Math.floor(timeSinceLaunch / 3600 / 24);

            if (daysSinceLaunch >= this.newDayInt || !this.useNewBadge) {
              break;
            }
            badgeHtml += `<span class="badge-item badge-new">${this.badges[badgeType]}</span>`;
            break;
          }
          case 'soldout': {
            if (productData.available || !this.useSoldOutBadge) {
              if (shouldShowBadges) {
                badgeHtml += `<span data-badge-soldout class="badge-item badge-soldout" hidden>${this.badges[badgeType]}</span>`;
              }
              break;
            }
            badgeHtml += `<span data-badge-soldout class="badge-item badge-soldout">${this.badges[badgeType]}</span>`;
            break;
          }
          default: {
            const customBadges = productData.customBadge;
            if (!customBadges || !this.useCustomBadge) {
              break;
            }
            for (let j = 0; j < customBadges.length; j++) {
              badgeHtml += `<span class="badge-item badge-custom badge-${productData.customBadgeHandle[j]}">${customBadges[j]}</span>`;
            }
          }
        }
      }
      badgeElements.html(badgeHtml);
    }
  }

  createColorSwatch(color, handle, isSoldOut) {
    const soldOutClass = isSoldOut ? 'pr-color--sold-out' : '';
    return `
          <span data-imgid="0" class="pr-color__item ${soldOutClass}" data-vid="${handle}">
              <span class="pr-color__name">${color}</span>
              <span class="pr-color__value"></span>
          </span>
      `;
  }

  addBadges($product, productData) {
    const badgesHtml = this.createBadgesHtml(productData);
    $product.find('[data-product-badge]').html(badgesHtml);
  }

  createBadgesHtml(productData) {
    let badges = '';
    // Implement logic for creating badge HTML based on productData
    return badges;
  }
  clickMoreSwatches() {
    if (this.swatchLimit && this.swatchClick !== '2') {
      $body.on('click', '.pr-color__item.is--colors-more > a', (event) => {
        event.preventDefault();
        const colorItemContainer = window
          .jQuery(event.currentTarget)
          .closest(`.${this.limitClass}`);
        const siblingTextElement = window
          .jQuery(event.currentTarget)
          .siblings();

        // Toggle the class and update the text based on the current state
        if (colorItemContainer.hasClass(this.openedClass)) {
          colorItemContainer.removeClass(this.openedClass);
          siblingTextElement.text(this.swatchLimit);
        } else {
          colorItemContainer.addClass(this.openedClass);
          siblingTextElement.text(this.swatchLimitLessData);
        }
      });
    }
  }

  handleSwatchSelection(selectedSwatch) {
    const productOptionsContainer = selectedSwatch.closest(
      '[data-product-options]'
    );
    const productOptionsData = productOptionsContainer.data('product-options');

    // Handle the case when the image ID is "0"
    if (selectedSwatch.data('imgid') === '0') {
      const imageSource = selectedSwatch.data('img');
      const variantId = selectedSwatch.data('vid');
      const imageElements = productOptionsContainer.find('[data-pr-img]');
      const linkElement = productOptionsContainer.find('[data-pr-href]');
      const href = linkElement.attr('href');

      // Update the selected color option
      selectedSwatch
        .closest('[data-color-options]')
        .find('.is-swatch--selected')
        .removeClass('is-swatch--selected');
      selectedSwatch.addClass('is-swatch--selected');
      productOptionsContainer.addClass('colors-selected');

      // Set the new image source
      imageElements.attr('data-srcset', imageSource);

      // Update the href if necessary
      if (this.currentProduct !== '1' && variantId !== undefined) {
        linkElement.attr(
          'href',
          (() => {
            return /variant=/.test(href)
              ? href.replace(/(variant=)[^&]+/, `$1${variantId}`)
              : href.includes('?')
              ? `${href}&variant=${variantId}`
              : `${href}?variant=${variantId}`;
          })()
        );

        // Update the available sizes if product options exist
        if (window.T4sFunc.psjson_lib[productOptionsData.id] !== undefined) {
          let sizeContainer = productOptionsContainer.find(
            this.productSizeSelector
          );
          let sizeOptions = sizeContainer.find('>span');
          let variants =
            window.T4sFunc.psjson_lib[productOptionsData.id].variants;
          let selectedVariant = variants.find(
            (variant) => variant.id === variantId
          );
          let sameColorVariants = variants.filter(
            (variant) =>
              variant[productOptionsData.index_color] ===
              selectedVariant[productOptionsData.index_color]
          );

          // Reset sold-out classes
          sizeOptions.removeClass('product-sizes--sold-out');
          let availableCount = 0;

          // Update the availability of sizes
          window.jQuery.map(sameColorVariants, (variant, index) => {
            if (variant.available) {
              availableCount++;
            } else {
              sizeOptions.eq(index).addClass('product-sizes--sold-out');
            }
          });

          sizeContainer.attr('data-size', availableCount);
        }
      }
    } else {
      // Handle the case when the image ID is not "0"
      let carousel = productOptionsContainer.find(
        '.flickity-enabled[data-product-img-carousel]'
      );
      if (carousel.length === 0) return;

      let imgId = selectedSwatch.data('imgid');
      carousel.flickity(
        'select',
        carousel.find(`[data-product-img-slide="${imgId}"]`).index()
      );
    }
  }

  swatchesClickHover() {
    if (window.T4SThemeSP.isTouch) {
      // Handle click events for touch devices
      $body.on('click', this.colorItemSelector, (event) => {
        this.handleSwatchSelection(window.jQuery(event.currentTarget));
      });
    } else {
      // Handle hover events for non-touch devices
      $body.hoverIntent({
        instance: $body,
        selector: this.colorItemSelector,
        sensitivity: 6,
        interval: 100,
        timeout: 100,
        over: (event) => {
          this.handleSwatchSelection(window.jQuery(event.currentTarget));
        },
        out: () => {
          // Optional: You can add functionality for mouse out event if needed
        },
      });
    }
  }

  resizeObserver() {
    // Select products that need to be observed for resizing
    const unobservedProducts = window.jQuery(
      this.resizeObserverSelector +
        '.flickity-enabled .product:not(.observered), ' +
        this.resizeObserverSelector +
        '.isotope-enabled .product:not(.observered)'
    );

    if (unobservedProducts.length > 0 && window.ResizeObserver) {
      // Create a new ResizeObserver instance
      const resizeObserverInstance = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const productElement = window.jQuery(entry.target);
          const closestContainer = productElement.is(
            this.resizeObserverSelector
          )
            ? productElement
            : productElement.closest(this.resizeObserverSelector);

          clearTimeout(resizeTimeout);
          closestContainer.addClass('is---doing');

          // Delay the resize operation to optimize performance
          resizeTimeout = setTimeout(() => {
            if (closestContainer.hasClass('flickity-enabled')) {
              closestContainer.flickity('resize');
            } else if (closestContainer.hasClass('isotope-enabled')) {
              closestContainer.isotope('layout');
            }
            closestContainer.removeClass('is---doing');
          }, 28);
        });
      });

      // Observe each unobserved product element
      unobservedProducts.each((_, element) => {
        const productElement = window.jQuery(element);
        resizeObserverInstance.observe(element);
        productElement.addClass('observered');

        // Clean up when the product element is destroyed
        productElement.one('destroy.observered', function () {
          resizeObserverInstance.unobserve(element);
          productElement.removeClass('observered');
        });
      });
    }
  }

  reloadReview() {
    // Check the review loading mode
    if (this.appReviewConfig === '1') {
      try {
        // Initialize and load reviews if SPR is available
        if (window.SPR && window.jQuery('.spr-badge').length > 0) {
          SPR.initDomEls();
          SPR.loadBadges();
        }
      } catch (error) {
        console.error('Error loading SPR badges:', error);
      }
    } else if (this.appReviewConfig === '8') {
      // Handle Smartify reviews if applicable
      if (typeof SMARTIFYAPPS !== 'undefined' && SMARTIFYAPPS.rv.installed) {
        SMARTIFYAPPS.rv.scmReviewsRate.actionCreateReviews();
      }
      if (typeof airReviewDisplayManager !== 'undefined') {
        airReviewDisplayManager.initialize();
      }
    } else if (this.appReviewConfig === '6') {
      // Trigger custom event to reload reviews
      $body.trigger('reloadReview.ts');
    }
  }

  loadjsRevew() {
    '6' == this.appReviewConfig && $script(window.T4Sconfigs.script12);
  }
};

window.T4SThemeSP.agreeForm = () => {
  let initialized = false;
  const checkboxSelector = '[data-agree-checkbox]';

  if (!initialized && document.querySelectorAll(checkboxSelector).length > 0) {
    initialized = true;

    // Click event for buttons
    document.addEventListener('click', (event) => {
      const { target } = event;
      const isAgreeButton = target.matches(
        '[data-agree-btn], [name="checkout"], [name="goto_pp"], [name="goto_gc"]'
      );

      if (isAgreeButton) {
        const form = target.closest('form');
        const checkbox = form.querySelector(
          `input[type="checkbox"]${checkboxSelector}`
        );

        if (form && checkbox) {
          if (checkbox.checked) {
            form.submit();
          } else {
            event.preventDefault();
            event.stopPropagation();
            window.T4SThemeSP.Notices(themeStrings.agree_checkout); // Assuming l is defined in the scope
          }
        }
      }
    });

    // Click event for the checkbox
    $body.on('click', (event) => {
      window.$(event.currentTarget).closest('form');

      if (window.$(event.currentTarget).is(':checked')) {
        $body.trigger('hide:t4:notice');
      }
    });
  }
};

window.T4SThemeSP.PhotoSwipe = (() => {
  const g = '.pswp__ts';
  const d = 'pswp__thumbnails';
  const u = 'pswp_thumb_active';
  let p = false;
  const m =
    '[data-pswp-btn-triger], [data-ts-gallery--open]:not(.is-pswp-disable)';
  const f = 'click.pswp';
  const h = 'data-pswp-images-trigger';
  const c = window.$('#photoswipe_template').html();

  const initializeGallery = () => {
    window
      .$('[data-ts-gallery].flickity-enabled')
      .on('dragEnd.flickity', () => {
        p = true;
      })
      .on('staticClick.flickity', () => {
        p = false;
      });

    $document.on(f, m, (event) => {
      event.preventDefault();
      const target = window.$(event.currentTarget);
      handleGalleryClick(event, target);
    });
  };

  const handleGalleryClick = (event, target) => {
    let index = -1;
    const isTriggerButton = target.is('[data-pswp-btn-triger]');

    if (isTriggerButton) {
      const groupBtns = target.closest('[data-ts-group-btns]') || target;
      const hasTriggerAttribute = target[0].hasAttribute(
        'data-pr-trigger-pswp'
      );
      const siblingGalleries = groupBtns.siblings('[data-ts-gallery]');

      index = getIndexFromTrigger(
        event,
        siblingGalleries,
        hasTriggerAttribute
          ? '[data-media-type="image"]:not(.is--media-hide)'
          : '[data-ts-gallery--item]'
      );
      p = false;
    } else {
      const isMedia = target.hasClass('product__media');
      const gallerySelector = isMedia
        ? '[data-media-type="image"]:not(.is--media-hide)'
        : '[data-ts-gallery--item]';
      const galleryElement = target.closest('[data-ts-gallery]');
      const images = galleryElement.find(
        isMedia
          ? '[data-media-type="image"]:not(.is--media-hide) [data-master]'
          : '[data-pswp-src]'
      );

      if (images.length === 0 || p) {
        p = false; // Resetting flag
        return;
      }

      const isThumbnail = galleryElement.is('data-ts-thumb-true');
      const items = extractGalleryItems(images);

      setupPhotoSwipe({
        index: index >= 0 ? index : target.index(),
        items,
        hasThumbnail: isThumbnail,
        galleryElement,
        maxSpreadZoom: parseFloat(galleryElement.attr('data-maxSpreadZoom')),
        fullscreenEl: galleryElement.attr('data-fullscreenEl'),
        shareEl: galleryElement.attr('data-shareEl'),
        counterEl: galleryElement.attr('data-counterEl'),
      });
    }

    $body.find(g).remove();
    window.T4SThemeSP.$appendComponent.after(c);
    const m = document.querySelectorAll(g)[0];
    let f = window.$(`.${d}`);
    const h = new PhotoSwipe(m, PhotoSwipeUI_Default, n, u);
    h.init();
    f.empty();
    clearTimeout(p);
    s.trigger('NTpopupInline:offClose');
    h.listen('close', function () {
      if (
        ((p = setTimeout(function () {
          s.trigger('NTpopupInline:onClose');
        }, 500)),
        a.hasClass('flickity-enabled'))
      ) {
        var n = e('[data-master="' + t.items[h.getCurrentIndex()].src + '"]')
          .parents('[data-main-slide]')
          .index();
        -1 == n && (n = h.getCurrentIndex()),
          a.flickity('selectCell', n, !1, !0);
      }
    }),
      t.HasThumb && updateThumbnails(i, n, f, h);
  };

  const getIndexFromTrigger = (event, siblingGalleries, hasTrigger) => {
    if (siblingGalleries.hasClass('flickity-enabled')) {
      let index = 0;
      window.$.each(
        siblingGalleries.find('[data-product-single-media-wrapper]'),
        (index, element) => {
          const $element = window.$(element);
          if ($element.hasClass('is-selected')) return false;
          if ($element.is(hasTrigger)) {
            index++;
          }
        }
      );
      return index;
    }
    return window.$(event.currentTarget).is(m)
      ? 0
      : window.$(event.currentTarget).index();
  };

  const extractGalleryItems = (elements) => {
    const items = [];
    elements.each((index, element) => {
      const $el = windiw.$(element);
      items.push({
        src: $el.attr('data-pswp-src') || $el.attr('data-master'),
        w: $el.attr('data-pswp-w') || $el.attr('width'),
        h: $el.attr('data-pswp-h') || $el.attr('height'),
      });
    });
    return items;
  };

  const setupPhotoSwipe = (config) => {
    const {
      index,
      items,
      hasThumbnail,
      galleryElement,
      maxSpreadZoom,
      fullscreenEl,
      shareEl,
      counterEl,
      parents,
      global,
    } = config;

    const options = {
      closeEl: true,
      captionEl: true,
      fullscreenEl: fullscreenEl || true,
      zoomEl: true,
      shareEl: shareEl || true,
      counterEl: counterEl || true,
      arrowEl: true,
      preloaderEl: true,
      history: false,
      maxSpreadZoom: maxSpreadZoom || 2,
      showHideOpacity: true,
      bgOpacity: 1,
      index,
      tapToToggleControls: true,
      shareButtons: [
        {
          id: 'facebook',
          label: themeStrings.pswp_facebook,
          url: `https://www.facebook.com/sharer/sharer.php?u={{url}}`,
        },
        {
          id: 'twitter',
          label: themeStrings.pswp_twitter,
          url: `https://twitter.com/intent/tweet?text={{text}}&url={{url}}`,
        },
        {
          id: 'pinterest',
          label: themeStrings.pswp_pinterest,
          url: `https://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}`,
        },
      ],
      getThumbBoundsFn: (index) => {
        const imageElement = global
          ? galleryElement.find(`a[data-index="${index}"]`).parents(parents)
          : galleryElement.find(parents).eq(index);
        const rect = imageElement[0]
          .getElementsByTagName('img')[0]
          .getBoundingClientRect();
        const yOffset =
          window.pageYOffset || document.documentElement.scrollTop;
        return {
          x: rect.left,
          y: rect.top + yOffset,
          w: rect.width,
        };
      },
    };

    // const photoSwipeElement = document.querySelector(g);
    // const photoSwipeInstance = new PhotoSwipe(
    //   photoSwipeElement,
    //   PhotoSwipeUI_Default,
    //   items,
    //   options
    // );
    // photoSwipeInstance.init();

    // photoSwipeInstance.listen('close', () => {
    //   setTimeout(() => {
    //     // Trigger some close event if needed
    //   }, 500);
    // });

    // if (hasThumbnail) {
    //   updateThumbnails(items, photoSwipeInstance);
    // }
  };

  const updateThumbnails = (items, photoSwipeInstance, i, o) => {
    // Thumbnail update logic here
    if (items.length === 0) return;
    items.forEach((item, index) => {
      i.append(
        `<div class="pswp_thumb_item" data-index="${
          index + 1
        }"><img loading="lazy" src="${
          photoSwipeInstance[index].src
        }" alt="pswp-thumb-img"></div>`
      );
    });

    i.find(
      '.pswp_thumb_item[data-index="' + (o.getCurrentIndex() + 1) + '"]'
    ).addClass(u);
    o.listen('beforeChange', function () {
      var e = o.getCurrentIndex() + 1,
        t = i.find('.pswp_thumb_item[data-index="' + e + '"]');
      t.siblings().removeClass(u), t.addClass(u);
    });

    o.listen('afterChange', function () {
      !(function (t) {
        let n = e('.' + u)[0],
          i = t,
          o = i[0],
          a = n.getBoundingClientRect(),
          s = o.getBoundingClientRect();
        a.left + a.width > s.width
          ? i.animate(
              {
                scrollLeft: n.offsetLeft + a.width - s.width + 10,
              },
              200
            )
          : n.offsetLeft < o.scrollLeft &&
            i.animate(
              {
                scrollLeft: n.offsetLeft - 10,
              },
              200
            );
      })(i);
    });
    i.find('.pswp_thumb_item').on('click', (event) => {
      const t = window.$(event.currentTarget).data('index');
      o.goTo(t - 1);
    });
  };

  const handleImageOpen = () => {
    $document.on(f, '[data-ts-image-opend]', (event) => {
      event.preventDefault();
      const target = window.$(event.currentTarget);
      $body.find(g).remove();
      window.T4SThemeSP.$appendComponent.after(c);
      var n = window.$(g),
        i = n[0],
        o = target.attr('data-pswp-class');
      o && n.addClass(o);
      var a = {
          history: false,
          maxSpreadZoom: 2,
          showHideOpacity: true,
          fullscreenEl: false,
          shareEl: false,
          counterEl: false,
          bgOpacity: 1,
          getThumbBoundsFn: function (e) {
            var n = window.pageYOffset || document.documentElement.scrollTop,
              i = target[0].getBoundingClientRect();
            return {
              x: i.left,
              y: i.top + n,
              w: i.width,
            };
          },
        },
        r = [],
        l = target.attr('data-pswp-w'),
        d = target.attr('data-pswp-h'),
        u = target.attr('data-pswp-src');
      r.push({
        src: u,
        w: l,
        h: d,
        title: target.text(),
      });
      var p,
        m = new PhotoSwipe(i, PhotoSwipeUI_Default, r, a);
      m.init(),
        clearTimeout(p),
        s.trigger('NTpopupInline:offClose'),
        m.listen('close', function () {
          p = setTimeout(function () {
            s.trigger('NTpopupInline:onClose');
          }, 500);
        });
    });
  };

  const openImageInPhotoSwipe = (target) => {
    const galleryElement = document.querySelector(g);
    const imageSrc = target.getAttribute('data-pswp-src');
    const imageWidth = target.getAttribute('data-pswp-w');
    const imageHeight = target.getAttribute('data-pswp-h');

    const items = [
      {
        src: imageSrc,
        w: imageWidth,
        h: imageHeight,
        title: target.textContent,
      },
    ];

    const options = {
      history: false,
      maxSpreadZoom: 2,
      showHideOpacity: true,
      fullscreenEl: false,
      shareEl: false,
      counterEl: false,
      bgOpacity: 1,
      getThumbBoundsFn: () => {
        const rect = target.getBoundingClientRect();
        const yOffset =
          window.pageYOffset || document.documentElement.scrollTop;
        return {
          x: rect.left,
          y: rect.top + yOffset,
          w: rect.width,
        };
      },
    };

    const photoSwipeInstance = new PhotoSwipe(
      galleryElement,
      PhotoSwipeUI_Default,
      items,
      options
    );
    photoSwipeInstance.init();
  };

  const handleImagesTrigger = () => {
    document.addEventListener(f, (event) => {
      const target = event.currentTarget.closest(`[${h}]`);
      if (target) {
        event.preventDefault();
        const imageItems = extractImagesFromTrigger(target);
        if (imageItems.length > 0) {
          setupPhotoSwipe({ items: imageItems });
        }
      }
    });
  };

  const extractImagesFromTrigger = (target) => {
    const imageData = target.getAttribute(h);
    return imageData ? JSON.parse(imageData) : [];
  };

  return {
    gallery: initializeGallery,
    image: handleImageOpen,
    images: handleImagesTrigger,
  };
})();

var VideoHandler = class {
  constructor() {
    this.loadedClass = 'postervideo-playing';
  }

  pauseAllVideos() {
    (window.jQuery || window.$)('.js-youtube').each(function () {
      this.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    });
    (window.jQuery || window.$)('.js-vimeo').each(function () {
      this.contentWindow.postMessage('{"method":"pause"}', '*');
    });
    (window.jQuery || window.$)('video:not(.bg_vid_html5)').each(function () {
      this.pause();
    });
    (window.jQuery || window.$)('.product-model').each(function () {
      this.modelViewerUI && this.modelViewerUI.pause();
    });
  }

  onYouTubePlayerReady(event) {
    event.target.playVideo();
  }

  initPoster() {
    (window.jQuery || window.$)('[data-video-poster-btn]').on(
      'click',
      (event) => {
        event.preventDefault();
        const $poster = window
          .jQuery(event.currentTarget)
          .closest('[data-video-poster]');
        const $videoElement = $poster.find('video, iframe');

        this.pauseAllVideos();

        this.setupVideo(
          $poster,
          (window.jQuery || window.$)(event.currentTarget)
        );
        setTimeout(() => {
          $poster.addClass(this.loadedClass);
          $videoElement.focus();
        }, 50);
      }
    );

    (window.jQuery || window.$)('[data-video-poster-close]').on(
      'click',
      (event) => {
        event.preventDefault();
        this.pauseAllVideos();
        const $poster = window
          .jQuery(event.currentTarget)
          .closest('[data-video-poster]');
        $poster.removeAttr('loaded').removeClass(this.loadedClass);
        $poster.find('video, iframe').remove();
      }
    );
  }

  setupVideo($poster, $button) {
    if (!$poster.is('[loaded]')) {
      const $insertTarget = $poster.find('[data-video-insert]').length
        ? $poster.find('[data-video-insert]')
        : $poster;
      let videoHtml =
        '<iframe src="src" id="id" class="class" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0"></iframe>';
      const options = JSON.parse($button.attr('data-options') || '{}');
      const { type, vid, id, srcDefault, autoplay, loop, accent_color } =
        options;

      const videoTypes = {
        html5: 'html5',
        youtube: 'youtube',
        vimeo: 'vimeo',
      };

      if (type === videoTypes.youtube) {
        videoHtml = `<div id="${id.replace('#', 'yt_')}"></div>`;
      } else if (type === videoTypes.vimeo) {
        videoHtml = videoHtml
          .replace(
            'src',
            `//player.vimeo.com/video/${vid}?&portrait=0&byline=0&color=${accent_color}&autoplay=${+autoplay}&loop=${+loop}`
          )
          .replace('class', 'js-vimeo');
      } else if (id && (window.jQuery || window.$)(id)[0]) {
        videoHtml = (window.jQuery || window.$)(id).html();
      } else {
        videoHtml =
          `<video src="src" preload="auto" controls data-autoplay data-loop playsinline></video>`.replace(
            'src',
            srcDefault
          );
      }

      if (autoplay) {
        videoHtml = videoHtml.replace('data-autoplay', 'autoplay');
      }
      if (loop) {
        videoHtml = videoHtml.replace('data-loop', 'loop');
      }

      $insertTarget.append(videoHtml);
      $poster.attr('data-type-video-inline', '').attr('loaded', true);

      if (type === videoTypes.youtube) {
        this.loadYouTubeAPI(id, vid, loop);
      }
    }
  }

  loadYouTubeAPI(id, vid, loop) {
    if ((window.jQuery || window.$)('#YTAPI').length <= 0) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.id = 'YTAPI';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    const intervalId = setInterval(() => {
      if (
        typeof onYouTubeIframeAPIReady === 'function' &&
        typeof YT.Player === 'function'
      ) {
        const player = new YT.Player(id.replace('#', 'yt_'), {
          height: '315',
          width: '560',
          videoId: vid,
          playerVars: {
            playsinline: 1,
            rel: 0,
            playlist: vid,
            loop: loop ? 1 : 0,
          },
          events: {
            onReady: this.onYouTubePlayerReady,
          },
        });
        clearInterval(intervalId);
      }
    }, 100);
  }
};

var LoadMoreContent = class {
  constructor(container) {
    this.container = container;
    this.$container = (window.jQuery || window.$)(container);
    this.options = JSON.parse(this.$container.attr('data-ntajax-options'));
    this.main = this.options.id || '';
    this.typeAjax = this.options.type || 'LmDefault';
    this.isProduct = this.options.isProduct || false;
    this.$section = (window.jQuery || window.$)(
      `#shopify-section-${this.main}`
    );
    this.isbtnLoadMore = true;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.$container.on('click.ntlm', '[data-load-more]', (event) => {
      event.preventDefault();
      const $button = (window.jQuery || window.$)(event.currentTarget);
      $button.addClass('is--loading');
      const url = `${
        $button.attr('data-href') || $button.attr('href')
      }&section_id=${this.main}`;
      this.isbtnLoadMore = !$button.is('[data-is-prev]');
      this.$btnCurrent = $button;
      this.renderSectionFromFetch(url);
    });
  }

  async renderSectionFromFetch(url) {
    const response = await window.T4SThemeSP.getToFetchSection(
      null,
      'text',
      url
    );
    if (response !== 'NVT_94') {
      this.$btnCurrent.removeClass('is--loading');
      this[this.typeAjax](response);
      if (this.isProduct) window.T4SThemeSP.reinitProductGridItem();
      (window.jQuery || window.$)(document).trigger('ts:hideTooltip');
    } else {
      this.$btnCurrent.removeClass('is--loading');
    }
  }

  LmDefault(content) {
    const $content = (window.jQuery || window.$)(content);
    const newContent = $content.find('[data-contentlm-replace]').html();
    const $wrap = this.isbtnLoadMore
      ? $content.find('[data-wrap-lm]')
      : $content.find('[data-wrap-lm-prev]');
    const $existingContent =
      this.$container.find('[data-contentlm-replace]') ||
      this.$section.find('[data-contentlm-replace]');

    if (this.isbtnLoadMore) {
      $existingContent.append(newContent);
    } else {
      $existingContent.prepend(newContent);
    }
    this.initLoamoreUpdate($wrap);
  }

  LmIsotope(content) {
    const $content = (window.jQuery || window.$)(content);
    const newContent = $content.find('[data-contentlm-replace]').html();
    const $wrap = this.isbtnLoadMore
      ? $content.find('[data-wrap-lm]')
      : $content.find('[data-wrap-lm-prev]');
    const $existingContent =
      this.$container.find('[data-contentlm-replace]') ||
      this.$section.find('[data-contentlm-replace]');

    const $newContent = (window.jQuery || window.$)(newContent);
    if (this.isbtnLoadMore) {
      $existingContent.append($newContent).isotope('appended', $newContent);
    } else {
      $existingContent.prepend($newContent).isotope('prepended', $newContent);
    }
    this.initLoamoreUpdate($wrap);
  }

  initLoamoreUpdate($wrap) {
    const selector = this.isbtnLoadMore
      ? '[data-wrap-lm]'
      : '[data-wrap-lm-prev]';
    let $containerWrap =
      this.$container.find(selector) || this.$section.find(selector);
    if ($wrap.length > 0) {
      $containerWrap.html($wrap.html());
    } else {
      $containerWrap.hide();
    }
  }
};

window.T4SThemeSP.initLoadMore = () => {
  const options = document.querySelectorAll(
    '[data-ntajax-options][data-not-main]:not(.is--enabled)'
  );
  options.forEach((option) => {
    option.classList.add('is--enabled');
    option.LoadMore = new LoadMoreContent(option);
  });
};
window.T4SThemeSP.reinitProductGridItem = () => {
  window.T4SThemeSP.ProductItem.init();
  window.T4SThemeSP.ProductItem.reloadReview();
  window.T4SThemeSP.Tooltip();
  window.T4SThemeSP.Countdown();
  window.T4SThemeSP.Compare.updateAll();
  window.T4SThemeSP.Wishlist.updateAll();
  document.dispatchEvent(new Event('currency:update'));
};

window.T4SThemeSP.instagram = () => {
  const url = `https://d3ejra0xbg20rg.cloudfront.net/instagram/media?shop=${Shopify.shop}&resource=default`;
  const token = 'ins_19041994';
  const accessTokenName = 'ig_ts_token';
  const isTokenValid = CookiesT4.get(accessTokenName) === 'true';
  const iconTemplate =
    (window.jQuery || window.$)('.icons-ins-svg').innerHTML || '';
  const splitIcons = iconTemplate.split('[split]');
  const loadedClass = { loaded: 'ins-is--loaded' };

  const fetchInstagramData = async (optionsElement) => {
    const options = JSON.parse(optionsElement.getAttribute('data-ins-options'));
    const { id, limit, acc = 'spnt', target } = options;
    const sessionKey = `nt_ins${atob(acc)}${id}`;

    let storedData = sessionStorage.getItem(sessionKey);
    let tokenData = sessionStorage.getItem(`nt_ins${atob(acc)}`);

    if (acc !== 'spnt') {
      if (storedData) {
        const currentTime = new Date();
        const tokenExpiration = new Date(JSON.parse(tokenData).timestamp);
        tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 30);

        if (currentTime > tokenExpiration) {
          storedData = null;
          sessionStorage.removeItem(sessionKey);
          sessionStorage.removeItem(`nt_ins${atob(acc)}`);
        }
      }

      if (storedData) {
        optionsElement.innerHTML = storedData;
        optionsElement.parentElement.classList.add(loadedClass.loaded);
        if (optionsElement.classList.contains('flickity-later')) {
          optionsElement.flickityt4s = new window.T4SThemeSP.Carousel(
            optionsElement
          );
        }
        return;
      }

      if (tokenData) {
        const mediaData = JSON.parse(tokenData).content;
        populateInstagramFeed(
          optionsElement,
          mediaData,
          false,
          atob(acc),
          limit,
          id,
          target
        );
      } else {
        const accessTokenUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption,children&access_token=${atob(
          acc
        )}`;
        try {
          const response = await fetch(accessTokenUrl);
          if (!response.ok) throw new Error('not ok');
          const data = await response.json();
          const mediaItems = acc === 'a' ? data : data.data;

          populateInstagramFeed(
            optionsElement,
            mediaItems,
            true,
            atob(acc),
            limit,
            id,
            target
          );
          if (!isTokenValid) {
            CookiesT4.set(accessTokenName, 'true', { expires: 7 });
            await fetch(
              `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${atob(
                acc
              )}`
            );
          }
        } catch (error) {
          optionsElement.innerHTML = '';
          console.error('Instagram Feed: error fetching', error);
        }
      }
    }
  };

  const populateInstagramFeed = (
    element,
    mediaArray,
    load,
    accessToken,
    limit,
    id,
    target
  ) => {
    const mediaTypeMap = {
      image: splitIcons[0],
      video: splitIcons[1],
      carousel_album: splitIcons[2],
    };

    let content = '';
    mediaArray.forEach((item, index) => {
      if (index >= limit) return;

      const thumbnailUrl = item.thumbnail_url || item.media_url;
      const mediaType = mediaTypeMap[item.media_type];
      content += `
                  <div class="col-ins${index} col-ins col-item ins-type-${mediaType}">
                      <a data-no-instant rel="nofollow" class="d-block relative overflow-hidden" href="${item.permalink}" target="${target}">
                          <div class="ratio bg lazyload lz--ins" data-bg="${thumbnailUrl}" data-sizes="auto"></div>
                          <span class="lazyload-loader"></span>
                          <div class="ins-info">
                              <span class="ins-icon">${mediaTypeMap[mediaType]}</span>
                          </div>
                      </a>
                  </div>
              `;
    });

    element.innerHTML = content;
    element.parentElement.classList.add(loadedClass.loaded);
    if (element.classList.contains('flickity-later')) {
      element[0].flickityt4s = new window.T4SThemeSP.Carousel(element[0]);
    }

    if (isStorageSpSessionAll && load) {
      sessionStorage.setItem(`nt_ins${accessToken}${id}`, content);
      sessionStorage.setItem(
        `nt_ins${accessToken}`,
        JSON.stringify({ timestamp: new Date(), content: mediaArray })
      );
    }
  };

  const optionsElements = document.querySelectorAll('[data-ins-options]');
  optionsElements.forEach(fetchInstagramData);
};

window.T4SThemeSP.sideBarInit = () => {
  const $ = window.jQuery || window.$;
  const sidebarElement = $('[data-sidebar-id]');
  const isSidebarTrue = sidebarElement.attr('data-sidebar-true');
  const sidebarContentElement = $('[data-sidebar-content]');
  const isDrawerDisabled = sidebarElement.attr('data-is-disableDrawer');

  if (sidebarElement.length > 0) {
    const sidebarId = sidebarElement.attr('data-sidebar-id');
    let searchParams = window.location.search.slice(1);
    let fetchUrl = `${window.location.pathname}?section_id=${sidebarId}&${searchParams}`;

    window.T4SThemeSP.getToFetchSection(null, 'text', fetchUrl).then(
      (response) => {
        if (response === 'NVT_94') {
          sidebarContentElement.text('');
          return console.error('Error: Invalid response from fetch');
        }
        const [mainContent, additionalContent, drawerOptions] = response
          .split('[splitlz]')
          .map((part) => part.split('[splitlz2]'));

        if (isSidebarTrue || ($window.width() < 1024 && !isDrawerDisabled)) {
          window.T4SThemeSP.$appendComponent.after(
            additionalContent[0] + mainContent + additionalContent[1]
          );
        } else {
          sidebarContentElement.text(mainContent);
          window.T4SThemeSP.$appendComponent.after(
            additionalContent[0] + mainContent + additionalContent[1]
          );
        }

        window.T4SThemeSP.initializeComponents();

        const drawerOptionsData = JSON.parse(
          sidebarElement.attr('data-drawer-options')
        );
        window.T4SThemeSP.initializeFlickity(drawerOptionsData.id);
      }
    );
  }
};

window.T4SThemeSP.initializeComponents = () => {
  window.T4SThemeSP.instagram();
  window.T4SThemeSP.Countdown();
  window.T4SThemeSP.Tooltip();
  window.T4SThemeSP.reinitProductGridItem();
  window.T4SThemeSP.Tabs.Accordion();
  $body.trigger('currency:update');
  $document.trigger('sidebar:updated');
};

window.T4SThemeSP.initializeFlickity = (drawerOptionsId) => {
  const $ = window.jQuery || window.$;
  const drawerElements = $(`${drawerOptionsId} .flickity-later`);
  drawerElements.forEach((element) => {
    element.flickityt4s = new window.T4SThemeSP.Carousel(element);
  });

  const sidebarContentFlickityElements = $(
    '[data-sidebar-content] .flickity-later'
  );
  sidebarContentFlickityElements.forEach((element) => {
    element.flickityt4s = new window.T4SThemeSP.Carousel(element);
  });
};

//done
window.T4SThemeSP.BackToTop = (() => {
  const backToTopButton = window.$('[data-BackToTop]');
  const scrollTopThreshold = parseInt(backToTopButton.data('scrolltop') || '0');
  const circleElement = backToTopButton.find('.circle-css')[0];
  let scrollTimeout, circleTimeout;

  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      backToTopButton.toggleClass(
        'is--show',
        $window.scrollTop() > scrollTopThreshold
      );
    }, 40);

    if (circleElement) {
      if (circleTimeout) clearTimeout(circleTimeout);
      circleTimeout = setTimeout(() => {
        const scrollPercentage =
          $window.scrollTop() / ($body.outerHeight() - $window.innerHeight());
        const circleRotation = 360 * scrollPercentage;
        circleElement.style.setProperty(
          '--cricle-degrees',
          `${circleRotation}deg`
        );
      }, 6);
    }
  };

  return () => {
    if (
      (isMobile && backToTopButton.data('hidden-mobile')) ||
      backToTopButton.length === 0
    )
      return;
    window.addEventListener('scroll', handleScroll);

    backToTopButton.on('click', (event) => {
      event.preventDefault();
      window.$('html, body').animate(
        {
          scrollTop: 0,
        },
        isBehaviorSmooth ? 0 : 800
      );
    });
  };
})();

var T4SThemeSPHeader = class {
  headerSection = null;
  unusedVariable = null;
  headerSelector = '.section-header';
  headerElement = document.querySelector(this.headerSelector);
  headerOptions = {};
  scrollPosition = 0;
  isStickyEnabled = false;
  headerHeight = 0;
  dataHeaderOptions = 'data-header-options';
  rawHeaderOptions =
    (window.jQuery || window.$)(this.headerElement)
      .find('[' + this.dataHeaderOptions + ']')
      .attr(this.dataHeaderOptions) || '{}';
  parsedOptions = JSON.parse(this.rawHeaderOptions);
  isSticky = this.parsedOptions.isSticky;
  hideOnScrollDown = this.parsedOptions.hideScroldown;
  documentElement = document.documentElement;
  hoverActionClass = 'is-action__hover';
  menuNavigation = (window.jQuery || window.$)('[data-menu-nav]');
  navItemsWithChildren = this.menuNavigation.find('>li.has--children');
  headerWrapper = (window.jQuery || window.$)(this.headerElement);
  positionCalculationClass = 'calc-pos-submenu';
  isVerticalHeader = this.headerWrapper.hasClass('header-vertical');
  categoriesMenuSelector = '.is-header-categories-menu';
  categoriesSelector = '.is-header-categories';
  categoriesMenuElement = (window.jQuery || window.$)(
    this.categoriesMenuSelector
  );
  categoriesElement = (window.jQuery || window.$)(this.categoriesSelector);
  childOpenClass = 'is--child-open';
  noTransitionClass = 'no-transiton-nav-a';
  headerStuckClass = 'is-header--stuck';
  scrollThreshold = 200;
  onlyClickDropIcon = window.T4Sconfigs.onlyClickDropIcon
    ? '.menu-item.has--children>a>.-menu-toggle'
    : '.menu-item.has--children>a';
  X = true;

  constructor() {}

  // Function to handle mega menu loading with session storage
  loadMegaMenu() {
    this.megaMenuElements = (window.jQuery || window.$)(
      '.type__mega .lazy_menu'
    );
    const activeCategory = (window.jQuery || window.$)(
      '.list-categories--item.is--active'
    );
    const categoryIndex =
      activeCategory.index() > 0 ? activeCategory.index() : '';
    this.storageKeyTime = cacheNameFirst + 'timeMega' + categoryIndex;
    this.storageKeyData = cacheNameFirst + 'dataMega' + categoryIndex;
    const lastSessionTime = isStorageSpSession
      ? parseInt(sessionStorage.getItem(this.storageKeyTime) || 0)
      : 0;
    this.cacheExpiry = 1800000;

    if (!(this.megaMenuElements.length == 0 || viewportWidth < 1024)) {
      // Check if cached data is valid or design mode is enabled
      if (
        !IsDesignMode &&
        lastSessionTime > 0 &&
        lastSessionTime >= Date.now()
      ) {
        this.populateContentAndInitializeFeatures(
          this.megaMenuElements,
          sessionStorage.getItem(this.storageKeyData)
        );
      } else {
        const megaMenuSection = (window.jQuery || window.$)(
          '.section-mega__menu'
        );
        const sectionId =
          megaMenuSection.length > 0
            ? megaMenuSection.find('[data-section-id]').data('section-id')
            : 'mega-menu,mega-menu2';
        const categoryUrl = activeCategory.find('>a').attr('href');

        // Fetch menu section if it’s not already loaded
        if (
          categoryIndex > 0 &&
          megaMenuSection.length === 0 &&
          location.pathname !== categoryUrl
        ) {
          window.T4SThemeSP.getToFetchSection(null, 'text', categoryUrl).then(
            (response) => {
              if (response !== 'NVT_94') {
                const sectionId = (window.jQuery || window.$)(response)
                  .find('.section-mega__menu [data-section-id]')
                  .data('section-id');
                sectionId && this.fetchMenuSection(sectionId);
              }
            }
          );
        } else {
          this.fetchMenuSection(sectionId);
        }
      }
    }
  }

  // Fetch menu content and store it in session storage
  fetchMenuSection(sectionId) {
    window.T4SThemeSP.getToFetchSection('?sections=' + sectionId, 'json').then(
      (response) => {
        if (response === 'NVT_94' || response.status) {
          response.status && console.error(response.description);
        } else {
          let content = '';
          for (const key in response) {
            content += response[key].split('[nt_mega_split1]')[1];
          }
          this.populateContentAndInitializeFeatures(
            this.megaMenuElements,
            '<div>' + content + '</div>'
          );
          if (isStorageSpSession) {
            sessionStorage.setItem(
              this.storageKeyTime,
              Date.now() + this.cacheExpiry
            );
            sessionStorage.setItem(
              this.storageKeyData,
              '<div>' + content + '</div>'
            );
          }
        }
      }
    );
  }

  loadMenuContent(container) {
    container
      .find(this.onlyClickDropIcon)
      .off('click')
      .on('click', function (event) {
        event.preventDefault();
        const element = (window.jQuery || window.$)(this);
        element.hasClass('menu-toggle') && (element = element.closest('a')),
          element.hasClass(this.childOpenClass)
            ? element
                .removeClass(this.childOpenClass)
                .siblings('ul')
                .slideUp(this.scrollThreshold)
            : element
                .addClass(this.childOpenClass)
                .siblings('ul')
                .slideDown(this.scrollThreshold);
      });
  }
  // Function to handle dropdown menu loading with session storage
  loadDropdownMenu() {
    const dropdownMenuElements = (window.jQuery || window.$)(
      '.type__drop .lazy_menu'
    );
    const activeCategoryIndex = (window.jQuery || window.$)(
      '.list-categories--item.is--active'
    ).index();
    const storageKeyTime =
      activeCategoryIndex > 0
        ? cacheNameFirst + 'timeDrop' + activeCategoryIndex
        : cacheNameFirst + 'timeDrop';
    const storageKeyData =
      activeCategoryIndex > 0
        ? cacheNameFirst + 'dataDrop' + activeCategoryIndex
        : cacheNameFirst + 'dataDrop';
    const lastSessionTime = isStorageSpSession
      ? parseInt(sessionStorage.getItem(storageKeyTime) || 0)
      : 0;

    // Load content for each dropdown menu item
    if (IsDesignMode) {
      dropdownMenuElements.each((indx, value) => {
        this.positionSubMenu(
          (window.jQuery || window.$)(value).closest('.has--children')
        );
        this.loadMenuContent((window.jQuery || window.$)(value));
      });
    }
    if (
      !(
        dropdownMenuElements.length == 0 ||
        viewportWidth < 1024 ||
        IsDesignMode
      )
    ) {
      if (lastSessionTime > 0 && lastSessionTime >= Date.now()) {
        const cachedData = sessionStorage
          .getItem(storageKeyData)
          .split('[nt_drop_split2]');
        dropdownMenuElements.each((index, value) => {
          (window.jQuery || window.$)(value).html(cachedData[index]);
          this.positionSubMenu(
            (window.jQuery || window.$)(value).closest('.has--children')
          );
          this.loadMenuContent((window.jQuery || window.$)(value));
        });
      } else {
        let itemHandles = [];
        dropdownMenuElements.each((indx, value) => {
          itemHandles.push((window.jQuery || window.$)(value).data('handle'));
        });
        itemHandles = itemHandles.join(' ');
        window.T4SThemeSP.getToFetchSection(
          null,
          'text',
          `${window.T4Sroutes.search_url}?type=article&q=${itemHandles}&section_id=dropdown-menu`
        ).then((response) => {
          if (response !== 'NVT_94') {
            const contentSections = response
              .split('[nt_drop_split1]')[1]
              .split('[nt_drop_split2]');
            dropdownMenuElements.each((index, value) => {
              (window.jQuery || window.$)(value).html(contentSections[index]);
              this.positionSubMenu(
                (window.jQuery || window.$)(value).closest('.has--children')
              );
              this.loadMenuContent((window.jQuery || window.$)(value));
            });
            if (isStorageSpSession) {
              sessionStorage.setItem(
                storageKeyTime,
                Date.now() + this.cacheExpiry
              );
              sessionStorage.setItem(
                storageKeyData,
                '<div>' + response + '</div>'
              );
            }
          }
        });
      }
    }
  }

  // Initialize header
  init(settings) {
    this.loadMegaMenu();
    this.loadDropdownMenu();
    this.setupMenuToggle(settings);
    this.handleMenuClick(settings);

    document.addEventListener('theme:hover', function () {
      this.handleMenuClick(settings);
    });

    // Additional setup tasks
    this.adjustLayoutForDesktop();
    this.applyLayoutToElements(settings, true);
    this.loadCategoryData();
    setTimeout(() => {
      $window.on('resize.menu', () => this.adjustLayoutForDesktop());
    }, 2000);
  }

  // Function to apply layout and add classes to specified elements based on screen size and conditions
  applyLayoutToElements(elements, useLayoutOption) {
    // Update `elements` if a new set is provided
    if (elements) {
      this.navItemsWithChildren = elements;
    }

    // Exit function if screen width is less than 1024 or if there are no elements to process
    if (viewportWidth < 1024 || this.navItemsWithChildren.length === 0) return;

    // In design mode, re-select the header section
    if (IsDesignMode) {
      this.headerWrapper = (window.jQuery || window.$)(this.headerSelector);
    }

    // Apply layout adjustments to each child element
    this.navItemsWithChildren.each((instance) => {
      this.positionSubMenu(
        (window.jQuery || window.$)(instance),
        useLayoutOption
      );
    });

    // Add a class to header section to indicate position calculation is done
    this.headerWrapper.addClass(this.positionCalculationClass);
  }

  // Function to update category content and initialize various components
  updateCat(
    contentHTML,
    container = this.categoriesMenuElement.find('[data-wrapper-categories]')
  ) {
    // Set HTML content of the provided container
    container.html(contentHTML);

    // Recalculate layout dimensions
    this.adjustLayoutForDesktop();

    // Retrieve child elements with categories navigation
    const categoryItems = container.find('#nav-categories > .has--children');

    // Initialize menu actions and hover effects on category items
    this.setupMenuToggle(categoryItems);
    this.handleMenuClick(categoryItems);

    // Add hover effect listener
    document.addEventListener('theme:hover', () => {
      this.handleMenuClick(categoryItems);
    });

    // Trigger layout adjustments
    this.applyLayoutToElements(categoryItems);

    // Run delayed layout adjustment
    setTimeout(() => {
      this.applyLayoutToElements(categoryItems);
    }, 1000);

    // Initialize lazy-loaded menus
    container.find('.type__drop .lazy_menu').each(function () {
      this.setupMenuToggle((window.jQuery || window.$)(this));
    });

    // Reinitialize product grid items if they exist
    if (container.find('.products .product').length > 0) {
      window.T4SThemeSP.reinitProductGridItem();
    }

    // Initialize 'isotope' layout and carousel for specified elements
    const isotopeElements = container.find('.isotope-later');
    const carouselElements = container.find('.flickity-later');

    // Initialize Isotope layout for each relevant element
    if (isotopeElements.length > 0) {
      isotopeElements.each(function () {
        window.T4SThemeSP.Isotopet4s.init((window.jQuery || window.$)(this));
      });
    }

    // Initialize carousels for each element with flickity later initialization
    if (carouselElements.length > 0) {
      carouselElements.each(function () {
        this.flickityt4s = new window.T4SThemeSP.Carousel(this);
      });
    }
  }

  // Function to manage loading and caching category data
  loadCategoryData() {
    // Check if there are any category wrappers present
    if (
      this.categoriesMenuElement.find('[data-wrapper-categories]').length !== 0
    ) {
      // If in design mode, refresh category elements and set HTML
      if (IsDesignMode) {
        this.categoriesMenuElement = (window.jQuery || window.$)(
          this.categoriesMenuSelector
        );
        const categoryWrapper = (window.jQuery || window.$)(
          this.categoriesSelector
        );
        this.updateCat(categoryWrapper.html());
      } else {
        // Define keys for session storage
        const cacheTimeKey = sessionKeyPrefix + 'timeCatCache';
        const cacheDataKey = sessionKeyPrefix + 'dataCatCache';

        // Retrieve cached time or set it to 0 if session storage is unavailable
        let cachedTime = isSessionStorageAvailable
          ? parseInt(sessionStorage.getItem(cacheTimeKey) || 0)
          : 0;

        // Use cached data if valid
        if (cachedTime > 0 && cachedTime >= Date.now()) {
          this.updateCat(sessionStorage.getItem(cacheDataKey));
        } else {
          // Prepare request parameters if cache is expired or unavailable
          const categoryElement = (window.jQuery || window.$)(
            '.is-header-categories'
          );
          const sectionID =
            categoryElement.length > 0
              ? `${categoryElement
                  .find('[data-section-id]')
                  .data('section-id')}&q=${categoryElement
                  .find('[data-section-id]')
                  .data('section-id')}`
              : 'header-categories';

          // Fetch the category section content
          window.T4SThemeSP.getToFetchSection(
            null,
            'text',
            `${searchUrl}/?section_id=${sectionID}`
          ).then((response) => {
            if (response !== 'NVT_94') {
              const parsedHTML = new DOMParser()
                .parseFromString(response, 'text/html')
                .querySelector('div').innerHTML;
              this.updateCat(parsedHTML);

              // Update session storage with fresh data
              if (isStorageSpSession) {
                cachedTime = Date.now() + this.cacheExpiry; // 30 minutes cache duration
                sessionStorage.setItem(cacheTimeKey, cachedTime);
                sessionStorage.setItem(cacheDataKey, parsedHTML);
              }
            }
          });
        }
      }
    }
  }

  // Function to adjust layout dimensions and perform layout refresh for desktop view
  adjustLayoutForDesktop() {
    // Exit if the window width is less than 1024 (likely mobile or tablet view)
    if ($window.width() < 1024) return;

    // If in design mode, re-select header section element
    if (IsDesignMode) {
      this.headerWrapper = (window.jQuery || window.$)(this.headerSelector);
    }

    // Remove any inline styles and set CSS variables for maximum width and height
    this.headerWrapper.removeAttr('style').css({
      '--ts-max-width': `${$window.width() - 10}px`,
      '--ts-max-height': `${
        $window.height() -
        Math.max(0, this.headerElement.getBoundingClientRect().top) -
        Math.max(0, this.headerElement.offsetHeight) -
        20
      }px`,
    });

    // Trigger layout refresh for any active Isotope grid items in the header section
    this.headerWrapper.find('.isotope-enabled').isotope('layout');

    // Repeat the layout refresh after a slight delay to ensure layout is updated
    setTimeout(() => {
      this.headerWrapper.find('.isotope-enabled').isotope('layout');
    }, 500);

    // Adjust navigation categories layout
    const navCategories = (window.jQuery || window.$)('#nav-categories');
    if (navCategories.length === 0) return;

    // Calculate available space for navigation categories
    let availableWidth =
      $window.width() -
      Math.max(0, navCategories[0].getBoundingClientRect().left) -
      navCategories.width();
    if (isThemeRTL) {
      availableWidth =
        $window.width() -
        ($window.width() -
          Math.max(0, navCategories[0].getBoundingClientRect().left));
    }

    // Apply CSS variables for navigation categories max width and height
    navCategories.removeAttr('style').css({
      '--ts-max-width': `${availableWidth}px`,
      '--ts-max-height': `${
        $window.height() -
        Math.max(0, navCategories[0].getBoundingClientRect().top) -
        10
      }px`,
    });

    // Trigger layout refresh for any active Isotope grid items in navigation categories
    navCategories.find('.isotope-enabled').isotope('layout');

    // Repeat the layout refresh after a slight delay for smoother layout update
    setTimeout(() => {
      navCategories.find('.isotope-enabled').isotope('layout');
    }, 500);
  }

  setup() {
    if (this.IsDesignMode) {
      if (!this.headerElement) return;
      this.headerElement.removeEventListener(
        'preventHeaderReveal',
        this.s.bind(this)
      );
      window.removeEventListener('scroll', this.handleScroll());
    }

    if (this.O && this.N && !this.W) {
      this.headerElement.addEventListener(
        'preventHeaderReveal',
        this.s.bind(this)
      );
      window.addEventListener('scroll', this.handleScroll(this), false);
      new IntersectionObserver((entries, observer) => {
        this.headerOptions = entries[0].intersectionRect;
        observer.disconnect();
      }).observe(this.headerElement);
    } else {
      this.headerElement.classList.remove(
        'shopify-section-header-hidden',
        'animate'
      );
    }
  }

  //
  l() {
    this.headerElement.dispatchEvent(new Event('HeaderHide'));
    this.headerWrapper.one(
      'transitionend webkitTransitionEnd oTransitionEnd',
      () => {
        if (this.headerWrapper.hasClass('shopify-section-header-hidden')) {
          this.documentElement.classList.remove(this.headerStuckClass);
        }
      }
    );
    this.headerElement.classList.add(
      'shopify-section-header-hidden',
      'shopify-section-header-sticky'
    );
  }
  //
  c() {
    this.headerElement.dispatchEvent(new Event('HeaderReveal'));
    this.documentElement.classList.add(this.headerStuckClass);
    this.headerElement.classList.add(
      'shopify-section-header-sticky',
      'animate'
    );
    this.headerElement.classList.remove('shopify-section-header-hidden');
  }
  //
  d() {
    this.documentElement.classList.remove(this.headerStuckClass);
    if (
      this.X &&
      this.headerOptions.top === 0 &&
      this.headerOptions.height === 0
    ) {
      this.headerOptions = this.headerElement.getBoundingClientRect();
      this.X = false;
    }
    this.headerElement.classList.remove(
      'shopify-section-header-hidden',
      'shopify-section-header-sticky',
      'animate'
    );
    this.documentElement.classList.add(this.noTransitionClass);
    let _;
    clearTimeout(_);
    _ = setTimeout(() => {
      this.documentElement.classList.remove(this.noTransitionClass);
    }, 366);
  }

  // Function to manage sticky header behavior based on scroll events
  stickyInit() {
    (function (instance) {
      // Check if conditions are met to set up the observer
      if (
        !instance.isSticky ||
        (instance.isSticky && instance.hideOnScrollDown) ||
        instance.isVerticalHeader
      )
        return;

      // Create an Intersection Observer to monitor the visibility of the sentinel element
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isVisible = Math.round(entry.intersectionRatio);

          // If the sentinel is not visible
          if (isVisible === 0) {
            instance.documentElement.classList.add(instance.headerStuckClass);
            if (instance.X) {
              instance.documentElement.classList.add('hsticky__ready');
              instance.X = false; // Update the flag indicating that the sticky header is ready
            }
          }
          // If the sentinel is fully visible
          else if (isVisible === 1) {
            instance.documentElement.classList.remove(
              instance.headerStuckClass
            ); // Remove visibility class
            instance.documentElement.classList.add(instance.noTransitionClass); // Add class for header active state
            let _;
            clearTimeout(_); // Clear any existing timeout
            _ = setTimeout(() => {
              instance.documentElement.classList.remove(
                instance.noTransitionClass
              ); // Remove active class after a delay
            }, 366);
          }
        },
        {
          threshold: [0, 1], // Observe when the intersection ratio crosses 0 or 1
        }
      );

      // Observe the sentinel element if it exists
      if ((window.jQuery || window.$)('#hsticky__sentinel').length > 0) {
        observer.observe(document.querySelector('#hsticky__sentinel'));
      }

      // Initial setup for the sticky header ready state
      setTimeout(() => {
        instance.documentElement.classList.add('hsticky__ready');
        instance.X = false; // Mark the header as ready after the delay
      }, 396);
    })(this);
    this.initializeHeaderBehavior();
    // Set initial styles for topbar and header heights
    this.updateHeaderStyles();

    // Update styles on window resize
    $window.on('resize', this.updateHeaderStyles);
  }

  // Function to manage the header's visibility and behavior based on design mode and scroll events
  initializeHeaderBehavior() {
    // Check if in design mode
    if (IsDesignMode) {
      this.headerElement = document.querySelector('.section-header');
      this.headerOptions = {};
      this.scrollPosition = 0;
      this.isStickyEnabled = false;
      this.rawHeaderOptions =
        (window.jQuery || window.$)(this.headerElement)
          .find('[' + this.dataHeaderOptions + ']')
          .attr(this.dataHeaderOptions) || '{}';
      this.parsedOptions = JSON.parse(this.rawHeaderOptions);
      this.isSticky = parsedSettings.isSticky;
      this.hideOnScrollDown = parsedSettings.hideScroldown;
      if (!this.headerElement) return;

      // Remove previous event listeners if any
      this.headerElement.removeEventListener('preventHeaderReveal', () =>
        this.preventHeaderReveal()
      );
      window.removeEventListener('scroll', () => this.handleScroll());
    }

    // If sticky and hide scroll down conditions are met, set up new event listeners
    if (this.hideOnScrollDown && this.isSticky && !this.isVerticalHeader) {
      this.headerElement.addEventListener('preventHeaderReveal', () =>
        this.preventHeaderReveal()
      );
      window.addEventListener('scroll', () => this.handleScroll(), false);

      // Create an Intersection Observer to monitor the header's visibility
      new IntersectionObserver((entries, observer) => {
        this.headerOptions = entries[0].intersectionRect; // Store the intersection rectangle
        observer.disconnect(); // Stop observing after the first entry
      }).observe(this.headerElement);
    } else {
      // Remove visibility classes if conditions are not met
      this.headerElement.classList.remove(
        'shopify-section-header-hidden',
        'animate'
      );
    }
  }

  // Function to handle scroll events and manage header visibility
  handleScroll() {
    // Get the current vertical scroll position
    const currentScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // If scrolling down past the threshold and past the bottom of the intersection rectangle
    if (
      currentScrollPosition > this.scrollPosition &&
      currentScrollPosition > this.headerOptions.bottom
    ) {
      requestAnimationFrame(() => this.l()); // Show header animation
    }
    // If scrolling up past the threshold and past the bottom of the intersection rectangle
    else if (
      currentScrollPosition < this.scrollPosition &&
      currentScrollPosition > this.headerOptions.bottom
    ) {
      if (this.isStickyEnabled) {
        // If the timeout flag is set
        let _;
        clearTimeout(_); // Clear any existing timeout
        _ = setTimeout(() => {
          this.isStickyEnabled = false; // Reset the flag after the timeout
        }, 366);
        requestAnimationFrame(() => this.l()); // Show header animation
      } else {
        requestAnimationFrame(() => this.c()); // Hide header animation
      }
    }
    // If scrolled back to the top of the viewport
    else if (currentScrollPosition <= this.headerOptions.top) {
      requestAnimationFrame(() => this.d()); // Reset header state
    }

    // Update the last scroll position
    this.scrollPosition = currentScrollPosition;
  }

  preventHeaderReveal() {
    this.isStickyEnabled = true;
  }

  // Function to update the CSS variables for header and topbar heights
  updateHeaderStyles() {
    $html.css({
      '--topbar-height':
        ((window.jQuery || window.$)('#top-bar-main').is(':visible')
          ? (window.jQuery || window.$)('#top-bar-main').height()
          : 0) + 'px',
      '--header-height':
        ((window.jQuery || window.$)('.section-header').is(':visible')
          ? (window.jQuery || window.$)('.section-header').height()
          : 0) + 'px',
    });
  }

  populateContentAndInitializeFeatures(targetElements, sourceContent) {
    const sourceWrapper = (window.$ || window.jQuery)(sourceContent);

    // Iterate over each target element to load and initialize content
    targetElements.each((_, element) => {
      const currentElement = window.$(element);
      const contentSelector = '#mega-contents' + currentElement.data('id');
      const contentHtml = sourceWrapper.find(contentSelector).html();

      if (contentHtml) {
        // Populate content and initialize features if content exists
        currentElement.html(contentHtml);

        // Reinitialize the product grid items if any products are present
        if (currentElement.find('.products .product').length > 0) {
          window.T4SThemeSP.reinitProductGridItem();
        }

        // Initialize additional features after a short delay
        setTimeout(() => {
          if (currentElement.hasClass('isotope')) {
            window.T4SThemeSP.Isotopet4s.init(currentElement);
          }

          // Setup animations or display options for parent elements
          this.positionSubMenu(currentElement.closest('.has--children'));

          // Initialize popup functionality
          window.T4SThemeSP.PopupMFP();

          // Initialize any carousels if present within the content
          const delayedCarousels = currentElement.find('.flickity-later');
          if (delayedCarousels.length > 0) {
            delayedCarousels.each((_, element) => {
              element.flickityt4s = new window.T4SThemeSP.Carousel(element);
            });
          }
        }, 600);
      } else {
        // If no content is found, clear the current element's content
        currentElement.html('');
      }
    });

    // Adjust layout of elements with the Isotope plugin after a delay
    setTimeout(() => {
      this.headerWrapper.find('.isotope-enabled').isotope('layout');
    }, 800);
  }

  // Function to handle click events for menu items
  setupMenuToggle(menuContainer) {
    if (menuContainer) {
      this.navItemsWithChildren = menuContainer;
      if (
        !(viewportWidth < 1024 || this.navItemsWithChildren.length == 0) &&
        window.T4SThemeSP.isHover
      ) {
        this.navItemsWithChildren.each((_, element) => {
          const instance = $(element);
          instance.hoverIntent({
            instance: instance,
            sensitivity: 3,
            interval: 35,
            timeout: 150,
            over: () => {
              instance.addClass(this.hoverActionClass);
            },
            out: () => {
              instance.removeClass(this.hoverActionClass);
            },
          });
        });
      }
    }
  }

  // Function to handle click events on menu items and toggle the hover effect for submenus
  handleMenuClick(targetMenu) {
    // Get anchor elements in the specified menu or default to anchors in main menu items
    this.HeaderSection = targetMenu
      ? targetMenu.find('>a')
      : this.navItemsWithChildren.find('>a');

    // Check if hover effect is disabled, screen size is less than 1024, or no anchor elements exist
    if (
      window.T4SThemeSP.isHoverDisabled ||
      viewportWidth < 1024 ||
      this.HeaderSection.length === 0
    ) {
      // Remove click event handlers if hover is disabled or in mobile view
      this.HeaderSection.off('click.menu click.menuIntent');
    } else {
      // Attach click event handler to toggle submenu visibility
      this.HeaderSection.on('click.menu', (event) => {
        event.preventDefault();

        const parentItem = (window.$ || window.jQuery)(
          event.currentTarget
        ).parent();

        // If the item has the hover-active class, remove it and turn off the menu intent listener
        if (parentItem.hasClass(this.hoverActionClass)) {
          parentItem.removeClass(this.hoverActionClass);
          $document.off('click.menuIntent');
        } else {
          // Add hover-active class to the clicked item and remove from siblings
          parentItem
            .addClass(this.hoverActionClass)
            .siblings()
            .removeClass(this.hoverActionClass);

          // Set up a click listener to remove the hover-active class when clicking outside
          $document.on('click.menuIntent', (event) => {
            const clickedElement = event.target;

            // Check if the click is outside the active menu items
            if (
              !window.jQuery(clickedElement).is(`.${this.hoverActionClass}`) &&
              !window
                .jQuery(clickedElement)
                .parents('li')
                .is(`.${this.hoverActionClass}`)
            ) {
              this.menuNavigation
                .find(`.${this.hoverActionClass}`)
                .removeClass(this.hoverActionClass);
              $document.off('click.menuIntent');
            }
          });
        }
      });
    }
  }

  // Function to position and style submenu with optional lazy-loading of Isotope layouts
  positionSubMenu(menuItem, applyLazyLayout = false) {
    const menuLink = menuItem.find('>a')[0];
    const subMenu = menuItem.find('>.sub-menu')[0];
    const placement = menuItem.data('placement') || 'bottom';

    // Check if submenu needs custom width settings or is full-width
    if (
      (!menuItem.hasClass('menu-width__full') || placement === 'right-start') &&
      subMenu
    ) {
      (window.jQuery || window.$)(subMenu).attr('style', ''); // Clear existing styles

      // If submenu placement is not at the bottom or if special conditions apply
      if (
        placement !== 'bottom' ||
        menuItem.hasClass('type__drop') ||
        !this.centerSubMenuIfPossible(subMenu)
      ) {
        // Use floating UI to calculate and set the position of submenu
        window.FloatingUIT4sDOM.computePosition(menuLink, subMenu, {
          placement: placement,
          middleware: [
            window.FloatingUIT4sDOM.flip({}),
            window.FloatingUIT4sDOM.shift({ padding: 5 }),
          ],
        }).then(({ x: leftPosition, y: topPosition }) => {
          Object.assign(subMenu.style, {
            left: `${leftPosition}px`,
            top: placement.includes('bottom') ? '100%' : `${topPosition}px`,
          });
        });
      }

      // Apply lazy-loading layout adjustment if specified
      if (!applyLazyLayout) {
        const isotopeMenus = (window.jQuery || window.$)(subMenu).find(
          '.lazy_menu.isotope.isotope-enabled'
        );
        if (isotopeMenus.length > 0) {
          isotopeMenus.isotope('layout');
        }
      }
    }
  }

  // Helper function to center submenu if possible within the viewport
  centerSubMenuIfPossible(subMenuElement) {
    const subMenu = (window.jQuery || window.$)(subMenuElement);
    subMenu.attr('style', '');

    const subMenuWidth = subMenu.outerWidth();
    const subMenuOffset = subMenu.offset();
    if (!subMenuWidth || !subMenuOffset) return false;

    const leftOffset = subMenuOffset.left;
    const centerLimit = (viewportWidth - subMenuWidth) / 2;

    // Check if the submenu is within the center boundaries of the viewport
    if (
      !isThemeRTL &&
      centerLimit <= leftOffset &&
      leftOffset <= centerLimit + subMenuWidth &&
      viewportWidth >= centerLimit + subMenuWidth
    ) {
      subMenu.addClass('is--center-screen');
      return true;
    } else if (
      isThemeRTL &&
      centerLimit <= leftOffset + subMenuWidth &&
      leftOffset <= centerLimit &&
      viewportWidth >= centerLimit + subMenuWidth
    ) {
      subMenu.addClass('is--center-screen');
      return true;
    } else {
      subMenu.removeClass('is--center-screen');
      return false;
    }
  }
};

window.T4SThemeSP.MobileNav = () => {
  const cssClasses = {
    tabNavActive: 'is--active',
    opend: 'is--opend',
  };

  const resizeEventName = 'resize.navmb';
  const drawerStateKey = 'opendDrawer';
  const $ = window.jQuery || window.$;

  // Get index of the active category item and construct session storage keys based on it
  let activeCategoryIndex = $('.list-categories--item.is--active').index();
  const categoryIndex = activeCategoryIndex > 0 ? activeCategoryIndex : '';
  const timeMenuKey = `${cacheNameFirst}timeMenu${categoryIndex}`;
  const dataMenuKey = `${cacheNameFirst}dataMenu${categoryIndex}`;

  // Flag to control behavior (currently unused)
  let isFlagActive = false;

  // Constant for 30 minutes in milliseconds
  const thirtyMinutes = 18e5;

  // Selecting elements for mobile navigation and categories
  const navSections = $('.sp-section-mb-nav [data-section-id]');
  const categorySections = $('.sp-section-mb-cat [data-section-id]');

  // Count of sections
  const navSectionCount = navSections.length;
  const categorySectionCount = categorySections.length;

  // Initialize section IDs if active category index exists
  let navSectionId, categorySectionId;
  if (activeCategoryIndex > 0) {
    navSectionId = navSections.data('section-id');
    categorySectionId = categorySections.data('section-id');
  }

  // Session storage retrieval
  let storedTime = isStorageSpSession
    ? parseInt(sessionStorage.getItem(timeMenuKey) || 0)
    : 0;

  // Placeholder for dynamic data configurations
  let configData = {};

  const toggleMenu = (element) => {
    element.hasClass(cssClasses.opend)
      ? element.removeClass(cssClasses.opend).children('ul').slideUp(200)
      : element.addClass(cssClasses.opend).children('ul').slideDown(200);
  };

  const fetchSection = (time_delay = 4) => {
    if (
      IsDesignMode ||
      isFlagActive ||
      configData.$mobileNav.is(':visible') ||
      viewportWidth > 1024
    ) {
      setTimeout(() => {
        if (activeCategoryIndex > 0) {
          navSectionId = navSectionCount === 1 ? navSectionId : 'mb_nav';
          categorySectionId =
            categorySectionCount === 1 ? categorySectionId : 'mb_cat';
          let navFetched = false;
          let catFetched = false;

          window.T4SThemeSP.getToFetchSection(
            `?section_id=${navSectionId}`,
            'text'
          ).then((res) => {
            if (res !== 'NVT_94') {
              configData.$mobileNav.find('#shopify-mb_nav').html(res);
              catFetched ? updateMobileNav('indexPage') : (navFetched = true);
            }
          });

          window.T4SThemeSP.getToFetchSection(
            `?section_id=${categorySectionId}`,
            'text'
          ).then((res) => {
            if (res !== 'NVT_94') {
              configData.$mobileNav.find('#shopify-mb_cat').html(res);
              navFetched ? updateMobileNav('indexPage') : (catFetched = true);
            }
          });
        } else {
          window.T4SThemeSP.getToFetchSection(
            null,
            'text',
            `${T4Sroutes.search_url}/?view=mn`
          ).then((res) => {
            if (res !== 'NVT_94') {
              updateMobileNav(res);
            }
          });
        }
      }, time_delay);
    }
  };

  const updateMobileNav = (content) => {
    window.T4SThemeSP.Helpers.promiseStylesheet(
      window.T4Sconfigs.stylesheet2
    ).then(() => {
      isFlagActive = true;
      if (activeCategoryIndex <= 0 && content !== 'indexPage') {
        configData.$mobileNav.html(content);
      } else if (activeCategoryIndex > 0 && content === 'indexPage') {
        content = configData.$mobileNav.html();
      }
      $window.off(resizeEventName);
      configData.$mobileNav.off(drawerStateKey);
      configData.$mobileNav.trigger('lazyincluded');

      if (isStorageSpSession) {
        storedTime = Date.now() + thirtyMinutes;
        sessionStorage.setItem(timeMenuKey, storedTime);
        sessionStorage.setItem(dataMenuKey, content);
      }
    });
  };

  const initializeMobileNav = () => {
    configData = {
      $mobileNav: $('#menu-drawer'),
    };
    if (isStorageSpSession && storedTime > 0 && storedTime >= Date.now()) {
      window.T4SThemeSP.Helpers.promiseStylesheet(
        window.T4Sconfigs.stylesheet2
      ).then(() => {
        configData.$mobileNav.html(sessionStorage.getItem(dataMenuKey));
        configData.$mobileNav.trigger('lazyincluded');
      });
    } else {
      $window.on(
        resizeEventName,
        window.T4SThemeSP.debounce(300, () => {
          viewportWidth = $window.width();
          fetchSection(0);
        })
      );

      fetchSection(500);

      if (!IsDesignMode) {
        configData.$mobileNav.on(drawerStateKey, () => {
          fetchSection(0);
        });
      }

      configData.$mobileNav.on(
        'click',
        '[data-tab-mb-nav]>[data-tab-mb-item]',
        (event) => {
          const tab = $(event.currentTarget);
          if (!tab.hasClass(cssClasses.tabNavActive)) {
            tab
              .addClass(cssClasses.tabNavActive)
              .siblings()
              .removeClass(cssClasses.tabNavActive);
            $(`[data-tab-mb-content].${cssClasses.tabNavActive}`).removeClass(
              cssClasses.tabNavActive
            );
            $(tab.data('id')).addClass(cssClasses.tabNavActive);
          }
        }
      );

      configData.$mobileNav.on(
        'click',
        '.menu-item-has-children.only_icon_false>a',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleMenu($(event.currentTarget).parent());
        }
      );

      configData.$mobileNav.on(
        'click',
        '.menu-item-has-children > a > .mb-nav__icon',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleMenu($(event.currentTarget).parent().parent());
        }
      );
    }
  };

  initializeMobileNav();
};
window.loadingBar = () => {
  return () => {
    console.log('loadingBar');
  };
};

//done
window.T4SThemeSP.loadingBar = () => {
  console.log('loadingBar');
};

//done
window.T4SThemeSP.currencyForm = () => {
  const cartCurrency = window.T4Sconfigs.cartCurrency;
  const selectedClass = 'is--select';
  let $elementMap = {};

  const selectCurrency = (currency) => {
    if (cartCurrency !== currency) {
      if (window.isStorageSpdLocalAll) {
        localStorage.setItem('Currency', currency);
      }
      window
        .jQuery(`[data-currency-wrap] [data-iso="${currency}"]`)
        .first()
        .trigger('click');
    }
  };

  const handleCurrencyLocaleSelection = () => {
    $body.on(
      'click',
      '[data-locale-wrap] [data-locale-item], [data-currency-wrap] [data-currency-item]',
      (event) => {
        event.preventDefault();
        const selectedItem = window.jQuery(event.currentTarget);
        if (
          !(
            (window.T4Sconfigs.currency_type === '2' &&
              selectedItem.is('[data-currency-item]')) ||
            selectedItem.hasClass(selectedClass)
          )
        ) {
          const isLocaleItem = selectedItem.is('[data-locale-item]');
          const wrapperSelector = isLocaleItem
            ? '[data-locale-wrap]'
            : '[data-currency-wrap]';
          const selectorType = isLocaleItem
            ? '$localeSelector'
            : '$currencySelector';
          let isCurrencyType = !isLocaleItem;

          const selectedIso = selectedItem.attr('data-iso');
          const currentIso = window
            .jQuery(`${wrapperSelector} .${selectedClass}`)
            .first()
            .attr('data-iso');
          const selectedLanguage = selectedItem.attr('data-language');
          // const currentLanguage = window
          //   .jQuery(`${wrapperSelector} .${selectedClass}`)
          //   .first()
          //   .attr('data-language');
          const selectedCountry = selectedItem.attr('data-country');
          // const currentCountry = window
          //   .jQuery(`${wrapperSelector} .${selectedClass}`)
          //   .first()
          //   .attr('data-country');

          window
            .jQuery(`${wrapperSelector} [data-current]`)
            .text(selectedLanguage || selectedIso)
            .removeClass(`flags-${currentIso}`)
            .addClass(`flags-${selectedIso}`);
          const imgCurrent = window.jQuery(
            `${wrapperSelector} [data-img-current]`
          );
          if (imgCurrent.length > 0) {
            const src = imgCurrent.attr('src');
            imgCurrent.attr(
              'src',
              src.replace(
                /\/\w\w.svg/g,
                `/${selectedCountry.toLowerCase()}.svg`
              )
            );
          }

          window
            .jQuery(`${wrapperSelector} [data-iso="${selectedIso}"]`)
            .addClass(selectedClass)
            .siblings()
            .removeClass(selectedClass);

          $elementMap[selectorType].val(selectedIso);
          if (selectorType === '$currencySelector') {
            $elementMap.$countryMirror.val(selectedCountry);
          }
          $elementMap.$formCurrencyLocale.submit();

          if (window.isStorageSpdLocal && isCurrencyType) {
            localStorage.setItem('Currency', selectedIso);
          }
          window.T4SThemeSP.loadingBar();
        }
      }
    );
  };

  const initializeCurrencyForm = () => {
    $elementMap = {
      $formCurrencyLocale: window.jQuery('#CurrencyLangSelector'),
      $countryMirror: window.jQuery('#countryMirror'),
      $localeSelector: window.jQuery('#LocaleSelector'),
      $currencySelector: window.jQuery('#CurrencySelector'),
    };

    if ($elementMap.$formCurrencyLocale.length) {
      handleCurrencyLocaleSelection();
      const storedCurrency = window.isStorageSpdLocalAll
        ? localStorage.getItem('Currency')
        : null;

      if (
        window.T4Sconfigs.auto_currency &&
        !navigator.userAgent.match(/bot|spider/i) &&
        !storedCurrency &&
        !IsDesignMode
      ) {
        let selectedCurrency;
        const currency = window.isStorageSpdLocalAll
          ? JSON.parse(localStorage.getItem('nt_currency') || '{}')
          : null;
        const currencyMap = {
          AF: 'AFN',
          AX: 'EUR',
          AL: 'ALL',
          DZ: 'DZD',
          AS: 'USD',
          AD: 'EUR',
          AO: 'AOA',
          AI: 'XCD',
          AQ: '',
          AG: 'XCD',
          AR: 'ARS',
          AM: 'AMD',
          AW: 'AWG',
          AU: 'AUD',
          AT: 'EUR',
          AZ: 'AZN',
          BS: 'BSD',
          BH: 'BHD',
          BD: 'BDT',
          BB: 'BBD',
          BY: 'BYN',
          BE: 'EUR',
          BZ: 'BZD',
          BJ: 'XOF',
          BM: 'BMD',
          BT: 'INR',
          BO: 'BOB',
          BQ: 'USD',
          BA: 'BAM',
          BW: 'BWP',
          BR: 'BRL',
          IO: 'USD',
          VG: 'USD',
          BN: 'BND',
          BG: 'BGN',
          BF: 'XOF',
          BI: 'BIF',
          KH: 'KHR',
          CM: 'XAF',
          CA: 'CAD',
          CV: 'CVE',
          KY: 'KYD',
          CF: 'XAF',
          TD: 'XAF',
          CL: 'CLP',
          CN: 'CNY',
          CX: 'AUD',
          CC: 'AUD',
          CO: 'COP',
          KM: 'KMF',
          CG: 'XAF',
          CD: 'CDF',
          CK: 'NZD',
          CR: 'CRC',
          HR: 'HRK',
          CU: 'CUP',
          CW: 'ANG',
          CY: 'EUR',
          CZ: 'CZK',
          DK: 'DKK',
          DJ: 'DJF',
          DM: 'XCD',
          DO: 'DOP',
          EC: 'USD',
          EG: 'EGP',
          SV: 'USD',
          GQ: 'XAF',
          ER: 'ERN',
          EE: 'EUR',
          ET: 'ETB',
          FK: 'FKP',
          FO: 'DKK',
          FJ: 'FJD',
          FI: 'EUR',
          FR: 'EUR',
          PF: 'XPF',
          GA: 'XAF',
          GM: 'GMD',
          GE: 'GEL',
          DE: 'EUR',
          GH: 'GHS',
          GI: 'GIP',
          GR: 'EUR',
          GL: 'DKK',
          GD: 'XCD',
          GU: 'USD',
          GT: 'GTQ',
          GG: 'GBP',
          GN: 'GNF',
          GW: 'XOF',
          GY: 'GYD',
          HT: 'HTG',
          HM: 'AUD',
          VA: 'EUR',
          HN: 'HNL',
          HK: 'HKD',
          HU: 'HUF',
          IS: 'ISK',
          IN: 'INR',
          ID: 'IDR',
          IR: 'IRR',
          IQ: 'IQD',
          IE: 'EUR',
          IM: 'GBP',
          IL: 'ILS',
          IT: 'EUR',
          CI: 'XOF',
          JM: 'JMD',
          JP: 'JPY',
          JE: 'GBP',
          JO: 'JOD',
          KZ: 'KZT',
          KE: 'KES',
          KI: 'AUD',
          XK: 'EUR',
          KW: 'KWD',
          KG: 'KGS',
          LA: 'LAK',
          LV: 'EUR',
          LB: 'LBP',
          LS: 'LSL',
          LR: 'LRD',
          LY: 'LYD',
          LI: 'CHF',
          LT: 'EUR',
          LU: 'EUR',
          MO: 'MOP',
          MK: 'MKD',
          MG: 'MGA',
          MW: 'MWK',
          MY: 'MYR',
          MV: 'MVR',
          ML: 'XOF',
          MT: 'EUR',
          MH: 'USD',
          MR: 'MRU',
          MU: 'MUR',
          YT: 'EUR',
          MX: 'MXN',
          FM: 'USD',
          MD: 'MDL',
          MC: 'EUR',
          MN: 'MNT',
          ME: 'EUR',
          MS: 'XCD',
          MA: 'MAD',
          MZ: 'MZN',
          MM: 'MMK',
          NA: 'NAD',
          NR: 'AUD',
          NP: 'NPR',
          NL: 'EUR',
          NC: 'XPF',
          NZ: 'NZD',
          NI: 'NIO',
          NE: 'XOF',
          NG: 'NGN',
          NU: 'NZD',
          NF: 'AUD',
          KP: 'KPW',
          MP: 'USD',
          NO: 'NOK',
          OM: 'OMR',
          PK: 'PKR',
          PW: 'USD',
          PS: 'ILS',
          PA: 'PAB',
          PG: 'PGK',
          PY: 'PYG',
          PE: 'PEN',
          PH: 'PHP',
          PN: 'NZD',
          PL: 'PLN',
          PT: 'EUR',
          PR: 'USD',
          QA: 'QAR',
          RO: 'RON',
          RU: 'RUB',
          RW: 'RWF',
          RE: 'EUR',
          WS: 'WST',
          SM: 'EUR',
          ST: 'STN',
          SA: 'SAR',
          SN: 'XOF',
          RS: 'RSD',
          SC: 'SCR',
          SL: 'SLL',
          SG: 'SGD',
          SX: 'ANG',
          SK: 'EUR',
          SI: 'EUR',
          SB: 'SBD',
          SO: 'SOS',
          ZA: 'ZAR',
          GS: 'GBP',
          KR: 'KRW',
          SS: 'SSP',
          ES: 'EUR',
          LK: 'LKR',
          BL: 'EUR',
          SH: 'SHP',
          KN: 'XCD',
          LC: 'XCD',
          MF: 'EUR',
          PM: 'EUR',
          VC: 'XCD',
          SD: 'SDG',
          SR: 'SRD',
          SE: 'SEK',
          CH: 'CHF',
          SY: 'SYP',
          TW: 'TWD',
          TJ: 'TJS',
          TZ: 'TZS',
          TH: 'THB',
          TL: 'USD',
          TG: 'XOF',
          TK: 'NZD',
          TO: 'TOP',
          TT: 'TTD',
          TN: 'TND',
          TR: 'TRY',
          TM: 'TMT',
          TC: 'USD',
          TV: 'AUD',
          UG: 'UGX',
          UA: 'UAH',
          AE: 'AED',
          GB: 'GBP',
          US: 'USD',
          UY: 'UYU',
          UZ: 'UZS',
          VU: 'VUV',
          VE: 'VES',
          VN: 'VND',
          WF: 'XPF',
          EH: 'MAD',
          YE: 'YER',
          ZM: 'ZMW',
          ZW: 'ZWL',
        };
        if (Object.keys(currency).length) {
          selectedCurrency =
            storedCurrency ||
            currency.currency?.handle ||
            currencyMap[currency.currencyMap] ||
            currencyMap[currency.country] ||
            currency.country;
          selectCurrency(selectedCurrency);
        } else {
          const primaryRequest = {
            type: 'get',
            url: 'https://extreme-ip-lookup.com/json/?key=demo2',
            dataType: 'json',
            success: (res) => {
              if ('success' == res.status) {
                selectCurrency(currencyMap[res.countryCode]);
                if (window.isStorageSpdLocal) {
                  localStorage.setItem('nt_currency', JSON.stringify(res));
                }
              } else {
                window.jQuery.ajax(secondaryRequest);
              }
            },
            error: (error) => {
              window.jQuery.ajax(secondaryRequest);
            },
          };
          const secondaryRequest = {
            type: 'get',
            url: 'https://ipinfo.io/json',
            dataType: 'json',
            success: (res) => {
              selectCurrency(currencyMap[res.country]);
              if (window.isStorageSpdLocal) {
                localStorage.setItem('nt_currency', JSON.stringify(res));
              }
            },
            error: (error) => {
              window.jQuery.ajax(ternaryRequest);
            },
          };
          const ternaryRequest = {
            type: 'get',
            url: 'https://d1hcrjcdtouu7e.cloudfront.net/users/countryDetection',
            dataType: 'json',
            success: (res) => {
              selectCurrency(currencyMap[res.country]);
              if (isStorageSpdLocal) {
                localStorage.setItem('nt_currency', JSON.stringify(res));
              }
            },
          };

          window.jQuery.ajax({
            type: 'get',
            url: '/browsing_context_suggestions.json?source=geolocation_recommendation&currency[enabled]=true&language[enabled]=true',
            dataType: 'json',
            success: (res) => {
              try {
                selectCurrency(res.suggestions[0].parts.currency.handle);
                if (window.isStorageSpdLocal) {
                  localStorage.setItem(
                    'nt_currency',
                    JSON.stringify(res.suggestions[0].parts)
                  );
                }
              } catch (error) {
                window.jQuery.ajax(primaryRequest);
              }
            },
            error: (error) => {
              window.jQuery.ajax(primaryRequest);
            },
          });
        }
      }
    }
  };

  initializeCurrencyForm();
};

window.T4SThemeSP.productRecommendations = () => {
  const handleEmptyRecommendations = (element) => {
    if (element[0]) {
      element.hide();
    } else if (i.$recommendationsWrap.hasClass('pr-single_tab-content')) {
      i.$recommendationsWrap.find('.loading--bg').hide();
      i.$recommendationsWrap.find('[data-empty-product]').show();
    } else {
      window.T4SThemeSP.isRelatedEmpty = true;
      window.T4SThemeSP.isRecentEmpty
        ? (window.jQuery || window.$)('.tp-recent-related').hide()
        : i.$recommendationsWrap.hide();
    }
  };

  const fetchRecommendations = (recommendationsWrap) => {
    const dataType = recommendationsWrap.data('type');
    const sectionId = recommendationsWrap.data('sid');
    const baseUrl = recommendationsWrap.data('baseurl');
    const closestRecommendations = recommendationsWrap.closest(
      '.id_product-recommendations'
    );
    let url = `${m}${baseUrl}&section_id=${sectionId}`;

    if (dataType === '3') {
      url = `${baseUrl}?section_id=${sectionId}&product_id=${recommendationsWrap.data(
        'id'
      )}&limit=${recommendationsWrap.data('limit')}`;
    }

    window.T4SThemeSP.getToFetchSection(null, 'text', url).then((response) => {
      if (response !== 'NVT_94') {
        let htmlContent = IsDesignMode
          ? (window.jQuery || window.$)(response[2]).html()
          : (window.jQuery || window.$)(response).html();
        try {
          htmlContent = htmlContent.trim();
        } catch {
          htmlContent = (window.jQuery || window.$)(response).html();
        }
        if (htmlContent) {
          recommendationsWrap.html(htmlContent);
          if (recommendationsWrap.find('.product').length > 0) {
            window.T4SThemeSP.reinitProductGridItem();
          }
          window.T4SThemeSP.Reveal();
          if (recommendationsWrap.find('.flickity').length > 0) {
            const carousel = recommendationsWrap.find('.flickity')[0];
            carousel.flickityt4s = new window.T4SThemeSP.Carousel(carousel);
            window.T4SThemeSP.ProductItem.resizeObserver();
          }
        } else {
          handleEmptyRecommendations(closestRecommendations);
        }
      } else {
        handleEmptyRecommendations(closestRecommendations);
      }
    });
  };

  const recommendationsWrap = (window.jQuery || window.$)(
    '#pr_recommendations:not(.is--not-rub-js)'
  );
  const i = { $recommendationsWrap: recommendationsWrap };
  if (recommendationsWrap.length) {
    fetchRecommendations(recommendationsWrap);
  }
};

window.T4SThemeSP.recentlyViewed = () => {
  const handleEmptyRecentlyViewed = (element, hide = true) => {
    if (element[0]) {
      hide ? element.hide() : element.slideUp();
    } else if (o.$recentlyWrap.hasClass('pr-single_tab-content')) {
      o.$recentlyWrap.find('.loading--bg').hide();
      o.$recentlyWrap.find('[data-empty-product]').show();
    } else {
      window.T4SThemeSP.isRecentEmpty = true;
      window.T4SThemeSP.isRelatedEmpty
        ? (window.jQuery || window.$)('.tp-recent-related').hide()
        : o.$recentlyWrap.hide();
    }
  };

  const fetchRecentlyViewedProducts = (recentWrap) => {
    const storedRecentProducts = localStorage.getItem('nt_recent');
    const productId = p === 'product' ? recentWrap.data('id') : '19041994';
    const sectionId = recentWrap.data('sid');
    const unavailableProducts = recentWrap.data('unpr');
    const limit = recentWrap.data('limit');
    const closestRecentlyViewed = recentWrap.closest('.id_recently_viewed');

    if (storedRecentProducts) {
      let recentProducts = storedRecentProducts.split(',');
      const productIndex = recentProducts.indexOf(productId);
      if (productIndex > -1) {
        recentProducts = recentProducts.splice(0, limit + 1);
        recentProducts.splice(productIndex, 1);
      } else {
        recentProducts = recentProducts.splice(0, limit);
      }

      if (!recentProducts.length) {
        return handleEmptyRecentlyViewed(closestRecentlyViewed, false);
      }

      const query = recentProducts.join(' OR ');
      const encodedQuery = encodeURI(query);
      const url = `${m}/?section_id=${sectionId}&type=product&options[unavailable_products]=${unavailableProducts}&q=${encodedQuery}`;

      window.T4SThemeSP.getToFetchSection(null, 'text', url).then(
        (response) => {
          if (response !== 'NVT_94') {
            let htmlContent = IsDesignMode
              ? (window.jQuery || window.$)(response[2]).html()
              : (window.jQuery || window.$)(response).html();
            try {
              htmlContent = htmlContent.trim();
            } catch {
              htmlContent = (window.jQuery || window.$)(response).html();
            }
            if (htmlContent) {
              recentWrap.html(htmlContent);
              if (recentWrap.find('.product').length > 0) {
                window.T4SThemeSP.reinitProductGridItem();
              }
              window.T4SThemeSP.Reveal();
              if (recentWrap.find('.flickity').length > 0) {
                const carousel = recentWrap.find('.flickity')[0];
                carousel.flickityt4s = new window.T4SThemeSP.Carousel(carousel);
                window.T4SThemeSP.ProductItem.resizeObserver();
              }
            } else {
              handleEmptyRecentlyViewed(closestRecentlyViewed);
            }
          } else {
            handleEmptyRecentlyViewed(closestRecentlyViewed);
          }
        }
      );
    } else {
      handleEmptyRecentlyViewed(closestRecentlyViewed);
      localStorage.setItem('nt_recent', []);
    }

    if (
      !storedRecentProducts?.includes(productId) &&
      productId !== '19041994'
    ) {
      const updatedRecentProducts = storedRecentProducts
        ? storedRecentProducts.split(',').splice(0, limit)
        : [];
      updatedRecentProducts.unshift(productId);
      localStorage.setItem('nt_recent', updatedRecentProducts.toString());
    }
  };

  const recentWrap = (window.jQuery || window.$)('#recently_wrap');
  const o = { $recentlyWrap: recentWrap };
  if (isStorageSpdLocalAll && recentWrap.length) {
    fetchRecentlyViewedProducts(recentWrap);
  }
};

window.T4SThemeSP.Cart = (() => {
  const $ = window.jQuery || window.$;

  let cartItemsSelector = '[data-cart-items]';
  let cartPricesSelector = '[data-cart-prices]';
  let cartShippingCalcSelector = '[data-cart-calc-shipping]';
  let cartShippingTextSelector = '[data-cart-ship-text]';
  let cartShippingBarSelector = '[data-cart-ship-bar]';
  let cartDiscountsSelector = '[data-cart-discounts]';
  let cartUpsellOptionsAttribute = 'data-cart-upsell-options';
  let cartDiscountPercentageAttribute = 'data-ts-percent';
  let showShippingConfetti = true;
  let showCartConfetti = true;
  let isCartDisabled = 'disable' == window.T4Sconfigs.cartType;
  let afterAddToCartAction =
    'cart' != pageType ? window.T4Sconfigs.afterActionATC : '4';
  let cartDataLoadType = isCartDisabled ? 'cart_data' : 'cart_data,mini_cart';
  let loadingClass = {
    loading: 'is--loading',
    none: '!d-none',
    active: 'is--active',
  };
  let cartSectionID = window.cartT4SectionID;
  let cartDataRequestType =
    'cart' != pageType ? cartDataLoadType : `cart_data,${cartSectionID}`;
  let defaultProductID = 19041994;
  let isCartUpdating = false;
  let carouselConfig = {};
  let cartURL = window.T4Sroutes.cart_url;

  // Update cart items count and trigger necessary events
  function updateCartCount() {
    $('[data-cart-count]').html($('#mini_cart').data('ccount'));
    window.T4SThemeSP.Tooltip();
    $body.trigger('currency:update');

    // Additional cart functionalities if not in design mode
    if (!isCartDisabled) {
      window.T4SThemeSP.ProductAjax.change();
      window.T4SThemeSP.agreeForm();
      setupCartTools();
    }
  }

  function S() {
    let t = $('#tab-wishlist');
    let n = window.T4SThemeSP.linkWishlist || '';
    if (0 == t.length || n.indexOf('id:') < 0) return;

    let i = $('.tab-wishlist-empty'),
      o = $('.tab-wishlist-skeleton'),
      a = n.replace('view=wishlist', 'section_id=mini_cart_wishlist');
    i.hide(),
      o.show(),
      T4SThemeSP.getToFetchSection(null, 'text', a).then((t) => {
        o.hide(),
          'NVT_94' != t &&
            (o.siblings('.widget__pr').remove(),
            o.after(e(t).html()),
            $body.trigger('currency:update'),
            window.T4SThemeSP.Wishlist.updateAll(),
            window.T4SThemeSP.Tooltip());
      });
  }

  // Setup cart tools (actions like open, close, etc.)
  function setupCartTools() {
    if (pageType === 'cart') return;
    const cartWrapper = $('[data-cart-wrapper]');
    const toolContentSelector = '.mini_cart-tool__content';

    $('[data-cart-tools]').on('click', '[data-cart-tool_action]', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const toolId = $(event.currentTarget).data('id');
      const toolContent = $(`${toolContentSelector}.is--${toolId}`);
      const closeBtn = toolContent.find('[data-cart-tool_close]');

      toolContent.addClass('is--opend');
      cartWrapper.addClass('is--contentUpdate');
      toolContent.removeAttr('style');

      if (!window.T4SThemeSP.isTouch) {
        toolContent.one(
          'transitionend webkitTransitionEnd oTransitionEnd',
          function () {
            toolContent.find('[data-opend-focus]').focus();
          }
        );
      }

      cartWrapper.on('click.tool', (event) => {
        event.preventDefault();
        if (
          !$(event.target).is(toolContentSelector) &&
          $(event.target).closest(toolContentSelector).length === 0
        ) {
          toolContent.removeClass('is--opend');
          cartWrapper.removeClass('is--contentUpdate');
          cartWrapper.off('click.tool');
          closeBtn.off('click');
        }
      });

      closeBtn.on('click', function (event) {
        event.preventDefault();
        toolContent.removeClass('is--opend');
        cartWrapper.removeClass('is--contentUpdate');
        cartWrapper.off('click.tool');
        closeBtn.off('click');
      });

      $body.off('keyup.drawer').on('keyup.toolCart', function (event) {
        if (event.keyCode === 27) {
          toolContent.removeClass('is--opend');
          cartWrapper.removeClass('is--contentUpdate');
          cartWrapper.off('click.tool');
          closeBtn.off('click');
          $body.off('keyup.toolCart').on('keyup.drawer', function (event) {
            if (event.keyCode === 27) window.T4SThemeSP.Drawer.close(event);
          });
        }
      });
    });
    updateCartNote();
    handleDiscountCodeInput();
    handleDiscountCodeStorage();
    initializeShippingEstimator();
    let tabCartWrapper = $('[data-tab-cart-wrap]');
    window.T4SThemeSP.cartTabActive = true;
    if (tabCartWrapper[0]) {
      let tabCartTittle = $('[data-cart-tab-title]');
      let tabCartContent = $('[data-cart-tab-content]');
      tabCartWrapper.on('click', '[data-tab-cart-item]', (event) => {
        event.preventDefault();
        let instance = $(event.currentTarget);
        window.T4SThemeSP.cartTabActive = instance.is('[data-is-tab-cart]');
        tabCartTittle.text(instance.data('title'));
        instance
          .addClass(loadingClass.active)
          .siblings('.' + loadingClass.active)
          .removeClass(loadingClass.active),
          tabCartContent
            .attr('aria-hidden', true)
            .eq(instance.index())
            .attr('aria-hidden', false);
      });
    }
    triggerConfettiOnCartAction();
    updateProductSection();
    if (!(0 == $('#tab-visited').length || !isStorageSpdLocalAll)) {
      let t = localStorage.getItem('nt_recent');
      if (t) {
        let n = t.split(',').toString().replace(/,/g, ' OR ');
        let i = encodeURI(n);
        let o = $('.tab-visited-empty');
        let a = $('.tab-visited-skeleton');
        o.hide();
        a.show();
        window.T4SThemeSP.getToFetchSection(
          null,
          'text',
          m +
            '/?section_id=mini_cart_visited&type=product&options[unavailable_products]=show&q=' +
            i
        ).then((t) => {
          a.hide(),
            'NVT_94' != t &&
              (a.after($(t).html()),
              $body.trigger('currency:update'),
              window.T4SThemeSP.Wishlist.updateAll(),
              window.T4SThemeSP.Tooltip());
        });
      }
    }
    $document.on('update:mini_cart:wishlist', S),
      $document.trigger('update:mini_cart:wishlist'),
      document.dispatchEvent(
        new CustomEvent('cart:updated', {
          detail: {
            count: $('#mini_cart').data('ccount'),
          },
          bubbles: true,
          cancelable: true,
        })
      );
  }

  // Fetch and update cart section
  function fetchCartSection(isFullUpdate = false) {
    window.T4SThemeSP.getToFetchSection(
      `?sections=${cartDataRequestType}`,
      'json'
    ).then((response) => {
      if (response !== 'NVT_94') {
        updateCartContents(response, isFullUpdate);
      }
    });
  }

  // Update cart contents
  function updateCartContents(cartData, isAddToCartSuccessful = false) {
    let cartItemCount = cartData.cart_data;
    let miniCartData = cartData.mini_cart || cartData[window.cartT4SectionID];
    const miniCartElement = $(miniCartData);
    const cartItemsContainer = $(cartItemsSelector);
    const cartPricesContainer = $(cartPricesSelector);
    const shippingCalcContainer = $(cartShippingCalcSelector);
    const shippingTextElement = shippingCalcContainer.find(
      cartShippingTextSelector
    );
    const shippingBarElement = shippingCalcContainer.find(
      cartShippingBarSelector
    );
    const cartDiscountsContainer = $(cartDiscountsSelector);

    // Split cart data for further processing
    cartItemCount = cartItemCount.split('[split1]')[1];
    cartItemCount = cartItemCount.split('[split2]');

    if (
      (cartItemCount[0] != 0 && !window.T4SThemeSP.isATCSuccess) ||
      pageType !== 'cart'
    ) {
      // Handle successful Add-To-Cart
      if (!window.T4SThemeSP.isATCSuccess && isAddToCartSuccessful) {
        window.T4SThemeSP.isATCSuccess = isAddToCartSuccessful;
      }

      // Update various cart elements
      cartItemsContainer.html(miniCartElement.find(cartItemsSelector).html());
      cartPricesContainer.html(miniCartElement.find(cartPricesSelector).html());
      shippingCalcContainer.attr(
        cartDiscountPercentageAttribute,
        miniCartElement
          .find(cartShippingCalcSelector)
          .attr(cartDiscountPercentageAttribute)
      );
      shippingTextElement.replaceWith(
        miniCartElement.find(cartShippingTextSelector).wrap()
      );
      shippingBarElement.attr(
        'style',
        miniCartElement.find(cartShippingBarSelector).attr('style')
      );
      cartDiscountsContainer.html(
        miniCartElement.find(cartDiscountsSelector).html()
      );

      const cartItemCountParsed = parseFloat(cartItemCount[0]);

      // Update cart counts and display text based on item count
      $('[data-cart-count]').html(cartItemCountParsed);
      $('[data-cart-ttcount]').html(
        cartItemCountParsed < 2
          ? themeStrings.item_cart[cartItemCountParsed]
          : themeStrings.item_cart[2]
      );
      $('[data-cart-tt-price]').html(cartItemCount[1]);

      // Handle gift toggle
      if (cartItemCount[2] === '1') {
        $(
          '.mini_cart-tool__content.is--gift.is--opend [data-cart-tool_close]'
        ).trigger('click');
        $('[data-toogle-gift]').hide();
      } else {
        $('[data-toogle-gift]').show();
      }

      // Update cart count badge
      if (cartItemCount[0] == 0) {
        $('.cart-count-badge').addClass('cart-count-0');
      } else {
        $('.cart-count-badge').removeClass('cart-count-0');
        if (isCartUpdating) {
          triggerConfettiOnCartAction();
          isCartUpdating = false;
        }
      }

      // Dispatch events for cart updates
      document.dispatchEvent(
        new CustomEvent('cart:update:count', {
          detail: { count: cartItemCount[0] },
          bubbles: true,
          cancelable: true,
        })
      );
      window.T4SThemeSP.Tooltip();
      $('.currency-selector').trigger('currency:update');

      // Handle cart action after Add-To-Cart
      if (afterAddToCartAction !== '0' && window.T4SThemeSP.isATCSuccess) {
        closeMiniCart();
      }

      document.dispatchEvent(
        new CustomEvent('cart:updated', {
          detail: { count: cartItemCount[0] },
          bubbles: true,
          cancelable: true,
        })
      );
      $('.cart-updated-trigger').trigger('cart:updated');

      updateProductSection();
    } else {
      closeMiniCart();
    }
  }

  // Functionality after adding item to cart
  function closeMiniCart() {
    window.T4SThemeSP.isATCSuccess = false;
    if (afterAddToCartAction === '1' || afterAddToCartAction === '2') {
      // Other actions if needed for specific cart options
    } else if (afterAddToCartAction === '3') {
      if (!window.T4SThemeSP.cartTabActive) {
        $('[data-is-tab-cart]').trigger('click');
      }
      window.T4SThemeSP.Drawer.opend($('#mini_cart'));
    } else {
      document.location.href =
        afterAddToCartAction === '5'
          ? `${window.T4SThemeSP.root_url}checkout`
          : cartURL;
    }
  }

  // Handle cart note update
  function updateCartNote() {
    $('textarea[name="note"]').on('change', (event) => {
      const note = $.trim($(event.currentTarget).val());
      const headers = new Headers({ 'Content-Type': 'application/json' });

      fetch(`${cart_url}/update.js`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ note }),
      })
        .then((response) => response.json())
        .then(() => {
          const editNoteSelector =
            '[data-id="note"].is--editNote, .txt_edit_note';
          const addNoteSelector = '[data-id="note"].is--addNote, .txt_add_note';

          if (note.length > 0) {
            $(editNoteSelector).removeClass(lodingStatus.none);
            $(addNoteSelector).addClass(lodingStatus.none);
          } else {
            $(editNoteSelector).addClass(lodingStatus.none);
            $(addNoteSelector).removeClass(lodingStatus.none);
          }
        })
        .catch((error) => console.error('Cart update error:', error));
    });
  }

  function handleDiscountCodeInput() {
    let timer;
    const discountInput = $('#CartDiscountcode');

    // Check if the element exists
    if (discountInput.length) {
      discountInput.keyup(() => {
        // Clear previous timer to debounce
        clearTimeout(timer);

        // Set new timer to wait for 300ms after typing stops
        timer = setTimeout(() => {
          // Add or remove the 'name' attribute based on input length
          if (discountInput.val().length) {
            discountInput.attr('name', 'discount');
          } else {
            discountInput.removeAttr('name');
          }
        }, 300);
      });
    }
  }

  function handleDiscountCodeStorage() {
    // Check if local storage is available
    if (isStorageSpdLocal) {
      const discountInput = $('#CartDiscountcode');
      const discountFields = $('#CartDiscountcode, [data-cart-discount]');

      // Retrieve any saved discount code from localStorage and set it in the input fields
      const savedDiscountCode = localStorage.getItem('CartDiscountcode');
      discountFields.val(savedDiscountCode).trigger('keyup');

      // Set up event listener for saving the discount code when the save button is clicked
      $('[data-action="save-discountcode"]').click(() => {
        const discountCode = $.trim(discountInput.val());

        // Save the discount code to localStorage
        localStorage.setItem('CartDiscountcode', discountCode);

        // Update the input fields with the saved code and trigger any relevant updates
        discountFields.val(discountCode).trigger('keyup');

        // Apply discount if code is not empty by calling Shopify's discount endpoint
        if (discountCode) {
          window.fetch(window.Shopify.routes.root + 'discount/' + discountCode);
        }
      });
    }
  }

  function initializeShippingEstimator() {
    const estimateWrap = $('[data-estimate-shipping-wrap]');

    if (!estimateWrap[0]) return;

    // Parse language-specific rates for display
    estimateWrap[0].langRates = JSON.parse(
      estimateWrap.find('template[data-lang-rates]').html() || '{}'
    );

    // Initialize country and province selector
    const id = estimateWrap.data('id');
    window.Shopify &&
      new window.Shopify.CountryProvinceSelector(
        `ShippingCountry_${id}`,
        `ShippingProvince_${id}`,
        {
          hideElement: `ShippingProvinceContainer_${id}`,
        }
      );

    // Click event handler for shipping estimation button
    estimateWrap.on(
      'click',
      '[data-action="estimate-shipping"]',
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        const button = (window.jQuery || window.$)(event.currentTarget);
        const responseRatesContainer = button.find('[data-response-rates]');

        // Prepare the shipping address data
        const shippingData = {
          country: button.find('[name="country"]').val() || '',
          province: button.find('[name="province"]').val() || '',
          zip: button.find('[name="zip"]').val() || '',
        };

        // Show loading indication
        button.addClass(loadingStatus.loading);
        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        // Fetch shipping rates based on address input
        fetch(
          `${cart_url}/shipping_rates.json?${e.param({
            shipping_address: shippingData,
          })}`,
          {
            credentials: 'same-origin',
            method: 'GET',
          }
        ).then((response) => {
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
          button.removeClass(loadingStatus.loading);

          response.json().then((data) => {
            displayShippingRates(
              response.ok,
              data,
              shippingData,
              responseRatesContainer,
              estimateWrap[0].langRates
            );
          });
        });
      }.bind(estimateWrap[0])
    );

    // Helper function to display shipping rates or errors
    function displayShippingRates(
      isSuccess,
      data,
      shippingData,
      container,
      langRates
    ) {
      if (isSuccess) {
        displayAvailableRates(
          data.shipping_rates,
          shippingData,
          container,
          langRates
        );
      } else {
        displayErrorRates(data, container, langRates);
      }
    }

    // Display the available rates if shipping is supported
    function displayAvailableRates(rates, address, container, langRates) {
      let addressText = [address.zip, address.province, address.country]
        .filter(Boolean)
        .join(', ');
      let ratesInfo =
        rates.length > 1
          ? langRates.multiple_rates
              .replace('[number_of_rates]', rates.length)
              .replace('[address]', addressText)
          : rates.length === 1
          ? langRates.one_rate.replace('[address]', addressText)
          : langRates.no_rates;

      let rateList = rates
        .map(
          (rate) =>
            `<li>${langRates.rate_value
              .replace('[rate_title]', rate.name)
              .replace(
                '[rate]',
                window.T4SThemeSP.Currency.formatMoney(rate.price)
              )}</li>`
        )
        .join('');

      container
        .html(
          `
            <div class="mess__rates is--rates-success">${ratesInfo}</div>
            <div class="results__rates"><ul>${rateList}</ul></div>
        `
        )
        .fadeIn();

      (window.jQuery || window.$)('body').trigger('currency:update');
    }

    // Display error if no rates are available
    function displayErrorRates(errors, container, langRates) {
      let errorMessages = Object.entries(errors)
        .map(
          ([key, message]) =>
            `<li><span class='key__rate'>${key}</span> ${message}</li>`
        )
        .join('');

      if (errorMessages === 'country is not supported.')
        errorMessages = `<li>${langRates.no_rates}</li>`;

      container
        .html(
          `
            <p>${langRates.errors}</p>
            <ul class="mess__rates is--rates-error">${errorMessages}</ul>
        `
        )
        .fadeIn();
    }
  }

  function triggerConfettiOnCartAction() {
    // Exit if `h` flag is not enabled
    if (!isConfettiEnabled) return;

    // Check if shipping/cart action is completed
    const shipDoneCount = (window.jQuery || window.$)(
      '[data-cart-ship-done]'
    ).length;

    // If shipping/cart action is done and confetti has not been triggered recently
    if (shipDoneCount > 0 && confetti) {
      window.T4SThemeSP.CanvasConfetti(); // Trigger confetti animation
      confetti = false; // Reset flags to prevent repeat confetti
      showCartConfetti = false;
    }
    // If other elements (possibly in `C`) exist and confetti hasn't been triggered
    else if (shipDoneCount > 0 && M) {
      window.T4SThemeSP.CanvasConfetti();
      showCartConfetti = false;
    }
    // Reset flags if no actions are detected
    else if (shipDoneCount === 0) {
      showCartConfetti = false;
      confetti = true;
    }
  }

  function updateProductSection() {
    // Select the target element based on attribute `I`
    const targetElement = (window.jQuery || window.$)(
      `[${cartUpsellOptionsAttribute}]`
    );
    if (targetElement.length === 0) return; // Exit if no elements found

    // Extract product data and assign a fallback product ID if not present
    let productData = JSON.parse(
      targetElement.attr(cartUpsellOptionsAttribute) || '{}'
    );
    productData.product_id =
      (window.jQuery || window.$)(
        '[data-cart-items] [data-cart-item]:first'
      ).data('pid') ||
      productData.product_id ||
      19041994;

    // Avoid redundant fetches for the same product
    if (defaultProductID === productData.product_id) return;
    defaultProductID = productData.product_id;

    // Construct the URL to fetch the section with updated product content
    const fetchUrl = `${productData.baseurl}?section_id=${productData.section_id}&product_id=${productData.product_id}&limit=${productData.limit}`;

    // Fetch and update the section content
    window.T4SThemeSP.getToFetchSection(null, 'text', fetchUrl).then(
      (response) => {
        // If the response indicates no valid content, hide the target element and exit
        if (response === 'NVT_94') {
          targetElement.hide();
          return;
        }

        // Destroy existing carousel if present, update the content, and initialize tooltips
        if (carouselConfig.flickity) carouselConfig.flickity.destroy();
        targetElement.html((window.jQuery || window.$)(response).html());
        $body.trigger('currency:update');
        window.T4SThemeSP.Tooltip();

        // Initialize and resize the carousel if it exists in the updated content
        const carouselElement = targetElement.find('.flickity')[0];
        if (carouselElement) {
          carouselConfig.flickityt4s = new window.T4SThemeSP.Carousel(
            carouselElement
          );
          setTimeout(
            () =>
              (window.jQuery || window.$)(carouselElement).flickity('resize'),
            150
          );
          setTimeout(
            () =>
              (window.jQuery || window.$)(carouselElement).flickity('resize'),
            450
          );
        }
      }
    );
  }

  // Initialize all cart functionalities
  function initCart() {
    if (pageType === 'cart') {
      updateCartNote();
      handleDiscountCodeInput();
      handleDiscountCodeStorage();
      initializeShippingEstimator();
      window.T4SThemeSP.agreeForm();
      triggerConfettiOnCartAction();
      updateProductSection();
    } else {
      if (IsDesignMode) {
        updateCartCount();
      } else if (!isCartDisabled) {
        window.T4SThemeSP.getToFetchSection('?section_id=mini_cart').then(
          (response) => {
            if ('NVT_94' != response) {
              window.T4SThemeSP.Helpers.promiseStylesheet(
                T4Sconfigs.stylesheet1
              ).then(() => {
                window.$('#mini_cart').html(window.$(response).html());
                updateCartCount();
              });
            }
          }
        );
      }
    }

    document.addEventListener('cart:refresh', () => fetchCartSection(false));
    document.addEventListener('cart:refresh:opend', () =>
      fetchCartSection(true)
    );
    $document.on('add:cart:upsell', () => {
      isCartUpdating = true;
    });
  }

  // Return exposed methods
  return {
    renderContents: updateCartContents,
    getToFetch: fetchCartSection,
    init: initCart,
  };
})();

window.T4SThemeSP.Login = () => {
  const storageKeys = {
    timeLogin: `${cacheNameFirst}timeLogin`,
    dataLogin: `${cacheNameFirst}dataLogin`,
  };

  const renderLoginSidebar = () => {
    const loginSidebar = (window.jQuery || window.$)('#login-sidebar');
    if (loginSidebar.length > 0) {
      const storedTime = isStorageSpSession
        ? sessionStorage.getItem(storageKeys.timeLogin) || 0
        : 0;
      const parsedTime = parseInt(storedTime);

      if (parsedTime > 0 && parsedTime >= Date.now()) {
        window.T4SThemeSP.Helpers.promiseStylesheet(
          T4Sconfigs.stylesheet3
        ).then(() => {
          loginSidebar.html(sessionStorage.getItem(storageKeys.dataLogin));
          attachLoginEvents();
        });
      } else {
        window.T4SThemeSP.getToFetchSection('?section_id=login-sidebar').then(
          (response) => {
            if (response !== 'NVT_94') {
              window.T4SThemeSP.Helpers.promiseStylesheet(
                T4Sconfigs.stylesheet3
              ).then(() => {
                loginSidebar.html((window.jQuery || window.$)(response).html());
                attachLoginEvents();

                if (isStorageSpSession) {
                  const newTime = Date.now() + 24e6;
                  sessionStorage.setItem(storageKeys.timeLogin, newTime);
                  sessionStorage.setItem(
                    storageKeys.dataLogin,
                    (window.jQuery || window.$)(response).html()
                  );
                }
              });
            }
          }
        );
      }
    }
  };

  const attachLoginEvents = () => {
    const loginSidebar = (window.jQuery || window.$)('#login-sidebar');
    window.T4SThemeSP.Drawer.remove('login-sidebar');

    loginSidebar.on('click', `[${loginDataAttribute}]`, (event) => {
      event.preventDefault();
      const target = window
        .jQuery(event.currentTarget)
        .attr(loginDataAttribute);
      loginSidebar
        .find(`.content-login-sidebar.is--${target}`)
        .attr('aria-hidden', 'false')
        .siblings()
        .attr('aria-hidden', 'true');

      loginSidebar
        .find(`.drawer__header .is--${target}`)
        .attr('aria-hidden', 'false')
        .siblings()
        .attr('aria-hidden', 'true');

      loginSidebar.attr('data-target', target);
    });
  };

  const loginDataAttribute = 'data-login-sidebar';

  if (IsDesignMode) {
    attachLoginEvents();
  } else {
    renderLoginSidebar();
  }
};

//debugging
window.T4SThemeSP.Compare = (() => {
  let d;
  let comparedItems = [];
  let comparePopupContainer;
  const MAX_COMPARE_ITEMS = 6;
  const isComparisonDisabled = !window.T4Sconfigs.enable_compare;
  const itemCountSelector = '[data-count-compare]';
  const tooltipCountSelector = '[data-ttcount-compare]';
  const compareLinkSelector = '[data-link-compare]'; // Selector for comparison link element
  const compareActionSelector = '[data-action-compare]'; // Selector for action button to add to comparison
  const removeCompareSelector = '[data-remove-compare]'; // Selector for removing items from comparison
  const clearCompareSelector = '[data-clear-compare]'; // Selector for clearing all compared items
  const closeCompareSelector = '[data-close-compare]'; // Selector for closing the compare modal
  const compareStorageKey = 'cp'; // Key used for storing compare items in local storage
  const disabledPointerClass = 'is--pointer-events-none'; // Class to disable pointer events
  const itemAddedClass = 'is--added'; // Class for marking an item as added to comparison
  const activateClass = 'is--activate'; // Class for activating the comparison feature
  const addedText = window.T4SProductStrings.added_text_cp; // Text displayed when an item is added to compare
  const compareText = window.T4SProductStrings.compare; // Default compare text
  let currentCompareCount = 0; // Counter for currently compared items
  const comparePageUrl = `${searchUrl}/?view=compare&type=product&options[unavailable_products]=last&q=`; // URL for the comparison page
  let compareRedirectUrl = ''; // URL for redirecting after comparison action
  const defaultCompareIcon = window.T4Sconfigs.cp_icon; // Default icon for compare button
  const addedCompareIcon = window.T4Sconfigs.cp_icon_added;
  const enableComparePopup = window.T4Sconfigs.enableCompePopup; // Flag to enable compare popup
  const isOnComparePage = window.isPageCompare; // Flag to check if the current page is the compare page

  const updateCompareItems = () => {
    const storedItems = localStorage.getItem(compareStorageKey);

    if (storedItems !== null) {
      compareItemArray = storedItems.split(',');

      const searchQuery = storedItems.replace(/,/g, ' OR ');
      const encodedQuery = encodeURI(searchQuery);

      compareRedirectUrl = comparePageUrl + encodedQuery;
    }
  };

  const updateCompareItemDisplay = (itemId, tooltipElement) => {
    // Select the item element by data-id, ensuring it does not already have the 'is--added' class
    const itemElement = window.jQuery(
      `${compareActionSelector}[data-id="${itemId}"]:not(.${itemAddedClass})`
    );

    // Update the element's classes and text/icon to show it's added to the comparison list
    itemElement
      .addClass(itemAddedClass)
      .removeClass(disabledPointerClass)
      .find('.text-pr')
      .text(addedText);
    itemElement.find('.svg-pr-icon').html(addedCompareIcon);

    // If a tooltip element is provided, update it to reflect the change
    if (tooltipElement) {
      tooltipElement.trigger('updateTooltip');
    }
  };

  const initializeCompareList = () => {
    // Check if local storage is enabled for compare data and that comparison is not disabled
    if (window.isStorageSpdLocalAll && !isComparisonDisabled) {
      // Retrieve the stored compare items list from local storage
      const storedItems = localStorage.getItem(compareStorageKey);

      if (storedItems !== null) {
        // Remove the "id:" prefix from each item and split into an array
        comparedItems = storedItems.replace(/id:/g, '').split(',');
        currentCompareCount = storedItems === '' ? 0 : comparedItems.length;

        // Process each item ID in the list to update the UI accordingly
        comparedItems.forEach((itemId) => {
          updateCompareItemDisplay(itemId.replace('id:', ''));
        });

        // Update the displayed count of compared items on the page
        window
          .jQuery(itemCountSelector)
          .html(window.countComparePage || currentCompareCount);
      }
    }
  };

  const showModal = (url, shouldAnimate = false) => {
    // Check if comparison popup feature is enabled in the settings
    if (enableComparePopup) {
      // Determine the popup type (canvas or modal) and proceed accordingly
      const popupType = window.T4Sconfigs.compePopupDes;

      // Fetch section if popup type is 'canvas' or undefined
      if (popupType === undefined || popupType === 'canvas') {
        window.T4SThemeSP.getToFetchSection(
          null,
          'text',
          url.replace('view=compare', 'section_id=compare-popup')
        ).then((response) => {
          // Check for valid response before proceeding
          if (response !== 'NVT_94') {
            // If animation is enabled and a previous popup exists, remove it
            if (shouldAnimate && comparePopupContainer) {
              comparePopupContainer.remove();
            }

            // Append new compare popup component
            window.T4SThemeSP.$appendComponent.after(response);
            comparePopupContainer = (window.jQuery || window.$)(
              '.section__compare-popup'
            );

            // If animation is required, add the activation class after a delay
            if (shouldAnimate) {
              setTimeout(() => {
                comparePopupContainer.addClass(activateClass);
              }, 20);
            }

            // Initialize tooltips for any newly added elements
            window.T4SThemeSP.Tooltip();
          }
        });
      } else if (shouldAnimate && popupType === 'modal') {
        // For modal popup type, fetch and display in modal window
        window.T4SThemeSP.getToFetchSection(
          null,
          'text',
          url.replace('view=compare', 'section_id=compare-modal')
        ).then((response) => {
          if (response !== 'NVT_94') {
            if (shouldAnimate && comparePopupContainer) {
              comparePopupContainer.remove();
            }

            // Display popup with modal behavior
            window.T4SThemeSP.NTpopupInline(
              response,
              '',
              () => {
                window.T4SThemeSP.Wishlist.updateAll();
                window.T4SThemeSP.Compare.updateAll();
                window.T4SThemeSP.ProductItem.reloadReview();
                window.T4SThemeSP.Tooltip();
                $body.trigger('currency:update');
              },
              'opening-cp'
            );

            // Trigger event for modal open
            eventDispatcher.trigger('modal:opened');

            // Initialize tooltips for any newly added elements
            window.T4SThemeSP.Tooltip();
          }
        });
      }
    }
  };

  function attachCompareEvents() {
    if (window.isStorageSpdLocalAll && !isComparisonDisabled) {
      if (window.history.replaceState && isOnComparePage) {
        window.history.replaceState(
          {},
          document.title,
          `${searchUrl}/?view=compare`
        );
      }
      updateCompareItems();

      if (isOnComparePage) {
        if (window.isEmtyCompare && window.isComparePerformed) {
          localStorage.removeItem(compareStorageKey);
        } else {
          if (
            window.countComparePage !== comparedItems.length &&
            window.isComparePerformed
          ) {
            window.jQuery(dt_count_wishlist).html(window.countComparePage);
            localStorage.setItem(wis, window.listIDPrs);
          }
          if (
            !window.isEmtyCompare ||
            !window.isComparePerformed ||
            comparedItems.toString() !== '' ||
            !IsDesignMode
          ) {
            window.location.href = compareRedirectUrl;
          }
        }
      }

      $body.on(
        'click',
        `${compareActionSelector}.${itemAddedClass}`,
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (enableComparePopup) {
            if (
              window.T4Sconfigs.compePopupDes === undefined ||
              window.T4Sconfigs.compePopupDes === 'canvas'
            ) {
              compareModalClass.addClass(activateClass);
            } else if (window.T4Sconfigs.compePopupDes === 'modal') {
              showModal(compareRedirectUrl, true);
            }
          } else {
            window.location.href = compareRedirectUrl;
          }
        }
      );

      $body.on('click', compareLinkSelector, (event) => {
        event.preventDefault();
        window.location.href = compareRedirectUrl;
      });

      $body.on('click', clearCompareSelector, (event) => {
        event.preventDefault();
        if (
          window.T4Sconfigs.compePopupDes === undefined ||
          window.T4Sconfigs.compePopupDes === 'canvas'
        ) {
          comparePopupContainer.removeClass(activateClass);
        } else if (window.T4Sconfigs.compePopupDes === 'modal') {
          $body.trigger('modal:closed');
        }
        comparedItems.forEach((item) => {
          let productId = item.replace('id:', '');
          window
            .jQuery(`${compareActionSelector}[data-id="${productId}"]`)
            .removeClass(itemAddedClass)
            .find('.text-pr')
            .text(compareText);
          window
            .jQuery(`${compareActionSelector}[data-id="${productId}"]`)
            .find('.svg-pr-icon')
            .html(defaultCompareIcon);
        });
        localStorage.setItem(compareStorageKey, comparedItems.toString());
        currentCompareCount = 0;
        window.jQuery(itemCountSelector).html(currentCompareCount);
        window
          .jQuery(tooltipCountSelector)
          .html(
            currentCompareCount < 2
              ? themeStrings.item_compare[currentCompareCount]
              : themeStrings.item_compare[2]
          );
        updateCompareItems();
      });

      $body.on('click', closeCompareSelector, (event) => {
        event.preventDefault();
        comparePopupContainer.removeClass(activateClass);
      });

      if (
        localStorage.getItem(compareStorageKey) !== null &&
        comparedItems.toString() !== ''
      ) {
        showModal(compareRedirectUrl);
      }

      $body.on(
        'click',
        `${compareActionSelector}:not(.${itemAddedClass})`,
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          let element = window.jQuery(event.currentTarget);
          let productId = element.data('id') || '';
          let productIdentifier = `id:${productId}`;
          let storedCompareData = localStorage.getItem(compareStorageKey);
          let isExceedingLimit = false;

          if (productId !== '') {
            element.addClass(disabledPointerClass);
            let compareList = storedCompareData
              ? storedCompareData.split(',')
              : [];
            compareList.unshift(productIdentifier);

            if (compareList.length > MAX_COMPARE_ITEMS) {
              compareList = compareList.splice(0, MAX_COMPARE_ITEMS);
              isExceedingLimit = true;
            }

            localStorage.setItem(compareStorageKey, compareList.toString());
            currentCompareCount = compareList.length;

            if (isExceedingLimit) {
              let elements = window.jQuery(
                `${compareActionSelector}${itemAddedClass}`
              );
              elements
                .removeClass(itemAddedClass)
                .find('.text-pr')
                .text(compareText);
              elements.find('.svg-pr-icon').html(defaultCompareIcon);
              initializeCompareList();
            } else {
              updateCompareItemDisplay(productId, element);
            }

            window.jQuery(itemCountSelector).html(currentCompareCount);
            window
              .jQuery(tooltipCountSelector)
              .html(
                currentCompareCount < 2
                  ? themeStrings.item_compare[currentCompareCount]
                  : themeStrings.item_compare[2]
              );
            updateCompareItems();
            showModal(compareRedirectUrl, true);

            if (isOnComparePage) {
              window.location.href = compareRedirectUrl;
            }
          }
        }
      );

      $body.on('click', removeCompareSelector, (event) => {
        event.preventDefault();
        event.stopPropagation();
        let element = window.$(event.currentTarget);
        let productId = element.data('id');
        let productIdentifier = `id:${productId}`;
        let storedCompareData = localStorage.getItem(compareStorageKey);

        element.addClass(disabledPointerClass);
        d = storedCompareData.split(',');
        let index = d.indexOf(productIdentifier);

        if (index > -1) {
          d.splice(index, 1);
        }

        localStorage.setItem(compareStorageKey, d.toString());
        element.removeClass(disabledPointerClass);
        element.trigger('destroyTooltip');
        $(`.compare_id_${productId}`).remove();
        $(`${compareActionSelector}[data-id="${productId}"]`)
          .removeClass(itemAddedClass)
          .find('.text-pr')
          .text(compareText);
        $(`${compareActionSelector}[data-id="${productId}"]`)
          .find('.svg-pr-icon')
          .html(defaultCompareIcon);

        currentCompareCount = comparedItems.length;
        $(itemCountSelector).html(currentCompareCount);
        $(tooltipCountSelector).html(
          currentCompareCount < 2
            ? themeStrings.item_compare[currentCompareCount]
            : themeStrings.item_compare[2]
        );
        updateCompareItems();

        if (isOnComparePage && comparedItems.toString() === '') {
          $('.compare_table').fadeTo(300, 0);
          window.location.href = compareRedirectUrl;
        }

        if (currentCompareCount === 0) {
          if (enableComparePopup) {
            if (
              window.T4Sconfigs.compePopupDes === undefined ||
              window.T4Sconfigs.compePopupDes === 'canvas'
            ) {
              comparePopupContainer.removeClass(activateClass);
            } else if (window.T4Sconfigs.compePopupDes === 'modal') {
              $body.trigger('modal:closed');
            }
          } else {
            window.location.href = compareRedirectUrl;
          }
        }
      });
    }
  }

  return {
    init: attachCompareEvents,
    updateAll: initializeCompareList,
  };
})();
window.T4SThemeSP.Wishlist = (() => {
  const wishlistMode = window.T4Sconfigs.wishlist_mode;
  const wishlistATC = window.T4Sconfigs.wis_atc_added;
  const f = wishlistATC === '2';
  const supportsLocalStorage = wishlistMode === '2';
  const isLocalWishlist = wishlistMode === '1';
  const wishlistDisabled = !(isLocalWishlist || supportsLocalStorage);
  const maxItems = 50;

  const wishlistLinkSelector = '[data-link-wishlist]';
  const wishlistButton = '[data-action-wishlist]';
  const removeWishlistButton = '[data-remove-wishlist]';
  const countSelector = '[data-count-wishlist]';
  const addedClass = 'is--added';
  const pendingClass = 'is--pointer-events-none';
  const loadingClass = 'is--loading';

  const browseWishlist = T4SProductStrings.browse_wishlist;
  const addToWishlistText = window.T4SProductStrings.add_to_wishlist;
  const removeWishlist = window.T4SProductStrings.remove_wishlist;
  const addIcon = window.T4Sconfigs.wis_icon;
  const removeIcon = window.T4Sconfigs.wis_icon_remove;
  const addedIcon = window.T4Sconfigs.wis_icon_added;
  const M = wishlistATC ? removeWishlist : browseWishlist;

  const storageName = 'wis';
  const ecomriseWishlistapiEndpoint = '/apps/ecomrise/wishlist';
  const the4WishlistapiEndpoint = '/tools/the4/wishlist';
  const baseWishlistURL =
    searchUrl +
    '/?view=wishlist&type=product&options[unavailable_products]=last&q=';
  let wishlistPageURL = '';
  let itemCount = 0;
  let currentItems = [];
  let W = (q = Z = O = '');

  if (supportsLocalStorage) {
    const wishListDocument = window.jQuery('#wis_list').html() || '';
    W = wishListDocument.length > 0 ? wishListDocument.split(' ') : [];
    q = window.jQuery('#wis_list_old').html() || '';
    Z = q.length > 0 ? q.split(' ') : [];
  }
  // Utility function to check if item is unique in array
  function isUnique(item, index, arr) {
    return arr.indexOf(item) === index;
  }

  function n() {
    $body.on(
      'click',
      `["${wishlistButton}"]` + ':not(.' + addedClass + ')',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLocalWishlist) {
          ((element) => {
            const id = element.data('id') || '';
            const ID = 'id:' + id;
            const data = localStorage.getItem(storageName);
            const s = false;
            if (!id) return;

            element.addClass(pendingClass);
            let datas =
              data.length > 0
                ? a.split(',').unshift(ID).filter(isUnique)
                : [ID];
            if (datas.length > maxItems) {
              datas = datas.splice(0, maxItems);
              s = true;
            }
            localStorage.setItem(storageName, datas.toString());
            itemCount = datas.length;
            if (s) {
              const $elem = e(`["${wishlistButton}"]${addedClass}`);
              $elem
                .removeClass(addedClass)
                .find('.text-pr')
                .text(addToWishlistText);
              $elem.find('.svg-pr-icon').html(addIcon);
              updateAllWishlist();
            } else {
              updateWishlistUI(id, element);
            }
            window.jQuery(countSelector).html(itemCount);
            updateWishlistLink();
            if (window.isPageWishlist) window.location.href = O;
          })(window.jQuery(event.currentTarget));
        } else {
          (function (element) {
            const id = element.attr('data-id') || '';
            const handle = element.attr('data-handle') || 'ntt4s' + id;
            if (!id) return;
            element.addClass(loadingClass + ' ' + pendingClass);
            fetch(ecomriseWishlistapiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                product_id: id,
                product_handle: handle,
                action: 'add',
              }),
            })
              .then((e) => e.json())
              .then((res) => {
                if ('success' == res.status) {
                  Z = JSON.parse(res.response.metafield.value).the4_ids;
                  W = JSON.parse(res.response.metafield.value).ecomrise_ids;
                  Z && (W = W.concat(Z));
                  Array.isArray(W) || (W = W.split(','));
                  updateWishlistUI(n);
                  itemCount = W.length;
                  window.jQuery(countSelector).html(itemCount);
                  triggerWishlistUpdate();
                  if (window.isPageWishlist) window.location.href = O;
                } else {
                  console.error(res.message || 'Unknow error');
                }
              })
              .catch((error) => {
                console.log('Error: ' + error);
              })
              .finally(() => {
                element.removeClass(loadingClass + ' ' + pendingClass);
              });
          })(window.jQuery(event.currentTarget));
        }
      }
    );
  }

  function o(element) {
    var n = element.data('id'),
      i = 'id:' + n,
      o = localStorage.getItem(_);
    element.addClass(P);
    var a = (N = o.split(',')).indexOf(i);
    a > -1 ? (N = N.splice(0, T + 1)).splice(a, 1) : (N = N.splice(0, T)),
      localStorage.setItem(_, N.toString()),
      element.removeClass(P),
      element.trigger('destroyTooltip');
    var s = window.$('.products-wishlist .products');
    if (s.length > 0) {
      let i = element.closest('.product');
      (i = i[0]
        ? i
        : e(`[data-remove-wishlist][data-id="${n}"]`).closest('.product')),
        s.hasClass('isotope-enabled')
          ? s.isotopet4s('remove', i[0]).isotopet4s('layout')
          : i.remove();
    }
    e(w + '[data-id="' + n + '"]')
      .removeClass(k)
      .find('.text-pr')
      .text(A),
      e(w + '[data-id="' + n + '"]')
        .find('.svg-pr-icon')
        .html($),
      (E = N.length),
      e(C).html(E),
      r(),
      j &&
        ('' == N.toString() || z) &&
        (e('.products-wishlist').fadeTo(300, 0), (window.location.href = O));
  }

  // Handle adding to wishlist in local storage mode
  function handleLocalWishlistClick(element) {
    const productId = element.data('id') || '';
    const storageKey = `id:${productId}`;
    const currentWishlist = localStorage.getItem(storageName);
    let isFull = false;

    if (!productId) return;

    element.addClass(pendingClass);

    let wishlistArray =
      currentWishlist?.length > 0 ? currentWishlist.split(',') : [];
    wishlistArray.unshift(storageKey);

    wishlistArray = wishlistArray.filter(isUnique);

    if (wishlistArray.length > maxItems) {
      wishlistArray = wishlistArray.slice(0, maxItems);
      isFull = true;
    }

    localStorage.setItem(storageName, wishlistArray.toString());
    itemCount = wishlistArray.length;

    if (isFull) {
      removeOldestItem();
    } else {
      updateWishlistUI(productId, element);
    }

    $(countSelector).html(itemCount);
    updateWishlistLink();
    if (window.isPageWishlist) {
      window.location.href = wishlistPageURL;
    }
  }

  // Handle adding to wishlist in remote server mode
  function handleRemoteWishlistClick(element) {
    const productId = element.attr('data-id') || '';
    const productHandle = element.attr('data-handle') || 'nt' + productId;

    if (!productId) return;

    element.addClass(`${loadingClass} ${pendingClass}`);

    fetch(
      Z.indexOf(productId) >= 0
        ? ecomriseWishlistapiEndpoint
        : the4WishlistapiEndpoint,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          product_handle: productHandle,
          action: 'add',
          _method: 'DELETE',
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          const id = JSON.parse(data.response.metafield.value).the4_ids;
          currentItems =
            JSON.parse(data.response.metafield.value).ecomrise_ids || [];
          if (id) {
            currentItems = currentItems.concat(id);
          }
          W = currentItems;
          if (!Array.isArray(W)) {
            W = W.split(',');
          }
          element.trigger('destroyTooltip');
          const $element = window.jQuery('.products-wishlist .products');
          if ($element.length > 0) {
            let $elm = element.closest('.product');
            ($elm = $elm[0]
              ? $elm
              : window
                  .jQuery(`[data-remove-wishlist][data-id="${productId}"]`)
                  .closest('.product')),
              $element.hasClass('isotope-enabled')
                ? $element.isotope('remove', $elm[0]).isotope('layout')
                : $elm.remove();
          }
          window
            .jQuery(`["${wishlistButton}"][data-id="${id}"]`)
            .removeClass(addedClass)
            .find('.text-pr')
            .text(addToWishlistText);
          window
            .jQuery(`["${wishlistButton}"][data-id="${id}"]`)
            .find('.svg-pr-icon')
            .html(addIcon);
          itemCount = W.length;
          window.jQuery(countSelector).html(itemCount);
          triggerWishlistUpdate();
          if (
            window.isPageWishlist &&
            (currentItems.length || window.hasPaginateWishlist)
          ) {
            window.jQuery('.products-wishlist').fadeTo(300, 0);
            window.location.href = baseWishlistURL;
          }
        } else {
          console.error(data.message || 'Unknown error', data);
        }
      })
      .catch((error) => console.error('Error: ' + error))
      .finally(() => {
        element.removeClass(loadingClass + ' ' + pendingClass);
      });
  }

  // Function to update the wishlist link and UI after item is added
  function updateWishlistLink() {
    const currentWishlist = localStorage.getItem(storageName);

    if (currentWishlist) {
      let queryString = encodeURI(currentWishlist.replace(/,/g, ' OR '));
      wishlistPageURL = baseWishlistURL + queryString;
      window.T4SThemeSP.linkWishlist = wishlistPageURL;
      $document.trigger('update:mini_cart:wishlist');
    }
  }

  // Function to trigger the wishlist update for the mini cart
  function triggerWishlistUpdate() {
    if (itemCount > 0) {
      let queryString = 'id:' + currentItems.join(' OR id:');
      wishlistPageURL = baseWishlistURL + encodeURI(queryString);
      window.T4SThemeSP.linkWishlist = wishlistPageURL;
      $document.trigger('update:mini_cart:wishlist');
    }
  }

  // Updates the UI for a specific item in the wishlist
  function updateWishlistUI(productId, element) {
    let itemElement = $(
      `${wishlistButton}'[data-id="${productId}"]:not(.${addedClass})`
    );
    itemElement.addClass(addedClass).removeClass(pendingClass);
    itemElement.find('.text-pr').text(removeWishlist);
    itemElement.find('.svg-pr-icon').html(addedIcon);

    if (element) {
      itemElement.trigger('updateTooltip');
    }
  }

  function updateAllWishlist() {
    if (
      !((!isStorageSpdLocalAll && supportsLocalStorage) || wishlistDisabled)
    ) {
      if (supportsLocalStorage) {
        const data = localStorage.getItem(storageName);
        if (!data) return;
        const ids = data.replace(/id:/g, '');
        (currentItems = ids.split(',')),
          (itemCount = '' == data ? 0 : currentItems.length);
      } else {
        currentItems = W;
        if (currentItems.length) {
          itemCount = currentItems.length;
        } else {
          return;
        }
      }
      currentItems.forEach((item) => {
        updateWishlistUI(item.replace('id:', ''));
      });
      if (window.isPageWishlist) {
        const element = window.jQuery(`.products-wishlist [${wishlistButton}]`);
        element
          .removeClass(addedClass)
          .removeAttr(wishlistButton, '')
          .attr(removeWishlistButton, '')
          .find('.text-pr')
          .html(removeWishlist);
        element.find('.svg-pr-icon').html(removeIcon);
      }
      window.jQuery(countSelector).html(itemCount || window.countWishlistPage);
    }
  }

  // Remove oldest item if wishlist is full
  function removeOldestItem() {
    const wishlistButtonElements = $(`${wishlistButton}${addedClass}`);
    wishlistButtonElements.removeClass(addedClass);
    wishlistButtonElements.find('.text-pr').text(addToWishlistText);
    wishlistButtonElements.find('.svg-pr-icon').html(addIcon);
  }

  // Main initializer function for the wishlist
  function initializeWishlist() {
    if (!((!isStorageSpdLocalAll && isLocalWishlist) || wishlistDisabled))
      return;

    if (history.replaceState && window.isPageWishlist) {
      window.history.replaceState(
        {},
        document.title,
        `${searchUrl}/?view=wishlist`
      );
    }
    if (isLocalWishlist) {
      updateWishlistLink();
    } else {
      triggerWishlistUpdate();
    }

    if (window.isPageWishlist) {
      if (window.isEmtyWishlist && window.isWishlistPerformed) {
        localStorage.removeItem(storageName);
      } else {
        if (
          window.countWishlistPage != currentItems.length &&
          window.isWishlistPerformed
        ) {
          window.jQuery(countSelector).html(window.countWishlistPage);
          localStorage.setItem(storageName, window.listIDPrs);
        }
      }

      if (
        !window.isEmtyWishlist ||
        window.isWishlistPerformed ||
        itemCount.length ||
        IsDesignMode
      ) {
        window.location.href = O;
      }
    }
    $body.on('click', `${wishlistButton}.${addedClass}`, (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (f) {
        if (isLocalWishlist) {
          handleLocalWishlistClick($(event.currentTarget));
        } else {
          handleRemoteWishlistClick($(event.currentTarget));
        }
      } else {
        window.location.href = O;
      }
    });

    $body.on('click', wishlistLinkSelector, (event) => {
      if (O.length) {
        event.preventDefault();
        window.location.href = O;
      }
    });
    n();
    $body.on('click', `[${removeWishlistButton}]`, (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isLocalWishlist) {
        handleLocalWishlistClick($(event.currentTarget));
      } else {
        handleRemoteWishlistClick($(event.currentTarget));
      }
    });
  }

  return {
    init: initializeWishlist,
    updateAll: updateAllWishlist,
  };
})();

//done
window.T4SThemeSP.PopupPro = (() => {
  const $ = window.jQuery || window.$;
  const mfpClose = themeStrings.mfp_close;
  const theme = window.T4Sconfigs.theme;
  const openingcls = 'is-opening-mfp';
  const loadedCls = 'is--loaded';
  const openPopupEvent = 'open.popup';
  const closePopupEvent = 'close.popup';
  const ageVerify = {
    $popup: null,
    stts: {},
    age_limit: 0,
    date_of_birth: 0,
    day_next: null,
    click: 'click.age',
    popup: '#popup__age',
    CookiesName: `${theme}_age_verify`,
  };
  const exitIntent = {
    $popup: null,
    stts: {},
    day_next: null,
    mouseleave: 'mouseleave.exit',
    click: 'click.exit',
    popup: '#popup__exit',
    CookiesName: `${theme}_exit`,
  };
  const newsletter = {
    $content: null,
    stts: {},
    pp_version: 0,
    day_next: null,
    scroll_delay: null,
    after: null,
    scroll: 'scroll.newsletter',
    click: 'click.newsletter',
    popup: '#popup__newsletter',
    canvas: '.newsletter_canvas',
    CookiesName: `${theme}_newsletter`,
  };
  const cookiesLaw = {
    $popup: null,
    popup: '#popup__cookies-law',
    click: 'click.cookies',
    stts: {},
    day_next: 0,
    pp_version: 0,
    CookiesName: '',
  };
  const salesNotification = {
    popup: '#popup__sales-tmp',
    closeSelector: '[data-close-sale]',
  };
  const isPopupEnabled = true;
  const showAgeVerificationPopup = () => {
    $.magnificPopupT4s.open({
      items: { src: ageVerify.popup },
      type: 'inline',
      closeOnBgClick: false,
      closeBtnInside: false,
      showCloseBtn: false,
      enableEscapeKey: false,
      removalDelay: 500,
      tClose: mfpClose,
      callbacks: {
        beforeOpen() {
          $html.addClass(openingcls);
          this.st.mainClass = 'mfp-move-horizontal age_pp_wrapper';
        },
        open() {
          ageVerify.$popup
            .find('.age_verify_allowed')
            .on(ageVerify.click, () => {
              if (ageVerify.date_of_birth) {
                const ageYearValue = parseInt($('#ageyear').val());
                const ageMonthValue = parseInt($('#agemonth').val());
                const ageDayValue = parseInt($('#ageday').val());
                const dob = new Date(
                  ageYearValue + ageVerify.age_limit,
                  ageMonthValue,
                  ageDayValue
                );
                if (new Date().getTime() - dob.getTime() < 0) {
                  ageVerify.$popup.addClass('animated shake');
                  setTimeout(() => {
                    ageVerify.$popup.removeClass('animated shake');
                  }, 1000);
                } else {
                  CookiesT4.set(ageVerify.CookiesName, 'confirmed', {
                    expires: parseInt(ageVerify.day_next),
                    path: '/',
                  });
                  $.magnificPopupT4s.close();
                }
              } else {
                CookiesT4.set(ageVerify.CookiesName, 'confirmed', {
                  expires: parseInt(ageVerify.day_next),
                  path: '/',
                });
                $.magnificPopupT4s.close();
              }
            });
          ageVerify.$popup
            .find('.age_verify_forbidden')
            .on(ageVerify.click, () => {
              ageVerify.$popup.addClass('active_forbidden');
            });
        },
        before() {
          console.log('before close');
        },
        close() {
          ageVerify.$popup
            .find('.age_verify_allowed, .age_verify_forbidden')
            .off(ageVerify.click);
        },
        afterClose() {
          $html.removeClass(openingcls);
        },
      },
    });
  };

  const openExitPopup = () => {
    $.magnificPopupT4s.open({
      items: { src: exitIntent.popup },
      type: 'inline',
      removalDelay: 500,
      tClose: mfpClose,
      callbacks: {
        beforeOpen() {
          $html.addClass(openingcls);
          this.st.mainClass = 'mfp-move-horizontal exit_pp_wrapper';
        },
        open() {
          if ($('.exit_pp_wrapper .product').length > 0)
            window.T4SThemeSP.reinitProductGridItem();
          if ($('.exit_pp_wrapper .flickity').length > 0) {
            const t = $('.exit_pp_wrapper .flickity')[0];
            t.flickityt4s = new window.T4SThemeSP.Carousel(t);
          }
          $body.trigger('ts:hideTooltip');
          $body.trigger('currency:update');
        },
        beforeClose() {
          console.log('before close');
        },
        close: () => {
          $document.off(exitIntent.mouseleave);
          CookiesT4.set(exitIntent.CookiesName, 'shown', {
            expires: exitIntent.day_next,
            path: '/',
          });
        },
        afterClose: () => {
          $html.removeClass(openingcls);
        },
      },
    });
  };

  const handleNewsletterPopup = (type, close = false) => {
    if (type === 1) {
      $.magnificPopupT4s.open({
        items: { src: newsletter.popup },
        type: 'inline',
        removalDelay: 500,
        tClose: mfpClose,
        callbacks: {
          beforeOpen() {
            $html.addClass(openingcls);
            this.st.mainClass = 'mfp-move-horizontal newsletter_pp_wrapper';
          },
          open() {
            $body.on('mail.subscribe.success', () => {
              CookiesT4.set(newsletter.CookiesName, 'shown', {
                expires: newsletter.day_next,
                path: '/',
              });
            });
          },
          beforeClose() {
            if (
              $('[data-checked-newsletter]:checked').length > 0 ||
              !$('[data-checked-newsletter]')[0]
            ) {
              CookiesT4.set(newsletter.CookiesName, 'shown', {
                expires: newsletter.day_next,
                path: '/',
              });
            }
          },
          close() {
            console.log('close');
          },
          afterClose: () => {
            $html.removeClass(openingcls);
          },
        },
      });
    } else if (close) {
      newsletter.$content.addClass('on--show').removeClass('on--shown');
      setTimeout(() => newsletter.$content.removeClass('on--show'), 500);
      if (
        $('[data-checked-newsletter]:checked').length > 0 ||
        !$('[data-checked-newsletter]')[0]
      ) {
        CookiesT4.set(newsletter.CookiesName, 'shown', {
          expires: newsletter.day_next,
          path: '/',
        });
      }
    } else {
      newsletter.$content.addClass('on--show');
      setTimeout(
        () => newsletter.$content.removeClass('on--show').addClass('on--shown'),
        100
      );
    }
  };

  const randomIntInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const updateSalePopupContent = (index) => {
    const imgSrc = window.T4SThemeSP.Images.getNewImageUrl(
      salesNotification.imageArray[index],
      65
    );
    const imgSrc2x = window.T4SThemeSP.Images.getNewImageUrl(
      salesNotification.imageArray[index],
      130
    );
    salesNotification.$temp
      .find('[data-img-sale]')
      .attr('src', imgSrc)
      .attr('srcset', `${imgSrc} 1x, ${imgSrc2x} 2x`);
    salesNotification.$temp
      .find('[data-title-sale]')
      .text(salesNotification.titleArray[index]);
    salesNotification.$temp
      .find('[data-href-sale]')
      .attr('href', salesNotification.urlArray[index]);
    salesNotification.$temp
      .find('[data-action-quickview]')
      .attr('data-id', salesNotification.idArray[index]);
    salesNotification.$temp
      .find('[data-location-sale]')
      .text(
        salesNotification.locationArray[
          randomIntInRange(salesNotification.min, salesNotification.max2)
        ]
      );
    salesNotification.$temp
      .find('[data-ago-sale]')
      .text(
        salesNotification.timeArray[
          randomIntInRange(salesNotification.min, salesNotification.max3)
        ]
      );
  };

  const hideTooltip = () => {
    $body.trigger('ts:hideTooltip');
    if (salesNotification.$temp) {
      salesNotification.$temp
        .removeClass(salesNotification.classUp)
        .addClass(salesNotification.classDown)
        .off('mouseenter mouseleave');
    }
  };

  const cycleSalesPopup = () => {
    hideTooltip();
    salesNotification.starTimeout = setTimeout(() => {
      if (salesNotification.$temp) salesNotification.$temp.remove();
      window.T4SThemeSP.$appendComponent.after(salesNotification.temp);
      window.T4SThemeSP.Tooltip();
      salesNotification.$temp = $('.popup__sales');
      if (salesNotification.ppType === '1') {
        updateSalePopupContent(salesNotification.index);
        salesNotification.index++;
        if (salesNotification.index > salesNotification.max)
          salesNotification.index = 0;
      } else {
        updateSalePopupContent(
          randomIntInRange(salesNotification.min, salesNotification.max)
        );
      }
      salesNotification.time.START = new Date().getTime();
      salesNotification.time.END =
        salesNotification.time.START + salesNotification.stayTime;
      salesNotification.stayTimeout = setTimeout(() => {
        clearTimeout(salesNotification.stayTimeout);
        cycleSalesPopup();
      }, salesNotification.stayTime);

      salesNotification.$progressbarSpan = $('.pp-slpr-progressbar>span');

      if (salesNotification.pauseOnHover) {
        salesNotification.$temp
          .on('mouseenter', () => {
            if (salesNotification.resetOnHover) {
              salesNotification.$progressbarSpan.css('animation-name', 'none');
            } else {
              salesNotification.time.REMAINING =
                salesNotification.time.END - new Date().getTime();
            }
            clearTimeout(salesNotification.stayTimeout);
          })
          .on('mouseleave', () => {
            if (salesNotification.resetOnHover) {
              salesNotification.time.REMAINING = salesNotification.stayTime;
              salesNotification.$progressbarSpan.css('animation-name', 'ani-w');
            } else {
              salesNotification.time.END =
                new Date().getTime() + salesNotification.time.REMAINING;
            }
            salesNotification.stayTimeout = setTimeout(
              () => cycleSalesPopup(),
              salesNotification.time.REMAINING
            );
          });
      }
    }, salesNotification.timeBetween);
  };

  const closeLayout = () => {
    cookiesLaw.$popup.removeClass('on--hide').addClass('on--show');
    cookiesLaw.$popup.on(
      cookiesLaw.click,
      '.pp_cookies__accept-btn',
      (event) => {
        event.preventDefault();
        window.Shopify.customerPrivacy.setTrackingConsent(true, hidePopup);
        document.addEventListener('trackingConsentAccepted', () => {
          CookiesT4.set(cookiesLaw.CookiesName, 'accepted', {
            expires: cookiesLaw.day_next,
            path: '/',
          });
        });
        if (isPopupEnabled) {
          CookiesT4.set(cookiesLaw.CookiesName, 'accepted', {
            expires: cookiesLaw.day_next,
            path: '/',
          });
        }
      }
    );
    cookiesLaw.$popup.on(
      cookiesLaw.click,
      '.pp_cookies__decline-btn',
      (event) => {
        event.preventDefault();
        window.Shopify.customerPrivacy.setTrackingConsent(false, hidePopup);
      }
    );
  };

  const hidePopup = () => {
    cookiesLaw.$popup.addClass('on--hide').removeClass('on--show');
  };

  const initializeCookieConsentPopup = () => {
    cookiesLaw.$popup = $(cookiesLaw.popup);
    if (cookiesLaw.$popup.length !== 0) {
      cookiesLaw.stts = cookiesLaw.$popup.data('stt'); // Get the settings data from the popup
      cookiesLaw.day_next = cookiesLaw.stts.day_next || 60; // Default to 60 days if not specified
      cookiesLaw.pp_version = cookiesLaw.stts.pp_version || 1994; // Default version is 1994
      cookiesLaw.CookiesName = `${theme}_cookies_${cookiesLaw.pp_version}`; // Cookie name using theme and version

      isPopupEnabled = '1' == cookiesLaw.stts.show; // Check if popup should be shown

      // Check if the cookie has been set or if the popup is already accepted
      if (
        'accepted' === CookiesT4.get(cookiesLaw.CookiesName) ||
        cookiesLaw.$popup.hasClass(loadedCls)
      ) {
        return; // No need to show the popup if already accepted
      }

      // Show the popup if not accepted
      cookiesLaw.$popup.addClass(loadedCls);

      // Load Shopify features to manage tracking consent
      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        (error) => {
          if (error) {
            throw error;
          }

          // Check if the user can be tracked and their tracking consent status
          const canTrackUser =
            window.Shopify.customerPrivacy.userCanBeTracked();
          const trackingConsentStatus =
            window.Shopify.customerPrivacy.getTrackingConsent();

          // Show the popup only if the user cannot be tracked or the tracking consent is denied
          // Or if it's in design mode or if the popup is enabled
          if (
            (!canTrackUser && trackingConsentStatus === 'no_interaction') ||
            IsDesignMode ||
            isPopupEnabled
          ) {
            if (IsDesignMode) {
              cookiesLaw.$popup
                .on(openPopupEvent, () => {
                  cookiesLaw.$popup = window.$(cookiesLaw.popup); // Reinitialize the popup element
                  closeLayout(); // Handle closing the popup in design mode
                })
                .on(closePopupEvent, function () {
                  hidePopup(); // Handle hiding the popup
                });
            } else {
              closeLayout(); // Close the popup in production mode
            }
          }
        }
      );
    }
  };

  return () => {
    // Initialize everything
    initializeCookieConsentPopup();
    // Determine the popup content element, prioritizing the popup if it exists; otherwise, use the canvas
    newsletter.$content = $(
      $(newsletter.popup).length > 0 ? newsletter.popup : newsletter.canvas
    );

    const pageShowCountCookie = `${theme}_shown_pages`;
    let shownPageCount = CookiesT4.get(pageShowCountCookie) || 0;
    const popupType = $(newsletter.popup).length > 0 ? 1 : 2;

    // If there is no content to display, increment the show count and set it in the cookies, then exit
    if (newsletter.$content.length === 0) {
      shownPageCount++;
      CookiesT4.set(pageShowCountCookie, shownPageCount, {
        expires: 194,
        path: '/',
      });
    } else {
      // Retrieve popup settings
      newsletter.stts = newsletter.$content.data('stt');
      newsletter.pp_version = newsletter.stts.pp_version;
      newsletter.CookiesName += newsletter.pp_version;

      // Conditions to avoid showing the popup in specific cases
      if (
        !(
          (!IsDesignMode &&
            CookiesT4.get(newsletter.CookiesName) === 'shown') ||
          (!newsletter.stts.isMobile && $window.width() < 768) ||
          newsletter.$content.hasClass(loadedCls)
        )
      ) {
        const alternateVersion = newsletter.pp_version === '1' ? '2' : '1';
        const alternateCookie = `${theme}_newsletter${alternateVersion}`;

        if (CookiesT4.get(alternateCookie) === 'shown') {
          CookiesT4.remove(alternateCookie);
        }

        // Mark popup as loaded and retrieve display parameters
        newsletter.$content.addClass(loadedCls);
        newsletter.day_next = newsletter.stts.day_next;
        newsletter.scroll_delay = newsletter.stts.scroll_delay;
        newsletter.after = newsletter.stts.after;

        if (isEmailSubscribed) {
          const hasSuccessMessage =
            newsletter.$content.find('.newsletter-success').length > 0;
          const hasErrorMessage =
            newsletter.$content.find('.newsletter-error').length > 0;

          if (hasSuccessMessage || hasErrorMessage) {
            if (hasSuccessMessage) {
              CookiesT4.set(newsletter.CookiesName, 'shown', {
                expires: newsletter.day_next,
                path: '/',
              });
            }
            newsletter.after = 'auto';
            newsletter.stts.time_delay = 500;
          }
        }

        if (IsDesignMode) {
          if (popupType === 1) {
            newsletter.$content
              .on(openPopupEvent, () => {
                if ($.magnificPopupT4s.instance.isOpen) {
                  $.magnificPopupT4s.close();
                  setTimeout(() => {
                    newsletter.$content
                      .off(openPopupEvent)
                      .off(closePopupEvent);
                    newsletter.$content = $(newsletter.popup);
                    handleNewsletterPopup(popupType);
                    newsletter.$content
                      .on(openPopupEvent, () => {
                        handleNewsletterPopup(popupType);
                      })
                      .on(closePopupEvent, () => {
                        $.magnificPopupT4s.close();
                      });
                  }, $.magnificPopupT4s.instance.st.removalDelay + 10);
                } else {
                  handleNewsletterPopup(popupType);
                }
              })
              .on(closePopupEvent, () => {
                $.magnificPopupT4s.close();
              });
          } else {
            newsletter.$content
              .on('shopify:block:select', () => {
                handleNewsletterPopup(popupType);
              })
              .on('shopify:block:deselect', () => {
                handleNewsletterPopup(popupType, 'close');
              });
          }
        } else {
          const pageViewLimit = newsletter.stts.number_pages;

          if (shownPageCount < pageViewLimit) {
            shownPageCount++;
            CookiesT4.set(pageShowCountCookie, shownPageCount, {
              expires: 194,
              path: '/',
            });
            return;
          }

          CookiesT4.set(pageShowCountCookie, pageViewLimit, {
            expires: 194,
            path: '/',
          });

          if (newsletter.triggerMethod === 'scroll') {
            $window.on(newsletter.scroll, () => {
              if ($document.scrollTop() >= newsletter.scroll_delay) {
                handleNewsletterPopup(popupType);
                $window.off(newsletter.scroll);
              }
            });
          } else {
            setTimeout(() => {
              handleNewsletterPopup(popupType);
            }, newsletter.stts.time_delay);
          }

          $document
            .on('click', '[data-trigger-newsletter]', (event) => {
              event.preventDefault();
              handleNewsletterPopup(popupType);
            })
            .on('click', '[data-dismiss]', (event) => {
              event.preventDefault();
              handleNewsletterPopup(popupType, 'close');
            });

          $body.on('mail.subscribe.success', () => {
            handleNewsletterPopup(popupType);
            CookiesT4.set(newsletter.CookiesName, 'shown', {
              expires: newsletter.nextDisplayDays,
              path: '/',
            });
          });
        }
      }
    }
    // Setting up the 'exit intent' popup behavior
    exitIntent.$popup = $(exitIntent.popup);
    if (exitIntent.$popup.length !== 0) {
      const isPopupAlreadyShown =
        CookiesT4.get(exitIntent.CookiesName) === 'shown';

      // If popup is not shown, and it isn't in design mode, show it
      if (
        !(!IsDesignMode && isPopupAlreadyShown) ||
        exitIntent.$popup.hasClass(loadedCls)
      ) {
        // Retrieving popup settings from the HTML `data` attributes
        exitIntent.stts = exitIntent.$popup.data('stt');
        exitIntent.day_next = exitIntent.stts.day_next;
        exitIntent.$popup.addClass(loadedCls);

        // Handle coupon button behavior within the popup
        $document.on('click', '.btn-coupon', (event) => {
          const couponCode = $(event.currentTarget).data('coupon');
          navigator.clipboard.writeText(couponCode);
          window
            .$(event.currentTarget)
            .find('.tooltiptext')
            .text(`${window.T4Sstrings.copied_tooltipText}: ${couponCode}`);
        });

        // Restore tooltip text on mouse leave
        $document.on('mouseleave', '.btn-coupon', (event) => {
          window
            .$(event.currentTarget)
            .find('.tooltiptext')
            .text(window.T4Sstrings.copied_tooltipText);
        });

        // Logic for popup display in design mode
        if (IsDesignMode) {
          newsletter.$popup
            .on(openPopupEvent, () => {
              if ($.magnificPopupT4s.instance.isOpen) {
                $.magnificPopupT4s.close();
                setTimeout(() => {
                  newsletter.$popup.off(openPopupEvent).off(closePopupEvent);
                  newsletter.$popup = $(newsletter.popup);
                  openExitPopup();

                  newsletter.$popup
                    .on(openPopupEvent, openExitPopup)
                    .on(closePopupEvent, () => $.magnificPopupT4s.close());
                }, $.magnificPopupT4s.instance.st.removalDelay + 10);
              } else {
                openExitPopup();
              }
            })
            .on(closePopupEvent, () => {
              $.magnificPopupT4s.close();
            });
        } else {
          $document.on(newsletter.mouseleave, (event) => {
            if (event.clientY < 60 && $('.mfp-content').length === 0)
              openExitPopup();
          });
        }
      }
    }

    // Setting up the age verification popup
    ageVerify.$popup = $(ageVerify.popup);
    if (ageVerify.$popup.length !== 0) {
      const isAgeConfirmed =
        CookiesT4.get(ageVerify.CookiesName) === 'confirmed';

      if (
        !(!IsDesignMode && isAgeConfirmed) ||
        ageVerify.$popup.hasClass(loadedCls)
      ) {
        ageVerify.stts = ageVerify.$popup.data('stt');
        ageVerify.age_limit = ageVerify.stts.age_limit;
        ageVerify.date_of_birth = ageVerify.stts.date_of_birth;
        ageVerify.day_next = ageVerify.stts.day_next;
        ageVerify.$popup.addClass(loadedCls);

        if (IsDesignMode) {
          ageVerify.$popupElement
            .on(openPopupEvent, () => {
              if ($.magnificPopupT4s.instance.isOpen) {
                $.magnificPopupT4s.close();
                setTimeout(() => {
                  ageVerify.$popupElement
                    .off(openPopupEvent)
                    .off(closePopupEvent);
                  ageVerify.$popupElement = $(ageVerify.popup);
                  showAgeVerificationPopup();

                  ageVerify.$popupElement
                    .on(openPopupEvent, showAgeVerificationPopup)
                    .on(closePopupEvent, () => $.magnificPopupT4s.close());
                }, $.magnificPopupT4s.instance.st.removalDelay + 10);
              } else {
                showAgeVerificationPopup();
              }
            })
            .on('close.popup', () => {
              $.close();
            });
        } else {
          showAgeVerificationPopup();
        }
      }
    }
    // Retrieve and check if the popup element exists in the DOM
    salesNotification.$popup = $(salesNotification.popup);
    if (salesNotification.$popup.length === 0) return;

    // Fetch the JSON configuration for the popup settings
    const popupConfigElement = $('#popup__sales-JSON');
    salesNotification.stts = parseJSON(popupConfigElement.html()); // Parsing JSON from the HTML element
    popupConfigElement.remove();

    // Check mobile device compatibility or if the popup has already been loaded
    if (
      (!salesNotification.stts.isMobile && $window.width() < 768) ||
      salesNotification.$popup.hasClass(loadedCls)
    )
      return;

    // Initialize the popup by adding the loaded class and setting properties based on the configuration
    salesNotification.$popup.addClass(loadedCls);
    salesNotification.temp = salesNotification.$popup.html();
    salesNotification.starTime =
      salesNotification.stts.startTime * salesNotification.stts.startTimeUnit;
    salesNotification.stayTime =
      salesNotification.stts.stayTime * salesNotification.stts.stayTimeUnit;
    salesNotification.index = 0;
    salesNotification.limit = salesNotification.stts.limit;
    salesNotification.max = salesNotification.stts.max;
    salesNotification.min = 0;
    salesNotification.classUp = salesNotification.stts.classUp;
    salesNotification.classUp =
      salesNotification.stts.classDown[salesNotification.classUp];
    salesNotification.ppType = salesNotification.stts.ppType;
    salesNotification.pauseOnHover = salesNotification.stts.pauseOnHover;
    salesNotification.resetOnHover = salesNotification.stts.resetOnHover;

    // Arrays holding various popup content elements
    salesNotification.idArray = salesNotification.stts.idArray;
    salesNotification.titleArray = salesNotification.stts.titleArray;
    salesNotification.urlArray = salesNotification.stts.urlArray;
    salesNotification.locationArray = salesNotification.stts.locationArray;
    salesNotification.timeArray = salesNotification.stts.timeArray;
    salesNotification.imageArray = salesNotification.stts.imageArray;

    // Set max indices based on array lengths
    salesNotification.max = salesNotification.urlArray.length - 1;
    salesNotification.max2 = salesNotification.locationArray.length - 1;
    salesNotification.max3 = salesNotification.timeArray.length - 1;

    // Initialize placeholders for timeouts
    salesNotification.time = {};

    // Display the popup in design mode
    if (IsDesignMode) {
      T4SThemeSP.$appendComponent.after(salesNotification.temp);
      salesNotification.$temp = $('.popup__sales');
      salesNotification.$temp.hide();
      T4SThemeSP.Tooltip();

      // Close button functionality
      $(salesNotification.close).on('click', function (event) {
        event.preventDefault();
        hideTooltip();
      });

      // Event listeners to show/hide popup in design mode
      salesNotification.$popup
        .on(openExitPopup, () => {
          salesNotification.$temp.show();
          salesNotification.$temp
            .addClass(salesNotification.classUp)
            .removeClass(salesNotification.classDown);
        })
        .on(closePopupEvent, () => {
          hideTooltip();
        });
    } else {
      // Remove popup element in production mode and initialize auto-show functionality
      salesNotification.$popup.remove();
      cycleSalesPopup();
    }
  };
})();

var isEmailSubscribed =
  location.search.indexOf('customer_posted=true') > -1 ||
  location.search.indexOf('newsletter&form_type=customer') > -1;

//done
window.T4SThemeSP.PopupFetch = () => {
  const path = T4Srequest.path;
  let url = `${path !== '/' ? path : ''}/?section_id=popups`;

  if (isEmailSubscribed) {
    const queryParams = location.href.split('/?')[1];
    url += `&${queryParams}`;
  }

  window.T4SThemeSP.getToFetchSection(null, 'text', url).then((response) => {
    if (response !== 'NVT_94') {
      window.T4SThemeSP.$appendComponent.after(response);
      window.T4SThemeSP.PopupPro();
      window.T4SThemeSP.PlatFormMail();
      window.T4SThemeSP.PopupMFP();
    }
  });
};

//done
window.T4SThemeSP.PlatFormMail = (() => {
  const classes = {
    loading: 'is--loading',
    enabled: 'is--enabled',
    errorCheckbox: 'is--error-checkbox',
    errorEmail: 'is--error-email',
  };

  const selectors = {
    klaviyo: '[data-ts-klaviyo-submit]',
    agreeCheckbox: '[data-agreeMail-checkbox]',
  };

  const events = {
    click: 'click.mail',
    keyup: 'keyup.mail',
  };

  const handleFormSubmit = (
    form,
    button,
    responseForm,
    successMessage,
    errorMessage
  ) => {
    button.addClass(classes.loading);
    window.$.ajax({
      type: 'GET',
      url: form.attr('action'),
      data: form.serialize(),
      cache: false,
      dataType: 'jsonp',
      jsonp: 'c',
      contentType: 'application/json; charset=utf-8',
      error(error) {
        button.removeClass(classes.loading);
        const errorMsg = error.replace(/^\d+ - /, '');
        errorMessage.html(errorMsg).slideDown(100);
      },
      success(response) {
        button.removeClass(classes.loading);
        const successMsg = response.msg.replace(/^\d+ - /, '');
        if (response.result !== 'success') {
          successMessage.slideUp(100);
          errorMessage.html(successMsg).slideDown(100);
        } else {
          $document.trigger('mail.subscribe.success');
          errorMessage.slideUp(100);
          successMessage.slideDown(100);
        }
      },
    });
  };

  const initializeMailchimpForms = () => {
    if (platformEmail === '4') {
      window
        .jQuery(`[data-ts-mailChimp-ajax]:not(.${classes.enabled})`)
        .addClass(classes.enabled)
        .submit((event) => {
          event.preventDefault();
          const form = window.$(event.currentTarget);
          const responseForm = form.find('[data-new-response-form]');
          const submitButton = form.find('[data-ts-mailChimp-submit]');
          const successMessage = responseForm.find(
            '[data-new-response-success]'
          );
          const errorMessage = responseForm.find('[data-new-response-error]');

          handleFormSubmit(
            form,
            submitButton,
            responseForm,
            successMessage,
            errorMessage
          );
        });
    }
  };

  const initializeKlaviyoForms = () => {
    if (platformEmail === '3') {
      $script('//www.klaviyo.com/media/js/public/klaviyo_subscribe.js', () => {
        window
          .jQuery(`[data-ts-klaviyo-ajax]:not(.${classes.enabled})`)
          .each((_, element) => {
            const $form = window.$(element);
            const brand = $form.attr('data-brand') || 'Kalles Klaviyo';

            KlaviyoSubscribe.attachToForms(`#${$form.attr('id')}`, {
              custom_success_message: true,
              extra_properties: {
                $source: 'Newsletter Popup',
                Brand: brand,
              },
              success() {
                $(document).trigger('mail.subscribe.success');
                $form.find(selectors.klaviyo).removeClass(classes.loading);
              },
            });

            $form.addClass(classes.enabled).submit((event) => {
              $form.find(selectors.klaviyo).addClass(classes.loading);
            });
          });
        $document.on('klaviyo.subscribe.success', (e) => {
          $document.trigger('mail.subscribe.success');
        });
        $document.on(
          'klaviyo.subscribe.success klaviyo.subscribe.error',
          (event) => {
            window
              .$(event.target)
              .find(selectors.klaviyo)
              .removeClass(classes.loading);
          }
        );
      });
    }
  };

  const handleCheckboxInteraction = () => {
    window
      .jQuery('[data-agreeMail-btn]')
      .off(events.click)
      .on(events.click, (event) => {
        const form = window.$(event.currentTarget).closest('form');
        const isChecked = form
          .find(`[type="checkbox"]${selectors.agreeCheckbox}`)
          .is(':checked');

        if (!isChecked) {
          event.preventDefault();
          event.stopPropagation();
          form.addClass(classes.errorCheckbox);
          if (!form.find('[type="email"]').val().length) {
            form.addClass(classes.errorEmail);
          }
        }
      });

    window
      .jQuery(selectors.agreeCheckbox)
      .off(events.click)
      .on(events.click, (event) => {
        const isChecked = window.$(event.currentTarget).is(':checked');
        if (isChecked) {
          window
            .$(event.currentTarget)
            .closet('form')
            .removeClass(classes.errorCheckbox);
        }
      });

    window
      .jQuery('[data-form-mail-agree] [type="email"]')
      .off(events.keyup)
      .on(events.keyup, (event) => {
        const element = window.$(event.currentTarget);
        const form = element.closest('form');
        form.toggleClass(classes.errorEmail, !!element.val().length);
      });
  };

  const handleAutoDisplayError = () => {
    const searchParams = '?contact%5Btags%5D=newsletter&form_type=customer';
    if (location.search === searchParams) {
      window
        .$('[data-new-response-form]')
        .html(
          `<div class="newsletter__error">${themeStrings.error_exist}</div>`
        )
        .slideDown(100);
    }
  };

  return () => {
    initializeMailchimpForms();
    initializeKlaviyoForms();
    handleCheckboxInteraction();
    handleAutoDisplayError();
  };
})();

var GroupedProductForm = class {
  constructor(formElement) {
    this.$form = (window.jQuery || window.$)(formElement);
    this.$totalPrice = this.$form.find('[data-groups-total-price]');
    this.ArrayPrice = [];
    this.ArrayComparePrice = [];

    this.initialize();
  }

  initialize() {
    this.$form
      .find('[data-groups-pr-item]')
      .each((index, item) => this.updateItemPrice(item, index));
    this.updateTotalPrice();
    this.addEventListeners();
  }

  addEventListeners() {
    this.$form.on('change.groups', 'select[data-groups-pr-sl]', (event) =>
      this.updateItem(event.currentTarget)
    );
    this.$form.on('change.groups', '[data-groups-pr-ck]', (event) =>
      this.handleCheckboxChange(event)
    );
    this.$form.on('change.groups', '[data-groups-qty-value]', (event) =>
      this.updateQuantity(event)
    );
  }

  handleCheckboxChange(event) {
    const $item = (window.jQuery || window.$)(event.currentTarget).closest(
      '[data-groups-pr-item]'
    );
    const index = $item.index();
    const $image = this.$form.find(`[data-groups-img="${index}"]`);
    const $input = $item.find('[name*="items[]"]');

    if (event.currentTarget.checked) {
      $item.addClass('is--checked');
      this.updateItemPrice($item[0], index);
      $image.fadeIn(300);
      $input.prop('disabled', false);
    } else {
      $item.removeClass('is--checked');
      this.ArrayPrice[index] = 0;
      this.ArrayComparePrice[index] = 0;
      $image.fadeOut(300);
      $input.prop('disabled', true);
    }

    this.updateTotalPrice();
  }

  updateItem(item) {
    const $select = (window.jQuery || window.$)(item);
    const $option = $select.find(':selected');
    const $item = $select.closest('[data-groups-pr-item]');
    const index = $item.data('index') || $item.index();
    const imgSrc = $option.data('img');
    const maxQty = $option.data('max');
    const $qtyInput = $item.find('[data-groups-qty-value]');
    const $image = this.$form.find(`[data-groups-img="${index}"] img`);
    const price = $option.data('price');
    const comparePrice = $option.data('cpprice');
    const $priceDisplay = $item.find('[data-groups-item-price]');

    $qtyInput.attr('max', maxQty);
    if ($image.attr('data-original') !== imgSrc) {
      $image
        .attr({
          'data-src': imgSrc,
          'data-original': imgSrc,
        })
        .removeClass('lazyloaded')
        .addClass('lazyload');
    }

    const qty = $qtyInput.val();
    const totalPrice = qty * price;
    const totalComparePrice = qty * comparePrice;

    const formattedPrice = window.T4SThemeSP.Currency.formatMoney(totalPrice);
    const formattedComparePrice = window.T4SThemeSP.Currency.formatMoney(
      totalComparePrice > totalPrice ? totalComparePrice : totalPrice
    );

    if (totalComparePrice > totalPrice) {
      $priceDisplay.html(
        `<del>${T4SThemeSP.Currency.formatMoney(
          totalComparePrice
        )}</del> <ins>${formattedPrice}</ins>`
      );
    } else {
      $priceDisplay.html(formattedPrice);
    }

    this.ArrayPrice[index] = totalPrice;
    this.ArrayComparePrice[index] = totalComparePrice;
    this.updateTotalPrice();
  }

  updateItemPrice(item, index) {
    const $item = (window.jQuery || window.$)(item);
    const price = parseInt(
      $item.find('[data-groups-pr-sl]').attr('data-price'),
      10
    );
    const qty = parseInt($item.find('[data-groups-qty-value]').val(), 10);
    this.ArrayPrice[index] = price * qty;
  }

  updateTotalPrice() {
    const totalPrice = this.ArrayPrice.reduce((sum, price) => sum + price, 0);
    const totalComparePrice = this.ArrayComparePrice.reduce(
      (sum, price) => sum + price,
      0
    );
    const formattedTotalPrice =
      window.T4SThemeSP.Currency.formatMoney(totalPrice);
    const formattedTotalComparePrice =
      window.T4SThemeSP.Currency.formatMoney(totalComparePrice);

    this.$totalPrice.html(
      totalComparePrice > totalPrice
        ? `<del>${formattedTotalComparePrice}</del> <ins>${formattedTotalPrice}</ins>`
        : formattedTotalPrice
    );
  }

  updateQuantity(event) {
    const $input = (window.jQuery || window.$)(event.currentTarget);
    const $item = $input.closest('[data-groups-pr-item]');
    const index = $item.index();
    const $select = $item.find('[data-groups-pr-sl]');

    this.updateItem($select, index);
  }
};

window.jQuery(document).ready(() => {
  window.jQuery('[data-groups-form]').each((_, formElement) => {
    new GroupedProductForm(formElement);
  });
});

window.T4SThemeSP.goToID = () => {
  const goIdSelector = '[data-go-id]';
  let scrollTimeout = 0;

  const $goIds = (window.jQuery || window.$)(goIdSelector);
  if ($goIds.length === 0) return;

  $goIds.click((event) => {
    event.preventDefault();
    event.stopPropagation();

    const $this = (window.jQuery || window.$)(event.currentTarget);
    const targetId = $this.data('go-id') || $this.attr('href');
    const $target = (window.jQuery || window.$)(targetId);
    const offset = $this.data('offset') || 100;

    if ($target.length === 0) return;

    if ($target.is(':hidden')) {
      window
        .jQuery(`[data-ts-tab-item][href="${targetId}"]:visible`)
        .trigger('click');
      scrollTimeout = 100;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      window.scrollTo({
        behavior: 'smooth',
        top: $target.offset().top - offset,
      });
    }, scrollTimeout);
  });
};

window.T4SThemeSP.CanvasConfetti = (() => {
  class ConfettiParticle {
    constructor(color) {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight - window.innerHeight;
      this.radius = this.getRandomInt(10, 30);
      this.diameter = Math.random() * 20 + 10;
      this.color = color;
      this.tilt = Math.floor(Math.random() * 10) - 10;
      this.tiltAngleIncremental = 0.07 * Math.random() + 0.05;
      this.tiltAngle = 0;
    }

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.lineWidth = this.radius / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.radius / 4, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.radius / 4);
      ctx.stroke();
    }
  }

  const colorOptions = [
    'DodgerBlue',
    'OliveDrab',
    'Gold',
    'pink',
    'SlateBlue',
    'lightblue',
    'Violet',
    'PaleGreen',
    'SteelBlue',
    'SandyBrown',
    'Chocolate',
    'Crimson',
  ];
  let particles = [];
  let animationFrameId;
  let isAnimating = false;
  let canvas, ctx, width, height;
  const totalParticles = window.innerWidth < 988 ? 75 : 150;

  const getColor = (() => {
    let colorIndex = 0;
    let colorIncrementer = 0;
    const colorThreshold = 10;

    return () => {
      if (colorIncrementer >= colorThreshold) {
        colorIncrementer = 0;
        colorIndex++;
        if (colorIndex >= colorOptions.length) colorIndex = 0;
      }
      colorIncrementer++;
      return colorOptions[colorIndex];
    };
  })();

  const initializeCanvas = () => {
    canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.display = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
  };

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  const startAnimation = () => {
    if (!isAnimating) {
      isAnimating = true;
      particles = Array.from(
        { length: totalParticles },
        () => new ConfettiParticle(getColor())
      );
      animationFrame();
    }
  };

  const stopAnimation = () => {
    isAnimating = false;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      canvas.style.display = 'none';
    }
  };

  const animationFrame = () => {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      particle.draw(ctx);
      if (particle.y < -15) {
        particle.y = height + 100;
      } else {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y +=
          (Math.cos(f + particle.diameter) + 3 + particle.radius / 2) / 2;
        particle.x += Math.sin(f);
        particle.tilt = 15 * Math.sin(particle.tiltAngle - index / 3);
      }
    });

    animationFrameId = requestAnimationFrame(animationFrame);
  };

  return () => {
    initializeCanvas();
    startAnimation();

    setTimeout(() => {
      stopAnimation();
    }, 3500);
  };
})();

window.T4SThemeSP.ToggleClass = () => {
  const $ = window.jQuery || window.$;
  $(document).on('click', '[data-toggle-class]', (event) => {
    const toggleClassName = $(event.currentTarget).attr('data-toggle-class');
    const targetSelector = $(event.currentTarget).attr('data-toggle-trigger');
    $(event.currentTarget).toggleClass(toggleClassName);
    $(targetSelector).toggleClass(toggleClassName);
  });
};

var GroupedProductManager = class {
  totalPriceSelector = '[data-groups-total-price]';
  itemSelector = '[data-groups-pr-item]';
  events = { change: 'change.groups' };
  classes = { checked: 'is--checked' };

  constructor(formElement) {
    this.$form = window.jQuery(formElement);
    this.$totalPriceDisplay = this.$form.find(totalPriceSelector);
    this.itemPrices = [];
    this.itemComparePrices = [];

    // Initialize item prices
    this.$form.find(itemSelector).each(function (index) {
      this._updateItemPrice(this, index);
    });

    // Set up total price and event listeners
    this._updateTotalPrice();
    this._eventListeners();
  }

  _eventListeners() {
    // Event listener for option selection change
    this.$form.on(events.change, 'select[data-groups-pr-sl]', function (event) {
      this.updateSelectedItem(event.currentTarget);
    });

    // Event listener for checkbox toggle
    this.$form.on(events.change, '[data-groups-pr-ck]', function (event) {
      let $item = e(event.currentTarget).closest(itemSelector);
      let itemIndex = $item.index();
      let $image = this.$form.find(`[data-groups-img="${itemIndex}"]`);
      let $hiddenInput = $item.find('[name*="items[]"]');

      if (this.checked) {
        $item.addClass(classes.checked);
        this.updateItemPrice($item, itemIndex);
        $image.fadeIn(300);
        $hiddenInput.prop('disabled', false);
      } else {
        $item.removeClass(classes.checked);
        this.itemPrices[itemIndex] = 0;
        this.itemComparePrices[itemIndex] = 0;
        $image.fadeOut(300);
        $hiddenInput.prop('disabled', true);
      }

      this.updateTotalPrice();
    });

    // Event listener for quantity change
    this.$form.on(events.change, '[data-groups-qty-value]', function (event) {
      let $item = e(event.currentTarget).closest(itemSelector);
      let itemIndex = $item.index();
      this.updateItemPrice($item[0], itemIndex);
      this.updateTotalPrice();
    });
  }

  updateItemPrice(element, index) {
    let $item = e(element);
    let $selectOption = $item.find('[data-groups-pr-sl]');
    let quantity = parseInt($item.find('[data-groups-qty-value]').val());
    let price = parseInt($selectOption.attr('data-price')) * quantity;
    let comparePrice = parseInt($selectOption.attr('data-cpprice')) * quantity;

    this.itemPrices[index] = price;
    this.itemComparePrices[index] = comparePrice > price ? comparePrice : price;
  }

  updateSelectedItem(selectElement) {
    let $select = e(selectElement);
    let $option = $select.find(':selected');
    let $item = $select.closest(itemSelector);
    let itemIndex = $item.data('index') ?? $item.index();
    let maxQuantity = $option.data('max');
    let $quantityInput = $item.find('[data-groups-qty-value]');
    let imageSrc = $option.data('img');
    let price = parseInt($option.data('price'));
    let comparePrice = parseInt($option.data('cpprice'));
    let $priceDisplay = $item.find('[data-groups-item-price]');

    $quantityInput.attr('max', maxQuantity);

    let $image = this.$form.find(`[data-groups-img="${itemIndex}"] img`);
    if ($image.attr('data-original') !== imageSrc) {
      $image
        .attr({ 'data-src': imageSrc, 'data-original': imageSrc })
        .removeClass('lazyloaded')
        .addClass('lazyload');
    }

    let totalItemPrice = price * $quantityInput.val();
    let totalComparePrice = comparePrice * $quantityInput.val();

    comparePrice =
      totalComparePrice > totalItemPrice ? totalComparePrice : totalItemPrice;

    $priceDisplay.html(
      comparePrice > totalItemPrice
        ? T4SProductStrings.price_template
            .replace(
              'INS',
              window.T4SThemeSP.Currency.formatMoney(totalItemPrice)
            )
            .replace(
              'DEL',
              window.T4SThemeSP.Currency.formatMoney(totalComparePrice)
            )
        : window.T4SThemeSP.Currency.formatMoney(totalItemPrice)
    );

    this.itemPrices[itemIndex] = totalItemPrice;
    this.itemComparePrices[itemIndex] = comparePrice;
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    let totalPrice = this.itemPrices.reduce((sum, price) => sum + price, 0);
    let totalComparePrice = this.itemComparePrices.reduce(
      (sum, price) => sum + price,
      0
    );

    this.$totalPriceDisplay.html(
      totalComparePrice > totalPrice
        ? T4SProductStrings.price_template
            .replace('INS', window.T4SThemeSP.Currency.formatMoney(totalPrice))
            .replace(
              'DEL',
              window.T4SThemeSP.Currency.formatMoney(totalComparePrice)
            )
        : window.T4SThemeSP.Currency.formatMoney(totalPrice)
    );

    $body.trigger('currency:update');
  }
};

window.T4SThemeSP.initGroupsProduct = () => {
  // Check if there are any elements with the attribute 'data-groups-pr-form' that are not yet enabled
  if (window.jQuery('[data-groups-pr-form]:not(.is--enabled)').length !== 0) {
    // Iterate over each element that is not enabled
    window
      .jQuery('[data-groups-pr-form]:not(.is--enabled)')
      .each(function (index) {
        // Add the 'is--enabled' class to mark it as enabled
        window.jQuery(this).addClass('is--enabled');
        // Create a new instance of the class 'x' for this element
        new GroupedProductManager(this);
      });
  }
};

window.jQuery(document).ready(() => {
  window.T4SThemeSP.ProductItem = new ProductItem();
  window.T4SThemeSP.Video = new VideoHandler();
  window.T4SThemeSP.Header = new T4SThemeSPHeader();
  window.T4SThemeSP.Hover();
  window.T4SThemeSP.Header.stickyInit();
  window.T4SThemeSP.MobileNav();
  window.T4SThemeSP.Cart.init();
  window.T4SThemeSP.agreeForm();
  window.T4SThemeSP.Login();
  window.T4SThemeSP.Compare.init();
  window.T4SThemeSP.Wishlist.init();
  window.T4SThemeSP.recentlyViewed();
  window.T4SThemeSP.productRecommendations();
  window.T4SThemeSP.ProductItem.init();
  window.T4SThemeSP.ProductItem.loadjsRevew();
  window.T4SThemeSP.Tooltip();
  window.T4SThemeSP.ProductItem.clickMoreSwatches();
  window.T4SThemeSP.ProductItem.swatchesClickHover();
  window.T4SThemeSP.ProductItem.resizeObserver();
  window.T4SThemeSP.ProductItem.initQuickVS();
  window.T4SThemeSP.RenderRefresh();
  window.T4SThemeSP.ProductAjax.init();
  window.T4SThemeSP._initBundlePrs();
  window.T4SThemeSP.T4sQuantityAdjust();
  window.T4SThemeSP.PhotoSwipe.gallery();
  window.T4SThemeSP.PhotoSwipe.images();
  window.T4SThemeSP.PhotoSwipe.image();
  window.T4SThemeSP.Video.initPoster();
  window.T4SThemeSP.initLoadMore();

  const hasAjaxContainer =
    window.jQuery('.section-main [data-ntajax-container]').length > 0 ||
    IsDesignMode;
  if (hasAjaxContainer) {
    $script(window.T4Sconfigs.script7, 'ts:facets');
  }

  window.T4SThemeSP.instagram();
  window.T4SThemeSP.sideBarInit();
  window.T4SThemeSP.LookBook();
  window.T4SThemeSP.initGroupsProduct();

  if (IsDesignMode) {
    window.T4SThemeSP.PopupPro();
  } else {
    setTimeout(() => {
      window.T4SThemeSP.PopupFetch();
    }, 686);
  }

  setTimeout(() => {
    window.T4SThemeSP.PlatFormMail();
    window.T4SThemeSP.goToID();
  }, 500);

  if (
    window.T4SThemeSP.isHover &&
    (window.jQuery || window.$)('[data-zoom-options]').length > 0
  ) {
    $script(window.T4Sconfigs.script5, 'ts:zoom');
  }

  document.addEventListener('theme:hover', () => {
    if ((window.jQuery || window.$)('[data-zoom-options]').length > 0) {
      $script(window.T4Sconfigs.script5, 'ts:zoom');
    }
  });

  window.T4SThemeSP.BackToTop();
  window.T4SThemeSP.Header.init();
  window.T4SThemeSP.currencyForm();

  if (window.T4Sconfigs.currency_type === '2') {
    $script(window.T4Sconfigs.script12a);
  }

  if (window.T4Sconfigs.script11 !== 'none') {
    $script(window.T4Sconfigs.script11, 'ts:customjs');
  }
});

window.$(window).resize(() => {
  window.T4SThemeSP.ProductItem.recalculateSwatches(true);
});
