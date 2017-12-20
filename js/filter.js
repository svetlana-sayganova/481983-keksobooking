'use strict';

(function () {
  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var filteredAds = [];

  var filterByType = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.type === filterValue;
    });
  };

  var filterByRooms = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.rooms.toString() === filterValue;
    });
  };

  var filterByGuests = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.guests.toString() === filterValue;
    });
  };

  var filterByPrice = function (ads, filterValue) {
    return ads.filter(function (ad) {
      var priceInterval = {
        'low': ad.offer.price < 10000,
        'middle': ad.offer.price >= 10000 && ad.offer.price < 50000,
        'high': ad.offer.price > 50000
      };
      return priceInterval[filterValue];
    });
  };

  var filterByFeatures = function (ads, featureValue) {
    return ads.filter(function (ad) {
      return ad.offer.features.indexOf(featureValue) >= 0;
    });
  };

  filtersContainer.addEventListener('change', function () {
    window.util.debounce(window.map.updateMap, 500);
  });

  /**
   * filterAds - Возвращает отфильтрованный массив объявлений.
   *
   * @param  {Arr.<Ad>} ads Массив объявлений до фильтрации.
   * @return {Arr.<Ad>}     Отфильтрованный массив объявлений.
   */
  var filterAds = function (ads) {
    filteredAds = ads.slice();

    // Формирует массив из фильтров, которые были применены (фильтр был применен,
    // если его значение отличается от значения 'any')
    var appliedFilters = Array.from(filters).filter(function (filter) {
      return filter.value !== 'any';
    });

    // Формирует массив из выбранных характеристик объявления
    var checkedFeatures = Array.from(filtersContainer.querySelectorAll('.map__filter-set input[name="features"]:checked'));

    // Фильтрует объявления по каждому примененному фильтру
    appliedFilters.forEach(function (filter) {
      var filterName = filter.name;
      if (filterName === 'housing-type') {
        filteredAds = filterByType(filteredAds, filter.value);
      } else if (filterName === 'housing-rooms') {
        filteredAds = filterByRooms(filteredAds, filter.value);
      } else if (filterName === 'housing-guests') {
        filteredAds = filterByGuests(filteredAds, filter.value);
      } else if (filterName === 'housing-price') {
        filteredAds = filterByPrice(filteredAds, filter.value);
      }
    });

    // Фильтрует объявления по каждой выбранной характеристике
    checkedFeatures.forEach(function (feature) {
      filteredAds = filterByFeatures(filteredAds, feature.value);
    });

    return filteredAds;
  };

  window.filter = {
    filterAds: filterAds
  };
})();
