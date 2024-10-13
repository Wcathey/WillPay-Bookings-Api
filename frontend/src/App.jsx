import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import ManageSpots from './components/ManageSpots/ManageSpots';
import CreateNewSpot from './components/CreateNewSpot/CreateNewSpot';
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
        path: '/spots/current',
        element:
          <ManageSpots/>

      },
      {
        path: '/spots/new',
        element: <CreateNewSpot/>
      },
      {
        path: '/spots/:spotId',
        element: <Outlet/>,
        childre: [
          {
            index: true,
            element: <></>
          }
        ]
      }
    ]

  },


]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;
