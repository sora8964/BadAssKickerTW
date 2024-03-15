function timeObjectTo14Digit(timeObject){
    return timeObject.getFullYear().toString()+
    addLeadingZero(timeObject.getMonth() + 1).toString()+
    addLeadingZero(timeObject.getDate().toString())+
    addLeadingZero(timeObject.getHours().toString())+
    addLeadingZero(timeObject.getMinutes().toString())+
    addLeadingZero(timeObject.getSeconds().toString());
}

function timeObjectToHumanReadable(timeObject){
    let year = timeObject.getFullYear();
    let month = timeObject.getMonth() + 1;
    let day = timeObject.getDate();
    let hour = timeObject.getHours();
    let minute = timeObject.getMinutes();
    let second = timeObject.getSeconds();

    return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)} ${addLeadingZero(hour)}:${addLeadingZero(minute)}:${addLeadingZero(second)}`;
}

function addLeadingZero(numberString) {
    return numberString.toString().length < 2 ? '0' + numberString : numberString;
}

function parseFilename(fileName){
    if(/^\d{4}_\d{2}\d{2}_\d{2}\d{2}\d{2}_\d{3}\.MP4$/.test(fileName)){
        return parseSJCamFilename(fileName);
    } else if(/^REC_\d{6}-\d{6}-\d{6}F\.TS$/.test(fileName)){
        return parseMy150CamFilename(fileName);
    } else {
        alert("不支援的檔案名稱Pattern");
        return false;
    }
}

function parseSJCamFilename(fileName){
    let dateTimeString = fileName.substring(0, 16);
    let year = dateTimeString.substring(0, 4);
    let month = dateTimeString.substring(5, 7);
    let day = dateTimeString.substring(7, 9);
    let hour = dateTimeString.substring(10, 12);
    let minute = dateTimeString.substring(12, 14);
    let second = dateTimeString.substring(14, 16);
    return new Date(year, month-1, day, hour, minute, second);
}

function parseMy150CamFilename(fileName){
    let year="20"+fileName.substring(4, 6);
    let month = fileName.substring(6, 8);
    let day = fileName.substring(8, 10);
    let hour = fileName.substring(11, 13);
    let minute = fileName.substring(13, 15);
    let second = fileName.substring(15, 17);
    return new Date(year, month-1, day, hour, minute, second);
}