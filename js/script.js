$(document).ready(function() {
  // Tel Input Config begin
  var telInput = $('#phone'),
    errorMsg = $('#error-msg'),
    validMsg = $('#valid-msg');

  $('#phone').intlTelInput({
    // allowDropdown: false,
    // autoHideDialCode: false,
    autoPlaceholder: 'aggressive',
    // dropdownContainer: "body",
    // excludeCountries: ["us"],
    // formatOnDisplay: false,
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, 'jsonp').always(function(resp) {
        var countryCode = resp && resp.country ? resp.country : '';
        callback(countryCode);
      });
    },
    // hiddenInput: "full_number",
    initialCountry: 'auto',
    // nationalMode: false,
    // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
    // placeholderNumberType: "MOBILE",
    preferredCountries: ['us', 'uk', 'in'],
    separateDialCode: true,
    utilsScript: './js/utils.js'
  });

  var reset = function() {
    telInput.removeClass('error');
    errorMsg.addClass('hide');
    validMsg.addClass('hide');
  };

  telInput.blur(function() {
    reset();
    if ($.trim(telInput.val())) {
      if (telInput.intlTelInput('isValidNumber')) {
        validMsg.removeClass('hide');
      } else {
        telInput.addClass('error');
        errorMsg.removeClass('hide');
      }
    }
  });
  // on keyup / change flag: reset
  telInput.on('keyup change', reset);
  // Tel Input Config end

  // Bulma nav config begin

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener('click', function() {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
  // Bulma nav config end

  // About click event begin
  $('.about-btn').click(function() {
    let content = document.createElement('div');
    content.innerHTML =
      "\
    No Save Number is an application that lets you send Whatsapp messages without having to save the number to your contact list.<br><br>\
    Simply enter the number you'd like to message along with your message and hit submit.\
    ";
    swal({
      title: 'About',
      content,
      icon: 'info'
    });
  });
  // About click event end

  // On submit begin
  $('#submit-btn').click(function(e) {
    e.preventDefault();
    var message = encodeURI($('#message').val());

    if (!telInput.intlTelInput('isValidNumber')) {
      swal('Error', 'Please enter a valid number!', 'error');
    } else if (message.length === 0) {
      swal('Error', 'Please enter a message!', 'error');
    } else {
      var phoneNumber = $('#phone')
        .intlTelInput('getNumber')
        .replace('+', '');

      ga('send', {
        hitType: 'event',
        eventCategory: 'Submit',
        eventAction: 'click',
        eventLabel: $('#phone').intlTelInput('getSelectedCountryData').name
      });

      window.location = `https://api.whatsapp.com/send?phone=${
        phoneNumber
      }&text=${message}`;
    }
  });
  // On submit end
});
