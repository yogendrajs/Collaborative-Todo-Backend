const config = require('../config').envdata;
// console.log(config);
module.exports = function(forgotPass, nodeoutlook, jwt, Auth) {
   
   forgotPass.post('/forgot', (req, res) => {
      // console.log(req.body);
      Auth.findOne({
         where: {
            email: req.body.email
         }
      })
      .then(data => {
         // data = data.dataValues;
         if (data === null){
            res.send(data);
         }
         else {
            data = data.dataValues;
            jwt.sign({allData: JSON.stringify(data)}, config.SECRET, { expiresIn: '3m' }, (err, token) => {
               if (!err){
                   data.token = token;

                  nodeoutlook.sendEmail({
                     auth: {
                        user: config.GMAIL_USER,
                        pass: config.GMAIL_PASS
                    },
                    from: `"React Todo" ${config.GMAIL_USER}`,
                    to: req.body.email,
                    subject: 'Password Reset Request for React Todo',
                    html: `<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="padding: 0;">
                    <div id="wrapper" dir="ltr" style="background-color: #f7f7f7; margin: 0; padding: 70px 0; width: 100%; -webkit-text-size-adjust: none;">
                       <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
              <tr>
              <td align="center" valign="top">
                                <div id="template_header_image">
                                                     </div>
                                <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container" style="background-color: #ffffff; border: 1px solid #dedede; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); border-radius: 3px;">
              <tr>
              <td align="center" valign="top">
                                         <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_header" style='background-color: #1976d2; color: #ffffff; border-bottom: 0; font-weight: bold; line-height: 100%; vertical-align: middle; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; border-radius: 3px 3px 0 0;'><tr>
              <td id="header_wrapper" style="padding: 36px 48px; ">
                                                  <h1 style='font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 30px; font-weight: 300; line-height: 150%; margin: 0; text-align: left; text-shadow: 0 1px 0 #4791db; color: #ffffff;'>Password Reset Request</h1>
                                               </td>
                                            </tr></table>
              </td>
                                   </tr>
              <tr>
              <td align="center" valign="top">
                                         <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body"><tr>
              <td valign="top" id="body_content" style="background-color: #ffffff;">
                                                  <table border="0" cellpadding="20" cellspacing="0" width="100%"><tr>
              <td valign="top" style="padding: 48px 48px 32px;">
                                                           <div id="body_content_inner" style='color: #515151; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 14px; line-height: 150%; text-align: left;'>
              
              <p style="margin: 0 0 16px;">Hi ${data.firstName},</p>
              <p style="margin: 0 0 16px;">You have requested a new password for your Todo Account</p>
              <p style="margin: 0 0 16px;">Email: ${data.email}</p>
              <p style="margin: 0 0 16px;">If you didn't make this request, just ignore this email. If you'd like to proceed:</p>
              <p style="margin: 0 0 16px;">
                 <a class="link" href="http://localhost:3000/resetpass?key=${data.token}&id=${data.userId}" style="font-weight: normal; text-decoration: underline; color: #1976d2;">		Click here to reset your password	</a>
              </p>
              <p style="margin: 0 0 16px;">Thanks for reading.</p>
              
                                                           </div>
                                                        </td>
                                                     </tr></table>
              </td>
                                            </tr></table>
              </td>
                                   </tr>
              </table>
              </td>
                          </tr>
              <tr>
              <td align="center" valign="top">
                                <table border="0" cellpadding="10" cellspacing="0" width="600" id="template_footer"><tr>
              <td valign="top" style="padding: 0; border-radius: 6px;">
                                         <table border="0" cellpadding="10" cellspacing="0" width="100%"><tr>
              <td colspan="2" valign="middle" id="credit" style='border-radius: 6px; border: 0; color: #7d7d7d; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 12px; line-height: 150%; text-align: center; padding: 24px 0;'>
                                                  <p style="margin: 0 0 16px;">Sent by <a href="https://github.com/yogendra3236" style="color: #1976d2; font-weight: normal; text-decoration: underline;">React-Todo</a>.</p>
                                               </td>
                                            </tr></table>
              </td>
                                   </tr></table>
              </td>
                          </tr>
              </table>
              </div>
        </body>`,
                    
                    onError: (e) => console.log(e),
                    onSuccess: (i) => console.log(i)

                  })

                  res.send(data);

               }else {
                   console.log(err);
               }
           })
         }
      })
      .catch(err => console.log('ed', err));
   })
}
