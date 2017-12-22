'use strict';

(function () {
  var PinSize = {
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
    var pin = mapPinTemplate.cloneNode(true);

    pin.querySelector('img').src = ad.author.avatar;
    pin.style.left = ad.location.x + 'px';
    pin.style.top = ad.location.y - PinSize.HEIGHT / 2 - PinSize.ARROW + 'px';

    // Вызывает функцию showPopup для показа соответсвующего элемента
    // 'Карточка объявления'
    pin.addEventListener('click', function (evt) {
      window.card.show(evt, ad);
    });

    return pin;
  };

  /**
   * createPins - Создает массив элементов 'Метка объявления'. Количество элементов
   * не превышает значения pinsAmountMax.
   *
   * @param  {Array.<Ad>} ads           Массив объектов Ad.
   * @param  {number}     pinsAmountMax Максимальное количество создаваемых элементов.
   * @return {Array.<Node>}             Массив элементов 'Метка объявления'.
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
    create: createPins
  };
})();
