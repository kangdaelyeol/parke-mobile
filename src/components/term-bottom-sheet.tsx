import { JSX } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { Consent, ConsentThird, Privacy, Terms } from './terms'
import { DocType } from '@/types/common'

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

interface Props {
  docState: DocType
  modalRef: React.RefObject<BottomSheetModal | null>
}

export const TermBottomSheet = ({ docState, modalRef }: Props) => {
  return (
    <BottomSheetModal
      ref={modalRef}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.backgroundStyle}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <BottomSheetView style={styles.container}>
        <ScrollView>
          {docState === 'privacy' && <Privacy />}
          {docState === 'terms' && <Terms />}
          {docState === 'consent' && <Consent />}
          {docState === 'consent-third' && <ConsentThird />}
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
