import packages from '../packages';

const AVAILABLE_INTERACTIONS = ['click', 'touchstart', 'touchmove', 'touchend', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave'];

export class ControllerParser {
  constructor (packages) {
    this.packages = packages;
    this.createIntersectionObserver();
  }

  parse (node) {
    const selector = '.controller[data-controller]';
    node = node || document.documentElement;
    let nodes = Array.prototype.slice.call(node.querySelectorAll(selector));
    if (this.matches(node, selector)) {
      nodes.push(node);
    }
    nodes = nodes.filter(parseFilter.bind(this));
    return this.render(selector, nodes);
  }

  registerIntersect (node) {
    var selector = '.controller[data-controller]';
    node = node || document.documentElement;
    var nodes = Array.prototype.slice.call(node.querySelectorAll(selector));
    if (this.matches(node, selector)) {
      nodes.push(node);
    }
  }

  render (selector, nodes) {
    // reverse the initializing order to initialize inner controller before outer controller
    Array.prototype.reverse.call(nodes);
    return new Promise((resolve, reject) => {
      nodes.forEach((node) => {
        try {
          this.initController(selector, node);
        } catch (e) {
          reject(e);
        }
      });
      resolve(true);
    });
  }

  initController (selector, node) {
    if (node.init) {
      return;
    }

    node.init = true;
    let targetNode = null;
    const targetSelector = node.dataset.target;

    if (targetSelector) {
      targetNode = this.initTargetController(targetSelector, selector);
    }
    const data = this.getController(node.getAttribute('data-controller'));

    if (data && data.controller) {
      if (data.async && typeof data.controller === 'function') {
        data.controller = data.controller().then(module => module.default);
      }
      this.addController(data.controller, node, targetNode);
    }
  }

  initTargetController (targetSelector, selector) {
    const targetNode = document.querySelector(targetSelector);
    if (this.matches(targetNode, selector)) {
      this.initController(selector, targetNode);
    }
    return targetNode;
  }

  getController (name) {
    return this.packages.find(function (controller) {
      return controller.name === name;
    });
  }

  addController (controller, node, targetNode) {
    return Promise.resolve(controller)
      .then(function (Controller) {
        new Controller({
          el: node,
          target: targetNode
        });
      });
  }

  matches (el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  createIntersectionObserver () {
    var options = {
      // root: document.body,
      rootMargin: '0px',
      threshold: 1.0
    };

    var callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.observer.unobserve(entry.target);
          controllerParser.parse(entry.target);
        }
      });
    };

    this.observer = new IntersectionObserver(callback, options);
  }
}

// eslint-disable-next-line complexity
function parseFilter (node) {
  if ('controllerAsync' in node.dataset && !node.controllerAsyncInit) {
    let asyncType = node.dataset.controllerAsync.toLowerCase();
    node.controllerAsyncInit = true;
    const matches = asyncType.match(/^interaction:(.*)$/);
    let interaction;

    if (matches) {
      interaction = matches[1];
      if (AVAILABLE_INTERACTIONS.indexOf(interaction) !== -1) {
        asyncType = 'interaction';
      }
    }

    switch (asyncType) {
      case 'interaction':
        node.addEventListener(interaction, function (params) {
          controllerParser.parse(node);
        });
        break;

      case 'idle':
        requestIdleCallback(function () {
          controllerParser.parse(node);
        });
        break;

      case 'visible':
        this.observer.observe(node);
        break;

      default:
        controllerParser.parse(node);
        break;
    }
  } else {
    return node;
  }
}

const controllerParser = new ControllerParser(packages);
export default controllerParser;
