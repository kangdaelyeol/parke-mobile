import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useProfileController } from '@/controllers';
import { ProfileStackNavigationProp } from '@/navigation/types';
import { Main, Header } from '@profile/components';

export default function ProfileScreen({
  navigation,
}: {
  navigation: ProfileStackNavigationProp;
}) {
  const viewModel = useProfileController(navigation);

  return (
    <View style={styles.container}>
      <Header handleBackPress={viewModel.handlers.backPress} />
      <Main viewModel={viewModel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
