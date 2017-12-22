'use strict';

(function () {
  var body = document.querySelector('body');

  /**
   * createPopup - Создает попап с информацией об успешном / неуспешном действии.
   *
   * @param  {string} text            Сообщение попапа.
   * @param  {string} backgroundColor Цвет фона попапа.
   */
  var createPopup = function (text, backgroundColor) {
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '300px';
    popup.style.padding = '40px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '100';
    popup.style.color = 'white';
    popup.style.fontSize = '30px';
    popup.style.backgroundColor = backgroundColor;
    popup.textContent = text;
    body.appendChild(popup);

    var onEscPress = function (evt) {
      window.util.runOnEsc(evt, closePopup);
    };

    var onDocumentClick = function (evt) {
      if (evt.target !== popup) {
        closePopup();
      }
    };

    // Удаляет попап
    var closePopup = function () {
      popup.remove();

      document.removeEventListener('keydown', onEscPress);
      document.removeEventListener('click', onDocumentClick);
    };

    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onDocumentClick);
  };

  // Создает 'успешный' попап
  var createErrorPopup = function (errorMessage) {
    createPopup(errorMessage, 'red');
  };

  // Создает 'неуспешный' попап
  var createSuccessPopup = function () {
    createPopup('Данные отправлены успешно', 'green');
  };

  window.popup = {
    createError: createErrorPopup,
    createSuccess: createSuccessPopup
  };
})();
