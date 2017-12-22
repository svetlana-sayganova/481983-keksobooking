'use strict';

(function () {
  var types = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var map = document.querySelector('.map');

  var card;
  var cardClose;
  var currentTarget;

  /**
   * renderCard - Возвращает DOM-элемент 'Карточка объявления',
   * созданный на основе шаблона с заданными свойствами из объекта Ad.
   *
   * @param  {Ad} ad   Объект Ad.
   * @return {Node}    DOM-элемент 'Карточка объявления' с заданными свойствами.
   */
  var renderCard = function (ad) {
    var renderedCard = cardTemplate.cloneNode(true);
    var cardCharacteristics = renderedCard.querySelectorAll('p');
    var cardFeatures = renderedCard.querySelector('.popup__features');
    var cardPictures = renderedCard.querySelector('.popup__pictures');

    renderedCard.querySelector('h3').textContent = ad.offer.title;
    renderedCard.querySelector('small').textContent = ad.offer.address;
    renderedCard.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
    renderedCard.querySelector('h4').textContent = types[ad.offer.type];
    cardCharacteristics[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardCharacteristics[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    cardFeatures.innerHTML = '';
    ad.offer.features.forEach(function (feature) {
      var featureElement = '<li class="feature feature--' + feature + '"></li>';
      cardFeatures.insertAdjacentHTML('afterbegin', featureElement);
    });

    cardPictures.innerHTML = '';
    ad.offer.photos.forEach(function (photo) {
      var pictureElement = '<li style="margin-right: 3px"><img src="' + photo + '" width = "42" height="42" ></li>';
      cardPictures.insertAdjacentHTML('afterbegin', pictureElement);
    });

    cardCharacteristics[4].textContent = ad.offer.description;
    renderedCard.querySelector('img').src = ad.author.avatar;

    return renderedCard;
  };

  /**
   * showCard - Подсвечивает активный элемент 'Метка объявления'
   * и показывает соответствущий ему элемент 'Карточка объявления'.
   *
   * @param  {Event} evt  Событие Event.
   * @param  {Ad}    ad   Объявление Ad.
   */
  var showCard = function (evt, ad) {
    // переменной target присваивает ближайший родительский элемент 'Метка объявления'
    // исходнго элемента, на котором произошло событие
    var target = evt.target.closest('.map__pin');

    if (target) {
      // удаляет подсветку с предыдущего активного элемента 'Метка объявления'
      // и соответствующий ему элемент 'Карточка объявления'
      if (currentTarget) {
        currentTarget.classList.remove('map__pin--active');
        card.remove();
      }
      // добавляет подсветку элементу 'Метка объявления'
      target.classList.add('map__pin--active');
      // переменной currentTarget присваивает элемент 'Метка объявления',
      // находящийся в активном состоянии
      currentTarget = target;

      // по объявлению создает соответствующий элемент 'Карточка объявления'
      // и размещает на карте
      card = renderCard(ad);
      map.appendChild(card);

      // ищет кнопку закрытия элеманта 'Карточка объявления'
      // и назначает ему обработчик closeCard (закрытие элемента по клику)
      cardClose = map.querySelector('.popup__close');
      cardClose.addEventListener('click', closeCard);

      // назначает обработчик onCardEscPress (закрытие элемента по нажатию на клавишу Esc)
      document.addEventListener('keydown', onCardEscPress);
    }
  };

  /**
   * closeCard - Снимает подсветку с активного элемента 'Метка объявления'
   * и скрывает соответствущий ему элемент 'Карточка объявления'.
   *
   */
  var closeCard = function () {
    if (card) {
      currentTarget.classList.remove('map__pin--active');
      card.remove();
      document.removeEventListener('keydown', onCardEscPress);
    }
  };

  /**
   * onCardEscPress - Закрывает элемент 'Карточка объявления'
   * при нажатии клавиши Esc.
   *
   * @param  {Event} evt Событие Event.
   */
  var onCardEscPress = function (evt) {
    window.util.runOnEsc(evt, closeCard);
  };

  window.card = {
    show: showCard,
    close: closeCard
  };
})();
