var socket = io.connect('http://localhost:5001');
var FReader, Name, id;

window.addEventListener("load", Ready); 
 
function Ready(){ 
    if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use 
        document.getElementById('UploadButton').addEventListener('click', StartUpload);  
        document.getElementById('FileBox').addEventListener('change', FileChosen);
    }
    else
    {
        document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
    }
}

var SelectedFile;
function FileChosen(evnt) {
    SelectedFile = evnt.target.files[0];
    document.getElementById('NameBox').value = SelectedFile.name;
}

function StartUpload() {
    if (document.getElementById('FileBox').value != "") {
        FReader = new FileReader();
        Name = document.getElementById('NameBox').value;
        var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
        Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
        Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";

        document.getElementById('UploadArea').innerHTML = Content;
        FReader.onload = function(event) {
            socket.emit('upload', { 'id': id, Data: event.target.result });
        }
        socket.emit('start', {
            'Name': Name,
            'Size': SelectedFile.size,
            "Extension": Name.split('.').pop(),
            "Message": "This is a dummy message",
            "Tumblr": "gustavswift13",
            "Twitter": "gustavswift13",
            "Instagram": ""
        });
    } else {
        alert("Select a file");
    }
}

function UpdateBar(percent) {
    document.getElementById('ProgressBar').style.width = percent + '%';
    document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
    var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
    document.getElementById('MB').innerHTML = MBDone;
}

socket.on('moreData', function(data) {
    UpdateBar(data['Percent']);
    var Place = data['Place'] * 524288; // The next blocks starting position
    var NewFile; // The variablethat will hold the new block of data
    // Needs to be checked for browser-compability. Probably need to do special cases for old chrome/firefox
    NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
    /*
    if (SelectedFile.webkitSlice) {
        NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
    } else {
        NewFile = SelectedFile.mozSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));        
    }
    */
    id = data['id'];
    FReader.readAsBinaryString(NewFile);
});

socket.on('FileNotAllowed', function(error) {
    // Notify user that the file is not allowed
});

socket.on('done', function() {
    UpdateBar(100);
});