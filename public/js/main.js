
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

        $.confirm({
            theme: 'material',
            title: 'Are you sure',
            content: 'Are you sure you want to cash in the ' + fistsNeeded + ' fists needed for this sweet reward?',
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
                document.body.appendChild(form);
                form.submit();
                return false;
            }
        });

    })


});
