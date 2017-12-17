'use strict';

(function () {
  var body = document.querySelector('body');
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

  var onEscPress = function (evt) {
    window.util.runOnEsc(evt, closePopup);
  };

  var onDocumentClick = function (evt) {
    if (evt.target !== popup) {
      closePopup();
    }
  };

  var closePopup = function () {
    popup.remove();

    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', closePopup);
  };

  var createErrorPopup = function (errorMessage) {
    popup.style.backgroundColor = 'red';
    popup.textContent = errorMessage;
    body.appendChild(popup);

    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onDocumentClick);
  };

  var createSuccessPopup = function () {
    popup.style.backgroundColor = 'green';
    popup.textContent = 'Данные отправлены успешно';
    body.appendChild(popup);

    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onDocumentClick);
  };

  window.popup = {
    createErrorPopup: createErrorPopup,
    createSuccessPopup: createSuccessPopup
  };
})();
