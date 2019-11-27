let config = require("../config").envdata;
let checkToken = require("../middleware");

module.exports = function(files, jwt, multer, multerS3, aws, path, Files) {
    const s3 = new aws.S3({
        accessKeyId: config.ACCESS_KEY_ID,
        secretAccessKey: config.SECRET_ACCESS_KEY,
        Bucket: config.BUCKET,
        region: "ap-south-1"
    });

    const uploadsBusinessGallery = multer({
        storage: multerS3({
            s3,
            bucket: config.BUCKET,
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function(req, file, cb) {
                cb(
                    null,
                    path.basename(
                        file.originalname,
                        path.extname(file.originalname)
                    ) +
                        "-" +
                        Date.now() +
                        path.extname(file.originalname)
                );
            }
        }),
        fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
        }
    }).array("files", 3);

    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|pdf/;
        // Check ext
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images And PDFs Only!");
        }
    }

    files.post("/files", checkToken, (req, res) => {
        // let token = req.headers.authorization.slice(7)
        // console.log(req.body.token);

        uploadsBusinessGallery(req, res, error => {
            // console.log("files", req.files);
            let { todoId, token } = req.body;
            // console.log(token);
            if (error) {
                console.log("errors", error);
                res.json({ error: error });
            } else {
                // If File not found
                if (req.files === undefined) {
                    console.log("Error: No File Selected!");
                    res.json("Error: No File Selected");
                } else {
                    // If Success
                    let userId;
                    jwt.verify(token, config.SECRET, (err, authData) => {
                        if (!err) {
                            // console.log("authData is here", authData);
                            userId = authData.allData.userId;
                            let fileArray = req.files;
                            console.log("length", fileArray);

                            // Save the file name into database
                            const insertions = fileArray.map(file => {
                                // fileLocation = fileArray[i].location;
                                // console.log("this is the first case");
                                // imgLocationArray.push(fileLocation);
                                return Files.create({
                                    fileLink: file.location,
                                    todoId: todoId,
                                    userId: userId,
                                    fileName: file.originalname,
                                    fileType: file.originalname.split(".").pop()
                                })
                            });

                            // console.log('all insertions', insertions);

                            Promise.all(insertions)
                                .then(() =>
                                    Files.findAll({
                                        where: {
                                            userId: userId
                                        }
                                    })
                                    .then(userFiles => {
                                        // console.log("baad wala hai yrr");
                                        res.json({
                                            userFiles: userFiles
                                        });
                                    })
                                )
                                .catch(err => console.log(err));
                        } else {
                            console.log("token err", err);
                            res.json("token is not valid");
                        }
                    });
                }
            }
        });
    });

    files.get("/allfiles", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            if (!err) {
                let userId = authData.allData.userId;
                console.log(userId);
                Files.findAll({
                    where: {
                        userId: userId
                    },
                    raw: true
                })
                .then(userFiles => {
                    console.log("the user data", userFiles);
                    res.json({ userFiles: userFiles });
                })
                .catch(err => console.log(err));
            } else {
                console.log("token err", err);
                res.json("token is not valid");
            }
        });
    });
};
