import { useState } from 'react'
import { View, ToastAndroid } from 'react-native';
import { SpeedDial } from '@rneui/themed';

import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

const CustomComponentSpeedDial = ({ outsideProps, addNewForm, setViewStyle, viewStyle, isRegistered }) => {

  const [open, setOpen] = useState(false);
  const [viewTitle, setViewTitle] = useState('Table View');
  const [viewIcon, setViewIcon] = useState('table-view');

  const handleOpenSheet = () => {
    addNewForm();
    setOpen(false);
  }

  const handleChangeView = () => {
    if (viewStyle == 'list') {
      setViewTitle('List View');
      setViewIcon('list');
      setViewStyle('table');
    } else if (viewStyle == 'table') {
      setViewTitle('Table View');
      setViewIcon('table-view');
      setViewStyle('list');
    }
    setOpen(false);
  }

  const handleIsRegisteredAccount = async () => {
    if (isRegistered) {
      signOut(auth)
        .then(() => outsideProps.navigation.navigate('Login'))
        .catch(() => ToastAndroid.show('Error logging out', ToastAndroid.SHORT))
    } else {
      outsideProps.navigation.navigate('Login');
    }
  }

  const RegisteredUser = () => {
    return (
      <View>
        <SpeedDial.Action
          icon={{ name: 'add-circle', color: '#fff'}}
          title="Add New"
          onPress={handleOpenSheet}
          buttonStyle={{ backgroundColor: '#3f3026'}}
        />
        <SpeedDial.Action
          icon={{ name: viewIcon, color: '#fff' }}
          title={viewTitle}
          onPress={() => handleChangeView()}
          buttonStyle={{ backgroundColor: '#3f3026' }}
        />
        <SpeedDial.Action
          icon={{ name: 'logout', color: '#fff' }}
          title="Log Out"
          onPress={() => handleIsRegisteredAccount()}
          buttonStyle={{ backgroundColor: '#3f3026' }}
        />
      </View>
    )
  }

  const NotRegisteredUser = () => {
    return (
      <View>
        <SpeedDial.Action
          icon={{ name: viewIcon, color: '#fff' }}
          title={viewTitle}
          onPress={() => handleChangeView()}
          buttonStyle={{ backgroundColor: '#3f3026' }}
        />
        <SpeedDial.Action
          icon={{ name: 'login', color: '#fff' }}
          title="Log In"
          onPress={() => handleIsRegisteredAccount()}
          buttonStyle={{ backgroundColor: '#3f3026' }}
        />
      </View>
    )
  }

  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: 'edit', color: '#fff' }}
      openIcon={{ name: 'close', color: '#fff' }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      buttonStyle={{ backgroundColor: '#767d86' }}
    >
      { isRegistered ? <RegisteredUser/> : <NotRegisteredUser />}
    </SpeedDial>
  )
}

export default CustomComponentSpeedDial;