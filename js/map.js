'use strict';

(function () {
  var map = document.querySelector('.map');

  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

  var fragment = document.createDocumentFragment();

  var form = document.querySelector('.notice__form');
  var fieldsets = form.querySelectorAll('fieldset');

  var ads;
  var pins;
  var popup;
  var popupClose;
  var currentTarget;

  /**
   * showMap - создает и показывает элементы 'Метка объявления на карте'
   * и снимает блокировку с формы
   *
   */
  var showMap = function () {
    // Размещает DOM-элементы 'Метка объявления на карте' из массива во фрагменте 'fragment'
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(pins[i]);
    }

    // Добавляет DOM-элементы 'Метка объявления на карте' в блок '.map__pins'
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    // делает все поля формы доступными
    changeAccessibility(fieldsets);

    // назначает обработчик showPopups на элемент 'Карта',
    // в котором расположены элементы 'Метка объявления на карте'
    mapPins.addEventListener('click', showPopups);

    // удадаляет обработчики с элемента 'Главный пин'
    mainPin.removeEventListener('mouseup', showMap);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  /**
   * showPopups - Подсвечивает активный элемент 'Метка объявления на карте'
   * и показвает соответсвущий ему элемент 'Карточка объявления на карте'.
   *
   * @param  {Event} evt Событие Event.
   */
  var showPopups = function (evt) {
    // переменной target присваивает ближайший родительский элемент 'Метка объявления на карте'
    // исходнго элемента, на котором произошло событие
    var target = evt.target.closest('.map__pin');

    if (target && target !== mainPin) {
      // удаляет подсветку с предыдущего активного элемента 'Метка объявления на карте'
      // и соответствующий ему элемент 'Карточка объявления на карте'
      if (currentTarget) {
        currentTarget.classList.remove('map__pin--active');
        popup.remove();
      }
      // добавляет подсветку элементу 'Метка объявления на карте'
      target.classList.add('map__pin--active');
      // переменной currentTarget присваивает элемент 'Метка объявления на карте',
      // находящийся в активном состоянии
      currentTarget = target;

      // по индексу активного элемента в массиве элементов 'Метка объявления на карте'
      // создает соответствующий элемент 'Карточка объявления на карте' и размещает на карте
      popup = window.card.renderCard(ads[pins.indexOf(currentTarget)]);
      map.appendChild(popup);

      // ищет кнопку закрытия элеманта 'Карточка объявления на карте'
      // и назначает ему обработчик closePopup (закрытие элемента по клику)
      popupClose = map.querySelector('.popup__close');
      popupClose.addEventListener('click', closePopup);

      // назначает обработчик onPopupEscPress (закрытие элемента по нажатию на клавишу Esc)
      document.addEventListener('keydown', onPopupEscPress);
    }
    // если клик произошел по элементу 'Главный пин', то закрывает открытый попап
    if (popup && target === mainPin) {
      closePopup();
    }
  };

  /**
   * closePopup - Снимает подсветку с активного элемента 'Метка объявления на карте'
   * и скрывает соответствущий ему элемент 'Карточка объявления на карте'.
   *
   */
  var closePopup = function () {
    currentTarget.classList.remove('map__pin--active');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  /**
   * onPopupEscPress - Закрывает элемент 'Карточка объявления на карте'
   * при нажатии клавиши Esc.
   *
   * @param  {Event} evt Событие Event.
   */
  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  /**
   * onMainPinEnterPress - запускает функцию showMap при нажатии клавиши Enter
   * на элементе 'Главный пин'
   *
   * @param  {Event} evt Событие Event.
   */
  var onMainPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, showMap);
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

  // Создает объявления
  ads = window.data.createAds();

  // Создает массив элементов 'Метка объявления на карте'
  pins = window.pin.createPins(ads);

  // Делает все поля формы недоступными в момент открытия страницы
  changeAccessibility(fieldsets);

  // Добавляет обработчики на элемент 'Главный пин'
  mainPin.addEventListener('mouseup', showMap);
  mainPin.addEventListener('keydown', onMainPinEnterPress);
})();
