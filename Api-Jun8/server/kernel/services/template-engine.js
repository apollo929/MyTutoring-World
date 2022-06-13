const SwigEngine = require('swig').Swig;
const _ = require('lodash');

module.exports = {
  getSwigEngine() {
    const swig = new SwigEngine({
      cache: 'memory'
    });

    swig.setFilter('money', (input) => {
      if (!input || !_.isNumber(input)) {
        return input;
      }

      return input.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    });

    swig.setFilter('number', (input) => {
      if (!input || !_.isNumber(input)) {
        return input;
      }

      return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    return swig;
  }
};
