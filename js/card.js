'use strict';

(function () {
  var TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  /**
   * renderCard - Возвращает DOM-элемент 'Карточка объявления на карте',
   * созданный на основе шаблона с заданными свойствами из объекта Ad.
   *
   * @param  {Ad} ad   Объект Ad.
   * @return {Node}    DOM-элемент 'Карточка объявления на карте' с заданными свойствами.
   */
  var renderCard = function (ad) {
    var mapCardElement = mapCardTemplate.cloneNode(true);
    var paragraphs = mapCardElement.querySelectorAll('p');
    var featureList = mapCardElement.querySelector('.popup__features');
    var pictureList = mapCardElement.querySelector('.popup__pictures');

    mapCardElement.querySelector('h3').textContent = ad.offer.title;
    mapCardElement.querySelector('small').textContent = ad.offer.address;
    mapCardElement.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
    mapCardElement.querySelector('h4').textContent = TYPES[ad.offer.type];
    paragraphs[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    paragraphs[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    featureList.innerHTML = '';
    for (var i = 0; i < ad.offer.features.length; i++) {
      var featureElement = '<li class="feature feature--' + ad.offer.features[i] + '"></li>';
      featureList.insertAdjacentHTML('afterbegin', featureElement);
    }

    pictureList.innerHTML = '';
    for (var j = 0; j < ad.offer.photos.length; j++) {
      var photoElement = '<li style="margin-right: 3px"><img src="' + ad.offer.photos[j] + '" width = "42" height="42" ></li>';
      pictureList.insertAdjacentHTML('afterbegin', photoElement);
    }

    paragraphs[4].textContent = ad.offer.description;
    mapCardElement.querySelector('img').src = ad.author.avatar;

    return mapCardElement;
  };

  window.card = {
    renderCard: renderCard
  };
})();
