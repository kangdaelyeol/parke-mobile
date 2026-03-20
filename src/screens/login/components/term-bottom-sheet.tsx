import { JSX } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { useLoginContext } from '@/contexts'
import { Consent, ConsentThird, Privacy, Terms } from './terms'

const renderBackdrop = (
  props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    pressBehavior="close"
  />
)

export const TermBottomSheet = () => {
  const { state } = useLoginContext()
  return (
    <BottomSheetModal
      ref={state.modalRef}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.backgroundStyle}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <BottomSheetView style={styles.container}>
        <ScrollView>
          {state.docType === 'privacy' && <Privacy />}
          {state.docType === 'terms' && <Terms />}
          {state.docType === 'consent' && <Consent />}
          {state.docType === 'consent-third' && <ConsentThird />}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#141414',
    borderTopColor: '#2a2a2a',
    borderWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    maxHeight: 700,
  },
})
