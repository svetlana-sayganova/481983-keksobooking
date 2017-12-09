'use strict';

(function () {
  var minPrices = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };

  var form = document.querySelector('.notice__form');
  var titleInput = form.querySelector('#title');
  var checkinSelect = form.querySelector('#timein');
  var checkoutSelect = form.querySelector('#timeout');
  var typeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');

  /**
   * syncTimes - Синхронизирует время заезда и время выезда путем выбора опции
   * синхронизиуемого списка того же индекса, что и у основного списка.
   *
   * @param  {Node} times1 select -- основной список.
   * @param  {Node} times2 select -- синхронизируемый список.
   */
  var syncTimes = function (times1, times2) {
    times2.options[times1.selectedIndex].selected = true;
  };

  /**
   * syncTypeWithPrice - Устанавливает минимальнную стоимость жилья в зависимости от типа.
   *
   */
  var syncTypeWithPrice = function () {
    priceInput.min = minPrices[typeSelect.value];
  };

  /**
   * syncGuestsWithRooms - В зависимости от количства комнат блокирует недоступное для размещения
   * количество гостей.
   *
   */
  var syncGuestsWithRooms = function () {
    guestsSelect.value = (roomsSelect.value === '100') ? '0' : roomsSelect.value;
    var currentValue = guestsSelect.value;

    for (var i = 0; i < guestsSelect.options.length; i++) {
      guestsSelect.options[i].disabled = (currentValue === '0') ?
        (guestsSelect.options[i].value !== '0') :
        (guestsSelect.options[i].value > currentValue || guestsSelect.options[i].value === '0');
    }
  };

  // Синхронизирует необходимые значия до взаимодействия с формой
  syncTimes(checkinSelect, checkoutSelect);
  syncTypeWithPrice();
  syncGuestsWithRooms();

  // Синхронизирует время заезда и время выезда
  checkinSelect.addEventListener('change', function () {
    syncTimes(checkinSelect, checkoutSelect);
  });
  checkoutSelect.addEventListener('change', function () {
    syncTimes(checkoutSelect, checkinSelect);
  });

  // Устанавливает минимальнную стоимость жилья в зависимости от типа
  typeSelect.addEventListener('change', syncTypeWithPrice);

  // В зависимости от количства комнат блокирует недоступное для размещения
  // количество гостей
  roomsSelect.addEventListener('change', syncGuestsWithRooms);

  // Выделяет неверно заполненные поля красной рамкой
  form.addEventListener('invalid', function (evt) {
    evt.target.style.outline = '2px solid red';
  }, true);

  // Выводит сообщение при неправильно заполненном заголовке
  // и выделяет неверно заполненные поля красной рамкой
  titleInput.addEventListener('input', function () {
    var inputError;
    if (!titleInput.validity.valid) {
      titleInput.style.outline = '2px solid red';
    }
    if (titleInput.validity.tooShort) {
      inputError = 'Заголовок должен состоять минимум из 30 символов. Сейчас символов: ' + titleInput.value.length;
    } else if (titleInput.validity.tooLong) {
      inputError = 'Заголовок не должен превышать 100 символов';
    } else if (titleInput.validity.valueMissing) {
      inputError = 'Поле обязательно для заполнения';
    } else {
      inputError = '';
      titleInput.style.outline = '';
    }
    titleInput.setCustomValidity(inputError);
  });

  // Выводит сообщение при неправильно заполненной цене
  // и выделяет неверно заполненные поля красной рамкой
  priceInput.addEventListener('input', function () {
    var inputError;
    if (!priceInput.validity.valid) {
      priceInput.style.outline = '2px solid red';
    }
    if (priceInput.validity.rangeUnderflow) {
      inputError = 'Цена для данного типа жилья не может быть менее ' + minPrices[typeSelect.value] + ' p.';
    } else if (priceInput.validity.rangeOverflow) {
      inputError = 'Цена не может быть более 1000000 р.';
    } else if (priceInput.validity.valueMissing) {
      inputError = 'Поле обязательно для заполнения';
    } else {
      inputError = '';
      priceInput.style.outline = '';
    }
    priceInput.setCustomValidity(inputError);
  });
})();
