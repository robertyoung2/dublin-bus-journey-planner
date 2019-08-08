//Function makes the day
console.log("Loaded jounrey_date_selector.js");
function set_date_options(){
    $(function(){
        var today = new Date().getTime();
        console.log("Today: "+today);
        for(var i =0 ;i < 7; i++){
            var day = today + i * 86400000;
            day = new Date(day);
            var maxDateYear = day.getFullYear();
            var maxDateMonth = day.getMonth()+1 < 10 ? "0"+(day.getMonth()+1) : (day.getMonth()+1);
            var maxDateDate = day.getDate() < 10 ? "0"+day.getDate() : day.getDate();
            var showday = maxDateYear+"-"+maxDateMonth+"-"+maxDateDate;
            $("#date").append("<option value="+showday+">"+day+"</option>");
        }
    });

    //Function displays the date and time
    $(function() {
        console.log("Inside Show/Hide date function!");
        $("#date").hide();
        $("#time").hide();
        $("#option").change(function () {
            if ($(this).val() == 'departureTime' || $(this).val() == 'arrivalTime'){
                $("#date").show();
                $("#time").show();
            }
            if ($(this).val() == 'now'){
                $("#date").hide();
                $("#time").hide();
            }
        });
    });
}
