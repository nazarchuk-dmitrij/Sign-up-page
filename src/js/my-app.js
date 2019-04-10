$(document).ready(function() {

    const $errorBox = $('.form__error-box'),
        $nextBtnWrapper = $('.js-next-btn-wrapper'),
        $nextButton = $('.js-btn-next'),
        $cancelButton = $('.js-btn-cancel'),
        $submitButton = $('.js-btn-submit'),
        $errorBar = $('.form__error-box'),
        $inputEmail = $('#userEmail'),
        $inputPassword = $('#userPassword'),
        $verifyPassword = $('#confirmPassword'),
        $sidebar = $('.sidebar'),
        $sidebarSteps = $('.sidebar__step'),
        $form = $('.form'),
        $formSteps = $('.form__step'),
        $groupSelect = $('.group__select'),
        $avatarImg = $('.avatar__img'),
        $openModal = $('.js-avatar__open-modal'),
        $modal = $('.modal'),
        $modalError = $('.modal__error'),
        $modalOverlay = $('.modal__overlay'),
        $modalPath = $('.js-modal__path'),
        $modalPathSpan = $('.js-modal__span'),
        $modalCancel = $('.js-modal__cancel'),
        $modalUpload = $('.js-modal__upload'),
        $finalEmail = $('.js-final__email'),
        $finalGroup = $('.js-final__group'),
        $finalAvatar = $('.js-final__avatar'),
        disabledButton = 'form-btn--is-disabled',
        isDisabledClass = 'js-is-disabled',
        activeStepSidebar = 'sidebar__step--is-active',
        activeStepForm = 'form__step--is-active',
        activeModal = 'js-modal--is-active',
        avatarImageActive = 'avatar__img--is-active',
        genericError = 'Please fill out all fields before proceeding to the next step',
        passwordError = 'Password should be at least 6 characters long and consist of big and small letters',
        jsonFile = 'mock.js', // Path to JSON
        maxStep = $('.sidebar__step').length; // Amount of Steps

    var isValidated = false, // is Current Step validated
        isEmailWrong = true, // is Email correct on first step
        isPasswordWrong = true, //is Password correct on first step
        currentStep = 1; // Number of current Step


    /* Declaring all needed functions */

    /* Getting Options for Select element on second step of registration
       and adding them to the <section> */
    /*    This is what it looked like with server being set up */
    // function getOptionsData() {
    //     var optionsHTML = '';

    //     $.getJSON(jsonFile)
    //         .done((data) => {
    //             $.each(data, function(key, val) {
    //                 optionsHTML += '<option value="' + val.id + '">' + val.name + '</option>';
    //             });
    //             $groupSelect.append(optionsHTML);
    //         })
    //         .fail((data) => {
    //             console.log('Something went wrong');
    //         });
    // }
    /* Imagine this is AJAX call for JSON file */
    function getOptionsData() {
        var optionsHTML = '';
        $.each(kindOfJSON, function(key, val) {
            optionsHTML += '<option value="' + val.id + '">' + val.name + '</option>';
        });
        $groupSelect.append(optionsHTML);
    }
    // Added flag to prevent Error box from flickering
    var wasErrorCalled = false;
    /* Displaying error */
    function triggerError($element) {
        var duration = 2500;
        if(!wasErrorCalled) {
            wasErrorCalled = true;
            $element.stop(true, true).slideDown().delay(duration).slideUp();
            setTimeout(function() {
                wasErrorCalled = false;
            }, duration );
        }
    }
    /* Common Regex for Emails */
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    /* Password should consist of small and big letters
       Length should be at least 6 characters */
    function isPassword(password) {
        // var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        var regex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]{6,}$/;
        return regex.test(password);
    }

    function becameValid() {
        isValidated = true;
        $nextButton.removeClass(isDisabledClass);
    }

    function becameInvalid() {
        isValidField = false;
        $nextButton.addClass(isDisabledClass);
    }

    function dataValidation(type) {
        let isPasswordConfirmed = confirmPasswordValidation(),
            isValidField = false;
        if (isEmail($inputEmail.val()) && isPassword($inputPassword.val()) && isPasswordConfirmed) {
            isValidField = true;
        }

        if (isValidField) {
            /* Displaying Email on the last step */
            $errorBar.text(genericError);
            $finalEmail.text($inputEmail.val());
            becameValid();
        } else {
            $errorBar.text(passwordError);
            triggerError($errorBar);
            becameInvalid();
        }
    }

    function confirmPasswordValidation() {
        var password = $inputPassword.val(),
            confirmPassword = $verifyPassword.val();

        if (password.length === confirmPassword.length && password === confirmPassword) {
            return true;
        } else {
            return false;
        }
    }
    /* Removing Active class from current Step 
       and assigning it to requested one */
    function changeStep() {
        $formSteps.removeClass(activeStepForm);
        $sidebarSteps.removeClass(activeStepSidebar);
        $form.find('[data-step="' + currentStep + '"]').addClass(activeStepForm);
        $sidebar.find('[data-step="' + currentStep + '"]').addClass(activeStepSidebar);
    }

    /* Reading Avatar and adding it to preview */
    function previewFile() {
        // List of acceptable File types
        var fileTypes = ['jpg', 'jpeg', 'png', 'gif'];
        var file = $modalPath.prop('files')[0];
        var reader = new FileReader();

        try {
            reader.onloadend = function() {
                $avatarImg.attr('src', reader.result);
                $finalAvatar.attr('src', reader.result);
            }
            if (file) {
                var extension = file.name.split('.').pop().toLowerCase();

                if (fileTypes.indexOf(extension) > -1) {
                    $modalPathSpan.text(file.name);
                    reader.readAsDataURL(file);
                    $modalUpload.attr('disabled', false);
                } else {
                    triggerError($modalError);
                }
            } else {
                $avatarImg.attr('src', '');
            }
        } catch (err) {
            console.log('Something went wrong: ' + err);
        }
    }


    /* Adding listeners for all needed actions */

    /* Getting Options for select on the second step of registration */
    getOptionsData();
    /* Preventing hitting Enter to Submit the Form */
    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    /* "Next" button click
        Showing warning if not all fields on current step were filled */
    $nextButton.click(function() {
        if (!$(this).hasClass(isDisabledClass)) {
            becameInvalid();
            currentStep++;
            changeStep();
        } else {
            triggerError($errorBar);
        }
        if(currentStep == 4) {
            $nextButton.addClass(disabledButton);
            $submitButton.removeClass(disabledButton);
        }
    });
    /* "Cancel" button click resets the form */
    $cancelButton.click(function() {
        isValidated = false;
        if(currentStep == 4) {
            $nextButton.removeClass(disabledButton);
            $submitButton.addClass(disabledButton);
        }
        currentStep = 1;
        changeStep();
    });

    $inputEmail.keyup(dataValidation);
    $inputPassword.keyup(dataValidation);
    $verifyPassword.keyup(dataValidation);
    /* When any Option gets selected, Step becomes valid */
    $groupSelect.on('change', function() {
        if (this.value) becameValid();
        /* Displaying selected option on Final step */
        $finalGroup.text(this.options[this.selectedIndex].text);
    });
    /* Open modal after clicking corresponding button */
    $openModal.click(function() {
        $modal.addClass(activeModal);
        $modalOverlay.addClass(activeModal);
        $avatarImg.removeClass(avatarImageActive);
        $modalUpload.attr('disabled', true);
    });
    /* Selecting File for Avatar */
    $modalPath.change(function() {
        previewFile();
    });
    /* Clicking "Cancel" on the button hides modal and resets selected avatar */
    $modalCancel.click(function() {
        becameInvalid();
        $modal.removeClass(activeModal);
        $modalOverlay.removeClass(activeModal);
        /* Reseting input type in order to reset its value */
        $modalPath.type = '';
        $modalPath.type = 'file';
        $modalPathSpan.text('No File Chosen');
        $avatarImg.attr('src', '');
        $avatarImg.removeClass(avatarImageActive);
        $modalUpload.attr('disabled', true);
    });

    $modalUpload.click(function() {
        $modal.removeClass(activeModal);
        $modalOverlay.removeClass(activeModal);
        $avatarImg.addClass(avatarImageActive);
        becameValid();
    });
});