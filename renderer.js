const videoPlayer = document.getElementById('videoPlayer');
const topLeftInfo = document.getElementById('topLeftInfo');
const topRightInfo = document.getElementById('topRightInfo');
const fileDialog = document.getElementById("fileDialog");

let fileName; //暫時無用
let filePath;
let fileDateTime;
let nowPlayingDateTime;
let startTime;
let violationTime;
let endTime;

window.onresize = () => {topLeftInfo.scrollTop = topLeftInfo.scrollHeight};

videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = Math.floor(videoPlayer.currentTime);
    nowPlayingDateTime = new Date(fileDateTime.getTime());
    nowPlayingDateTime.setSeconds(nowPlayingDateTime.getSeconds() + currentTime);
    setCurrentTimeDisplay(nowPlayingDateTime);
});

const clickFileDialog = () => {
    fileDialog.click();
}

videoPlayer.addEventListener('click', clickFileDialog);

fileDialog.addEventListener('change', (event) => {
    console.log(event.target.files[0]);
    videoPlayerLoadFile(event.target.files[0]);
});

function videoPlayerLoadFile(file){
    document.getElementById("licensePlate").value="";
    document.getElementById("violationDetail").value="";
    nowPlayingDateTime = startTime = violationTime = endTime = null;
    updateButtonTimeDisplay();

    fileName = file.name;
    filePath = file.path;
    fileDateTime = parseFilename(fileName);

    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.currentTime = 0; // Start from the beginning
    setCurrentTimeDisplay(fileDateTime);

    topLeftInfo.style.display="block";
    topRightInfo.style.display="block";

    videoPlayer.removeEventListener('click', clickFileDialog);
    videoPlayer.play();
}

function setCurrentTimeDisplay(timeObject) {
    const currentTimeDisplay = document.getElementById('nowPlayingDatetime');
    currentTimeDisplay.textContent = "現正播放："+timeObjectToHumanReadable(timeObject);
}

function setStartSecond() {
    startTime = nowPlayingDateTime;
    updateButtonTimeDisplay();
} document.getElementById('setStartTimeButton').addEventListener("click",setStartSecond);

function setViolationTime() {
    violationTime = nowPlayingDateTime;
    updateButtonTimeDisplay();
} document.getElementById('setViolationTimeButton').addEventListener("click",setViolationTime);

function setEndSecond() {
    endTime = nowPlayingDateTime;
    updateButtonTimeDisplay();
    videoPlayer.pause();
} document.getElementById('setEndTimeButton').addEventListener("click",setEndSecond);

function updateButtonTimeDisplay() {
    document.getElementById('startTimeDisplay').textContent = startTime ? `開始時間：${timeObjectToHumanReadable(startTime)}` : "";
    document.getElementById('violationTimeDisplay').textContent = violationTime ? `違規時間：${timeObjectToHumanReadable(violationTime)}` : "";
    document.getElementById('endTimeDisplay').textContent = endTime ? `結束時間：${timeObjectToHumanReadable(endTime)}` : "";
}

document.getElementById('trimVideo').addEventListener('submit', function(event) {
    event.preventDefault();

    /* Convert FormData to Object */
    const formData = new FormData(event.target);
    let trimVideoData={};
    formData.forEach((value, key) => (trimVideoData[key] = value));

    /* No 1 less */
    console.log(trimVideoData);
    if(! (
        trimVideoData["licensePlate"] && 
        trimVideoData["violationDetail"] && 
        startTime && 
        endTime && 
        filePath
        )){
        return false;
    }

    let violationTimeString=violationTime ? timeObjectTo14Digit(violationTime) : timeObjectTo14Digit(startTime);

    let destFilename=violationTimeString+"_"+trimVideoData["licensePlate"]+"_"+trimVideoData["violationDetail"]+".mp4";

    let message = {
        srcFilePath: filePath,
        destFilename,
        videoStartSecond: Math.round((startTime.getTime()-fileDateTime.getTime())/1000),
        duration: Math.round((endTime.getTime()-startTime.getTime())/1000),
    };

    console.log("FFMpeg: ", message);
    window.ffmpeg.convert(message);

});

/*const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
} func();

(async function () {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
})*/

