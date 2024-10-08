import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import SignUpFormPage from './components/SignUpFormPage/SignUpFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded}/>
    {isLoaded && <Outlet/>}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
      path: '/',
      element: <h1 className="greeting">Welcome!</h1>
      },
      {
        path: '/login',
        element: <LoginFormPage/>
      },
      {
        path: '/signup',
        element: <SignUpFormPage/>
      }
    ]

  },


]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;
