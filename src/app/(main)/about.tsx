import { MainPlaceholderScreen } from '@/components/main-placeholder-screen';

export default function AboutScreen() {
  return (
    <MainPlaceholderScreen
      title="About"
      description="Koyi game da manufar San Genotype da yadda ake amfani da iliminsa."
      icon={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
    />
  );
}
