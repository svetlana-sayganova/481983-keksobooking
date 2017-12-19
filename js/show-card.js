'use strict';

(function () {
  var map = document.querySelector('.map');

  var popup;
  var popupClose;
  var currentTarget;

  /**
   * showPopups - Подсвечивает активный элемент 'Метка объявления'
   * и показывает соответствущий ему элемент 'Карточка объявления'.
   *
   * @param  {Event} evt  Событие Event.
   * @param  {Ad}    ad   Объявление Ad.
   */
  var showPopup = function (evt, ad) {
    // переменной target присваивает ближайший родительский элемент 'Метка объявления'
    // исходнго элемента, на котором произошло событие
    var target = evt.target.closest('.map__pin');

    if (target) {
      // удаляет подсветку с предыдущего активного элемента 'Метка объявления'
      // и соответствующий ему элемент 'Карточка объявления'
      if (currentTarget) {
        currentTarget.classList.remove('map__pin--active');
        popup.remove();
      }
      // добавляет подсветку элементу 'Метка объявления'
      target.classList.add('map__pin--active');
      // переменной currentTarget присваивает элемент 'Метка объявления',
      // находящийся в активном состоянии
      currentTarget = target;

      // по объявлению создает соответствующий элемент 'Карточка объявления'
      // и размещает на карте
      popup = window.card.renderCard(ad);
      map.appendChild(popup);

      // ищет кнопку закрытия элеманта 'Карточка объявления'
      // и назначает ему обработчик closePopup (закрытие элемента по клику)
      popupClose = map.querySelector('.popup__close');
      popupClose.addEventListener('click', closePopup);

      // назначает обработчик onPopupEscPress (закрытие элемента по нажатию на клавишу Esc)
      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  /**
   * closePopup - Снимает подсветку с активного элемента 'Метка объявления'
   * и скрывает соответствущий ему элемент 'Карточка объявления'.
   *
   */
  var closePopup = function () {
    if (popup) {
      currentTarget.classList.remove('map__pin--active');
      popup.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  /**
   * onPopupEscPress - Закрывает элемент 'Карточка объявления'
   * при нажатии клавиши Esc.
   *
   * @param  {Event} evt Событие Event.
   */
  var onPopupEscPress = function (evt) {
    window.util.runOnEsc(evt, closePopup);
  };

  window.showCard = {
    showPopup: showPopup,
    closePopup: closePopup
  };
})();
