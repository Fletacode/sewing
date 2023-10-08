import { Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './routers/Main.js';
import {Book} from './routers/Book.js';
import LookUp from './routers/LookUp.js';
import Admin from './routers/Admin.js';
import SendSms from './routers/SendSms.js';

function App() {
  return (
    <>
	  <Routes>
	   	<Route path='/' element={<Main></Main> } />
		<Route path='/book' element={<Book></Book>} />
		<Route path='/lookup' element={<LookUp></LookUp>} />
		<Route path='/admin' element={<Admin></Admin>} />
		<Route path='/admin/sendsms/:phoneNumber' element={<SendSms></SendSms>} />
	  </Routes>
    </>
  );
}

export default App;
