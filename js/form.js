'use strict';

(function () {

  var types = ['bungalo', 'flat', 'house', 'palace'];
  var minPrices = ['0', '1000', '5000', '10000'];
  var rooms = ['1', '2', '3', '100'];
  var guests = ['1', '2', '3', '0'];
  var times = ['12:00', '13:00', '14:00'];

  var form = document.querySelector('.notice__form');
  var titleInput = form.querySelector('#title');
  var checkinSelect = form.querySelector('#timein');
  var checkoutSelect = form.querySelector('#timeout');
  var typeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');
  var address = form.querySelector('#address');
  var reset = form.querySelector('.form__reset');

  /**
   * syncValues - Устанавливает элементу element переданное значение value.
   *
   * @param  {Node}          element Элемент.
   * @param  {number|string} value   Значение.
   */
  var syncValues = function (element, value) {
    element.value = value;
  };

  /**
   * syncValueWithMin - Устанавливает минимиальное значение элементу element
   * равным переданному значению value.
   *
   * @param  {Node}   element Элемент.
   * @param  {number} value   Значение.
   */
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  /**
   * syncGuestsWithRooms - Устанавливает элементу guestField переданное значение guestValue
   * и в зависимости от него блокирует недоступные для выбора значения.
   *
   * @param  {Node}   guestField Элемент.
   * @param  {number} guestValue Значение.
   */
  var syncGuestsWithRooms = function (guestField, guestValue) {
    guestField.value = guestValue;
    var currentValue = guestField.value;

    for (var i = 0; i < guestField.options.length; i++) {
      guestField.options[i].disabled = (currentValue === '0') ?
        (guestField.options[i].value !== '0') :
        (guestField.options[i].value > currentValue || guestField.options[i].value === '0');
    }
  };

  /**
   * setAddress - В поле 'Адрес' устанавливает заданные координаты.
   *
   * @param  {number} x Координата на оси абсцисс.
   * @param  {number} y Координата на оси ординат.
   */
  var setAddress = function (x, y) {
    address.value = 'x: ' + x + ', y: ' + y;
  };

  /**
   * activateForm - Синхронизирует необходимые значения до взаимодействия с формой
   * и заносит в поле с адресом значение по умолчанию.
   *
   */
  var activateForm = function () {
    // Синхронизирует необходимые значения до взаимодействия с формой
    window.synchronizeFields(checkinSelect, checkoutSelect, times, times, syncValues);
    window.synchronizeFields(typeSelect, priceInput, types, minPrices, syncValueWithMin);
    window.synchronizeFields(roomsSelect, guestsSelect, rooms, guests, syncGuestsWithRooms);
    // Заносит в поле с адресом значение по умолчанию
    setAddress(window.map.addressDefaultCoords.left, window.map.addressDefaultCoords.top);
  };

  /**
   * interactWithForm - Задает поведение формы при взаимодействии с ней
   * (реакция на события).
   *
   */
  var interactWithForm = function () {
    // Синхронизирует время заезда и время выезда
    checkinSelect.addEventListener('change', function () {
      window.synchronizeFields(checkinSelect, checkoutSelect, times, times, syncValues);
    });
    checkoutSelect.addEventListener('change', function () {
      window.synchronizeFields(checkoutSelect, checkinSelect, times, times, syncValues);
    });

    // Устанавливает минимальнную стоимость жилья в зависимости от типа
    typeSelect.addEventListener('change', function () {
      window.synchronizeFields(typeSelect, priceInput, types, minPrices, syncValueWithMin);
    });

    // В зависимости от количства комнат блокирует недоступное для размещения
    // количество гостей
    roomsSelect.addEventListener('change', function () {
      window.synchronizeFields(roomsSelect, guestsSelect, rooms, guests, syncGuestsWithRooms);
    });

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
      if (titleInput.validity.tooShort || (titleInput.value.length < 30 && titleInput.value.length !== 0)) {
        inputError = 'Заголовок должен состоять минимум из 30 символов. Сейчас символов: ' + titleInput.value.length;
      } else if (titleInput.validity.tooLong) {
        inputError = 'Заголовок не должен превышать 100 символов';
      } else {
        inputError = '';
        titleInput.style.outline = '';
      }
      titleInput.setCustomValidity(inputError);
    });

    // Выводит сообщение при незаполнении поля заголовка
    titleInput.addEventListener('invalid', function () {
      if (titleInput.validity.valueMissing) {
        var inputError = 'Поле обязательно для заполнения';
        titleInput.style.outline = '2px solid red';
        titleInput.setCustomValidity(inputError);
      }
    });

    // Выводит сообщение при неправильно заполненной цене
    // и выделяет неверно заполненные поля красной рамкой
    priceInput.addEventListener('input', function () {
      var inputError;
      if (!priceInput.validity.valid) {
        priceInput.style.outline = '2px solid red';
      }
      if (priceInput.validity.rangeUnderflow) {
        inputError = 'Цена для данного типа жилья не может быть менее ' + priceInput.min + ' p.';
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

    // Запускает функцию successHandler в случае успешной отправки данных на сервер,
    // иначе выводит сообщение об ошибке
    form.addEventListener('submit', function (evt) {
      window.backend.save(new FormData(form), successHandler, window.popup.createErrorPopup);
      evt.preventDefault();
    });

    // При нажатии на кнопку 'Очистить' сбрасывает значения формы на значения по умолчанию
    reset.addEventListener('click', function (evt) {
      evt.preventDefault();
      form.reset();
      activateForm();
      // Устанавливает элемент 'Главный пин' на начальную позицию
      window.map.setMainPinCoords();
    });
  };

  /**
   * successHandler - выводит сообщение об успешной отправке формы
   * и сбрасывает значения формы на значения по умолчанию.
   *
   */
  var successHandler = function () {
    window.popup.createSuccessPopup();
    form.reset();
    activateForm();
    // Устанавливает элемент 'Главный пин' на начальную позицию
    window.map.setMainPinCoords();
  };

  activateForm();
  interactWithForm();

  window.form = {
    setAddress: setAddress
  };
})();
