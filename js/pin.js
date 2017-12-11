'use strict';

(function () {
  var PIN_SIZE = {
    X: 40,
    Y: 40
  };

  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  /**
   * renderPin - Возвращает DOM-элемент 'Метка объявления на карте',
   * созданный на основе шаблона с заданными свойствами из объекта Ad.
   *
   * @param  {Ad} ad            Объект Ad.
   * @return {Node}             DOM-элемент 'Метка объявления на карте' с заданными свойствами.
   */
  var renderPin = function (ad) {
    var mapPinElement = mapPinTemplate.cloneNode(true);

    mapPinElement.querySelector('img').src = ad.author.avatar;
    mapPinElement.style.left = ad.location.x - PIN_SIZE.X / 2 + 'px';
    mapPinElement.style.top = ad.location.y + PIN_SIZE.Y + 'px';

    return mapPinElement;
  };

  /**
   * createPins - Создает массив элементов 'Метка объявления на карте'.
   *
   * @param  {Array.<Ad>} ads Массив объектов Ad.
   * @return {Array.<Node>}   Массив элементов 'Метка объявления на карте'.
   */
  var createPins = function (ads) {
    var result = [];
    for (var i = 0; i < ads.length; i++) {
      result.push(renderPin(ads[i]));
    }

    return result;
  };

  window.pin = {
    createPins: createPins
  };
})();
