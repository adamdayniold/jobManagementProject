import { useState } from 'react'
import { Alert, ToastAndroid } from 'react-native';
import { SpeedDial } from '@rneui/themed';

import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

const CustomProjectSpeedDial = ({ outsideProps, isRegistered, isAdmin, isDashboard, isEvent, isPIC }) => {

  const [open, setOpen] = useState(false);

  const handleIsRegisteredAccount = async () => {
    if (isRegistered) {
      signOut(auth)
        .then(() => outsideProps.navigation.navigate('Login'))
        .catch(() => alertPopup('Error', 'Error logging out'))
      // .catch(() => ToastAndroid.show('Error logging out', ToastAndroid.SHORT))
    } else {
      outsideProps.navigation.navigate('Login');
    }
  }

  const navigate = (Route) => {
    let navigateRoute = Route;
    let param;
    if (Route == 'Dashboard') {
      navigateRoute = isAdmin ? 'AdminDashboard' : 'ConstructorDashboard'
    } else if (Route === 'UserCreation') {
      navigateRoute = Route;
      param = { type: isAdmin ? 'Admin' : 'Constructor' }
    } else if (Route === 'ZoneCreation') {
      navigateRoute = Route;
      param = { isAdmin: true, isNew: true };
    } else if (Route === 'PICCreation') {
      navigateRoute = Route;
      param = { isAdmin: true, isNew: true };
    }
    outsideProps.navigation.navigate(navigateRoute, param);
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK', onPress: () => console.log('OK Pressed')
  }]);

  const User = () => {
    return (
      <>
        {isPIC &&
          <>
            <SpeedDial.Action
              icon={{ name: 'person', color: '#fff' }}
              title="Add New PIC"
              onPress={() => navigate('PICCreation')}
              buttonStyle={{ backgroundColor: '#000080' }}
            />
          </>
        }
        {isEvent &&
          <>
            <SpeedDial.Action
              icon={{ name: 'map', color: '#fff' }}
              title="Add New Event"
              onPress={() => navigate('ZoneCreation')}
              buttonStyle={{ backgroundColor: '#000080' }}
            />
          </>
        }
        {!isDashboard &&
          <>
            <SpeedDial.Action
              icon={{ name: 'add-circle', color: '#fff' }}
              title="Home"
              onPress={() => navigate('Dashboard')}
              buttonStyle={{ backgroundColor: '#000080' }}
            />
          </>
        }
        <SpeedDial.Action
          icon={{ name: 'logout', color: '#fff' }}
          title="Log Out"
          onPress={() => handleIsRegisteredAccount()}
          buttonStyle={{ backgroundColor: '#000080' }}
        />
      </>
    )
  }

  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: 'edit', color: '#fff' }}
      openIcon={{ name: 'close', color: '#fff' }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      buttonStyle={{ backgroundColor: '#000080' }}
    >
      <User />
    </SpeedDial>
  )
}

export default CustomProjectSpeedDial;