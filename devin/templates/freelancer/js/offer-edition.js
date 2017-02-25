(function() {
  var steps = {
    'analyse-des-outils': {
      'included': true,
      'price': 340,
      'priority': 10,
    },
    'conception-de-linterface': {
      'included': true,
      'price': 680,
      'priority': 10,
    },
  };
  var fees = 80;

  function computeStepsPrice() {
    var price = 0;

    $.each(steps, function(name, step) {
      if(step.included) {
        price += step.price;
      }
    });

    return price;
  }

  function updatePrices() {
    var stepsPrice = computeStepsPrice();
    var excludingTaxePrice = stepsPrice + fees;
    var vat = 0.2 * excludingTaxePrice;
    var totalPrice = excludingTaxePrice + vat;

    $('#steps-price').html(stepsPrice + ' &euro; H.T.');
    $('#excluding-taxe-price').html(excludingTaxePrice + ' &euro; H.T.');
    $('#vat').html(vat + ' &euro;');
    $('#total-price').html(totalPrice + ' &euro; T.T.C.');
  }

  $('.step-name').click(function() {
    var step = $(this).data('step');
    steps[step]['included'] = !steps[step]['included'];
    $(this).parent().toggleClass('excluded');
    updatePrices();
  });
})();
