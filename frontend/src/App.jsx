import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import ManageSpots from './components/ManageSpots/ManageSpots';
import CreateNewSpot from './components/CreateNewSpot/CreateNewSpot';
import SpotDetails from './components/SpotDetails/SpotDetails';
import LandingPage from './components/LandingPage/LandingPage';
import UpdateSpotPage from './components/UpdateSpotPage/UpdateSpotPage';
import CreateNewBooking from './components/CreeateNewBooking/CreateNewBooking';

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
      element: <LandingPage/>
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
        children: [
          {
            index: true,
            element: <SpotDetails/>
          }

        ]
      },
      {
        path: 'spots/:spotId/edit',
        element: <UpdateSpotPage/>
      },
      {
        path: '/spots/:spotId/bookings/new',
        element: <CreateNewBooking/>
      }
    ]

  },


]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;
