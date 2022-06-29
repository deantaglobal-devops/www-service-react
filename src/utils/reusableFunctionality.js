export function dateTimeFunction(unixTimecode, dateOrTime = "time"){

    const localZoneDate = new Date(new Date(+unixTimecode * 1000).toLocaleString('en-US', Intl.DateTimeFormat().resolvedOptions().timeZone));

    // Add Leading 0 for day with a single digit
    let formattedDay = addLeadingZero(localZoneDate.getDate());

    // Add Leading 0 for months with a single digit
    let formattedMonth = addLeadingZero(localZoneDate.getMonth() + 1);

     // Add Leading 0 for hours with a single digit
    let formattedHours = addLeadingZero(localZoneDate.getHours());

    // Add Leading 0 for minutes with a single digit
    let formattedMinutes = addLeadingZero(localZoneDate.getMinutes());
    
    function addLeadingZero(number){
        if(number < 10){
            number = `0${number}`;
        }
        return number;
    }

    // Creating a new, nicely formatted string with Date or Time
    return dateOrTime === "time" ? `${formattedHours}:${formattedMinutes}`:`${formattedDay}/${formattedMonth}/${localZoneDate.getFullYear()}`;
}