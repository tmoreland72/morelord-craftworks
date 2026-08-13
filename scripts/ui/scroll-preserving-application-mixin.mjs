/**
 * Preserve all scrollable regions in a Craftworks ApplicationV2 across
 * template rerenders.
 */
export function ScrollPreservingApplicationMixin(Base) {
  return class ScrollPreservingApplication extends Base {
    async render(options = {}) {
      const scrollState =
        captureScrollState(this.element);

      const result =
        await super.render(options);

      restoreScrollState(
        this.element,
        scrollState
      );

      return result;
    }
  };
}

function captureScrollState(root) {
  if (!root) return [];

  const elements =
    scrollableElements(root);

  const signatureCounts =
    new Map();

  return elements.map(element => {
    const signature =
      elementSignature(element);

    const ordinal =
      signatureCounts.get(signature)
      ?? 0;

    signatureCounts.set(
      signature,
      ordinal + 1
    );

    return {
      signature,
      ordinal,
      scrollTop:
        Number(element.scrollTop ?? 0),
      scrollLeft:
        Number(element.scrollLeft ?? 0)
    };
  });
}

function restoreScrollState(root, state) {
  if (
    !root
    || !Array.isArray(state)
    || !state.length
  ) {
    return;
  }

  // Restore after render hooks and browser focus/layout have settled.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!root?.isConnected) return;

      const groups =
        new Map();

      for (
        const element of
        scrollableElements(root)
      ) {
        const signature =
          elementSignature(element);

        if (!groups.has(signature)) {
          groups.set(signature, []);
        }

        groups.get(signature)
          .push(element);
      }

      for (const entry of state) {
        const element =
          groups.get(entry.signature)
            ?.[entry.ordinal]
          ?? null;

        if (!element) continue;

        element.scrollTop =
          entry.scrollTop;

        element.scrollLeft =
          entry.scrollLeft;
      }
    });
  });
}

function scrollableElements(root) {
  const candidates = [
    root,
    ...root.querySelectorAll("*")
  ];

  return candidates.filter(element => {
    if (
      typeof HTMLElement !== "undefined"
      && !(element instanceof HTMLElement)
    ) {
      return false;
    }

    const style =
      getComputedStyle(element);

    const overflowY =
      style.overflowY;

    const overflowX =
      style.overflowX;

    const vertical =
      (
        overflowY === "auto"
        || overflowY === "scroll"
      )
      && element.scrollHeight
        > element.clientHeight + 1;

    const horizontal =
      (
        overflowX === "auto"
        || overflowX === "scroll"
      )
      && element.scrollWidth
        > element.clientWidth + 1;

    return (
      vertical
      || horizontal
      || Number(element.scrollTop) !== 0
      || Number(element.scrollLeft) !== 0
    );
  });
}

function elementSignature(element) {
  const explicit =
    element.dataset?.scrollKey
    ?? null;

  if (explicit) {
    return `data:${explicit}`;
  }

  if (element.id) {
    return `id:${element.id}`;
  }

  const classes =
    [...element.classList]
      .sort()
      .join(".");

  return classes
    ? `${element.tagName}.${classes}`
    : element.tagName;
}
