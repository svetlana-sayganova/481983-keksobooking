'use strict';

(function () {
  var map = document.querySelector('.map');

  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

  var COORD_Y = {
    MIN: 100,
    MAX: 500
  };

  var mainPinSize = {
    width: 62,
    height: 62,
    arrow: 22
  };

  var mainPinLeft = getComputedStyle(mainPin).left;
  var mainPinTop = getComputedStyle(mainPin).top;

  var addressDefaultCoords = {
    left: parseInt(mainPinLeft, 10),
    top: parseInt(mainPinTop, 10) + mainPinSize.height / 2 + mainPinSize.arrow
  };

  var form = document.querySelector('.notice__form');
  var fieldsets = form.querySelectorAll('fieldset');

  /**
   * showMap - создает и показывает элементы 'Метка объявления на карте'
   * и снимает блокировку с формы.
   *
   * @param  {Array} data Загруженные с сервера данные (массив объявлений).
   */
  var showMap = function (data) {
    // Создает массив объявлений (пока отображаю все)
    // в дальшенйшем здесь сформирую массив заданной длины согласо ТЗ
    // с использованием функции getRandomArray: var ads = window.util.getArray(data, 5);
    var ads = data;

    // Создает массив элементов 'Метка объявления на карте'
    var pins = window.pin.createPins(ads);

    // Добавляет DOM-элементы 'Метка объявления на карте' на страницу
    renderPins(pins);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    // Делает все поля формы доступными
    changeAccessibility(fieldsets);

    // Назначает обработчик showPopups на элемент 'Карта',
    // в котором расположены элементы 'Метка объявления на карте'
    mapPins.addEventListener('click', function (evt) {
      window.showCard.showPopups(evt, ads, pins);
    });

    // Назначает обработчик onMainPinMouseDown на элемент 'Главный пин'
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
  };

  /**
   * onMainPinEnterPress - запускает функцию showMap при нажатии клавиши Enter
   * на элементе 'Главный пин'.
   *
   * @param  {Event} evt Событие Event.
   */
  var onMainPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, onLoad);
  };

  /**
   * changeAccessibility - Меняет доступность элементов формы на противоположное значение.
   *
   * @param  {NodeList} list DOM-коллекция.
   */
  var changeAccessibility = function (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].disabled = !list[i].disabled;
    }
  };

  /**
   * onMainPinMouseDown - Перемещает элемент по странице.
   *
   * @param  {Event} evt Событие Event.
   */
  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    // Запоминает координаты стартовой точки, с которой началось перемещение
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Добавляет обработчик события перемещения мыши
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // Рассчитывает смещение относительно стартовой точки
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // Обновляет координаты стартовой точки
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // Рассчитывает положение перемещаемого элемента
      var currentCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      // Перемещает элемент при условии вхождения в заданную область перемещения
      // (намеренная коррекция по оси ординат для избежания размещения элемента над уровнем горизнота)
      if (currentCoords.x >= mainPinSize.width / 2 &&
        currentCoords.x <= map.clientWidth - mainPinSize.width / 2 &&
        currentCoords.y - mainPinSize.height / 2 >= COORD_Y.MIN &&
        currentCoords.y - mainPinSize.height / 2 <= COORD_Y.MAX) {

        mainPin.style.left = currentCoords.x + 'px';
        mainPin.style.top = currentCoords.y + 'px';

        // Заносит в поле с адресом текущее положение элемента 'Главный пин'
        // с поправкой на размер элемента
        window.form.setAddress(currentCoords.x, currentCoords.y + mainPinSize.height / 2 + mainPinSize.arrow);
      }
    };

    // При отпускании кнопки мыши прекращает слушать события движения мыши
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // Добавляет обработчики события передвижения мыши и отпускания кнопки мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /**
   * successHandler - Запускает функцию showMap в случае успешной загрузки данных с сервера,
   * иначе выводит сообщение об ошибке.
   *
   */
  var onLoad = function () {
    window.backend.load(showMap, window.popup.createErrorPopup);

    // Удаляет обработчики с элемента 'Главный пин'
    mainPin.removeEventListener('mouseup', onLoad);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  /**
   * renderPins - Добавляет DOM-элементы 'Метка объявления на карте' в блок '.map__pins'.
   *
   * @param  {Array} pins Массив DOM-элементов 'Метка объявления на карте'.
   */
  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    // Размещает DOM-элементы 'Метка объявления на карте' из массива во фрагменте 'fragment'
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(pins[i]);
    }

    // Добавляет DOM-элементы 'Метка объявления на карте' в блок '.map__pins'
    mapPins.appendChild(fragment);
  };

  /**
   * setMainPinCoords - Задает положение по умолчанию элементу 'Главный пин'.
   *
   */
  var setMainPinCoords = function () {
    mainPin.style.left = mainPinLeft;
    mainPin.style.top = mainPinTop;
  };

  // Делает все поля формы недоступными в момент открытия страницы
  changeAccessibility(fieldsets);

  // Добавляет обработчики на элемент 'Главный пин'
  mainPin.addEventListener('mouseup', onLoad);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  window.map = {
    addressDefaultCoords: addressDefaultCoords,
    setMainPinCoords: setMainPinCoords
  };
})();
