const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-south-1"});

const s3 = new AWS.S3();

const S3_BUCKET= "commithub-storage";

module.exports = {s3,S3_BUCKET};







// {
//     "Version": "2012-10-17",
//         "Statement": [
//             {
//                 "Effect": "Allow",
//                 "Principal": {
//                     "AWS": "arn:aws:iam::170145218658:user/sanjeev-admin"
//                 },
//                 "Action": "s3:*",
//                 "Resource": [
//                     "arn:aws:s3:::commithub-storage",
//                     "arn:aws:s3:::commithub-storage/*"
//                 ]
//             }
//         ]
// }
