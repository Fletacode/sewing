
import { Button,Form,Alert,Carousel,Image,InputGroup,Spinner} from 'react-bootstrap';
import { serverurl } from './serverurl.js';
import { useState ,useEffect} from 'react';
import axios from 'axios';






function Book() {
	const [name,setName] = useState('');
	const [phoneNumber,setPhoneNumber] = useState('');
	const [baseNumber,setBaseNumber] = useState('');
	const [content,setContent] = useState('');
	const [selectedBoxs, setSelectedBoxs] = useState('');
	
	const [show,setShow] = useState(false);
	
	const [isloading,setIsLoading] = useState(false);
	
	const [isBoxLoading,setIsBoxLoading] = useState(true);
	const [boxs,setBoxs] = useState('');
	
	useEffect(()=>{
		
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
	
	
	const clickBook =()=>{
		if (!name){
			alert('이름을 입력해주세요');
			return;
		}else if (!phoneNumber){
			alert('전화번호를 입력해주세요');
			return;
		}else if (!setIsBoxLoading){
			alert('상자를 선택해주세요');
			return;
		}
		
		if (baseNumber === '1112'){
			setIsLoading(true);
			
			axios.post(serverurl+'/book',{name:name,
										  phoneNumber:phoneNumber,
										  content:content,
										  boxNumber:selectedBoxs}).then((result)=>{
		  
		  		if (result.data.isSuccess){
					setIsLoading(false);
					alert(result.data.msg);
					window.location.replace('/lookup');
				}else{
					setIsLoading(false);
					alert(result.data.msg);
				}
		  		
		  
		  
			}).catch((err)=>{
			console.log(err);
			})
		}else if (!selectedBoxs){
			alert('박스를 선택해주세요');
		}else{
			alert('포대 번호가 틀렸습니다');
		}
		
		
		
	}
	
	const centerStyle = {
    	display: 'flex',
    	justifyContent: 'center',
    	alignItems: 'center',
    	height: '100vh',
    	
  	};
	
	const AlertStyle= {
		position: 'absolute',
		top: '10%',
    	left: '0%',
		height: '100%',
		width: '100%'
	}
	
	const redColor = {
		color:'red',
		fontWeight:'bold'
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

      <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
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
	
	  <InputGroup style={{padding:'10px'}}>
        <InputGroup.Text>요청사항</InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" onChange={(e)=>{setContent(e.target.value)}} />
      </InputGroup>
		
			
			{
				(isBoxLoading) ? (<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>) : (<Boxs boxs={boxs} isBoxLoading={isBoxLoading} setSelectedBoxs={setSelectedBoxs}></Boxs>)
			}
		
			
				
			
			
			
		
			
			
			
     <div style={{display: 'flex',
    	justifyContent: 'center',
    	alignItems: 'center',
		padding:'10px'		 }} >
		 
	     <Button variant="info" type="button" 
			disabled={isloading} 
			onClick={() => setShow(true)}>
       		예약하기
      	</Button>
		 
		 
		</div>
     
    	</Form>
		  
		  
		  <Alert show={show} variant="info" style={AlertStyle}>
        <Alert.Heading>사용방법</Alert.Heading>
        <Carousel interval={null}>
      <Carousel.Item>
        <Image variant="top" 
				rounded
				 height={500}
				src={'https://sewing.run.goorm.site/images/alert1.png'}
				alt={"배너 없음"}
				style={{margin:'20px'}}
				/>
        <Carousel.Caption>
          <h3 style={redColor}>어플로 예약신청을 해주세요</h3>
          <p style={redColor}>예약신청을 하면 자물쇠 비밀번호가 문자로 전송됩니다.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image variant="top" 
				rounded
				 height={500}
				src={'https://sewing.run.goorm.site/images/alert2.png'}
				alt={"배너 없음"}
				style={{margin:'20px'}}
				/>
        <Carousel.Caption>
          <h3 style={redColor}>옷,모자에 오버로크를 양면테이프로 원하는 위치에 붙여주세요</h3>
          <p style={redColor}>예약신청 -> 작업대기 -> 작업중 -> 작업완료 </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image variant="top" 
				rounded
				 height={500}
				src={'https://sewing.run.goorm.site/images/alert3.png'}
				alt={"배너 없음"}
				style={{margin:'20px'}}
				/>
        <Carousel.Caption>
          <h3 style={redColor}>옷을 상자에 넣고 자물쇠로 잠궈주세요</h3>
          <p style={redColor}>
            작업이 완료되면 작업 완료 문자가 전송됩니다.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
        <hr />
			  
		<div>
		 <div>이름:{name}</div>	  
		 <div>전화번호:{phoneNumber}</div>
		 <div>포대번호:{baseNumber}</div>
		 <div>요청사항:{content}</div>
		 <div>박스번호:{selectedBoxs}</div>
		</div>	  
			  
        <div className="d-flex justify-content-around">
		  <Button onClick={()=>{clickBook()}} 
			  disabled={isloading}
			  variant="outline-success">
            사용방법을 인지했고 예약하겠습니다.
          </Button>
          <Button onClick={() => setShow(false)} 
			  disabled={isloading}
			  variant="outline-success">
            닫기
          </Button>
			
			{
				(isloading) ? <> <Spinner animation="border" role="status">
      			<span className="visually-hidden">로딩중~~</span>
    		</Spinner> </> : null
			}
			
			
			
        </div>
      </Alert>

		  
		  
	 </div>
    </>
  );
}


function Boxs(props){
	
	
	const [isOverLap,setIsOverLap] = useState(false);
	
	
	
	const isBoxstatus = (value)=>{
		if (props.ispwChange) return false;
		if (value == "작업대기중" || value == "작업중" || value == "작업완료" ) return true;
		else{
			return false;
		}
	}
	
	
	return (
	<>	
		
		<Form.Group style={{display:'flex'}} >
		{
		props.boxs.map((box)=>{
			return(
				<div style={{display: 'flex',
							flexDirection: 'column',
    						alignItems: 'center'}}>
					
					
						<Form.Check 
							inline  
							type='radio'
							name="radioGroup"
							label={`${box.number}번 상자`}
							disabled = {isBoxstatus(box.status)}
							onChange={() => props.setSelectedBoxs(box.number)}
							/>	
						{(isBoxstatus(box.status)) ? (<div>❌</div>) : (null)}
				
				</div>
			
			);
			
			})
		}
		
		</Form.Group>
		
		
		
			
			
	</>	
	);
}

export { Book, Boxs };


