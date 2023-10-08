const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv').config();
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");

const bookinfos = require( './models/bookInfoModel.js');
const boxs = require( './models/boxModel.js');

app.use(cors({
    origin: '*',// 접근 권한을 부여하는 도메인
    method:['GET','POST','DELETE'],
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'sewing/build')));

mongoose.set('strictQuery',true); //스키마에서 설정한 필드만 바꿀수있게 설정

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
	 .then(()=>{console.log('연결 성공/ 포트:'+process.env.PORT)})
	 .catch((err)=>{console.error(err)});


app.listen(3000, function() {
    console.log("start! express server on port 3000")
})

function send_message(phone,title,content) {
  var user_phone_number = phone;//수신 전화번호 기입
  
  var resultCode = 200;
  const date = Date.now().toString();
  const uri = process.env.SERVICE_ID; //서비스 ID
  const secretKey = process.env.NCP_SECRET_KEY;// Secret Key
  const accessKey = process.env.NCP_KEY;//Access Key
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);
 
  axios({
        method: 'POST',
        url: url,
        headers: {
          "Content-type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": accessKey,
          "x-ncp-apigw-timestamp": date,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "SMS",
          countryCode: "82",
          from: user_phone_number,
		  subject:title,
          content: content,
          messages: [{  to: `${user_phone_number}`}],
        },
      }).then((result)=>{
	  return 200;
	 
  	  }).catch((err)=>{
	  return 404;
  })
	
	
	
  return resultCode;
}


app.post('/book',  (req,res)=>{
	req.body.status = "작업대기중";
	
	const input = new bookinfos(req.body);
	
	const transporter = nodemailer.createTransport({
  					service: 'gmail',  //  이메일사용 업체 ex 구글:gmail
  					auth: {
   					user: process.env.MAIL_ID,  // 발송자 이메일
    				pass: process.env.MAIL_PASSWORD,  // 발송자 비밀번호
  					},
			});
			
			const mailOptions = {
  					from: process.env.MAIL_ID,
  					to: 'bassrkd64@gmail.com',
  					subject: "sewing 주문!",
  					html: `<h1>sewing 주문 확인</h1>
							<h2>유저 이름:${req.body.name} <h2>
          					<div>
            				아래 글자를 눌러 주문 확인을 해주세요.
							
          					</div>
							
							
							
							<div>상태:${req.body.status} </div>
							<div>주문 요청 사항:${req.body.content} </div>
							
							
							<div>동시 클릭 방지 공간</div>
							<div>--------------------------------------------------------------------------</div>
							<a href='${process.env.server_URL}/admin'>관리자 화면</a>
							</div>`,
  					text: "주문 확인 메일입니다.",
			};
	
	
	const mailPromise = new Promise((resolve, reject) => {
 			 transporter.sendMail(mailOptions, (err, info) => {
    			if (err) {
      				console.log(err);
      				reject(err);
    			} else {
      				resolve(info);
    			}
  		});
	});

	const boxPromise = boxs.findOneAndUpdate({ number: req.body.boxNumber },
											 { $set: { status: req.body.status } });
	
	
	bookinfos.findOne({phoneNumber:req.body.phoneNumber}).then((result)=>{
		if (result){
			return res.json({isSuccess:false,msg:"이미 예약된 전화번호입니다."});
		}else{
			input.save()
  				.then( () => {
					Promise.all([mailPromise, boxPromise])
					  .then(([mailInfo, result]) => {
						if (result) {
						  if (200 == send_message(req.body.phoneNumber, '예약완료', 
												  `[오버로크 시스템]\n${result.number}번 상자 비밀번호:${result.pw}`)) {
							return res.json({isSuccess:true,msg:"예약되었습니다!"});
						  } else {
							return res.json({isSuccess:false,msg:"알수없는 에러"});
						  }
						}
						
					  })
					  .catch((err) => {
						console.error(err);
						return res.json({isSuccess:false,msg:"알수없는 에러"});
					  });
				
					
				
					
					
						
					
					
  				})
  				.catch((err) => {
   	 				console.error('Error saving bookinfos:', err);
					return res.json({isSuccess:false,msg:"알수없는 에러"});
  				});
		
		}
	}).catch((error)=>{
		if (error) return res.json({isSuccess:false,msg:error});
	})
	
	
})


