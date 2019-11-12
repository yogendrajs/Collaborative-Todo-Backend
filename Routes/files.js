let config = require("../config").envdata;
let checkToken = require("../middleware");

module.exports = function(files, knex, jwt, multer, multerS3, aws, path) {
    const s3 = new aws.S3({
        accessKeyId: config.ACCESS_KEY_ID,
        secretAccessKey: config.SECRET_ACCESS_KEY,
        Bucket: config.BUCKET,
        region: "ap-south-1"
    });

    const uploadsBusinessGallery = multer({
        storage: multerS3({
            s3: s3,
            bucket: config.BUCKET,
            acl: "public-read",
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
        const filetypes = /jpeg|jpg|png|gif|pdf/;
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
                            let fileArray = req.files,
                                fileLocation;
                            console.log("length", fileArray.length);
                            const imgLocationArray = [];
                            for (let i = 0; i < fileArray.length; i++) {
                                fileLocation = fileArray[i].location;
                                // console.log("filename", fileLocation);
                                imgLocationArray.push(fileLocation);
                            }
                            // Save the file name into database
                            for (var fileLink of imgLocationArray) {
                                knex("files")
                                    .insert({
                                        fileLink: fileLink,
                                        todoId: todoId,
                                        userId: userId
                                    })
                                    .then(() => {
                                        console.log();
                                        knex("files")
                                            .where("files.userId", userId)
                                            .then(userFiles => {
                                                // console.log('o shit', userFiles);
                                                res.json({
                                                    userFiles: userFiles
                                                });
                                            })
                                            .catch(err => console.log(err));
                                    })
                                    .catch(err => console.log(err));
                            }

                            // await knex("files")
                            //     .where("files.userId", userId)
                            //     .then(userFiles => {
                            //         console.log("o shit", userFiles);
                            //         fileList = userFiles;
                            //         // res.json({
                            //         //     userFiles: userFiles
                            //         // });
                            //     })
                            //     .catch(err => console.log(err));

                            // console.log("this is the file array", fileArray);

                            // res.json({
                            //     filesArray: fileArray,
                            //     locationArray: imgLocationArray
                            // });
                        } else {
                            console.log("token err", err);
                            res.json("token is not valid");
                        }
                    });
                    // console.log(req.file.key);
                    // console.log(req.file.location);

                    // console.log("fileArray", fileArray);
                    // console.log("locationArray", imgLocationArray);
                }
            }
        });
    });

    files.get("/allfiles", checkToken, (req, res) => {
        jwt.verify(req.token, config.SECRET, (err, authData) => {
            let userId = authData.allData.userId;
            knex("files")
                .where("files.userId", userId)
                .then(userFiles => {
                    console.log("the user data", userFiles);
                    res.json({ userFiles: userFiles });
                })
                .catch(err => console.log(err));
        });
    });
};
