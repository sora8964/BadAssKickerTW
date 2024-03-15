function dragOverHandler(event) {
    event.preventDefault();
}
//document.getElementById('dropArea').addEventListener('dragover', dragOverHandler);
document.getElementById('videoPlayer').addEventListener('dragover', dragOverHandler);

function dropHandler(event) {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (fileList.length > 0) {
        //document.getElementById('firstPage').style.display = 'none';
        //ocument.getElementById("main").style.display="block";
        const file = fileList[0];
        videoPlayerLoadFile(file);        
    }
}
//document.getElementById('dropArea').addEventListener('drop', dropHandler);
document.getElementById('videoPlayer').addEventListener('drop', dropHandler);
