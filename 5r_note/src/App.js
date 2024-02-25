import MainPage from './MainPage';
import SettingPage from './SettingPage';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/*
          <Route path="/setting_page" element={<SettingPage/>}/>
           */}
          <Route path='*' element="<p>找不到頁面</p>"/>
          <Route path='/' element={<MainPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
