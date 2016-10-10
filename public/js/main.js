
$( document ).ready(function() {
    $(".button-collapse").sideNav();
    $(".dropdown-button").dropdown();

    $( ".logoutFormAnchor" ).click(function() {
        var form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', '/logout');
        document.body.appendChild(form);
        form.submit();
        return false;
    });

    $( ".rewardConfirmationBtn" ).click(function() {
        $('#rewardConfirmation').slideUp();
    });



    $(".rewardBtn").click(function () {
        var _this = $(this);
        var rewardId = _this.attr('id');
        var fistsNeeded = _this.data('fistsNeeded');

        var title = 'Are you sure';
        var content = 'Are you sure you want to cash in the ' + fistsNeeded + ' fists needed for this sweet reward?';
        if (rewardId == 'reward5' || rewardId == 'reward25') {
            title = 'Confirm redemption';
            content = 'url:reward5.txt'
        }

        $.confirm({
            theme: 'material',
            title: title,
            content: content,
            confirm: function(){

                var form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', '/rewards');
                var input = document.createElement("input");
                input.type = "text";
                input.name = "rewardId";
                input.value = rewardId;
                form.appendChild(input);
                var input2 = document.createElement("input");
                input2.type = "text";
                input2.name = "fistsNeeded";
                input2.value = fistsNeeded;
                form.appendChild(input2);
                if (rewardId == 'reward5' || rewardId == 'reward25') {
                    var customText = this.$b.find('input#input-shoutout');
                    if (customText.val() !== '') {
                        var input3 = document.createElement("input");
                        input3.type = "text";
                        input3.name = "customText";
                        input3.value = customText.val();
                        form.appendChild(input3);
                    }
                }

                document.body.appendChild(form);
                form.submit();
                return false;
            }
        });

    })


});
