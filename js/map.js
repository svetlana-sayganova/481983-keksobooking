'use strict';

(function () {
  var PINS_AMOUNT_MAX = 5;

  var coordY = {
    MIN: 100,
    MAX: 500
  };

  var MainPinSize = {
    WIDTH: 62,
    HEIGHT: 62,
    ARROW: 18
  };

  var map = document.querySelector('.map');
  var pinsContainer = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');
  var fieldsets = form.querySelectorAll('fieldset');

  var offsetY = MainPinSize.HEIGHT / 2 + MainPinSize.ARROW;
  var mainPinLeft = getComputedStyle(mainPin).left;
  var mainPinTop = getComputedStyle(mainPin).top;

  var addressDefaultCoords = {
    left: parseInt(mainPinLeft, 10),
    top: parseInt(mainPinTop, 10) + offsetY
  };

  var ads = [];
  var pins = [];

  /**
  * Объявление, содержит информацию об авторе, координаты расположения
  * и описательную часть.
  * @typedef Ad
  * @type {Object}
  * @property {Object} author - Автор объявления.
  * @property {Object} offer - Описание объявления.
  * @property {Object} location - Координты расположения на карте.
  */

  /**
   * onMainPinMouseUp - При клике на элементе 'Главный пин' в случае успешной загрузки данных
   * с сервера запускает функцию onLoad, иначе выводит сообщение об ошибке.
   *
   */
  var onMainPinMouseUp = function () {
    window.backend.load(onLoad, window.popup.createError);
  };

  /**
   * onMainPinEnterPress - При нажатеии клавиши Enter на элементе 'Главный пин'
   * в случае успешной загрузки данных с сервера запускает функцию onLoad,
   * иначе выводит сообщение об ошибке.
   *
   * @param  {Event} evt Событие Event.
   */
  var onMainPinEnterPress = function (evt) {
    window.util.runOnEnter(evt, onMainPinMouseUp);
  };

  /**
   * onLoad - создает и показывает элементы 'Метка объявления на карте'
   * и снимает блокировку с формы.
   *
   * @param  {Array.<Ad>} data Загруженные с сервера данные (массив объявлений).
   */
  var onLoad = function (data) {
    // Копирует полученные данные в массив объявлений
    ads = data.slice();

    // Создает массив элементов 'Метка объявления' на основе массива объявлений.
    // Объявления выбираются случайным образом.
    pins = window.pin.create(window.util.mixArray(ads), PINS_AMOUNT_MAX);

    // Добавляет DOM-элементы 'Метка объявления' на страницу
    renderPins(pins);

    // Убирает 'затемнение' со страницы
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    // Делает все поля формы доступными
    changeAccessibility(fieldsets);

    // Располагает элемент 'Главный пин' над элементами 'Метка объявления'
    mainPin.style.zIndex = '50';

    // Удаляет обработчики с элемента 'Главный пин'
    mainPin.removeEventListener('mouseup', onMainPinMouseUp);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  /**
   * updateMap - Перерисовывает элементы 'Метка объявления' на основе
   * отфильтрованных объявлений.
   *
   */
  var updateMap = function () {
    // Закрывает открытый элемнет 'Карточка объявления'
    window.card.close();

    // 'Перемешивает' массив объявлений случайным обазом, чтобы при выборе опции 'любой'
    // отображались случайные элементы
    ads = window.util.mixArray(ads);

    // Фильтрует объявления и создает массив отфильтрованных объявлений
    var filteredAds = window.filterAds(ads);

    // Удаляет существующие элементы 'Метка объявления'
    pins.forEach(function (pin) {
      pin.remove();
    });

    // Создает массив элементов 'Метка объявления' на основе массива отфильтрованных объявлений
    pins = window.pin.create(filteredAds, PINS_AMOUNT_MAX);

    // Добавляет DOM-элементы 'Метка объявления' на страницу
    renderPins(pins);
  };

  /**
   * changeAccessibility - Меняет доступность элементов формы на противоположное значение.
   *
   * @param  {NodeList} list DOM-коллекция.
   */
  var changeAccessibility = function (list) {
    Array.from(list).forEach(function (listElement) {
      listElement.disabled = !listElement.disabled;
    });
  };

  /**
   * onMainPinMouseDown - Перемещает элемент 'Главный пин' по странице.
   *
   * @param  {Event} evt Событие Event.
   */
  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    // Закрывает открытый элемнет 'Карточка объявления' (если есть)
    window.card.close();

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
      if (currentCoords.x >= MainPinSize.WIDTH / 2 &&
        currentCoords.x <= map.clientWidth - MainPinSize.WIDTH / 2 &&
        currentCoords.y + offsetY >= coordY.MIN &&
        currentCoords.y + offsetY <= coordY.MAX) {

        mainPin.style.left = currentCoords.x + 'px';
        mainPin.style.top = currentCoords.y + 'px';

        // Заносит в поле с адресом текущее положение элемента 'Главный пин'
        // с поправкой на размер элемента
        window.form.setAddress(currentCoords.x, currentCoords.y + offsetY);
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
   * renderPins - Добавляет DOM-элементы 'Метка объявления' в блок '.map__pins'.
   *
   * @param  {Array} mapPins Массив DOM-элементов 'Метка объявления'.
   */
  var renderPins = function (mapPins) {
    var fragment = document.createDocumentFragment();

    // Размещает DOM-элементы 'Метка объявления' из массива mapPins во фрагменте 'fragment'
    mapPins.forEach(function (pin) {
      fragment.appendChild(pin);
    });

    // Добавляет DOM-элементы 'Метка объявления' в блок '.map__pins'
    pinsContainer.appendChild(fragment);
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
  mainPin.addEventListener('mouseup', onMainPinMouseUp);
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  window.map = {
    addressDefaultCoords: addressDefaultCoords,
    setMainPinCoords: setMainPinCoords,
    update: updateMap
  };
})();
