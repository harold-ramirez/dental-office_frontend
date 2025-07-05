import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';

export const HomeIcon = (props: any) => (
  <Octicons name="home" size={24} color="black" {...props} />
);

export const ProfileIcon = (props: any) => (
  <FontAwesome5 name="user" size={24} color="black" {...props} />
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