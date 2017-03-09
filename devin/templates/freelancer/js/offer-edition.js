$(document).ready(function() {
  var steps = {
    'analyse-des-outils': {
      'included': true,
      'price': 340,
      'priority': 20,
    },
    'conception-de-linterface': {
      'included': true,
      'price': 680,
      'priority': 19,
    },
  };
  var fees = 80;
  var maxPrice = null;

  function computeStepsPrice() {
    var price = 0;

    $.each(steps, function(name, step) {
      if(step.included) {
        price += step.price;
      }
    });

    return price;
  }

  function changeStepInclusion(cellStep, included) {
    var step = cellStep.data('step');
    steps[step]['included'] = included;
    if(included) {
      cellStep.parent().removeClass('excluded');
    } else {
      cellStep.parent().addClass('excluded');
    }
    updatePrices();
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

  function changeStepPriority(step, priority) {
    steps[step].priority = priority;
    updateMaxPrice(maxPrice);
  }

  function includeAllSteps() {
    $.each(steps, function(name, step) {
      changeStepInclusion(getStepCell(name), true);
    });
  }

  function getStepCell(step) {
    return $('#offer-table td[data-step="' + step + '"]');
  }

  function stepsToArray() {
    var array = [];

    $.each(steps, function(name, step) {
      step.name = name;
      array.push(step);
    });

    return array;
  }

  function getStepsOrderedByPrio() {
    var array = stepsToArray();
    array.sort(function(a, b) {
        return b.priority - a.priority; // Sort in descending order
    });
    return array;
  }

  function updateMaxPrice(price) {
    maxPrice = price;
    var remainingPrice = maxPrice - fees;

    if(isNaN(maxPrice)) {
      includeAllSteps();
      return;
    }

    var step, orderedSteps = getStepsOrderedByPrio();
    for(step of orderedSteps) {
      remainingPrice -= step.price;
      changeStepInclusion(getStepCell(step.name), remainingPrice >= 0);
    }
  }

  $('#offer-table .step-name').click(function() {
    changeStepInclusion($(this), !steps[$(this).data('step')]['included']);
  });

  $('#offer-table select').change(function() {
    changeStepPriority($(this).data('step'), $(this).children('option:selected').text());
  });

  $('#max-price-input').change(function() {
    updateMaxPrice(parseFloat($(this).val()));
  });

  $('#max-price-input').focusout(function() {
    updateMaxPrice(parseFloat($(this).val()));
  });

  // Init forms
  $('#max-price-input').val('');
  $.each(steps, function(name, step) {
    $('#offer-table select[data-step="' + name + '"]').val(step.priority).attr('selected', 'selected');
  });

  // Tooltips
  $('[data-toggle="tooltip"]').tooltip('show');
  $('.tooltip').hover(function() {
    $(this).prev().tooltip('hide');
  });
});
