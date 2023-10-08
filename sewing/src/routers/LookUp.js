
import { Button,Form} from 'react-bootstrap';
import { useState } from 'react';
import { serverurl } from './serverurl.js';
import axios from 'axios';

export default function LookUp() {
	const [name,setName] = useState('');
	const [phoneNumber,setPhoneNumber] = useState('');
	const [baseNumber,setBaseNumber] = useState('');
	
	
	const [isloading,setIsLoading] = useState(false);
	
	 const centerStyle = {
    	display: 'flex',
    	justifyContent: 'center',
    	alignItems: 'center',
    	height: '100vh',
    	flexDirection:"column"
  		};
	
	const clickLookUp =()=>{
		if(!name){
			alert('이름을 입력해주세요');
			return;
		}else if (!phoneNumber){
			alert('전화번호를 입력해주세요');
			return;
		}
		
		if (baseNumber === '1112'){
			setIsLoading(true);
			
			axios.get(serverurl+`/getlookup/${name}/${phoneNumber}`).then((result)=>{
		  		
		  		if (result.data.isSuccess){
					setIsLoading(false);
					alert(`이름:${result.data.name} 전화번호:${result.data.phoneNumber} 상태:${result.data.status} 상자번호:${result.data.boxNumber} 요청사항:${result.data.content}`);
				
				}else{
					setIsLoading(false);
					alert(result.data.msg);
				}
		  		
		  
		  
			}).catch((err)=>{
			console.log(err);
			})
		}else{
			alert('포대 번호가 틀렸습니다');
		}
		
		
		
	}
	
	const handleKeyPress = (event) => {
		
		const specialCharsPattern = /[\W_]/; // 모든 특수문자 패턴

  		
    // 특정 키코드나 문자를 허용하지 않음 (예: @ 기호)
    	if (specialCharsPattern.test(event.key)) {
      		event.preventDefault(); // 입력 차단
    	}
  	};
	 
  return (
    <>
	  <div style={centerStyle}>
		<h1>조회하기</h1>
	  
	  	<Form>
	  		<Form.Group className="mb-3" controlId="formBasicName">
        	<Form.Label>이름</Form.Label>
        	<Form.Control type="text" placeholder="이름을 입력해주세요" 
			value={name}
			 onChange={(e)=>{setName(e.target.value)}}
			 />
        	<Form.Text className="text-muted">
          	ex)김동훈
        	</Form.Text>
      		</Form.Group>
			
			<Form.Group className="mb-3" controlId="formBasicName">
        	<Form.Label>전화번호</Form.Label>
        	<Form.Control type="number" placeholder="전화번호를 입력해주세요" 
			value={phoneNumber}
			 onChange={(e)=>{setPhoneNumber(e.target.value)}}
			onKeyPress={handleKeyPress} />
        	<Form.Text className="text-muted">
          	ex)01012341234 (특수문자 '-' 없이 입력해주세요)
        	</Form.Text>
      		</Form.Group>
			
			<Form.Group className="mb-3" controlId="formBasicPhoneNumber">
        	<Form.Label>포대번호</Form.Label>
        	<Form.Control type="number" placeholder="포대번호를 입력해주세요"
			value={baseNumber}
			onChange={(e)=>{setBaseNumber(e.target.value)}}
			onKeyPress={handleKeyPress} />
		  	<Form.Text className="text-muted">
          	ex)133대대 2포대 -> 1332
        	</Form.Text>
      		</Form.Group>
			
			<div style={{display: 'flex',
    		justifyContent: 'center',
    		alignItems: 'center',
			padding:'10px'		 }} >
		 
	     	<Button variant="info" type="button" 
			disabled={isloading} 
			onClick={()=>{clickLookUp()}}
			>
       		조회하기
      		</Button>
		 
		 
		</div>
			
		  </Form>
	  </div>
		  
	  
	  
	  
	   
    </>
  );
}


