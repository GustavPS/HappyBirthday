var io      = require('socket.io')(),
    fs      = require('fs'),
    exec    = require('child_process').exec,
    util    = require('util'),
    sqlite3 = require('sqlite3').verbose();
var Files = {};
var AllowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'mp4', 'avi', 'flv'];
var Database = "./messages.db";

if (!fs.existsSync("Media")) {
    fs.mkdirSync("Media");
}

function generateId(extension) {
    id = "";
    while (true) {
        id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + extension;
        if (!fs.existsSync("Media/"+id)) {
            break;
        }
    }
    return id;
}

function removeFile(id) {
    try {
        fs.closeSync(Files[id]["Handler"]);
        fs.unlinkSync("Media/" + id);
    } catch(err) {
        console.log("Error removing file");
        console.log(err);
    }
}

io.sockets.on('connection', function(socket) {

    // If client started to send a file but it's not finished when it disconnects
    // remove the file, close the filehandler and remove the File object from RAM
    socket.on('disconnect', function() {
        if (socket.fileId != undefined) {
            console.log(socket.fileId + ": Client disconnected");
        }
        if (!socket.finished && socket.fileId != undefined) {
            console.log(socket.fileId + ": Upload was not finished, removing file.");
            removeFile(socket.fileId);
        }
        delete Files[socket.fileId];
    });

    socket.on('start', function(data) {
        var id;

        // If user only uploaded text
        if (!data['SendFile']) {
            var db = new sqlite3.Database(Database, function(err) {
                if (err) {
                    console.log(err.message);
                    return;
                }

                db.run(
                    "INSERT INTO Message (message, tumblr, twitter, instagram, timestamp) VALUES(?, ?, ?, ?, ?);",
                    data["Message"],
                    data["Tumblr"],
                    data["Twitter"],
                    data["Instagram"],
                    Date.now()
                );

                // Set to finished, close the filehandler and delete the file object in RAM.
                socket.finished = true;
                console.log("Saved text message");
                socket.emit('done');
            });
            db.close();

        // If user uploaded text and/or image/video
        } else {

            // Check so it is either a image or video that is being sent.
            if (!AllowedExtensions.includes(data['Extension'])) {
                console.log("User tried to send invalid file.");
                socket.emit('FileNotAllowed', 'extension');
                socket.FileNotAllowed = true;     
                return;
            }
            // Check so the file is smaller then or equal to 150MB
            if (data['Size'] > 157286400) {
                console.log("User tried to send a file bigger then 150MB.");
                socket.emit('FileNotAllowed', 'size');
                socket.FileNotAllowed = true;            
                return;
            }


            // Generate a unique id
            id = generateId(data['Extension']);
            socket.fileId = id;
            socket.FileNotAllowed = false;
            socket.finished = false;

            Files[id] = {
                FileSize:   data['Size'],
                Data:       "",
                Downloaded: 0,
                Message: {
                    "Message": data["Message"],
                    "Tumblr": data["Tumblr"],
                    "Twitter": data["Twitter"],
                    "Instagram": data["Instagram"]
                }
            };
            var Place = 0;
            fs.open("Media/" + id, 'a', 0755, function(err, fd) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(socket.fileId + ": Recieving file");
                    Files[id]['Handler'] = fd;
                    socket.emit('moreData', { 'Place': Place, Percent: 0, "id": id });
                }
            });
        }
    });

    socket.on('upload', function(data) {
        if (socket.FileNotAllowed) {
            console.log(socket.fileId + ": Got an upload request, but the file has been marked as not allowed.");
            return;
        }
        var id = data['id'];
        Files[id]['Downloaded'] += data['Data'].length;
        Files[id]['Data'] += data['Data'];
        // If the file has been 100% received
        if (Files[id]['Downloaded'] == Files[id]['FileSize']) {
            socket.emit('done');
            fs.write(Files[id]['Handler'], Files[id]['Data'], null, 'Binary', function(err, Writen) {
                console.log(socket.fileId + ": Saved file");
                // Save the message and the filename to the database
                var db = new sqlite3.Database(Database, function(err) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    db.run(
                        "INSERT INTO Message (file, message, tumblr, twitter, instagram, timestamp) VALUES(?, ?, ?, ?, ?, ?);",
                        id,
                        Files[id]["Message"]["Message"],
                        Files[id]["Message"]["Tumblr"],
                        Files[id]["Message"]["Twitter"],
                        Files[id]["Message"]["Instagram"],
                        Date.now()
                    );

                    // Set to finished, close the filehandler and delete the file object in RAM.
                    socket.finished = true;
                    fs.closeSync(Files[id]["Handler"]);
                    delete Files[id];
                });
                db.close();
            });
        // Reset the buffer if it reaches 10MB
        } else if(Files[id]['Data'].length > 10485760) {
            fs.write(Files[id]['Handler'], Files[id]['Data'], null, 'Binary', function(err, Writen) {
                Files[id]['Data'] = ""; // Reset the Buffer
                var Place = Files[id]['Downloaded'] / 524288;
                var Percent = (Files[id]['Downloaded'] / Files[id]['FileSize']) * 100;
                socket.emit('moreData', { 'Place': Place, 'Percent': Percent, "id": id });
            });
        } else {
            var Place = Files[id]['Downloaded'] / 524288;
            var Percent = (Files[id]['Downloaded'] / Files[id]['FileSize']) * 100;
            socket.emit('moreData', { 'Place': Place, 'Percent': Percent, "id": id });
        }
    })
});

io.listen(5001);