app.get('/getlookup/:name/:phonenumber', (req,res)=>{
	let name =  req.params.name;
	let phoneNumber = req.params.phonenumber;
	
	bookinfos.findOne({name:name,phoneNumber:phoneNumber})
	.then((result)=>{
		if (result){
			return res.json({isSuccess:true,
							 name:result.name,
							 phoneNumber:result.phoneNumber,
							 status:result.status,content:result.content,
							 boxNumber:result.boxNumber});
		}else{
			return res.json({isSuccess:false,msg:"존재하지않는 이름,번호입니다."});
		}
	})
	.catch((err)=>{
		return res.json({isSuccess:false,msg:err});
	})
	
})


app.get('/box', (req,res)=>{
	
	boxs.find()
  .then((box) => {
	
    return res.json({isSuccess:true,boxs:box});
  })
  .catch(err => {
    return res.json({isSuccess:false});
  });
})

app.get('/getbook' , (req,res)=>{
	bookinfos.find()
  .then((books) => {
	
    return res.json({isSuccess:true,books:books});
  })
  .catch(err => {
    return res.json({isSuccess:false});
  });
})

app.post('/sendsms', (req,res)=>{
	console.log(req.body);
	
	if (200 == send_message(req.body.phoneNumber,req.body.title,req.body.content)){
		return res.json({isSuccess:true,status:req.body.content});
	}else{
		return res.json({isSuccess:false});
	}
})


app.post('/admin/dbsave', (req,res)=>{
	
	if (req.body.pw){
		boxs.findOneAndUpdate(
		{ number: req.body.number },
		{ $set: { pw: req.body.pw }}).then((result)=>{
		if (result) return res.json({isSuccess:true,msg:req.body.pw+'로 변경'});
		else{
			return res.json({isSuccess:false,msg:'db에 해당상자 없음..'});
		}
		}).catch((err)=>{
			return res.json({isSuccess:false,msg:err});
		})
	}else if (req.body.status == '작업가능'){
		bookinfos.findOneAndDelete(
		{ phoneNumber: req.body.phoneNumber }).then((result)=>{
		if (result) {
			boxs.findOneAndUpdate(
			{ number: req.body.boxNumber},
			{ $set: { status: req.body.status }}).then((result)=>{
				return res.json({isSuccess:true,msg:req.body.status+'로 변경'});
			}).catch((err)=>{
				return res.json({isSuccess:false,msg:'box업뎃 안댐..'});
			})
			
			
			
		}
		else{
			return res.json({isSuccess:false,msg:'db에 해당예약 없음..'});
		}
		}).catch((err)=>{
			return res.json({isSuccess:false,msg:err});
		})
		
		
	}else{
		bookinfos.findOneAndUpdate(
		{ phoneNumber: req.body.phoneNumber },
		{ $set: { status: req.body.status }}).then((result)=>{
		if (result) {
			boxs.findOneAndUpdate(
			{ number: req.body.boxNumber},
			{ $set: { status: req.body.status }}).then((result)=>{
				return res.json({isSuccess:true,msg:req.body.status+'로 변경'});
			}).catch((err)=>{
				return res.json({isSuccess:false,msg:'box업뎃 안댐..'});
			})
			
			
			
		}
		else{
			return res.json({isSuccess:false,msg:'db에 해당예약 없음..'});
		}
		}).catch((err)=>{
			return res.json({isSuccess:false,msg:err});
		})
	}
	
	
})


app.get('*', function (req, res) {
	

	res.sendFile(path.join(__dirname,'/sewing/build/index.html'));
	
});