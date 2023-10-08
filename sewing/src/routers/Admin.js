
import { ListGroup,Spinner,Button,Form} from 'react-bootstrap';
import { serverurl } from './serverurl.js';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import {Boxs} from './Book.js';





export default function Admin() {
	
	const [isLoading,setIsLoading] = useState(true);
	const [books,setBooks] = useState('');
	const [boxs,setBoxs] = useState('');
	const [pw,setPw] = useState('');
	const [selectedBoxs, setSelectedBoxs] = useState('');
	const [adminPw,setAdminPw] = useState(0);
	
	const [isPwLoading,setIsPwLoading] = useState(false);
	const [isBoxLoading,setIsBoxLoading] = useState(false);
	
	useEffect(()=>{
		setIsLoading(true);
		
		axios.get(serverurl+"/getbook").then((result)=>{
			if (result.data.isSuccess){
				setBooks(result.data.books);
				setIsLoading(false);
			}else{
				alert('예약정보를 불러오지 못했습니다.');
				
				setIsLoading(false);
				
			}
		}).catch((err)=>{
			setIsLoading(false);
			alert('예약정보를 불러오지 못했습니다.');
		})
		
		setIsBoxLoading(true);
		axios.get(serverurl+"/box").then((result)=>{
			if (result.data.isSuccess){
				setBoxs(result.data.boxs);
				setIsBoxLoading(false);
			}else{
				alert('박스정보를 불러오지 못했습니다.');
				
				setIsBoxLoading(false);
				
			}
		}).catch((err)=>{
			setIsBoxLoading(false);
			alert('박스정보를 불러오지 못했습니다.');
		})
		
	},[])
	
	
	const ClickChangePw = ()=>{
		if (adminPw != '0520') {
			alert('틀림');
			return;
		}
		
		axios.post(serverurl+'/admin/dbsave',{pw:pw,number:selectedBoxs})
		.then((result)=>{
			if (result.data.isSuccess){
				alert(result.data.msg);
			}else{
				alert(result.data.msg);
			}
		})
			
		
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
	 	<ListGroup >
		  {
			  books.map((book)=>{
				  return(
				  	<ListGroup.Item action href={'/admin/sendsms/'+book.phoneNumber}>
        			이름:{book.name} 전화번호:{book.phoneNumber} 상태:{book.status}
      			  	</ListGroup.Item>
				  
				  );
				  
			  })
		  }
		  
		
      
      
    	</ListGroup>
			  
		<Form style={{background: 'aquamarine'}}>
			  
		<Form.Group  onChange={(e)=>{setPw(e.target.value)}} >			
		<Form.Label>pw 입력</Form.Label>
        <Form.Control value={pw}   type="number"  placeholder="0으로 시작하면 안댐"   />
		</Form.Group>
			
		<Form.Group  onChange={(e)=>{setAdminPw(e.target.value)}} >			
		<Form.Label>admin pw 입력</Form.Label>
        <Form.Control value={adminPw}   type="number"  placeholder="admin pw 입력"   />
		</Form.Group>
		
		{
			(isBoxLoading) ? (<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>  ) : (<Boxs  boxs={boxs} ispwChange={true} setSelectedBoxs={setSelectedBoxs}></Boxs>	)		
		}
			
			
			<Button variant="success" 
			disabled ={isPwLoading}
			onClick={()=>{ClickChangePw()}}>pw 변경</Button>
		
		</Form>
		
	
		  
		  
	 </div>
    </>
  );
	 
 }
	
	 
 
}




