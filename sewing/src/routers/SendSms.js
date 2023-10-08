
import { Button,Form,Spinner} from 'react-bootstrap';
import { serverurl } from './serverurl.js';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { useParams} from 'react-router-dom';





export default function SendSms() {
	let {phoneNumber} = useParams();
	const [isLoading,setIsLoading] = useState(true);
	const [books,setBooks] = useState('');
	const [baseNumber,setBaseNumber] = useState(0);
	
	
	const [isSaveLoading,setSaveLoading] = useState(false);
	const [state,setState] = useState('');
	const [isSmsLoading,setSmsLoading] = useState(false);
	
	useEffect(()=>{
		setIsLoading(true);
		
		axios.get(serverurl+"/getbook").then((result)=>{
			
			if (result.data.isSuccess){
				
				const resBook = result.data.books.filter((book)=> (book.phoneNumber == phoneNumber));
				setState(resBook[0].status);
				setBooks(resBook);
				
				setIsLoading(false);
			}else{
				alert('예약정보를 불러오지 못했습니다.');
				
				setIsLoading(false);
				
			}
		}).catch((err)=>{
			console.log(err);
			setIsLoading(false);
			alert('예약정보를 불러오지 못했습니다.');
		})
		
	},[])
	
	useEffect(()=>{
		console.log(state);
	},[state])
	
	const ClickDBSave = ()=>{
		if (baseNumber == '0520'){
			setSaveLoading(true);
		
		axios.post(serverurl+'/admin/dbsave',{phoneNumber:phoneNumber,
											  status:state,
											  boxNumber:books[0].boxNumber}).then((result)=>{
			if (result.data.isSuccess){
				
				alert(result.data.msg);
				
				
				setSaveLoading(false);
			}else{
				alert(result.data.msg);
				
				setSaveLoading(false);
				
			}
		}).catch((err)=>{
			
		})
		}else{
			alert('틀림');
		}
		
	}
	
	const ClickSms = ()=>{
		if (baseNumber == '0520'){
			setSmsLoading(true);
		
			axios.post('/sendsms',{phoneNumber:books[0].phoneNumber,
				    title:"오버로크 예약",
				    content:`[오버로크 시스템]\n${state}상태입니다`})
			.then((result)=>{
			
			if (result.data.isSuccess){
				
				alert('문자전송 성공 상태:'+state);
				
				
				setSmsLoading(false);
			}else{
				alert('문자 전송 실패');
				
				setSmsLoading(false);
				
			}
			
			
		}).catch((err)=>{
			console.log(err);
			setSmsLoading(false);
		})
		}else{
			alert('틀림');
		}
		
	}
	
	
	const centerStyle = {
    	display: 'flex',
    	justifyContent: 'center',
    	alignItems: 'center',
    	height: '100vh',
		flexDirection: 'column'
    	
  	};
	
	
 if (isLoading){
	 return (
	 	<>
		 
		 <Spinner animation="border" role="status">
      		<span className="visually-hidden">Loading...</span>
    	 </Spinner>
		</>	 
	 );
 }else{
	  return (
    <>	
	  <div style={centerStyle}>
		
		<span>전화번호:{books[0].phoneNumber}</span>
		<span>이름:{books[0].name}</span>	  
		<span>상태:{state}</span>
		
			  
	 	<Form>
		<Form.Group className="mb-3"  >
			<Form.Label htmlFor="Select">작업선택</Form.Label>
				<Form.Select id="Select"   onChange={(e)=>{setState(e.target.value)}}>
					<option>작업중</option>
					<option>작업완료</option>
					<option>작업가능</option>
				</Form.Select>
        
      	</Form.Group>
			
		<Form.Group  onChange={(e)=>{setBaseNumber(e.target.value)}} >			
		<Form.Label>pw 입력</Form.Label>
        <Form.Control value={baseNumber}   type="number"  placeholder="pw 입력"   />
		</Form.Group>
			
		
			
		<Button variant="success" 
			disabled ={isSaveLoading}
			onClick={()=>{ClickDBSave()}}>db저장하기</Button>
			
		<Button variant="success" 
			disabled ={isSmsLoading}
			onClick={()=>{ClickSms()}}>sms전송</Button>
			
			
			
		</Form>
	
		  
		  
	 </div>
    </>
  );
	 
 }
	
	 
 
}




