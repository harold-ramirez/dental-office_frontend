import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export const HomeIcon = (props: any) => (
  <Octicons name="home" size={24} color="black" {...props} />
);

export const ProfileIcon = (props: any) => (
  <FontAwesome5 name="user" size={24} color="black" {...props} />
);

export const ProfileIconAlt = (props: any) => (
  <FontAwesome5 name="user-alt" size={24} color="black" {...props} />
);

export const PatientIcon = (props: any) => (
  <FontAwesome name="address-book-o" size={24} color="black" {...props} />
);

export const RequestIcon = (props: any) => (
  <FontAwesome5 name="bell" size={24} color="black" {...props} />
);

export const ScheduleIcon = (props: any) => (
  <MaterialCommunityIcons name="book-clock-outline" size={24} color="black" {...props} />
);

export const SearchIcon = (props: any) => (
  <FontAwesome name="search" size={24} color="black" {...props} />
);

export const AddPatientIcon = (props: any) => (
  <Octicons name="person-add" size={24} color="black" {...props} />
);

export const WhatsappIcon = (props: any) => (
  <FontAwesome name="whatsapp" size={24} color="black" {...props} />
);

export const MedicalHistoryIcon = (props: any) => (
  <MaterialCommunityIcons name="folder-information-outline" size={24} color="black" {...props} />
);

export const SadIcon = (props: any) => (
  <MaterialCommunityIcons name="emoticon-sad-outline" size={24} color="black" {...props} />
);

export const SaveIcon = (props: any) => (
  <FontAwesome5 name="save" size={24} color="black" {...props} />
);

export const XIcon = (props: any) => (
  <FontAwesome6 name="x" size={24} color="black" {...props} />
);
