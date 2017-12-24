'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var MIN_PRICES = ['0', '1000', '5000', '10000'];
  var ROOMS = ['1', '2', '3', '100'];
  var GUESTS = ['1', '2', '3', '0'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var ERROR_FIELD = '2px solid red';
  var DEFAULT_IMAGE = 'img/muffin.png';

  var TitleLength = {
    MIN: 30,
    MAX: 100
  };

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

  var avatarChooser = form.querySelector('#avatar');
  var photoChooser = form.querySelector('#images');
  var avatarPreview = form.querySelector('.notice__preview').querySelector('img');
  var photoPreview = form.querySelector('.form__photo-container');
  var photos = [];

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

    Array.from(guestField).forEach(function (option) {
      option.disabled = (currentValue === '0') ?
        (option.value !== '0') :
        (option.value > currentValue || option.value === '0');
    });
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
    window.synchronizeFields(checkinSelect, checkoutSelect, TIMES, TIMES, syncValues);
    window.synchronizeFields(typeSelect, priceInput, TYPES, MIN_PRICES, syncValueWithMin);
    window.synchronizeFields(roomsSelect, guestsSelect, ROOMS, GUESTS, syncGuestsWithRooms);
    // Заносит в поле с адресом значение по умолчанию
    setAddress(window.map.addressDefaultCoords.left, window.map.addressDefaultCoords.top);
    // Разрешает мультизагрузку файлов
    photoChooser.multiple = 'multiple';
  };

  /**
   * interactWithForm - Задает поведение формы при взаимодействии с ней
   * (реакция на события).
   *
   */
  var interactWithForm = function () {
    // Синхронизирует время заезда и время выезда
    checkinSelect.addEventListener('change', function () {
      window.synchronizeFields(checkinSelect, checkoutSelect, TIMES, TIMES, syncValues);
    });
    checkoutSelect.addEventListener('change', function () {
      window.synchronizeFields(checkoutSelect, checkinSelect, TIMES, TIMES, syncValues);
    });

    // Устанавливает минимальнную стоимость жилья в зависимости от типа
    typeSelect.addEventListener('change', function () {
      window.synchronizeFields(typeSelect, priceInput, TYPES, MIN_PRICES, syncValueWithMin);
    });

    // В зависимости от количства комнат блокирует недоступное для размещения
    // количество гостей
    roomsSelect.addEventListener('change', function () {
      window.synchronizeFields(roomsSelect, guestsSelect, ROOMS, GUESTS, syncGuestsWithRooms);
    });

    // Выделяет неверно заполненные поля красной рамкой
    form.addEventListener('invalid', function (evt) {
      evt.target.style.outline = ERROR_FIELD;
    }, true);

    // Выводит сообщение при неправильно заполненном заголовке
    // и выделяет неверно заполненные поля красной рамкой
    titleInput.addEventListener('input', function () {
      var inputError;
      if (!titleInput.validity.valid) {
        titleInput.style.outline = ERROR_FIELD;
      }
      if (titleInput.validity.tooShort || (titleInput.value.length < TitleLength.MIN && titleInput.value.length !== 0)) {
        inputError = 'Заголовок должен состоять минимум из ' + TitleLength.MIN + ' символов. Сейчас символов: ' + titleInput.value.length;
      } else if (titleInput.validity.tooLong) {
        inputError = 'Заголовок не должен превышать ' + TitleLength.MAX + ' символов';
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
        titleInput.style.outline = ERROR_FIELD;
        titleInput.setCustomValidity(inputError);
      }
    });

    // Выводит сообщение при неправильно заполненной цене
    // и выделяет неверно заполненные поля красной рамкой
    priceInput.addEventListener('input', function () {
      var inputError;
      if (!priceInput.validity.valid) {
        priceInput.style.outline = ERROR_FIELD;
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

    // Загружает аватар
    avatarChooser.addEventListener('change', function () {
      var file = avatarChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          avatarPreview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });

    // Загружает фотографии объявления
    photoChooser.addEventListener('change', function () {
      Array.from(photoChooser.files).forEach(function (file) {
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var photo = document.createElement('img');
            photo.style.height = '100px';
            photo.style.margin = '5px';
            photo.src = reader.result;
            photoPreview.appendChild(photo);
            photos.push(photo);
          });

          reader.readAsDataURL(file);
        }
      });
    });

    // Запускает функцию successHandler в случае успешной отправки данных на сервер,
    // иначе выводит сообщение об ошибке
    form.addEventListener('submit', function (evt) {
      var formData = new FormData(form);
      // Передает загруженные фотографии на сервер
      formData.append('avatar', avatarChooser.files[0]);
      Array.from(photoChooser.files).forEach(function (file) {
        formData.append('photos[]', file);
      });
      window.backend.save(formData, successHandler, window.popup.createError);
      evt.preventDefault();
    });

    // При нажатии на кнопку 'Очистить' сбрасывает значения формы на значения по умолчанию
    reset.addEventListener('click', function (evt) {
      evt.preventDefault();
      successHandler();
    });
  };

  /**
   * successHandler - выводит сообщение об успешной отправке формы
   * и сбрасывает значения формы на значения по умолчанию.
   *
   */
  var successHandler = function () {
    window.popup.createSuccess();
    form.reset();
    avatarPreview.src = DEFAULT_IMAGE;
    photos.forEach(function (photo) {
      photo.remove();
    });
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
