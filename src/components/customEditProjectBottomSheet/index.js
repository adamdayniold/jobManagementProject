import { useRef, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import styles from './styles';

import CustomButton from "../customButton";

const CustomEditProjectBottomSheet = (props, ref) => {
  useImperativeHandle(ref, () => ({
    open: (index) => handleOpen(index)
  }))

  const btmSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%']);

  const handleOpen = useCallback((index) => {
    btmSheetRef.current?.snapToIndex(index);
  }, [])

  const handleClose = useCallback(() => {
    btmSheetRef.current?.close();
  })

  const renderBackdrop = useCallback(props => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
  ))

  const propActions = (type) => {
    if (type === 'edit') {
      props.handleAction(type);
      handleClose();
    } else if (type === 'delete') {
      props.handleAction(type);
      handleClose();
    }
  }

  return (
    <BottomSheet ref={btmSheetRef} enablePanDownToClose={true} index={-1} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.container}>
        <CustomButton text="Edit" btnColor="#bcb4b4" txtColor="#FFFFFF" onPress={() => propActions('edit')} />
        <CustomButton text="Delete" btnColor='#FF190C' txtColor="#FFFFFF" onPress={() => propActions('delete')} />
      </BottomSheetView>
    </BottomSheet>
  )
}

export default forwardRef(CustomEditProjectBottomSheet);