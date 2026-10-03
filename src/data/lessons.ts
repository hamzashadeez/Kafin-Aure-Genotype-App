import dummyAudioAsset from '@/audio/dummy-audio';

export type LessonThumbnailIcon = 'book' | 'layers' | 'calendar' | 'branch' | 'chat';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  thumbnailIcon: LessonThumbnailIcon;
  /** Future local or remote audio source. Null while playback is not implemented. */
  audioAsset: number | null;
  completed: boolean;
  /** Fraction from 0 to 1, kept independent from any future playback implementation. */
  progress: number;
  keyLearningPoints: string[];
};

export const lessons: Lesson[] = [
  {
    id: 'menene-genotype',
    title: 'Menene Genotype?',
    description: 'Gabatarwa ga ma’anar genotype da wasu kalmomin da ake amfani da su a darussan.',
    durationSeconds: 260,
    thumbnailIcon: 'book',
    audioAsset: dummyAudioAsset,
    completed: false,
    progress: 0.36,
    keyLearningPoints: [
      'Ma’anar kalmar genotype a cikin darasin.',
      'Wasu daga cikin alamomin da ake yawan ambata.',
      'Yadda za ka gane kalmomin asali yayin sauraro.',
    ],
  },
  {
    id: 'aa-as-ss',
    title: 'AA, AS da SS — Menene bambancin su?',
    description: 'Koyi yadda ake amfani da alamomin AA, AS da SS a cikin bayanan ilimi.',
    durationSeconds: 370,
    thumbnailIcon: 'layers',
    audioAsset: dummyAudioAsset,
    completed: false,
    progress: 0,
    keyLearningPoints: [
      'Ma’anar alamomin AA, AS da SS a darasin.',
      'Kalmomin da za ka iya ji yayin tattauna waɗannan alamomi.',
      'Muhimmancin neman bayani daga ƙwararre idan kana da tambaya ta kanka.',
    ],
  },
  {
    id: 'muhimmanci-kafin-aure',
    title: 'Me yasa genotype yake da muhimmanci kafin aure?',
    description: 'Darasi kan dalilin da ya sa mutane ke koyon wannan batu kafin aure da yadda za a fara tattaunawa cikin sani.',
    durationSeconds: 335,
    thumbnailIcon: 'calendar',
    audioAsset: dummyAudioAsset,
    completed: false,
    progress: 0,
    keyLearningPoints: [
      'Dalilan da ya sa ake tattauna genotype kafin aure.',
      'Tambayoyin da za su taimaka wajen fara tattaunawa cikin girmamawa.',
      'Inda za a nemi shawarwarin ƙwararru idan ana buƙata.',
    ],
  },
  {
    id: 'gadawa',
    title: 'Ta yaya genotype ke gadawa?',
    description: 'Gabatarwar ilimi game da yadda ake bayanin gado da genotype.',
    durationSeconds: 290,
    thumbnailIcon: 'branch',
    audioAsset: dummyAudioAsset,
    completed: false,
    progress: 0,
    keyLearningPoints: [
      'Ma’anar gado a cikin wannan batu na ilimi.',
      'Kalmomin da ake amfani da su wajen bayanin gado.',
      'Dalilin da ya sa darasin bai maye gurbin shawarar ƙwararre ba.',
    ],
  },
  {
    id: 'as-as',
    title: 'AS + AS: Me yake nufi?',
    description: 'Fahimci yadda wannan rubutun misali yake amfani da shi a tattaunawar genotype.',
    durationSeconds: 310,
    thumbnailIcon: 'chat',
    audioAsset: dummyAudioAsset,
    completed: false,
    progress: 0,
    keyLearningPoints: [
      'Yadda ake karanta rubutun misalin a cikin darasin.',
      'Bambanci tsakanin koyon bayani da neman shawarar mutum ɗaya.',
      'Yadda za a kai tambayoyi ga ƙwararren da ya dace.',
    ],
  },
];

export function formatLessonDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
