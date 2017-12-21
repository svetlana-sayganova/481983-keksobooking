'use strict';

(function () {
  var PIN_SIZE = {
    HEIGHT: 40,
    ARROW: 18
  };

  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  /**
   * renderPin - Возвращает DOM-элемент 'Метка объявления',
   * созданный на основе шаблона с заданными свойствами из объекта Ad.
   *
   * @param  {Ad} ad            Объект Ad.
   * @return {Node}             DOM-элемент 'Метка объявления' с заданными свойствами.
   */
  var renderPin = function (ad) {
    var mapPinElement = mapPinTemplate.cloneNode(true);

    mapPinElement.querySelector('img').src = ad.author.avatar;
    mapPinElement.style.left = ad.location.x + 'px';
    mapPinElement.style.top = ad.location.y - PIN_SIZE.HEIGHT / 2 - PIN_SIZE.ARROW + 'px';

    // Вызывает функцию showPopup для показа соответсвующего элемента
    // 'Карточка объявления'
    mapPinElement.addEventListener('click', function (evt) {
      window.showCard.showPopup(evt, ad);
    });

    return mapPinElement;
  };

  /**
   * createPins - Создает массив элементов 'Метка объявления'. Количество элементов
   * не превышает значения pinsAmountMax.
   *
   * @param  {Array.<Ad>} ads Массив объектов Ad.
   * @param  {number} pinsAmountMax Максимальное количество создаваемых элементов.
   * @return {Array.<Node>}   Массив элементов 'Метка объявления'.
   */
  var createPins = function (ads, pinsAmountMax) {
    var pins = [];
    var pinsAmount = (ads.length < pinsAmountMax) ? ads.length : pinsAmountMax;
    for (var i = 0; i < pinsAmount; i++) {
      pins.push(renderPin(ads[i]));
    }

    return pins;
  };

  window.pin = {
    createPins: createPins
  };
})();
