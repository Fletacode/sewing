
import { Image,Button} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

export default function Main() {
	 const navigate = useNavigate();
	
	 const centerStyle = {
    	display: 'flex',
    	justifyContent: 'center',
    	alignItems: 'center',
    	height: '100vh',
    	
  		};
	 
  return (
    <>
	  	<div style={centerStyle}>
		  <div style={{display:'flex', flexDirection: 'column'}}>
			  <h1 style={{textAlign: 'center'}} >오버로크 예약 서비스</h1>
		  	<Image variant="top" 
				rounded
				 height={200}
				src={'https://sewing.run.goorm.site/images/Main.png'}
				alt={"배너 없음"}
				style={{margin:'20px'}}
				/>
			  
			  <div style={{display:'flex', justifyContent: 'space-around'}}>
			  	<Button variant="info"  onClick={()=>{navigate('/book')}}>예약하기</Button>
			  	<Button variant="info" onClick={()=>{navigate('/lookup')}} >조회하기</Button>
			  </div>
			  
			  
		  </div>
	  		
		  	
	  
	  	</div>
	   
    </>
  );
}


