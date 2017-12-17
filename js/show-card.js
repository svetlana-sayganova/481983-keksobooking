'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var popup;
  var popupClose;
  var currentTarget;

  /**
   * showPopups - Подсвечивает активный элемент 'Метка объявления на карте'
   * и показывает соответствущий ему элемент 'Карточка объявления на карте'.
   *
   * @param  {Event}        evt  Событие Event.
   * @param  {Array.<Ad>}   ads  Массив объектов Ad.
   * @param  {Array.<Node>} pins Массив элементов 'Метка объявления на карте'.
   */
  var showPopups = function (evt, ads, pins) {
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
    window.util.runOnEsc(evt, closePopup);
  };

  window.showCard = {
    showPopups: showPopups
  };
})();
